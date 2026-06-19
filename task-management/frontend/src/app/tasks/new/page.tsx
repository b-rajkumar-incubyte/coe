import Link from "next/link";
import CreateTaskForm from "@/components/CreateTaskForm";

export default function NewTaskPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/tasks"
          className="text-sm text-gray-500 hover:text-blue-600 transition-colors mb-6 inline-block"
        >
          ← Back to tasks
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">New task</h1>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <CreateTaskForm />
        </div>
      </div>
    </main>
  );
}
