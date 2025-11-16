export async function executeCode(sessionId, code, language) {
  const response = await fetch("http://127.0.0.1:8000/run", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: code }), // or use your actual prompt
  });
  return await response.json();
}
