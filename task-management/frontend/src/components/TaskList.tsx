"use client";

import Link from "next/link";
import { useState } from "react";
import TaskCard, { type Task } from "@/components/TaskCard";

type TaskStatus = Task["status"] | "ALL";

const FILTERS: { label: string; value: TaskStatus }[] = [
  { label: "All", value: "ALL" },
  { label: "Not started", value: "NOT_STARTED" },
  { label: "In progress", value: "IN_PROGRESS" },
  { label: "Done", value: "DONE" },
];

export default function TaskList({ tasks }: { tasks: Task[] }) {
  const [filter, setFilter] = useState<TaskStatus>("ALL");

  const visible = filter === "ALL" ? tasks : tasks.filter((t) => t.status === filter);

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        {FILTERS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
              filter === value
                ? "bg-brand-600 text-white border-brand-600"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-16">
          <p className="font-medium text-gray-500">No tasks yet</p>
          <p className="text-sm text-gray-400 mt-1">Create your first task to get started.</p>
        </div>
      ) : visible.length === 0 ? (
        <p className="text-sm text-gray-500 py-4">No tasks match this filter.</p>
      ) : (
        <ul className="space-y-3">
          {visible.map((task) => (
            <li key={task.id}>
              <Link
                href={`/tasks/${task.id}`}
                className="block hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
              >
                <TaskCard task={task} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
