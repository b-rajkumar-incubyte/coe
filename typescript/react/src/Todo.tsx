import type { TodoItem } from "./types";
import styles from "./Todo.module.css";

interface TodoProps {
    todo: TodoItem,
    removeTodo: (id: number) => void
}

function Todo({ todo, removeTodo }: TodoProps) {
    return <div className={styles.container}>
        <p className={styles.task}>{todo.task}</p>
        <span className={`${styles.status} ${styles[todo.status]}`}>{todo.status}</span>
        <button className={styles.deleteButton} onClick={() => removeTodo(todo.id)}>✕</button>
    </div>
}


export default Todo;