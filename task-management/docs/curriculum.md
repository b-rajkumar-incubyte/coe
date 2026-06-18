# Task Management Frontend Curriculum

## Tech Stack
- Next.js 16.2 (App Router, TypeScript)
- Tailwind CSS
- Backend: NestJS on http://localhost:3000

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

- [ ] Step 3.1: Server Components — fetching data with async/await (no useEffect)
- [ ] Step 3.2: Replace hardcoded data with real API call to GET /task
- [ ] Step 3.3: Dynamic route — create app/tasks/[id]/page.tsx for task detail
- [ ] Step 3.4: Add app/tasks/loading.tsx — automatic loading skeleton
- [ ] Step 3.5: Add app/tasks/error.tsx — automatic error boundary
- [ ] Step 3.6: Checkpoint — Server Components vs Client Components

---

## Module 4: Client Components & Create Task Form
Goal: Add interactivity with Client Components and submit a new task to the API.

- [ ] Step 4.1: "use client" — when and why to use it
- [ ] Step 4.2: Extract TaskList as a Client Component with status filter
- [ ] Step 4.3: Build a CreateTaskForm Client Component
- [ ] Step 4.4: POST new task to NestJS backend
- [ ] Step 4.5: Final checkpoint + polish
