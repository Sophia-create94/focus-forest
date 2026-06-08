# Focus Forest 🌳

> An easy-to-use motivational calendar app — a calendar, to-do list, and countdown in one place, with an animated jungle where you level up and unlock new animals as a reward for staying organized.

**Live demo → [focus-forest-sophia.vercel.app](https://focus-forest-sophia.vercel.app/)**

Focus Forest began as a research-led UX project in 2022 (my first, moving from architecture into UX). In 2026 I rebuilt it as a real, interactive prototype — directing AI tools to implement a locked design system and ship it live, while keeping the design judgment and verification for myself. This repository is the rebuild.

> **Note:** This is a portfolio piece — an interactive prototype with hardcoded sample data, not a production application with a backend.

---

## ✨ Highlights

- **Mobile-first, iOS-style UI** — designed for the phone, framed as a device mockup on desktop.
- **Installable as a full-screen web app** — add to the iOS home screen and it launches standalone (web manifest + Apple meta tags + safe-area handling).
- **A real design system** — a 13-color palette, a 9-step type scale, and 9 typed component primitives, each built 1:1 to a locked design reference.
- **Glassmorphism surfaces** — translucent blurred header, bottom nav, and cards over a green canvas.
- **Hand-tuned jungle animation** — swaying trees, a bobbing toucan, a blinking frog — built in code and fully `prefers-reduced-motion` aware.

## 🧭 Screens

| Route | Screen |
|-------|--------|
| `/` | **Home** — jungle scene, level progress, and an "Up next" reward teaser |
| `/plans/todo` | **Plans · To-Do** |
| `/plans/calendar` | **Plans · Calendar** |
| `/plans/countdown` | **Plans · Countdown** |
| `/today` | **Today** — daily dashboard |
| `/profile` | **Profile** |
| `/lock` | **Lock screen** — standalone iOS lock-screen notification showcase |
| `/components` | **Component sandbox** — the design-system / component library |

## 🛠 Tech stack

- **[Next.js 16](https://nextjs.org/)** (App Router, Turbopack)
- **[React 19](https://react.dev/)**
- **[TypeScript 5](https://www.typescriptlang.org/)**
- **[Tailwind CSS v4](https://tailwindcss.com/)** — CSS-first config (tokens live in an `@theme` block, no `tailwind.config`)
- **[shadcn/ui](https://ui.shadcn.com/)** (Radix primitives) + **[lucide-react](https://lucide.dev/)** for icons
- Deployed on **[Vercel](https://vercel.com/)** (auto-deploy from `main`)

## 🎨 Design system

The design system is the foundation of the build. Tokens are defined in [`app/globals.css`](app/globals.css) via Tailwind v4's `@theme` block (with glassmorphism surface tokens as standard CSS custom properties alongside):

- **13-color brand palette** (`--ff-*`) plus semantic and supporting tokens
- **9-step type scale** — `h1`–`h4`, `body`, `button`, `caption`, `list-label`, `overline` — across two typefaces (Niramit display, Source Sans 3 body)
- **9 component primitives** in [`components/ui/`](components/ui/): `Button`, `Card`, `Input`, `Checkbox`, `Tabs`, `BottomNav`, `FabMenu`, `StatusBar`, and a custom icon set

Reusable primitives live in `components/ui/`; app-specific composites and screen sections live in `components/`.

## 🚀 Getting started

```bash
# install dependencies
npm install

# start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## 📁 Project structure

```
app/                 # Next.js App Router (routes, layouts, global styles)
  (app)/             # Main app shell (Home, Plans, Today, Profile)
  components/        # Component sandbox page
  lock/              # Lock-screen showcase
  globals.css        # Design tokens (@theme) + glassmorphism surfaces
  layout.tsx         # Root layout, metadata, PWA/manifest config
  manifest.ts        # Web app manifest
components/
  ui/                # Reusable design-system primitives
  *.tsx              # App-specific composites (PhoneFrame, AppHeader, …)
public/              # Icons (apple-touch-icon, manifest icons) and assets
```

## 📱 Add to your iPhone home screen

Open the [live demo](https://focus-forest-sophia.vercel.app/) in **Safari** → Share → **Add to Home Screen**. It launches full-screen (no browser chrome), with the status bar and home-indicator safe areas handled natively.

---

*Designed by Sophia Müller. Rebuilt in 2026 with AI-assisted development.*
