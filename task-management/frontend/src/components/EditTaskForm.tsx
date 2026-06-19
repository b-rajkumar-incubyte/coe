"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { type Task } from "@/components/TaskCard";
import { validateTaskForm, type TaskFormErrors } from "@/lib/validateTask";

type TaskStatus = Task["status"];

const STATUS_OPTIONS: { label: string; value: TaskStatus }[] = [
  { label: "Not started", value: "NOT_STARTED" },
  { label: "In progress", value: "IN_PROGRESS" },
  { label: "Done", value: "DONE" },
];

export default function EditTaskForm({ task }: { task: Task }) {
  const router = useRouter();
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [errors, setErrors] = useState<TaskFormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validateTaskForm(title);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    setServerError(null);

    const res = await fetch(`http://localhost:8001/task/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title.trim(), description: description || undefined, status }),
    });

    if (!res.ok) {
      setServerError("Failed to update task. Please try again.");
      setSubmitting(false);
      return;
    }

    router.push(`/tasks/${task.id}`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (errors.title) setErrors({});
          }}
          className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.title ? "border-red-400" : "border-gray-200"
          }`}
        />
        {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as TaskStatus)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          {STATUS_OPTIONS.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {serverError && <p className="text-sm text-red-600">{serverError}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? "Saving..." : "Save changes"}
      </button>
    </form>
  );
}
