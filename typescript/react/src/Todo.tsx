import type { TodoItem } from "./types"

interface TodoProps {
    todo: TodoItem
}


function Todo({todo}: TodoProps) {
    return <div>
        <p> {todo.id} </p>
        <p> {todo.task} </p>
        <p> {todo.status} </p>
    </div>
}


export default Todo;