import Link from "next/link";
import TaskCard, { type Task } from "@/components/TaskCard";
import DeleteTaskButton from "@/components/DeleteTaskButton";
import StatusToggle from "@/components/StatusToggle";
import { apiFetch } from "@/lib/api";

export default async function TaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await apiFetch(`/task/${id}`);
  if (!res.ok) throw new Error(`Task ${id} not found`);
  const task: Task = await res.json();

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-6 sm:px-8 sm:py-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/tasks"
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-500 transition-colors"
          >
            ← Back to tasks
          </Link>
          <div className="flex items-center gap-2">
            <DeleteTaskButton taskId={task.id} />
            <Link
              href={`/tasks/${id}/edit`}
              className="px-4 py-2 text-sm bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
            >
              Edit
            </Link>
          </div>
        </div>
        <TaskCard task={task} />
        <StatusToggle task={task} />
      </div>
    </main>
  );
}
