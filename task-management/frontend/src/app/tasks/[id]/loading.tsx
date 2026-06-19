export default function Loading() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="h-5 w-20 bg-gray-200 rounded-full animate-pulse shrink-0" />
        </div>
      </div>
    </main>
  );
}