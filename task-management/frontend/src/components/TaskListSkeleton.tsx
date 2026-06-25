export default function TaskListSkeleton() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-6 sm:px-8 sm:py-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <div className="h-8 w-24 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse sm:h-9" />
          <div className="h-9 w-24 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
        </div>
        <div className="h-4 w-28 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-6" />

        <div className="flex gap-2 mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-8 w-20 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse" />
          ))}
        </div>

        <ul className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <li key={i} className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                  <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                </div>
                <div className="h-5 w-20 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse shrink-0" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
