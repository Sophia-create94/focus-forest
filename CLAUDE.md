@AGENTS.md

# Focus Forest

Motivational calendar app — portfolio piece showcasing UX/UI work. iOS-style mobile app, designed mobile-first.

Built from a clean Next.js scaffold that translates the locked Design System into code.

## Stack
- Next.js 16.2.4 (App Router) — see AGENTS.md, breaking changes vs. earlier versions
- React 19.2.4
- TypeScript 5
- Tailwind CSS v4
- shadcn/ui (Radix, Nova preset) — initialized, components added on demand via `npx shadcn@latest add <component>`
- lucide-react for general icons (custom Focus Forest SVG icons live alongside)
- Deployed to Vercel via GitHub `main` branch (auto-deploy on push)

## Design system source of truth

The locked design system lives outside the project at `~/Documents/focus-forest-design-system-snapshots/`. Key files:

- `colors_and_type.css` — master CSS with all color/typography tokens (THE primary token source)
- `preview/*.html` — 21 standalone HTML files, one per design system block. Production-quality reference for tokens, components, and surfaces. Includes glassmorphism mechanics in `colors-product-greens.html`.
- `ui_kits/mobile/*.jsx` — working React components for the three core screens (StatusBar, AppHeader, BottomNav, JungleIllustration, Screens, App). These are the **behavioral spec** for porting components to v2 — they include all interactions (FAB submenu, todo expand/collapse, search filtering, lock-screen action picking) and animations (tree sway, frog blink, toucan bob).
- `assets/logos/*.svg` — three logo variants (mark, wordmark, full)
- `assets/screens/*.png` — brand-faithful renders of Home, Home+Add, To-Do, Lock screens

When in doubt about a design decision, refer to these files in this priority order: `colors_and_type.css` → `preview/*.html` → `ui_kits/mobile/*.jsx` → `assets/screens/*.png`.

## Conventions

- **Tokens go in `app/globals.css` via Tailwind v4's `@theme` block** (CSS-first config; there is no `tailwind.config.ts` in v4). Glassmorphism surface tokens (gradients, blur, borders) live alongside as standard CSS custom properties. Never hardcoded hex values inside components.
- **Components go in `components/ui/`** (shadcn-style primitives) for reusable building blocks; **`components/`** (one level up) for app-specific composites and screen sections.
- **kebab-case** for filenames (e.g., `bottom-nav.tsx`), **PascalCase** for component names (`BottomNav`).
- **All components functional with hooks**, fully typed (no `any`).
- **Variants via `cva`** from `class-variance-authority` (shadcn-style).
- **Tailwind utility classes preferred** over custom CSS unless the design requires it.

## Milestones

Build is complete through milestone 5; only portfolio packaging remains. These double as the Git commit + Vercel deploy milestones — one clean commit per milestone.

- [x] **1. Baseline** — Design system + component library (the `/components` URL)
- [x] **2. Home screen**
- [x] **3. Plans screen** — Calendar / To-do / Countdown switcher
- [x] **4. Today screen**
- [x] **5. Profile screen**
- [ ] **6. Portfolio packaging** — real README, case study, screenshots

## Workflow notes

- Multiple AI tools touch this codebase: Claude Code (primary), Cursor (in-line edits and visual inspection), occasionally Claude Design (for setting up the Design System).
- **Always read `CHANGELOG.md` before starting a session** to understand what's changed since you last had context.
- **Always update `CHANGELOG.md` at the end of a session** with what changed during this session — include the date.
- **Worktree mode is OFF and stays off.** Write directly to the project root. Do not create branches under `.claude/worktrees/`.
