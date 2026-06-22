"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

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

export async function updateTask(
  id: number,
  title: string,
  description?: string,
  status?: string,
) {
  const res = await fetch(`http://localhost:8001/task/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description, status }),
  });

  if (!res.ok) throw new Error("Failed to update task.");

  revalidatePath(`/tasks/${id}`);
  redirect(`/tasks/${id}`);
}

export async function deleteTask(id: number) {
  const res = await fetch(`http://localhost:8001/task/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Failed to delete task.");

  revalidatePath("/tasks");
  redirect("/tasks");
}
