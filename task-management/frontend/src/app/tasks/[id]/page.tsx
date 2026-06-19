import Link from "next/link";
import TaskCard, { type Task } from "@/components/TaskCard";
import DeleteTaskButton from "@/components/DeleteTaskButton";

export default async function TaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await fetch(`http://localhost:8001/task/${id}`);
  if (!res.ok) {
    throw new Error(`Task ${id} not found`);
  }
  const task: Task = await res.json();

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/tasks"
            className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
          >
            ← Back to tasks
          </Link>
          <div className="flex items-center gap-2">
            <DeleteTaskButton taskId={task.id} />
            <Link
              href={`/tasks/${id}/edit`}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Edit
            </Link>
          </div>
        </div>
        <TaskCard task={task} />
      </div>
    </main>
  );
}
