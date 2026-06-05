import Counter from "./Counter";
import TodoList from "./TodoList";
import type { TodoItem } from "./types";

function App() {
  const todos: TodoItem[] = [
    {id: 1, task: "breakfast", status: "done"},
    {id: 2, task: "Work", status: "inProgress"}
  ];

  return (
  <>
  <div> <Counter start={2} /> </div>
    <div>
      <TodoList todos={todos}/>
    </div>
    </>
  )
}


export default App;