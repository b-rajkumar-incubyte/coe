export enum TaskStatus {
    NOT_STARTED = "Not started",
    IN_PROGRESS = "In progress",
    DONE = "Done",
}

export interface Task {
    id: number,
    title: string,
    description?: string,
    status: TaskStatus
}