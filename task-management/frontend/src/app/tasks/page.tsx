type Task = {
  id: number;
  title: string;
  description: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
};

const statusStyles: Record<Task["status"], string> = {
  DONE: "bg-green-100 text-green-700",
  IN_PROGRESS: "bg-yellow-100 text-yellow-700",
  TODO: "bg-gray-100 text-gray-600",
};

export default async function TasksPage() {
  const tasksResponse = await fetch("http://localhost:3001/task").then(r => r.json());
  const tasks: Task[] = tasksResponse.tasks;

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tasks</h1>
        <p className="text-sm text-gray-500 mb-6">{tasks.length} tasks</p>
        <ul className="space-y-3">
          {tasks.map((task) => (
            <li key={task.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:border-blue-300 hover:shadow-sm transition-all">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-gray-900">{task.title}</p>
                  <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 ${statusStyles[task.status]}`}>
                  {task.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}