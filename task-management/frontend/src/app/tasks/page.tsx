import Link from "next/link";
import TaskList from "@/components/TaskList";
import { type Task } from "@/components/TaskCard";
import { apiFetch } from "@/lib/api";

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

  const res = await apiFetch(`/task?page=${page}&size=${PAGE_SIZE}`);

  if (!res.ok) {
    throw new Error("Failed to fetch tasks");
  }

  const { tasks, total }: TasksResponse = await res.json();
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-6 sm:px-8 sm:py-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl">Tasks</h1>
          <Link
            href="/tasks/new"
            className="px-4 py-2 text-sm bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
          >
            New task
          </Link>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{total} tasks total</p>

        <TaskList tasks={tasks} />

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <Link
              href={`/tasks?page=${page - 1}`}
              className={`px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${page <= 1 ? "pointer-events-none opacity-40" : ""}`}
            >
              Previous
            </Link>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Page {page} of {totalPages}
            </span>
            <Link
              href={`/tasks?page=${page + 1}`}
              className={`px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${page >= totalPages ? "pointer-events-none opacity-40" : ""}`}
            >
              Next
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
