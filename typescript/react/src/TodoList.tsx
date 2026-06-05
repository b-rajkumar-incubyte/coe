import Todo from "./Todo";
import type { TodoItem } from "./types";


interface TodoListProps {
    todos: TodoItem[]
}

function TodoList({todos}: TodoListProps) {

    return <div>
        {todos.map((todo) => <Todo key={todo.id} todo={todo}/> )}
    </div>

}


export default TodoList;