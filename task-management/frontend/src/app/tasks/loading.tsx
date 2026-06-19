export default function Loading() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="h-9 w-24 bg-gray-200 rounded-lg animate-pulse mb-2" />
        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-6" />
        <ul className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <li key={i} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="h-5 w-20 bg-gray-200 rounded-full animate-pulse shrink-0" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}