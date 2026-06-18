type Task = {
  id: number;
  title: string;
  description: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
};

const tasks: Task[] = [
  { id: 1, title: "Set up NestJS backend", description: "Initialize project and install dependencies", status: "DONE" },
  { id: 2, title: "Create task model", description: "Define Task entity with Prisma", status: "DONE" },
  { id: 3, title: "Build task API", description: "CRUD endpoints for tasks", status: "IN_PROGRESS" },
  { id: 4, title: "Build frontend", description: "Next.js app with task list and form", status: "TODO" },
];

const statusStyles: Record<Task["status"], string> = {
  DONE: "bg-green-100 text-green-700",
  IN_PROGRESS: "bg-yellow-100 text-yellow-700",
  TODO: "bg-gray-100 text-gray-600",
};


export default function TasksPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Tasks</h1>
        <ul className="space-y-3">
          {tasks.map((task) => (
            <li key={task.id} className="bg-white rounded-lg border border-gray-200 p-4">
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