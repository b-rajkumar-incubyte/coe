type TodoStatus = "done" | "inProgress" | "notStarted"

export interface TodoItem  {
    id: number,
    task: string,
    status: TodoStatus
}