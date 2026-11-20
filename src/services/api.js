const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL || "http://localhost:8000").replace(
    /\/$/,
    "",
  );

async function fetchWithTimeout(url, options = {}, timeoutMs = 30000) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    if (!response.ok) {
      let detail = "";
      try {
        detail = await response.text();
      } catch {
        detail = "";
      }
      throw new Error(
        detail || `Request failed with status ${response.status}`,
      );
    }

    return await response.json();
  } finally {
    window.clearTimeout(timeoutId);
  }
}

export async function checkHealth() {
  return fetchWithTimeout(`${API_BASE_URL}/`, { method: "GET" }, 5000);
}

export async function askCandidate(question) {
  return fetchWithTimeout(
    `${API_BASE_URL}/chat`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    },
    30000,
  );
}
