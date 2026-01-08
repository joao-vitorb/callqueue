const API_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ??
  "http://localhost:3000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${API_URL}${path}`;

  const res = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed (${res.status})`);
  }

  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}

export const http = {
  get: <T>(path: string) => request<T>(path),

  post: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "POST",
      body: body === undefined ? undefined : JSON.stringify(body),
    }),

  del: <T>(path: string) =>
    request<T>(path, {
      method: "DELETE",
    }),
};
