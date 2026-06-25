import Link from "next/link";
import EditTaskForm from "@/components/EditTaskForm";
import { type Task } from "@/components/TaskCard";
import { apiFetch } from "@/lib/api";

export default async function EditTaskPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await apiFetch(`/task/${id}`);
  if (!res.ok) {
    throw new Error(`Task ${id} not found`);
  }
  const task: Task = await res.json();

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 p-8">
      <div className="max-w-2xl mx-auto">
        <Link
          href={`/tasks/${id}`}
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-500 transition-colors mb-6 inline-block"
        >
          ← Back to task
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Edit task</h1>
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <EditTaskForm task={task} />
        </div>
      </div>
    </main>
  );
}
