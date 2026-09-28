# Scorebridge — *Build your way to college*

A gamified SAT test-prep web platform. The core metaphor: a student's SAT
score is the **bridge** from school to university, and every lesson, homework
set and mock exam adds another section to that bridge.

The signature user is **Aziza Karimova** (Evening Group B) — best score 1340,
goal 1450, 58% of her bridge built.

> The app lives in [`frontend/`](./frontend).

---

## Features

- **Dashboard** — score rings (animated count-up + goal ticks), your-bridge %, test-day countdown, stat donuts, live-session card, pending homework, rankings snippet, level/streak/badge/score-trend rail. First-load skeleton.
- **Homework** — filter tabs with live counts; task cards whose status (not started / in progress / overdue / completed) is **always computed** from due date + progress, never stored.
- **Solve flow** — timed module, A–D choices, flag-for-review, question navigator, submit → XP + bridge growth + possible level-up celebration.
- **Result** — score/XP/bridge summary **plus per-question review with explanations**.
- **Lessons** — dark hero, lesson timeline, a **working custom video player** (openly-licensed clip) with play/pause, speed cycle and a seekable scrubber with chapter markers, chapters, up-next, notes, downloadable materials.
- **Attendance** — stat cards + a **Calendar ⇄ Table toggle** (calendar default) with status-coloured days, month switcher, legend and click-a-day details, alongside the transposed session-log table.
- **Rankings** — group + time filters, oxblood podium hero with trophy and weekly-close countdown, ranked list with XP bars, and a sticky "You" row.
- **Mock Exams** — *Start new mock* (loading → +300 XP → best-score celebration), score-history line chart (Total / Math / R&W / All, dashed goal line, best marker), past-exam list.
- **Profile** — identity card, bridge rings, stat cards, badges grid (earned + progress).
- **Design system** — brand & status colours, type scale, buttons, inputs, pills, avatars/badges, shape & elevation.
- **Cross-cutting** — working top-bar **search** (pages / homework / lessons, full keyboard nav), notifications dropdown, **dark mode** (persisted), celebration modal + confetti, fully responsive with a mobile bottom-tab bar, and **Reset demo data**.

### Relative demo dates
On first load every demo date is anchored as an offset from *now* and persisted,
so homework statuses always resolve to exactly **1 not-started / 1 in-progress /
1 overdue / 3 completed** and every countdown stays live — whenever you open it.
Only test day is fixed (2026-11-07). *Reset demo data* re-anchors to the moment.

---

## Stack

React 18 · Vite · TypeScript (strict) · Tailwind CSS · React Router · Zustand
(persisted to `localStorage`). No backend — mock data behind an async **service
layer** (simulated first-load latency + cache) that is later swappable for
Supabase. No icon or chart library: the ~45 outline icons and all SVG art
(rings, bridge, donuts, sparkline, practice chart, badges, trophy, confetti) are
hand-rolled components. Fonts (Inter + Source Serif 4) are self-hosted.

---

## Run

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
```

Other scripts: `npm run build` · `npm run typecheck` · `npm run lint` · `npm run test`.

---

## Project structure

```
frontend/src/
├─ assets/fonts/     self-hosted woff2 (Inter, Source Serif 4)
├─ styles/           tokens.css (light/dark vars + keyframes), fonts.css
├─ icons/            typed <Icon> — ~45 outline glyphs
├─ components/art/   SVG art (Rings, Bridge, Donut, Sparkline, PracticeChart, …)
├─ components/       Celebration overlay
├─ data/            typed seed + relative-date anchor engine + question bank
├─ services/         async cached getters (the swappable data seam)
├─ utils/            countdown formatters, homeworkStatus, levelInfo, ring math
├─ hooks/            useNow, useCountdown, useCountUp, useService
├─ store/            Zustand store (theme, xp/bridge/streak, submit/mock, reset)
├─ layout/           Sidebar, Topbar, Search, BottomTabs, Shell
└─ pages/            Dashboard, Lessons, Homework, Solve, Result, Rankings,
                     Attendance, MockExams, Profile, DesignSystem
```

---

## Key decisions

- **App mounts at `/`** (Dashboard) — no landing page, no `/mobile` showcase; the
  real app is responsive with a bottom tab bar.
- **Semantic tokens** — `brand` (oxblood) and `reward` (brass) name the palette in
  code; both light and dark themes swap via CSS variables.
- **Original content** — a fully original brand and an original SAT-style question
  bank (≥20 Math + ≥20 R&W, each with an explanation). Nothing references a real
  product, and the footer notes the College Board trademark.
- **Deploy** — `frontend/vercel.json` adds SPA rewrites; the build stays green
  after every step.

---

## How I built it with AI

The design was produced with **Claude (Design)** and delivered as a bundled
export, which was decoded into a source of truth — the complete component logic,
rendered markup, tokens and fonts — plus reference screenshots. The frontend was
then implemented with **Claude Code**, porting every value, colour, string, icon
and interaction from that source rather than inventing them, and keeping
`typecheck` / `lint` / `build` / `test` green at each step.

---

## Deploy

```bash
cd frontend
npm run build          # outputs dist/
npx vercel deploy      # or connect the repo in the Vercel dashboard
```

`vercel.json` rewrites all routes to `index.html` so client-side routing works on
refresh/deep-link.

---

## License

Licensed under the **Apache License 2.0** — see [`LICENSE`](./LICENSE).

*SAT is a registered trademark of the College Board, which is not affiliated with Scorebridge.*
