import { cookies } from "next/headers";

const API_BASE = "http://localhost:8001";

// Server-side fetch wrapper: reads the JWT from the httpOnly cookie and
// forwards it to the NestJS API as a Bearer token. Only callable from
// Server Components, Server Actions, or Route Handlers (where cookies() works).
export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = (await cookies()).get("token")?.value;

  return fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...options.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}
