import Link from "next/link";
import TaskCard, { type Task } from "@/components/TaskCard";

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
        <Link
          href="/tasks"
          className="text-sm text-gray-500 hover:text-blue-600 transition-colors mb-6 inline-block"
        >
          ← Back to tasks
        </Link>
        <TaskCard task={task} />
      </div>
    </main>
  );
}
