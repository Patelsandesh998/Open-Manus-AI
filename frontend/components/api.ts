import axios from "axios";

/**
 * Read Vite env safely in TypeScript when vite/client types are not available.
 */
const API = axios.create({
  baseURL: (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
});

/* ============================
   SESSION MANAGEMENT
============================ */

/**
 * Create a new sandbox session
 */
export const createSession = async (): Promise<any> => {
  const { data } = await API.post("/sessions/create");
  return data;
};

/**
 * List all active sessions
 */
export const listSessions = async (): Promise<any[]> => {
  const { data } = await API.get("/sessions");
  return data;
};

/**
 * Delete a specific session
 */
export interface DeleteSessionResponse {
  message?: string;
  session_id?: string;
  status?: string;
  [key: string]: any;
}

export const deleteSession = async (
  sessionId: string
): Promise<DeleteSessionResponse> => {
  const { data } = await API.delete<DeleteSessionResponse>(
    `/sessions/${sessionId}`
  );
  return data;
};

/* ============================
   SANDBOX OPERATIONS
============================ */

export interface ExecuteCodeResponse {
  result: {
    success: boolean;
    data: {
      session_id: string;
      stdout: string;
      stderr: string;
      result: any;
      execution_count: number;
    };
  };
}

/**
 * Execute code (Python/Bash)
 */
export const executeCode = async (
  sessionId: string,
  code: string,
  language: "python" | "bash" = "python"
): Promise<ExecuteCodeResponse> => {
  const { data } = await API.post(`/sessions/${sessionId}/execute`, {
    language,
    code,
  });
  return data;
};

/**
 * Read a file inside sandbox
 */
export const readFile = async (
  sessionId: string,
  filePath: string
): Promise<{ content: string }> => {
  const { data } = await API.post(`/sessions/${sessionId}/file/read`, {
    file_path: filePath,
  });
  return data;
};

/**
 * Write to a file inside sandbox
 */
export const writeFile = async (
  sessionId: string,
  filePath: string,
  content: string
): Promise<{ status: string }> => {
  const { data } = await API.post(`/sessions/${sessionId}/file/write`, {
    file_path: filePath,
    content,
  });
  return data;
};

/**
 * Fetch browser info (CDP endpoint)
 */
export const getBrowserInfo = async (
  sessionId: string
): Promise<{ cdp_endpoint: string }> => {
  const { data } = await API.get(`/sessions/${sessionId}/browser/info`);
  return data;
};

/**
 * Take browser screenshot
 */
export const getBrowserScreenshot = async (sessionId: string): Promise<string> => {
  const response = await API.get(`/sessions/${sessionId}/browser/screenshot`, {
    responseType: "blob",
  });
  return URL.createObjectURL(response.data);
};

/**
 * Execute browser actions (click, typing, etc.)
 */
export const executeBrowserAction = async (
  sessionId: string,
  actionData: Record<string, any>
): Promise<{ status: string }> => {
  const { data } = await API.post(
    `/sessions/${sessionId}/browser/actions`,
    actionData
  );
  return data;
};

/**
 * Get VNC viewer URL
 */
export const getVncUrl = async (
  sessionId: string
): Promise<{ url: string }> => {
  const { data } = await API.get(`/sessions/${sessionId}/vnc/url`);
  return data;
};
