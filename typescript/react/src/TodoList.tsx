import Todo from "./Todo";
import type { TodoItem } from "./types";
import styles from "./TodoList.module.css";

interface TodoListProps {
    todos: TodoItem[],
    removeTodo: (id: number) => void
}

function TodoList({ todos, removeTodo }: TodoListProps) {
    return <div className={styles.container}>
        {todos.map((todo) => <Todo key={todo.id} todo={todo} removeTodo={removeTodo} />)}
    </div>
}


export default TodoList;