import Link from "next/link";
import TaskCard, { type Task } from "@/components/TaskCard";

type TasksResponse = {
  tasks: Task[];
  total: number;
  page: number;
  limit: number;
};

const PAGE_SIZE = 10;

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam ?? 1));

  const res = await fetch(
    `http://localhost:8001/task?page=${page}&size=${PAGE_SIZE}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch tasks");
  }

  const { tasks, total }: TasksResponse = await res.json();
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tasks</h1>
        <p className="text-sm text-gray-500 mb-6">{total} tasks total</p>

        <ul className="space-y-3">
          {tasks.map((task) => (
            <li key={task.id}>
              <Link href={`/tasks/${task.id}`} className="block hover:opacity-90 transition-opacity">
                <TaskCard task={task} />
              </Link>
            </li>
          ))}
        </ul>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <Link
              href={`/tasks?page=${page - 1}`}
              className={`px-4 py-2 text-sm rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors ${page <= 1 ? "pointer-events-none opacity-40" : ""}`}
            >
              Previous
            </Link>
            <span className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </span>
            <Link
              href={`/tasks?page=${page + 1}`}
              className={`px-4 py-2 text-sm rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors ${page >= totalPages ? "pointer-events-none opacity-40" : ""}`}
            >
              Next
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}