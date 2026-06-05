## React with TypeScript

React is a JavaScript library for building user interfaces through reusable components. TypeScript adds static typing on top, which helps catch errors early and provides better tooling support when building React applications.

### Exercises

The following exercises were built as part of day 2 learnings. Both live under `typescript/react/src/`:

- **Counter app** — `Counter.tsx` — a simple component that increments a count, demonstrating `useState` and props with TypeScript
- **Todo app** — `App.tsx`, `TodoList.tsx`, `Todo.tsx`, `types.ts` — a todo list with remove, and status tracking, demonstrating component composition, prop drilling, typed interfaces, and CSS Modules

### File Extensions

React projects use two file extensions:

- **`.tsx`** — for files that contain JSX (components that render UI)
- **`.ts`** — for everything else: utility functions, types, hooks without JSX

Using `.tsx` everywhere works but misleads the reader about whether a file renders UI. The extension communicates intent.

### Why `import React` is No Longer Needed

Before React 17, every file with JSX required `import React from "react"` because the compiler transformed JSX into `React.createElement()` calls. Since React 17, a new JSX transform automatically imports the factory function behind the scenes. Today, React is only imported when explicitly using something from the package — hooks, types, context — as named imports.

---

## TypeScript in React

### `interface` vs `type`

Both can describe object shapes but serve different purposes:

- **`interface`** — preferred for describing the shape of objects, component props, and data models. Can be extended.
- **`type`** — used for unions, intersections, primitive aliases, and anything that requires flexibility. Cannot be extended or merged.

The practical distinction: if it is an object shape, use `interface`. If it involves a union of values or combining multiple types, use `type`.

### Organizing Types

Types have a natural home based on how widely they are shared:

- **Component prop types** are internal wiring of the component. They stay in the same file and are never exported.
- **Domain types** represent shared data used across multiple components. These belong in a dedicated `types.ts` file.
- **API response types** describe the shape of data returned from a backend. These also live in `types.ts` or a dedicated `types/api.ts`.

As the app grows, types can be organized into a `types/` folder grouped by domain, or co-located inside feature folders for larger applications.

### `verbatimModuleSyntax`

A strict TypeScript compiler setting that requires type imports to explicitly use `import type`. It prevents the compiler from silently erasing imports and makes the intent of each import unambiguous — whether it brings in a value or a type.

---

## CSS Modules

Regular CSS is global by default. A class name defined in one file can accidentally override or conflict with a class in another file as the application grows.

CSS Modules solves this by scoping class names to the file they are defined in. The build tool transforms each class name into a unique hash at compile time, so `.container` in `Todo.module.css` becomes something like `Todo_container_a3f2k` and can never clash with `.container` in another file.

The workflow is:

- Create a `.module.css` file alongside the component
- Write normal CSS inside it
- Import it as an object in the component and reference classes via `styles.className`

The naming convention is to match the CSS file name to the component file — `Todo.tsx` pairs with `Todo.module.css`.

---

## React State Management

### `useState`

State is data that, when changed, causes React to re-render the component and update the UI. It is declared with `useState` and always replaced with a new value — never mutated directly.

React uses reference equality to decide whether to re-render. Mutating the existing value (e.g. using `splice` on an array) leaves the reference unchanged, so React skips the re-render and the UI does not update.

The correct patterns for common operations on arrays:

- **Remove** — use `filter`, which returns a new array excluding the item
- **Update** — use `map`, which returns a new array with the changed item
- **Add** — use spread `[...todos, newItem]`, which returns a new array with the item appended

### Functional Updates

`useState`'s setter can accept either a new value or a function. When new state is derived from the previous state, the functional form should always be used:

```
setTodos(prev => prev.filter(todo => todo.id !== id))
```

This guarantees that `prev` is the latest state even when multiple updates are queued before a re-render. Closing over the state variable directly can lead to stale closure bugs where the update is based on an outdated value.

---

## Component Architecture

### Single Responsibility

Each component should have one job. A `Todo` component renders a single item, a `TodoList` component renders the collection, and an `App` component owns the data and orchestrates the rest. Keeping components focused makes them easier to test, understand, and reuse.

### State Ownership

State should live at the lowest common ancestor of all components that need to read or modify it. Placing state too low — inside a child component — means sibling or parent components cannot access it. A common mistake is initialising `useState` with a prop value. This only uses the prop once on the first render; if the parent updates the prop later, the child never sees the change because it holds its own stale copy.

### Prop Drilling

When state lives at the top of the tree and multiple nested components need it, props must be passed through every level even if intermediate components do not use the data themselves. This is called prop drilling.

Prop drilling is manageable in small applications but becomes painful as the tree deepens. This pain is what drives the need for more advanced state sharing solutions:

- **React Context** — built-in solution, eliminates drilling for shared state
- **Zustand / Jotai** — lightweight external libraries with simpler APIs
- **Redux** — heavyweight solution for large teams requiring strict patterns

The natural progression is to start with `useState` and prop drilling, move to Context when drilling becomes inconvenient, and reach for external libraries only when Context becomes complex.

### `key` Prop in Lists

When rendering a list with `map`, each item must have a unique `key` prop. React uses this to identify which items changed, were added, or removed between renders. Without a key, React re-renders every item from scratch and can produce subtle UI bugs when the list order changes. The key should be a stable unique identifier from the data, not the array index.

### `React.PropsWithChildren`

`PropsWithChildren` is a React utility type that adds an optional `children` prop to an interface. It should only be used on components that actually render `{props.children}` — layout wrappers and structural containers. Using it on a component that accepts no children is misleading and adds an unused prop to the component's API.

### `HTMLAttributes<T>`

A built-in React generic type that describes all props a native HTML element can accept — `className`, `style`, `id`, event handlers, and more. Extending it allows a custom component to accept the full set of props that the underlying element supports, without manually declaring each one.

The generic parameter `T` flows into event handlers, so `event.currentTarget` is typed correctly for that specific element. This pattern is most useful for design system components that wrap native elements and need to pass arbitrary HTML attributes through to callers.

---

## Promises and Async/Await

### Promises

A Promise is an object that represents the eventual result of an asynchronous operation. It can be in one of three states:

- **Pending** — the operation has not completed yet
- **Fulfilled** — the operation completed successfully and a value is available
- **Rejected** — the operation failed and an error is available

A Promise exposes two methods to handle its outcome:

- **`.then(result => ...)`** — runs when the Promise fulfills, receives the resolved value
- **`.catch(error => ...)`** — runs when the Promise rejects, receives the error

These methods can be chained because `.then` itself returns a new Promise:

```
fetch("/api/todos")
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error))
```

Each `.then` receives the return value of the previous one, forming a pipeline. If any step throws or rejects, execution jumps to `.catch`.

### async/await

`async/await` is syntactic sugar over Promises. It does not introduce a new concept — it is a cleaner way to write the same `.then` chain. Under the hood, the JavaScript engine still works with Promises.

Marking a function `async` means it always returns a Promise implicitly. Inside an `async` function, `await` unwraps the resolved value of a Promise directly — eliminating the need for nested `.then` callbacks.

A common misconception is that `await` makes the JavaScript engine pause and wait. It does not. JavaScript is single-threaded and never truly blocks. What actually happens is that the engine encounters `await`, suspends the rest of the `async` function, hands control back to the event loop to continue other work, and resumes the function only when the Promise settles. Under the hood, everything after an `await` is essentially wrapped in a `.then` callback by the engine — `await` is just a more readable way to express that. The code looks synchronous but the runtime behaviour is identical to chaining `.then`.

The equivalent of the `.then` chain above written with `async/await`:

```
async function fetchTodos() {
  const response = await fetch("/api/todos")
  const data = await response.json()
  console.log(data)
}
```

Each `await` line corresponds to one `.then`. Errors are handled with a standard `try/catch` block instead of `.catch`:

```
async function fetchTodos() {
  try {
    const response = await fetch("/api/todos")
    const data = await response.json()
    console.log(data)
  } catch (error) {
    console.error(error)
  }
}
```

### Why `async/await` is Preferred

`.then` chains become difficult to read when multiple asynchronous steps depend on each other, as each step requires a new callback. `async/await` reads like synchronous code while remaining non-blocking, making the intent easier to follow. Both are correct — `async/await` is the more readable form for most situations.
