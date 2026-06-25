"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const TOKEN_MAX_AGE = 60 * 60 * 24; // 1 day — matches the backend JWT expiry

// Not exported, so it stays a plain helper rather than a Server Action.
async function storeToken(accessToken: string) {
  const cookieStore = await cookies();
  cookieStore.set("token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: TOKEN_MAX_AGE,
    path: "/",
  });
}

export async function login(email: string, password: string) {
  const res = await fetch("http://localhost:8001/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    return { error: "Invalid email or password" };
  }

  const { accessToken } = await res.json();
  await storeToken(accessToken);
  redirect("/tasks");
}

export async function register(name: string, email: string, password: string) {
  const res = await fetch("http://localhost:8001/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    const message = Array.isArray(data?.message) ? data.message[0] : data?.message;
    return { error: message ?? "Registration failed" };
  }

  const { accessToken } = await res.json();
  await storeToken(accessToken);
  redirect("/tasks");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("token");
  redirect("/login");
}
