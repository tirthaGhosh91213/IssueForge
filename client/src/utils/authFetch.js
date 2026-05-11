/**
 * Authenticated fetch wrapper.
 * Automatically attaches the JWT token from localStorage.
 */
export async function authFetch(url, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    ...(options.headers || {}),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  // Only set Content-Type for non-FormData bodies
  if (!(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }
  return fetch(url, { ...options, headers });
}
