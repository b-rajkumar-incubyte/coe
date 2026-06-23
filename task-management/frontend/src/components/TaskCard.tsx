type TaskStatus = "NOT_STARTED" | "IN_PROGRESS" | "DONE";

export type Task = {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
};

const statusStyles: Record<TaskStatus, string> = {
  NOT_STARTED: "bg-status-not-started text-status-not-started-fg",
  IN_PROGRESS: "bg-status-in-progress text-status-in-progress-fg",
  DONE:        "bg-status-done text-status-done-fg",
};

const statusLabels: Record<TaskStatus, string> = {
  NOT_STARTED: "Not started",
  IN_PROGRESS: "In progress",
  DONE:        "Done",
};

export default function TaskCard({ task }: { task: Task }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-medium text-gray-900">{task.title}</p>
          {task.description && (
            <p className="text-sm text-gray-500 mt-1">{task.description}</p>
          )}
        </div>
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 ${statusStyles[task.status]}`}
        >
          {statusLabels[task.status]}
        </span>
      </div>
    </div>
  );
}
