const API_BASE = import.meta.env.VITE_API_URL;
const TOKEN_KEY = "sigmagpt_token";
const USER_KEY = "sigmagpt_user";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getSavedUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || "null");
  } catch {
    return null;
  }
}

export function saveSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

async function request(path, options = {}) {
  const token = getToken();
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || data.message || "Request failed");
  }
  return data;
}

export const api = {
  signup: (body) =>
    request("/auth/signup", { method: "POST", body: JSON.stringify(body) }),
  login: (body) =>
    request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  me: () => request("/auth/me"),
  createThread: () => request("/create", { method: "POST" }),
  getThreads: () => request("/threads"),
  getThreadMessages: (threadId) => request(`/threads/${threadId}`),
  deleteThread: (threadId) =>
    request(`/threads/${threadId}`, { method: "DELETE" }),
  sendMessage: (threadId, message) =>
    request("/chat", {
      method: "POST",
      body: JSON.stringify({ threadId, message }),
    }),
};
