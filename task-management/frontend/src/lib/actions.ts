"use server";

import { redirect } from "next/navigation";

export async function createTask(title: string, description?: string) {
  const res = await fetch("http://localhost:8001/task", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description }),
  });

  if (!res.ok) throw new Error("Failed to create task.");

  const task = await res.json();
  redirect(`/tasks/${task.id}`);
}
