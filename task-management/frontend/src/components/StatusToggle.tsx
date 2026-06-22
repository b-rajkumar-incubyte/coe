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
  NOT_STARTED: "bg-gray-200 text-gray-800",
  IN_PROGRESS: "bg-yellow-100 text-yellow-800",
  DONE: "bg-green-100 text-green-800",
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
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Status</p>
      <div className={`inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1 gap-1 ${isPending ? "opacity-70" : ""}`}>
        {STATUS_OPTIONS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => handleSelect(value)}
            disabled={isPending}
            className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors ${
              optimisticStatus === value
                ? activeStyles[value]
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
