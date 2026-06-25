## Tailwind Design Systems, Theming & Accessibility

Day 9 polished the Task Management frontend: a real Tailwind v4 design-token system, responsive layouts, loading skeletons, a from-scratch toast system, system-aware dark mode, and an accessibility pass. The throughline was a single idea kept resurfacing — solve a concern *once, structurally* rather than re-solving it per component.

---

## Tailwind v4 has no config file

Most tutorials show Tailwind v3, where custom colors live in `tailwind.config.ts`. **Tailwind v4 removed that file.** Configuration lives in CSS via the `@theme` directive. Any variable you define there with the right prefix generates utility classes automatically:

| Variable | Utilities generated |
|---|---|
| `--color-brand-600` | `bg-brand-600`, `text-brand-600`, `border-brand-600` |
| `--animate-toast-in` | `animate-toast-in` |

The catch that cost real debugging time: **`@theme inline` vs `@theme`.**

- `@theme { --color-brand-600: #2563eb }` — bakes the hex straight into the utility class. The variable does **not** appear in DevTools at `:root`.
- `@theme inline { --color-brand-600: var(--brand-600) }` — emits the utility as `var(--brand-600)`, so the underlying `--brand-600` variable is visible and inspectable.

The correct, inspectable pattern is to define raw values in `:root`, then reference them from `@theme inline`:

```css
:root { --brand-600: #2563eb; }
@theme inline { --color-brand-600: var(--brand-600); }
```

This is exactly the pattern the starter already used for `--background`/`--foreground` — the lesson was recognizing *why* it was written that way.

---

## Mobile-first breakpoints

Tailwind is mobile-first. An unprefixed class applies at all sizes; a prefixed one applies at that breakpoint **and wider**. `px-4 sm:px-8` means 1rem on phones, 2rem at ≥640px. There's no `xs:` — no prefix *is* the smallest screen. You design small, then add size, never the reverse.

---

## The shadcn/ui trade-off (and the cost of `init` on an existing project)

shadcn/ui is not an imported library — it's a generator that copies component source into your project. The components are built on **Radix** (headless, accessible primitives — focus trap, ESC, ARIA, portals) plus Tailwind for styling. You own the code.

It earns its keep on hard-to-get-right components. Swapping the hand-rolled delete modal for shadcn's `Dialog` deleted the `useEffect` ESC listener, the `fixed inset-0` overlay, and the `stopPropagation` handler — Radix owns all of it.

But `npx shadcn init` is **invasive on an existing project**. It writes directly into `globals.css` — the file loaded on every page. It overwrote the font token (`--font-sans: var(--font-sans)`, a circular self-reference that broke the font), shifted the radius scale, added a global `* { border-border }` base rule, and swapped dark mode from `@media` to a `.dark` class strategy. Root cause: `globals.css` is the global entry point, so its `@layer base` rules cascade to the whole document. On greenfield this is fine; on an existing app, prefer copying individual component files and skipping `init`.

---

## Loading skeletons beat spinners

A skeleton mirrors the real layout with `bg-gray-200 animate-pulse` placeholders. Two wins over a spinner: **perceived performance** (the brain "sees" content arriving) and **layout stability** — the skeleton reserves the space the real content will fill, so nothing jumps when data loads (no Cumulative Layout Shift).

The skeleton's job is layout stability, *not* accuracy. Hardcoding 5 placeholder rows is fine even when the real list has a different count — users aren't counting placeholders, and `loading.tsx` renders before the fetch so it can't know the count anyway.

---

## A toast system from scratch

**State**: `useContext` + `useReducer`. The provider exposes a `showToast` function via context and renders the toast viewport itself, so the layout needs one wrapper. The reducer has `ADD` / `START_EXIT` / `REMOVE`.

**The redirect problem**: all mutations are Server Actions that call `redirect()`, which unmounts the calling component. So `showToast()` after `await createTask()` can't run — the component is gone. The fix is **redirect-and-flash**: the action redirects with a query flag (`/tasks/5?toast=created`), and a client `ToastFlash` component on the destination reads the flag, fires the toast, and `router.replace(pathname)` strips it so a refresh won't re-fire. The URL is the one piece of state that survives a server→client navigation.

A `lastFired` ref guards against React Strict Mode firing effects twice in dev (which would double every toast), resetting when the param clears so consecutive same-value flashes still work.

**Animating out** needs two phases — you can't animate an unmounted element. `START_EXIT` flips an `exiting` flag (element stays mounted, plays `animate-toast-out`), and `REMOVE` runs 200ms later once the animation finishes. This is what `AnimatePresence` automates in animation libraries.

---

## Dark mode: class strategy + no-flash script

Two strategies for when `dark:` activates:

- **Media query** (`@media (prefers-color-scheme: dark)`) — follows the OS automatically, zero JS, but the user **cannot override it**. No toggle possible.
- **Class** (`.dark` on `<html>`) — JS-controlled, so a toggle works *and* it can still default to the OS preference.

shadcn switched the project to the class strategy (`@custom-variant dark (&:is(.dark *))`), but nothing set the class — so dark mode was dormant until wired up.

**No-flash script**: setting `.dark` in a React `useEffect` paints light first, then repaints dark — a visible flash. The theme must be decided *before first paint*, and only a synchronous inline script runs that early. In this Next 16 + React 19 setup, a raw inline `<script>` in the tree is dropped during SSR; the working tool is `next/script` with `strategy="beforeInteractive"`, which the docs confirm is injected into `<head>` and runs before hydration. This is exactly what `next-themes` does internally. `suppressHydrationWarning` on `<html>` silences the expected mismatch from the script mutating the class before hydration.

**The toggle's hydration trap**: the server has no `document`/`localStorage`, so it can't know the theme and would render the wrong icon → hydration mismatch. The `mounted` pattern renders a neutral placeholder during SSR + first client render, then reads the real theme in `useEffect`.

**`dark:` variants vs semantic tokens**: with explicit `dark:bg-gray-900` on every surface, you must annotate each one — miss one (like the loading skeletons) and it stays light. The alternative is **semantic tokens** (`bg-card`, `text-foreground`, `border-border`) whose light/dark values are defined once in `:root`/`.dark`; components never write `dark:` and a new component is dark-ready automatically. This is why design systems use tokens — the same "solve it once, structurally" idea.

---

## Accessibility: structural vs per-element

- **`focus-visible`**: the browser's default focus ring already makes keyboard nav accessible — the danger is developers writing `outline: none` to hide the click ring, which breaks it. `:focus-visible` shows a ring only for keyboard focus, not mouse clicks. A single base rule (`button:focus-visible { ring-2 ... }`) covers every button at once.
- **Icon-only buttons** need an accessible name two ways: `aria-label` (good for dynamic labels, like the theme toggle's state-dependent text) or a visually-hidden `<span className="sr-only">` (static, survives translation tools). Both read identically to a screen reader.
- **`aria-live` regions**: dynamically inserted content (toasts) is silent to screen readers unless it lands in a region marked `aria-live="polite"`. The region must exist *before* content is added (the toast viewport always renders, even empty), and `aria-atomic="false"` so only the new toast is read.
- **Skip link**: the first focusable element, hidden with `sr-only` and revealed with `focus:not-sr-only`, jumping to `#main-content` (which needs `tabIndex={-1}` so the next Tab continues into content). Lets keyboard users bypass the nav on every page.

**The pattern that ties Day 9 together**: structural concerns (focus ring, skip link, toast announcements) are solved once, globally — a new button inherits them for free. But per-element semantics (what *this* icon means) travel with each element and can't be globalized. Knowing which is which is the difference between an accessible app and a pile of one-off fixes.
