const API_BASE_URL = "http://127.0.0.1:8000";

const MANAGER_KEY = import.meta.env.VITE_DAIRYFLOW_MANAGER_KEY;

export async function apiRequest(endpoint, options = {}) {
  if (!MANAGER_KEY) {
    throw new Error(
      "Manager key is missing. Check frontend/.env and restart Vite."
    );
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${MANAGER_KEY}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `Request failed (${response.status})`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}