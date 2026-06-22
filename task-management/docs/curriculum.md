# Task Management Frontend Curriculum

## Tech Stack
- Next.js 16.2 (App Router, TypeScript)
- Tailwind CSS
- Backend: NestJS on http://localhost:8000

## Learner Profile
- Knows React (hooks, components, JSX)
- New to Next.js

---

## Module 1: Project Setup & App Router Structure
Goal: Create the Next.js project and understand how App Router organizes files differently from plain React.

- [x] Step 1.1: Create Next.js 16.2 project with create-next-app
- [x] Step 1.2: Tour the generated file structure (app/, layout.tsx, page.tsx, next.config.ts)
- [x] Step 1.3: Understand the root layout — the persistent shell around every page
- [x] Step 1.4: Edit the home page to show a Task Manager welcome screen
- [x] Step 1.5: Checkpoint — App Router mental model

---

## Module 2: File-Based Routing
Goal: Create the /tasks route and understand how folders become URLs.

- [x] Step 2.1: Create app/tasks/page.tsx — your first route
- [x] Step 2.2: Add a navigation bar to the root layout
- [x] Step 2.3: Build a static tasks list with hardcoded data
- [x] Step 2.4: Style the tasks list with Tailwind
- [x] Step 2.5: Checkpoint — routing and layouts

---

## Module 3: Data Fetching from NestJS API
Goal: Fetch real tasks from the NestJS backend using Server Components.

- [x] Step 3.1: Server Components — fetching data with async/await (no useEffect)
- [x] Step 3.2: Replace hardcoded data with real API call to GET /task
- [x] Step 3.3: Dynamic route — create app/tasks/[id]/page.tsx for task detail
- [x] Step 3.4: Add app/tasks/loading.tsx — automatic loading skeleton
- [x] Step 3.5: Add app/tasks/error.tsx — automatic error boundary
- [x] Step 3.6: Checkpoint — Server Components vs Client Components

---

## Module 4: Client Components & Interactive UI
Goal: Understand when Server Components can't do the job, add your first interactive feature with useState.

- [x] Step 4.1: "use client" — when and why to use it
- [x] Step 4.2: Add a status filter bar — useState to filter the task list client-side
- [x] Step 4.3: Checkpoint — deciding between Server and Client Components

---

## Module 5: Forms — Creating & Editing Tasks
Goal: Build forms that create and update tasks by calling the NestJS API directly from the browser.

- [x] Step 5.1: Enable CORS in NestJS — why browser requests are blocked without it
- [x] Step 5.2: Build CreateTaskForm — controlled inputs and useState
- [x] Step 5.3: POST to /task and redirect to the new task after creation
- [x] Step 5.4: Build EditTaskForm — pre-populate a form from existing task data
- [x] Step 5.5: PATCH /task/:id to save edits
- [x] Step 5.6: Checkpoint — form state and submission patterns

---

## Module 6: Delete, Validation & Error Handling
Goal: Complete CRUD by adding delete with confirmation and validate input before sending.

- [x] Step 6.1: Delete task with a confirmation prompt
- [x] Step 6.2: Client-side validation — catch errors before the request leaves the browser
- [x] Step 6.3: Display server errors inline in the form
- [x] Step 6.4: Checkpoint — validation and error UX patterns

---

## Module 7: Server Actions
Goal: Learn Server Actions — Next.js's native pattern for calling server-side logic from a form.

- [x] Step 7.1: What is a Server Action — a server function called directly from a form
- [x] Step 7.2: Rewrite create task using a Server Action
- [x] Step 7.3: revalidatePath — tell Next.js to re-render server data after a mutation
- [x] Step 7.4: Checkpoint — when to use Server Actions vs direct fetch

---

## Module 8: Optimistic UI & Polish
Goal: Make mutations feel instant, then clean up and ship.

- [x] Step 8.1: useOptimistic — update the UI before the server confirms
- [ ] Step 8.2: Pending state during form submission — disable the button, show a spinner
- [ ] Step 8.3: Final checkpoint + polish
