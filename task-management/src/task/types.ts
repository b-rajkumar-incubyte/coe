type TaskStatus = "Not started" | "In progress" | "Done";

export interface Task {
    id: number,
    title: string,
    description?: string,
    status: TaskStatus
}