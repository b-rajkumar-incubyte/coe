export type TaskFormErrors = {
  title?: string;
};

export function validateTaskForm(title: string): TaskFormErrors {
  const errors: TaskFormErrors = {};
  if (!title.trim()) errors.title = "Title is required.";
  else if (title.trim().length < 3) errors.title = "Title must be at least 3 characters.";
  return errors;
}
