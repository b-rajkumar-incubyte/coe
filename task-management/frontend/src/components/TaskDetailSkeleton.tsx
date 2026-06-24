export default function TaskDetailSkeleton() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-6 sm:px-8 sm:py-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
          <div className="flex gap-2">
            <div className="h-9 w-20 bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-9 w-16 bg-gray-200 rounded-lg animate-pulse" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              <div className="h-5 w-2/3 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse shrink-0" />
          </div>
        </div>

        <div className="mt-4">
          <div className="h-3 w-16 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="flex gap-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-9 w-28 bg-gray-200 rounded-md animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
