# Focus Forest — Design System

> Focus Forest is an **easy-to-use and motivational calendar app**. Users build streaks and "level up" by completing tasks; their progress is visualized as a growing jungle of trees and animals. Think of it as a calendar/to-do/reminder app with a gamified, nature-themed reward layer.

The brand vibe is **calm, friendly, nature-grounded, and low-stakes**. Lush dark-green surfaces, a single warm yellow accent, and playful flat illustrations of tropical wildlife (toucan, frog, monkey, sloth) carry the "forest" metaphor.

---

## Sources

- **Codebase** (mounted, read-only): `Focus Forest/` — Next.js 14 app (Tailwind + plain CSS) implementing three reference screens: Home, To-do list, Lock-screen reminder.
  - `Focus Forest/app/globals.css` — full token table + component CSS
  - `Focus Forest/components/*.jsx` — `AppHeader`, `BottomNav`, `IPhoneFrame`, `JungleIllustration`, `NotificationCards`, `StatusBar`, `TabBar`, `TodoList`
- **Reference uploads** (`uploads/`):
  - `Logo Focus Forest.svg` — the "ff" mark
  - `FocusForest - Moodboard.png`, `Colors.png`, `Colors | 60-30-10 Rule.png`, `Color Example.png`, `Color Compability.png`, `Typography.png`
  - High-fidelity Figma exports of three core screens (Home, Home + Add, To-do, Lock + Reminder)

No live Figma link was provided.

---

## Index

| File / folder | What it is |
|---|---|
| `README.md` | This document — brand context, content fundamentals, visual foundations, iconography |
| `SKILL.md` | Cross-compatible Agent Skill manifest |
| `colors_and_type.css` | CSS variables (colors, type scale, spacing, radius, shadow) + semantic styles |
| `assets/` | Logos, reference images, screen exports |
| `preview/` | Per-card design-system specimens shown in the Design System tab |
| `ui_kits/mobile/` | iOS UI kit (JSX components + interactive `index.html`) |

---

## Products in scope

Focus Forest, as represented in this codebase, has **one product surface**: an iOS mobile app. There is no marketing site, docs site, or web app in the source. The lock-screen reminder is part of the same iOS product (a system-level notification owned by the app).

---

## Content fundamentals

**Voice.** Warm, encouraging, second-person ("you"). The product is a coach, not a clipboard. It celebrates small wins ("Good job! You reached level 5") and never scolds.

**Casing.** Sentence case for everything except **`focusforest`**, which is always lowercase one-word. The "ff" mark mirrors that. UI navigation labels can capitalize the first letter ("Home", "Events", "Add"). Headings use sentence case ("Welcome!", "Your progress", "Grocery shopping").

**I vs you.** "You" for the product addressing the user. "I" appears in user-voiced action buttons on notifications: "I will do it later", "I am done". This makes pressing the button feel like *the user* is making the decision, not the app.

**Punctuation & tone markers.**
- Friendly exclamation marks are allowed but rationed — typically on celebrations only (`Welcome!`, `Good job!`).
- No em-dash bombast, no marketing superlatives.
- Notifications phrase reminders as a memory: "You wanted to do sports today. Please choose from the below."

**Emoji.** **Not used in product UI.** The brand expresses warmth through illustration, not emoji. (One leaf 🌿 appears in the dev prototype's page header — that is *prototype chrome*, not product copy. Don't carry it into product screens.)

**Examples — copy that fits the brand:**
- ✅ "Welcome!"
- ✅ "Your progress"
- ✅ "Good job! You reached level 5"
- ✅ "See your jungle here"
- ✅ "You wanted to do sports today. Please choose from the below."
- ✅ "I will do it later" / "Start tracking" / "I am done"
- ❌ "Crush your goals 💪"
- ❌ "🌿 Welcome back, champion!"
- ❌ "You missed a task. Don't break the chain."

---

## Visual foundations

### Color
- **60-30-10 rule.** ~60% deep forest green (`#3B7A57`), ~30% white, ~10% warm yellow (`#F6AE2D` / `#EB9C0A`) plus tiny doses of mist, sage, black.
- The app screens are **green-on-green**: a primary-green canvas with a slightly lighter green header (`#4A9468`) and a slightly lighter card surface (`#52A070`). The lock screen drops to a darker forest green (`#2E6848`) for night-mode feel.
- Yellow is **only** used for emphasis: the primary CTA pill, the "+" FAB, and the active-tab icon in the bottom nav. Never use yellow as a surface.
- White text on `#3B7A57` passes WCAG AA (5.11). Yellow surfaces always carry **black** text — white-on-yellow fails contrast.
- Sky blue (`#92D3F0`) is reserved for inline links on green surfaces and for sky in the jungle illustration.

### Typography
- **Niramit** (display, weights 200/300/400/500/600/700) — used for headings, the wordmark, the lock-screen clock, and CTA labels. It has soft shoulders that feel friendly without being a "kids' app" font.
- **Source Sans 3** (body, weights 300/400/600/700) — used for paragraph text, search inputs, list items, status bar, nav labels.
- **Type scale.** H1 38 / H2 30 / H3 20 / H4 16 / Text 14. Line-height generous (1.4–1.5). Display tracking tightens to about -0.3 to -0.5px on H1/H2.
- The big lock-screen clock uses Niramit Light at ~84px with -4px tracking — that's the system's signature "display" moment.

### Backgrounds
- **Solid greens are the default surface.** No gradients, no photo backgrounds in product UI.
- The home screen has a subtle vertical lighter-to-darker green wash inside the status-bar/header band — it reads as a soft top highlight, not a feature gradient.
- The "level" reward is a **flat-illustrated jungle scene** with cartoon trees, a toucan, a frog, and a monkey, on a sky-blue half-ellipse. Always centered inside a card, never full-bleed in the app.

### Animation
- **Calm, ambient, looping.** Trees sway 3–5s ease-in-out. The toucan bobs 2.2s. The frog blinks every 4s. Nothing demands attention.
- Press states: `scale(0.95–0.96)` over ~120ms.
- Submenu reveal: opacity + 12px translateY, 250ms.
- Tab/row deletion: opacity + 16px translate, 220ms.
- No spring physics, no confetti. The reward feedback is the *jungle growing*, not a burst.

### Hover / press states
- **Hover** is essentially a no-op on touch surfaces — the design is mobile-first.
- **Press**: `transform: scale(0.92–0.96)` and a slight darkening on yellow (use `--ff-yellow-dark`).
- Nav active state = swap icon color to yellow. No background pill.

### Borders & dividers
- Borders are **rare**. List rows use a 1px `rgba(255,255,255,0.10)` divider. Search inputs use a 1px `rgba(255,255,255,0.25)` border on a translucent white fill.
- The white outline button on green uses 1.5px solid white.

### Shadows
- Used sparingly and **only when an element floats off the surface**:
  - FAB: `0 4px 16px rgba(0,0,0,0.30)`
  - Submenu icons (white circles): `0 4px 18px rgba(0,0,0,0.30)`
  - Lock-screen notification cards: `0 8px 32px rgba(0,0,0,0.28)`
- No inner shadows. No glow.

### Transparency & blur
- Used to layer surfaces on green: search inputs (`rgba(255,255,255,0.18)`), translucent submenu labels via `text-shadow`, util buttons on lock screen (`rgba(255,255,255,0.12)`).
- No `backdrop-filter: blur(...)` in the source. Translucency is solid alpha, not glass.

### Corner radii
- 4px — small chips
- 8–10px — search inputs, form fields
- 14px — notification cards
- 18px — content cards (progress card)
- 9999px — pill buttons
- Circles: app logo, FAB, sub-menu icons, util buttons.

### Cards
- Slightly-lighter-green surface on the green canvas (`#52A070`).
- 18px corner radius, no border, no shadow when sitting on the same canvas.
- Rounded buttons sit *inside* the card, often half-overlapping the bottom edge (the "See your jungle here" CTA hangs off the illustration).
- White cards (lock-screen notifications) get 14px radius + the heavy shadow above.

### Layout rules (mobile)
- 393×852 iPhone frame.
- Status bar 54px, app header 54px, bottom nav 82px (with 14px home-indicator padding).
- Body content scrolls; header + nav are fixed.
- Side gutters 16–20px on the body, 26px on the status bar (matches iOS).
- The FAB is **center-anchored, raised −30px** above the nav bar so it visually overlaps both the nav and the body — the "you can always add" affordance.

### Illustration vibe
- **Flat, slightly stylized cartoon.** Solid fills, minimal gradients, no outlines except where needed (bird feet, frog limbs).
- **Warm, saturated jungle palette** (green canopy, brown trunks, a few pink/orange flower dots) over a cool sky-blue dome. The contrast warm-on-cool is the "look".
- Wildlife is rendered with simple geometric primitives (ellipses + paths). It reads as endearing, not realistic.
- Optional grain/noise: not used. Edges are clean.

---

## Iconography

**Approach.** Icons are **inline SVG**, hand-drawn at 20–26px, **2px stroke**, round line caps, monochrome. They use `currentColor` so they recolor with the parent (white at rest, yellow on active nav, green on white surfaces).

**Sets used in source.**
1. **Bottom-nav icons** — custom inline SVGs in `Focus Forest/components/BottomNav.jsx`: home (filled), calendar (stroked rect with header lines), progress (clock-like circle), profile (head + shoulders).
2. **Add submenu** — custom inline SVGs: calendar, to-do checkmark-in-clipboard, countdown clock.
3. **Trash** — custom inline SVG, 14×16, used in the to-do list to remove rows.
4. **iOS chrome** — signal bars, WiFi arc, battery — custom inline SVGs in `StatusBar.jsx`. Stay faithful to iOS proportions.

**No icon font, no Heroicons/Lucide/Feather dependency.** All icons are local SVG. If you need an icon that doesn't exist in the source, **substitute with a stroke-based icon at 2px weight, round caps, monochrome on `currentColor`** — Lucide is the closest match style-wise. **Flag any substitution to the user.**

**Logo.** The mark is a green circle with white **`ff`** in Niramit. There's also a wordmark (mark + `focusforest` lowercase). No tagline lockup is in source.

**Emoji.** Not used in product UI. (See Content Fundamentals.)

**Unicode glyphs.** Used in two places only — the dotted drag handle (`⠿`) and the kebab/expand chevrons (`⋮`, `∨`). Treat these as text, not icons; they inherit type styling.

---

## Caveats

- **Fonts.** The codebase loads **Niramit** and **Source Sans 3** from Google Fonts via `next/font`. We do the same in `colors_and_type.css` (no local TTFs needed).
- **Logo.** The uploaded `Logo Focus Forest.svg` references an embedded raster image we can't extract; we ship a clean SVG recreation as `assets/logo-mark.svg` and `assets/logo-wordmark.svg`. The original is preserved at `assets/logo-focusforest.svg` for fidelity reference.
- **No marketing surface, no Figma link.** Everything here is mobile-app fidelity; if you build web/marketing pages, you'll be extrapolating.
