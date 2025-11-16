from typing import Dict, List, Optional
import asyncio
from pydantic import Field, model_validator

from app.agent.browser import BrowserContextHelper
from app.agent.toolcall import ToolCallAgent
from app.config import config
from app.logger import logger
from app.prompt.manus import NEXT_STEP_PROMPT, SYSTEM_PROMPT
from app.tool import Terminate, ToolCollection
from app.tool.ask_human import AskHuman
from app.tool.browser_use_tool import BrowserUseTool
from app.tool.mcp import MCPClients, MCPClientTool
from app.tool.python_execute import PythonExecute
from app.tool.str_replace_editor import StrReplaceEditor


class Manus(ToolCallAgent):
    """A versatile general-purpose agent with support for both local and MCP tools."""

    name: str = "Manus"
    description: str = "A versatile agent that can solve various tasks using multiple tools including MCP-based tools"

    system_prompt: str = SYSTEM_PROMPT.format(directory=config.workspace_root)
    next_step_prompt: str = NEXT_STEP_PROMPT

    max_observe: int = 10000
    max_steps: int = 20

    mcp_clients: MCPClients = Field(default_factory=MCPClients)

    available_tools: ToolCollection = Field(
        default_factory=lambda: ToolCollection(
            PythonExecute(),
            BrowserUseTool(),
            StrReplaceEditor(),
            AskHuman(),
            Terminate(),
        )
    )

    special_tool_names: list[str] = Field(default_factory=lambda: [Terminate().name])
    browser_context_helper: Optional[BrowserContextHelper] = None

    connected_servers: Dict[str, str] = Field(default_factory=dict)
    _initialized: bool = False

    @model_validator(mode="after")
    def initialize_helper(self) -> "Manus":
        self.browser_context_helper = BrowserContextHelper(self)
        return self

    @classmethod
    async def create(cls, **kwargs) -> "Manus":
        instance = cls(**kwargs)
        await instance.initialize_mcp_servers()
        instance._initialized = True
        return instance

    async def initialize_mcp_servers(self) -> None:
        for server_id, server_config in config.mcp_config.servers.items():
            try:
                if server_config.type == "sse" and server_config.url:
                    await self.connect_mcp_server(server_config.url, server_id)
                    logger.info(f"Connected to MCP server {server_id} at {server_config.url}")
                elif server_config.type == "stdio" and server_config.command:
                    await self.connect_mcp_server(
                        server_config.command,
                        server_id,
                        use_stdio=True,
                        stdio_args=server_config.args,
                    )
                    logger.info(f"Connected to MCP server {server_id} using command {server_config.command}")
            except Exception as e:
                logger.error(f"Failed to connect to MCP server {server_id}: {e}")

    async def connect_mcp_server(self, server_url: str, server_id: str = "", use_stdio: bool = False, stdio_args: List[str] = None) -> None:
        if use_stdio:
            await self.mcp_clients.connect_stdio(server_url, stdio_args or [], server_id)
            self.connected_servers[server_id or server_url] = server_url
        else:
            await self.mcp_clients.connect_sse(server_url, server_id)
            self.connected_servers[server_id or server_url] = server_url

        new_tools = [tool for tool in self.mcp_clients.tools if tool.server_id == server_id]
        self.available_tools.add_tools(*new_tools)

    async def disconnect_mcp_server(self, server_id: str = "") -> None:
        await self.mcp_clients.disconnect(server_id)
        if server_id:
            self.connected_servers.pop(server_id, None)
        else:
            self.connected_servers.clear()

        base_tools = [tool for tool in self.available_tools.tools if not isinstance(tool, MCPClientTool)]
        self.available_tools = ToolCollection(*base_tools)
        self.available_tools.add_tools(*self.mcp_clients.tools)

    async def cleanup(self):
        if self.browser_context_helper:
            await self.browser_context_helper.cleanup_browser()
        if self._initialized:
            await self.disconnect_mcp_server()
            self._initialized = False

    async def think(self) -> bool:
        if not self._initialized:
            await self.initialize_mcp_servers()
            self._initialized = True

        original_prompt = self.next_step_prompt
        recent_messages = self.memory.messages[-3:] if self.memory.messages else []
        browser_in_use = any(
            tc.function.name == BrowserUseTool().name
            for msg in recent_messages if msg.tool_calls
            for tc in msg.tool_calls
        )

        if browser_in_use:
            self.next_step_prompt = await self.browser_context_helper.format_next_step_prompt()

        result = await super().think()
        self.next_step_prompt = original_prompt
        return result
    
    async def simple_generate(self, prompt: str) -> str:
        """
        ⚡ Lightweight single-step generation method.
        Skips multi-step reasoning and tool calls.
        Used for quick outputs like code, ppt, website, or short answers.
        """
        try:
            # Prefer the Manus's own LLM if available
            llm = getattr(self, "llm", None)
            if llm and hasattr(llm, "ask"):
                messages = [{"role": "user", "content": prompt}]
                result = await llm.ask(messages, stream=False)
                if isinstance(result, str):
                    return result.strip()
                if hasattr(result, "content"):
                    return result.content.strip()

            # Fallback to direct OpenAI client call if no LLM bound
            from openai import OpenAI
            import os

            client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.5,
            )
            return response.choices[0].message.content.strip()

        except Exception as e:
            logger.error(f"❌ simple_generate failed: {e}")
            return f"Error during quick generation: {str(e)}"


    async def llm_call(self, text: str) -> str:
        """Unified safe LLM call handler."""
        try:
            llm = getattr(self, "llm", None)
            if llm is None:
                return "❌ No LLM instance found."

            if hasattr(llm, "ask") and callable(llm.ask):
                messages = [{"role": "user", "content": text}]
                return await llm.ask(messages, stream=False)

            if hasattr(llm, "ask_tool") and callable(llm.ask_tool):
                messages = [{"role": "user", "content": text}]
                msg = await llm.ask_tool(messages)
                if msg and hasattr(msg, "content"):
                    return msg.content
                return str(msg)

            return "⚠️ No compatible LLM method available."
        except Exception as e:
            return f"❌ Failed to generate reasoning: {e}"

    # ✅ INSIDE the class
    async def run_stream(self, prompt: str):
        """
        Streams reasoning and generated output with clear markers for frontend display.
        Your frontend treats:
          - '🧠 ...' as received-prompt
          - '⚙️ ...' as processing
          - '🧩 ...' as reasoning
          - '💡 OUTPUT_START' / '💡 <line>' / '💡 OUTPUT_END' as code/output streaming
          - '✅ Completed successfully.' as done
        """
        # Exactly once:
        yield f"🧠 Received prompt: {prompt}"

        try:
            yield "⚙️ Initializing reasoning context..."
            await asyncio.sleep(0.2)

            # (Optional) short reasoning
            reasoning = await self.llm_call(f"Briefly explain the approach for: {prompt}")
            if reasoning and reasoning.strip():
                yield f"🧩 {reasoning.strip()}"

            # Output streaming
            yield "💡 OUTPUT_START"
            final_output = await self.llm_call(f"Return only the final answer/code for: {prompt}")
            if final_output and final_output.strip():
                for raw_line in final_output.strip().splitlines():
                    # Prefix with 💡 so the UI knows it's output
                    yield f"💡 {raw_line}"
                    # Tiny delay to allow the browser to render incrementally
                    await asyncio.sleep(0.005)
            else:
                yield "💡 No output produced."
            yield "💡 OUTPUT_END"

            yield "✅ Completed successfully."
        except Exception as e:
            yield f"❌ Error: {str(e)}"
