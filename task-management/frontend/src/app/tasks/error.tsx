"use client";

export default function TasksError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto text-center space-y-4 pt-20">
        <h2 className="text-xl font-semibold text-gray-900">
          Failed to load tasks
        </h2>
        <p className="text-sm text-gray-500">{error.message}</p>
        <button
          onClick={reset}
          className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          Try again
        </button>
      </div>
    </main>
  );
}