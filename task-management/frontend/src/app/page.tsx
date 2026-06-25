import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 p-8">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">Task Manager</h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg max-w-sm">
          Manage your tasks simply and efficiently.
        </p>
        <Link
          href="/tasks"
          className="inline-block rounded-lg bg-brand-600 px-6 py-3 text-white font-medium hover:bg-brand-700 transition-colors"
        >
          View Tasks
        </Link>
      </div>
    </main>
  );
}
