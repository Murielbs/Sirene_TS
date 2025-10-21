export const API_BASE = (import.meta as any)?.env?.VITE_API_URL
  ? String((import.meta as any).env.VITE_API_URL)
  : "";

export const apiUrl = (path: string) => {
  const base = API_BASE ? API_BASE.replace(/\/$/, "") : "";
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
};

export async function apiFetch(input: string, init?: RequestInit) {
  const url = apiUrl(input);
  return fetch(url, init);
}
