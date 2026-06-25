"use client";

import { useOptimistic, useTransition } from "react";
import { updateTask } from "@/lib/actions";
import { type Task } from "@/components/TaskCard";

type TaskStatus = Task["status"];

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: "NOT_STARTED", label: "Not started" },
  { value: "IN_PROGRESS", label: "In progress" },
  { value: "DONE", label: "Done" },
];

const activeStyles: Record<TaskStatus, string> = {
  NOT_STARTED: "bg-status-not-started text-status-not-started-fg",
  IN_PROGRESS: "bg-status-in-progress text-status-in-progress-fg",
  DONE:        "bg-status-done text-status-done-fg",
};

export default function StatusToggle({ task }: { task: Task }) {
  const [optimisticStatus, setOptimisticStatus] = useOptimistic(task.status);
  const [isPending, startTransition] = useTransition();

  function handleSelect(next: TaskStatus) {
    if (next === optimisticStatus) return;
    startTransition(async () => {
      setOptimisticStatus(next);
      await updateTask(task.id, task.title, task.description ?? undefined, next);
    });
  }

  return (
    <div className="mt-4">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Status</p>
      <div className={`inline-flex rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-1 gap-1 ${isPending ? "opacity-70" : ""}`}>
        {STATUS_OPTIONS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => handleSelect(value)}
            disabled={isPending}
            className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors ${
              optimisticStatus === value
                ? activeStyles[value]
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
