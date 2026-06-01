# Flexi Academy — Next-Gen Frontend

A headless frontend overhaul for Flexi Academy's Moodle LMS. Keep the Moodle backend
(records, configs, assignments, gradebook) — replace the legacy UI with a focus-driven,
animated learning experience.

This is the **demo prototype** built against a mock Moodle adapter. Swapping in the real
Moodle Web Services API is a one-file change (see "Wiring up real Moodle" below).

## What's in the box

All 5 epics from the PRD are built:

| Epic | Route | Highlights |
|---|---|---|
| 1 — Gateway | `/login` | Glassmorphic auth card, animated backdrop, inline validation (debounced), silent token refresh, **re-auth modal that preserves form state** anywhere in the app. |
| 2 — Command Center | `/dashboard` | Collapsible Live Room Utilities with Zoom ID / password / **OTP copy-to-clipboard** + rotating expiry, slide-out tabbed notifications drawer, contextual ProfileHub with streak + XP. |
| 3 — Library | `/library` | Visual CourseCards with category chips and progress bars, instant client-side OmniSearch, dynamic Category Pills, sticky UpcomingEvents panel that auto-polls. |
| 4 — Roadmap | `/courses/:id` | Interactive Quadmester timeline (inner-pane swap, no full page navigation), RadialProgress hero, Recharts pacing chart comparing your pace to required pace. |
| 5 — Immersion | `/courses/:id/lessons/:id` | **Focus mode** that slides all chrome away, slim slide-out LessonDrawer with animated completion ticks, wide ActivityBlocks (Minds On, reading, video, check, reflection) replacing the legacy narrow iframe. |

## Stack

- **Vite 5** + **React 18** (JSX)
- **Tailwind CSS** with custom design tokens (dark editorial: midnight / iris / aurora / amber)
- **Framer Motion** for transitions and micro-interactions
- **React Router 6** for nested routing
- **Zustand** (with `persist`) for auth, UI state, and client-side course cache
- **Recharts** for completion analytics
- **lucide-react** for icons

## Run it

```bash
npm install
npm run dev
```

Then open `http://localhost:5175/`.

**Demo login**: any email + any password ≥ 4 characters. The mock auth tokens last 5 minutes.
Use the profile menu → "Simulate session timeout" to demo the silent re-auth modal.

## Try these for the demo

1. **Sign in** with any credentials → notice inline validation, smooth transition to the dashboard.
2. **Dashboard** → click any chip in Live Room Utilities to copy a Zoom ID / OTP / password (watch the toast confirmation). Notice the OTP refreshes every 30 seconds.
3. **Notifications** bell (top-right) → tabbed drawer with Admin and Course categories.
4. **Profile menu → "Simulate session timeout"** → the re-auth modal appears overlaid; type any password to dismiss without losing where you are.
5. **Library** → search "math", filter by category pill. Tap any course.
6. **Course page** → click different Quadmesters; the inner pane swaps with a crossfade (page never navigates).
7. **Open a lesson** → see five activity blocks. **Click "Enter focus mode"** in the lesson header (or the icon in TopBar) — TopBar and SideRail slide away, leaving only the content.

## Wiring up real Moodle

The frontend talks to Moodle through a single adapter interface in
[`src/api/moodleClient.js`](src/api/moodleClient.js). Two implementations satisfy it:

- [`mockMoodle.js`](src/api/mockMoodle.js) — what runs by default; reads from
  [`fixtures/`](src/api/fixtures/) with simulated latency.
- [`realMoodle.js`](src/api/realMoodle.js) — stubbed adapter for Moodle Web Services.
  Each method is paired with the suggested `wsfunction` name in a comment.

To activate the real adapter:

```bash
# .env.local
VITE_MOODLE_MODE=real
VITE_MOODLE_URL=https://your-moodle.example.com
VITE_MOODLE_TOKEN=your-webservice-token
```

The token comes from Moodle's `/login/token.php` endpoint with the
`moodle_mobile_app` service. Implement each method in `realMoodle.js` by calling
`{baseUrl}/webservice/rest/server.php?wstoken=...&moodlewsrestformat=json&wsfunction=...`.

Suggested `wsfunction` map:

| Adapter method | Moodle `wsfunction` |
|---|---|
| `login` | `/login/token.php` (separate endpoint) |
| `getCurrentUser` | `core_webservice_get_site_info` |
| `getCourses` | `core_enrol_get_users_courses` |
| `getCourse` | `core_course_get_contents` |
| `getLesson` | `mod_lesson_get_lesson` / `mod_page_get_pages_by_courses` |
| `getNotifications` | `message_popup_get_popup_notifications` |
| `getUpcomingEvents` | `core_calendar_get_calendar_upcoming_view` |
| `markActivityComplete` | `core_completion_update_activity_completion_status_manually` |

## Architecture notes

- **Single source of truth for data**: every page/component goes through `getMoodleClient()`.
  No direct fetch calls anywhere. Swapping to real Moodle never touches UI code.
- **Auth + silent refresh**: `authStore` runs a 15-second interval that refreshes tokens
  60 seconds before expiry. If refresh fails, the global `ReAuthModal` mounts atop the
  current view — form inputs anywhere in the app are preserved because the modal is a
  portal sibling, not a parent remount.
- **Focus mode** is a single boolean in `uiStore`. `AppShell` reads it and animates the
  TopBar + SideRail out via `AnimatePresence`. Floating exit button takes over.
- **State hydration**: `coursesStore` persists fetched course schemas to `localStorage`
  via Zustand's `persist` middleware → back/forward navigation through syllabus is instant.
- **Reduced motion**: CSS animations honor `prefers-reduced-motion`. Framer Motion paths
  have appropriate fallbacks.

## Folder map

```
src/
├─ api/              # moodleClient.js factory + mock/real impls + JSON fixtures
├─ components/
│  ├─ ui/            # Primitives: GlassCard, ProgressBar, RadialProgress, Modal, Drawer, Toast, Avatar, Pill, Badge, IconButton, Skeleton
│  ├─ layout/        # AppShell, TopBar, SideRail (focus-mode aware)
│  ├─ auth/          # AuthCard pieces + ReAuthModal + animated backdrop
│  ├─ dashboard/     # LiveRoomUtilities, NotificationsDrawer, ProfileHub, NextUpCards
│  ├─ library/       # CourseCard, OmniSearch, CategoryPills, UpcomingEvents
│  ├─ roadmap/       # QuadmesterTimeline, UnitGrid, CompletionChart
│  └─ lesson/        # LessonDrawer, ActivityBlock
├─ hooks/            # useMoodleQuery (SWR-ish), useCopyToClipboard, useReducedMotion
├─ lib/              # Zustand stores: authStore, uiStore, coursesStore + cn() helper
├─ pages/            # LoginPage, DashboardPage, LibraryPage, CoursePage, LessonPage
├─ App.jsx           # Lazy-routed router shell
└─ main.jsx          # Entry
```

## Build

```bash
npm run build      # outputs dist/
npm run preview    # preview the production build
```

Bundles are code-split per route, with vendor chunks for React, Framer Motion, Recharts, and Lucide split out for cache stability.

## What's deliberately not in this prototype

- A real Moodle WS integration (stub exists for one-file activation)
- Bilingual / Arabic / RTL (the design system has hook points; could be added with i18next)
- TypeScript (matches the user's masharef convention)
- Tests (would add Vitest + React Testing Library in a follow-up)
- Deployment configuration (the `dist/` output is a static SPA — drops onto any static host)
