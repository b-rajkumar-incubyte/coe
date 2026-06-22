## Next.js Client Components, Forms, Server Actions & Optimistic UI

Day 8 continued the Task Management frontend. The session covered when and why to use Client Components, how to build forms that talk to a backend API, how Server Actions eliminate CORS by keeping mutations on the Next.js server, and how `useOptimistic` makes mutations feel instant.

---

## "use client" — the boundary directive

Server Components are the default in App Router. Adding `"use client"` at the top of a file marks it as a Client Component — it runs in the browser and can use `useState`, `useEffect`, event handlers, and browser APIs.

The directive is a boundary declaration, not a per-component toggle. Everything at and below the boundary in the import tree moves to the client. Everything above it stays on the server. This means the rule is: push `"use client"` as deep as possible — only the component that actually needs interactivity should carry the directive. A page with 90% static content and one interactive button should have `"use client"` on the button component, not on the page.

The decision is straightforward: if the component uses `useState`, `useEffect`, `onClick`, `onChange`, or any browser API — it needs `"use client"`. If it only receives props and renders HTML — it stays a Server Component.

---

## CORS — why browser requests are different

CORS (Cross-Origin Resource Sharing) is a browser security restriction. The browser refuses to send a request to a different origin than the page it loaded from, unless the target server explicitly opts in via `Access-Control-Allow-Origin` headers.

Before sending a cross-origin POST, the browser sends a preflight `OPTIONS` request asking: "I'm from `localhost:3000`, can I send a POST with a Content-Type header?" The server responds with the allowed origins, methods, and headers. If the origin matches, the real request proceeds. If not, the browser blocks it before it leaves the machine — which is why the error appears in the browser console rather than in a `catch` block.

Server Components are immune to CORS because they run on the Next.js server, not in the browser. The browser only ever sees the Next.js server — the request to NestJS is server-to-server. CORS is purely a browser protection; it has no effect on server-to-server calls.

The underlying threat CORS defends against is CSRF: a script on `evil.com` calling `bank.com` while the user's session cookies are attached. CORS forces `bank.com` to explicitly opt in before any cross-origin script can use it.

---

## Controlled forms in React

A controlled form keeps each input's value in `useState`. The input's `value` prop is set from state and `onChange` updates state. This means React is always the source of truth — you can read the current values at any point without querying the DOM.

The submit handler calls `e.preventDefault()` to stop the browser's default HTML form POST, then reads the state values and dispatches the mutation.

Client-side validation runs before the fetch. A pure `validate()` function takes the current field values and returns an errors object. If the object is non-empty, `handleSubmit` sets the errors state and returns early — no network request fires. This gives instant feedback without a round-trip, while the backend still validates independently (because client checks can be bypassed by calling the API directly).

---

## Server Actions

A Server Action is an `async` function marked with `"use server"`. Next.js compiles it into an internal POST endpoint and replaces the function in the client bundle with a stub that calls that endpoint. When a Client Component calls the action, the browser POSTs to Next.js, Next.js runs the function on the server, and the result is returned.

This means the fetch from Next.js to NestJS happens server-to-server — no CORS needed. NestJS never needs to know the browser exists.

```ts
"use server";

export async function createTask(title: string, description?: string) {
  const res = await fetch("http://localhost:8001/task", { method: "POST", ... });
  if (!res.ok) throw new Error("Failed to create task.");
  const task = await res.json();
  redirect(`/tasks/${task.id}`);
}
```

Server Actions are for mutations — create, update, delete. Reading data still belongs to Server Components with `fetch`. For reactive data (search-as-you-type, infinite scroll), client-side fetch is still the right tool because Server Actions are triggered by explicit calls, not reactive state.

`redirect()` from `next/navigation` works inside Server Actions. It throws a special signal that Next.js intercepts and turns into a navigation — no `useRouter` needed in the Client Component.

---

## revalidatePath — cache invalidation after mutations

Next.js caches Server Component responses. After a mutation, the cached version of affected pages must be invalidated or the user sees stale data.

`revalidatePath(path)` from `next/cache` marks a route's cache as stale. The next request to that route re-runs the Server Component and fetches fresh data. Call it inside a Server Action before `redirect()`.

```ts
revalidatePath("/tasks");        // list page gains the new/deleted task
revalidatePath(`/tasks/${id}`);  // detail page shows updated data
```

Without `revalidatePath`, navigating back to `/tasks` after creating a task may show the old cached list — the new task appears missing even though it was created successfully.

---

## useOptimistic — instant UI before the server confirms

`useOptimistic` holds a temporary value for the duration of an async operation. You render the optimistic value immediately; when the operation completes (success or failure), the real prop value takes over and React discards the temporary one.

```ts
const [optimisticStatus, setOptimisticStatus] = useOptimistic(task.status);
```

`useOptimistic` must be used inside a `startTransition` callback — React batches the optimistic update with the async operation so it knows when to revert.

```ts
startTransition(async () => {
  setOptimisticStatus(next);         // UI updates instantly
  await updateTask(task.id, next);   // server call runs in background
});
```

If the server call succeeds and `revalidatePath` fires, the real data replaces the optimistic value with no visible flicker. If it fails, the optimistic value is discarded and the original snaps back.

---

## _rsc query parameter

When you click a `<Link>` in Next.js, the browser does not do a full page reload. It fetches the new route's RSC payload via a POST to the current URL with `?_rsc=<hash>` appended. The server returns a serialised component tree (not full HTML), and React patches the existing page with the new content. The hash is a cache-busting key — it changes when `router.refresh()` is called, which is why `router.refresh()` in `error.tsx` triggers a new server fetch.

---

## Custom modal with Tailwind

A custom modal is a `fixed inset-0` overlay controlled by a `useState` boolean. Three things to handle manually that the native `<dialog>` element provides for free:

- **Backdrop click to close**: `onClick` on the overlay div
- **ESC key to close**: `useEffect` with a `keydown` listener, cleaned up when the modal closes
- **Stop propagation**: `e.stopPropagation()` on the modal card so clicking inside doesn't trigger the overlay's close handler

```tsx
<div className="fixed inset-0 bg-black/40 z-50" onClick={() => setOpen(false)}>
  <div onClick={(e) => e.stopPropagation()}>
    {/* modal content */}
  </div>
</div>
```
