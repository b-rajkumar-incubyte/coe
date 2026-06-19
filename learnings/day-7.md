## Next.js App Router — Routing, Server Components & Data Fetching

Day 7 started the frontend for the Task Management app using Next.js 16.2. The session covered how the App Router organises files into routes, how Server Components fetch data without hooks, how Next.js streams responses to the browser, and how `loading.tsx` and `error.tsx` provide automatic loading and error states.

---

## File-Based Routing

In Next.js App Router, the file system is the router. Every folder inside `app/` represents a URL segment, and a `page.tsx` file inside that folder is what makes the segment publicly accessible. A folder without a `page.tsx` is invisible to visitors — it can hold shared files but serves no route.

Nesting folders creates nested URLs. `app/tasks/[id]/page.tsx` becomes `/tasks/1`, `/tasks/42`, and so on. The `[id]` bracket syntax marks the segment as dynamic — Next.js captures whatever is in that position of the URL and passes it to the component as a param.

Route matching is greedy from the top of the folder tree downward. Specific (literal) folder names always take precedence over dynamic (`[param]`) segments at the same level, which is why static routes like `/tasks/archived` must be created as `app/tasks/archived/page.tsx` — without that file, the request falls through to `app/tasks/[id]/page.tsx` and `archived` is treated as an id.

---

## Layouts

`layout.tsx` is a persistent shell that wraps every page in its folder and all subfolders. The `{children}` prop is where the current page renders. When navigating between routes, the layout stays mounted — only the page swaps. This is what makes it the right place for the nav bar: one definition, present everywhere.

Layouts compose. A `app/tasks/layout.tsx` wraps only the tasks section and its children, sitting inside the root layout. This nesting means a route like `/tasks/1` is wrapped by both the root layout and the tasks layout simultaneously. Each layout can contribute its own structure — a root nav bar, a section-specific sidebar — without any page knowing about it.

---

## Dynamic Route Params and Search Params in Next.js 16

Next.js 16 made `params` and `searchParams` async — both are Promises that must be awaited before reading their values. This is a breaking change from older versions where they were plain synchronous objects.

`params` carries path segment values — the `id` from `[id]`. `searchParams` carries query string values — the `page` from `?page=2`. Both arrive as props on the page component and must be awaited at the top of the function before any access:

```tsx
export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
}
```

---

## Server Components

Server Components are the default in App Router. They run on the server, never in the browser, and can be `async` — meaning they can `await` data directly in the component body without any hooks.

The practical consequence is that data fetching looks like ordinary Node.js code. There is no `useEffect`, no `useState`, no loading flag to manage. The component awaits the fetch, constructs the JSX from the result, and Next.js sends the fully-rendered HTML to the browser. The user receives a complete page, not a blank shell that fills in after JavaScript loads.

Because Server Components run on the server, their fetch calls are server-to-server. The browser never sees a request to the NestJS backend — it only ever communicates with the Next.js server. CORS is a browser restriction and does not apply to server-side fetches.

---

## HTTP Streaming and loading.tsx

Next.js does not wait for all data to be ready before sending any HTML. It uses HTTP chunked transfer encoding to stream the response in pieces.

When a request arrives for an async page, Next.js immediately sends the outer shell — the layout, the nav bar, and whatever `loading.tsx` defines — as the first chunk. The browser renders the skeleton while the server continues awaiting data. When the async page component finishes, Next.js streams a second chunk containing the real content. React on the client swaps the skeleton out without a full page reload.

`loading.tsx` is the mechanism that enables this. Placing it next to a `page.tsx` automatically wraps that page in a React Suspense boundary. The Suspense boundary is what gives Next.js the split point — everything outside it can be sent immediately, and the boundary's fallback (the loading UI) is shown until the page resolves. Without `loading.tsx`, Next.js holds the entire response until the page is ready.

---

## error.tsx and Error Boundaries

`error.tsx` is the error counterpart to `loading.tsx`. It wraps the page in a React error boundary. If the async page component throws at any point, the error boundary catches it and renders `error.tsx` instead.

`error.tsx` must be a Client Component (`"use client"`) because React error boundaries require internal component state, which only exists on the client.

The component receives two props: `error` (the thrown Error object) and `reset` (a function to retry). These two do different things and must be used together for a genuine retry:

- `reset()` clears the React error boundary state so React attempts to render the page component again. On its own it does not trigger a new server fetch — it retries the render with whatever is already on the client.
- `router.refresh()` from `useRouter()` tells Next.js to invalidate the router cache and re-execute the Server Component on the server, firing a new RSC request. This is the call that actually re-fetches from the backend.

Calling only `reset()` produces no network activity. Calling both together is the correct retry pattern.

---

## Link vs anchor tag

Next.js provides a `Link` component from `next/link` for internal navigation. It performs client-side transitions — only the changed parts of the page update, the layout stays mounted, and no full HTML document is fetched. `Link` also prefetches the target page when it enters the viewport, making navigations feel instant.

A plain `<a>` tag triggers a full browser navigation — the entire page reloads, all state is lost, and the full HTML document is re-fetched. Use `<a>` only for external URLs. Every internal link should use `Link`.

---

## Component Organisation

Route files (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`) live inside `app/`. Shared UI components that are not routes live in `src/components/`. The distinction matters: anything inside `app/` is treated as a potential route segment; components in `src/components/` are never exposed as URLs.

Next.js configures a `@/` path alias pointing to `src/` automatically. Imports like `import TaskCard from "@/components/TaskCard"` work without any relative path traversal regardless of how deep the importing file is nested.

When the same JSX block appears in two different places, that is the right time to extract a component. Extracting before there are two use sites adds a file and an import for no practical benefit — three similar lines in one place are easier to reason about than an abstraction used once.
