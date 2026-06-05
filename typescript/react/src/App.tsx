import TodoList from "./TodoList";
import type { TodoItem } from "./types";
import { useState } from "react";
import styles from "./App.module.css";

function App() {
  const [todos, setTodos] = useState<TodoItem[]>([
    { id: 1, task: "breakfast", status: "done" },
    { id: 2, task: "Work", status: "inProgress" },
    { id: 3, task: "Evening walk", status: "notStarted" }
  ]);

  const removeTodo = (id: number) => {
    setTodos((previousTodos) => previousTodos.filter((todo) => todo.id !== id));
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>My Todos</h2>
      <TodoList todos={todos} removeTodo={removeTodo} />
    </div>
  )
}


export default App;