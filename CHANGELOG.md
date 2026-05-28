# Changelog

Session log for Focus Forest v2. Read at the start of each session; append at the end.

## 2026-05-28

### Home — remove chevron arrow from UP NEXT card

Dropped the trailing `ChevronRightIcon` from the "Up next" teaser on the Home screen — the card isn't (yet) tappable, so the affordance was misleading. Also removed it from the matching cell in the `/components` showcase to keep the design system reference in sync.

- **[`app/(app)/page.tsx`](app/(app)/page.tsx)** — removed the `<ChevronRightIcon>` render and its now-unused import.
- **[`app/components/page.tsx`](app/components/page.tsx)** — removed the `<ChevronRightIcon>` from sandbox cell 2 (UP NEXT teaser); import kept (still used by other cells + the icon grid).

## 2026-05-22

### Category "personal" color — coral #ff804e → #ff9f79

Same coral/peach family, so just changed the value of the existing `--color-coral` token ([`app/globals.css`](app/globals.css)) — `personal` already points at `bg-coral`, so no other wiring changed (comment in [`lib/categories.ts`](lib/categories.ts) updated). Verified `--color-coral: #ff9f79` in the built CSS. (Dev server: `rm -rf .next && npm run dev` to pick it up.)

### Category "personal" color — teal (#06D6A0) → coral (#ff804e)

- **[`app/globals.css`](app/globals.css)** — swapped the one-off `--color-teal` for `--color-coral: #ff804e`.
- **[`lib/categories.ts`](lib/categories.ts)** — `CATEGORY_BG_CLASS.personal` `bg-teal` → `bg-coral` (single source; recolors Today bars, week-strip dots, AgendaCard bars at once).
- **[`app/components/page.tsx`](app/components/page.tsx)** sandbox cell 3 + **[`app/(app)/today/page.tsx`](app/(app)/today/page.tsx)** comment updated.

Verified in the production build: `.bg-coral → var(--color-coral) → #ff804e`, applied on the rendered bars. (New color token → needs a `rm -rf .next && npm run dev` to show in the dev server, as before.)

### Category "personal" color — terracotta (#D67B42) → teal (#06D6A0)

- **[`app/globals.css`](app/globals.css)** — added palette token `--color-teal: #06D6A0`.
- **[`lib/categories.ts`](lib/categories.ts)** — `CATEGORY_BG_CLASS.personal` `bg-orange` → `bg-teal`. Single source of truth, so this one line recolors personal on the Today bars, Calendar week-strip dots, and AgendaCard bars at once.
- **[`app/components/page.tsx`](app/components/page.tsx)** — sandbox cell 3 "Coffee with Maya" bar → `bg-teal`; **[`app/(app)/today/page.tsx`](app/(app)/today/page.tsx)** comment updated.

Verified compiled CSS: `.bg-teal → var(--color-teal) → #06d6a0`. (`--color-orange` left in the palette, now unused.)

### Calendar — fix event category assignments

Audited every calendar event's category against its meaning and fixed the mismatches (the assignments had been bent earlier to stage week-strip dot demos rather than reflect the events):
- **Dinner with friends** (May 19) — was uncategorized → `personal` (now shows a color line).
- **Farmer's market** (May 19) — `work` → `personal` (it's an errand, not work).
- **Brunch** (May 20) — `health` → `personal` (social, not fitness).

[`app/(app)/events/calendar/page.tsx`](app/(app)/events/calendar/page.tsx). All other events check out (fitness/medical → health, meetings → work, social/family → personal). Week-strip dots update automatically from the data.

### Calendar AgendaCard — remove the "Now" pill

The "Now" pill only made sense on the Today screen (curated current-day dashboard); on the Calendar's agenda cards it was noise. Removed it from `AgendaCard` (used by the Calendar + the `/components` demo). The Today screen keeps its own "Now" pill — separate component, untouched.

- **[`components/calendar/agenda-card.tsx`](components/calendar/agenda-card.tsx)** — dropped the "Now" pill render and the now-dead `isNow?` field from `AgendaItem`; the title is a plain truncating block again.
- **[`app/(app)/events/calendar/page.tsx`](app/(app)/events/calendar/page.tsx)** + **[`app/components/page.tsx`](app/components/page.tsx)** — removed `isNow: true` from the May 18 / demo "Team standup" item.

### Build fix — stop Tailwind scanning markdown docs

Recurring build break: Tailwind v4's content scanner reads markdown too, and the CHANGELOG documents class names verbatim (including a wildcard arbitrary-value class). Those got picked up as utility candidates — the wildcard emitted invalid CSS (`Unexpected token Delim('*')`) and broke the build; the rest just bloated the bundle with dead classes referencing removed tokens.

- **[`app/globals.css`](app/globals.css)** — added `@source not "../**/*.md";` so Tailwind no longer scans markdown for classes. App source under `app/` + `components/` is still scanned normally.
- **[`CHANGELOG.md`](CHANGELOG.md)** — rephrased the three remaining wildcard/var class literals into prose as belt-and-suspenders.

Verified a clean `rm -rf .next` rebuild: the doc-derived dead classes are gone from the compiled CSS, the real category color still resolves (`.bg-orange → #d67b42`), build passes.

### Category colors — unify on one source, fix Calendar lag

The Calendar kept lagging the Today screen on personal-color recolors because the two surfaces colored categories through different mechanisms: Today used direct `bg-*` palette utilities, the Calendar used a `--ff-cat-*` CSS-var indirection applied as arbitrary classes — and that indirection served stale across dev-server CSS chunks (and earlier got pruned by the bundler). Unified everything on the direct palette utilities so they're literally the same class and can't drift.

- **[`lib/categories.ts`](lib/categories.ts)** — `CATEGORY_BG_CLASS` now maps to `bg-sky` / `bg-orange` / `bg-moss` directly (replacing the old per-category CSS-var arbitrary classes). This is now THE single source of truth for category → color.
- **[`app/(app)/today/page.tsx`](app/(app)/today/page.tsx)** — removed its local `EventCategory` type + `CATEGORY_BAR` map; imports `CATEGORY_BG_CLASS` + `EventCategory` from `lib/categories`. Personal stays `bg-orange` (#D67B42), now from the shared map.
- **[`app/globals.css`](app/globals.css)** — removed the now-unused `--ff-cat-*` token block (the indirection layer that caused the drift + earlier pruning).
- Refreshed stale `--ff-cat-*` comments in the AgendaCard / week-strip (one held an arbitrary CSS-var class literal that could have re-triggered the markdown-scan build error).

Net: Today, Calendar week-strip dots, and AgendaCard bars all read `CATEGORY_BG_CLASS`; personal = `bg-orange` = #D67B42 everywhere. Future recolors are a one-line change. Clean rebuild verified `.bg-orange → var(--color-orange) → #d67b42`.

### Category "personal" color — mist (#F1F9E7) → terracotta (#D67B42)

#F1F9E7 was too pale/near-white to read as a category. Switched personal to the existing `--color-orange` (#D67B42) terracotta. Set in every place personal is colored so the Calendar and Today screens match:
- **[`app/globals.css`](app/globals.css)** — `--ff-cat-personal` → `var(--color-orange)` (week-strip dots + AgendaCard bars).
- **[`app/(app)/today/page.tsx`](app/(app)/today/page.tsx)** — `CATEGORY_BAR.personal` `bg-mist` → `bg-orange`.
- **[`app/components/page.tsx`](app/components/page.tsx)** — sandbox cell 3 "Coffee with Maya" bar → `bg-orange`.

Verified in compiled CSS that both mechanisms resolve to #D67B42 (`--ff-cat-personal: var(--color-orange)`, `--color-orange: #d67b42`, `.bg-orange`).

Note on the reported mismatch: Calendar and Today color personal through different mechanisms (token vs inline `bg-*` utility), so they can drift across dev-server cache states — a clean rebuild syncs them. A future DRY pass repointing Today at the shared token would remove the divergence entirely (still flagged, not done).

### Week strip — no category dots on the active/today pill

Dots are a forecast for days you *haven't* opened. On the active/today pill they just duplicated the category bars in the agenda right below — and you're already looking at that day. So the active pill now shows no dots; inactive days still do.

- **[`components/calendar/week-strip.tsx`](components/calendar/week-strip.tsx)** — `categories` is forced to `[]` for the active pill, so its (still-present) indicator row renders empty and pill heights stay locked. Inactive-day dots use the base `--ff-cat-*` colors via `CATEGORY_BG_CLASS`.
- Cleanup: removed the now-dead high-contrast machinery that only existed for active-pill dots — `CATEGORY_BG_CLASS_ON_ACCENT` ([`lib/categories.ts`](lib/categories.ts)) and the `--ff-cat-*-on-accent` tokens ([`app/globals.css`](app/globals.css)).

### Category "personal" color — yellow (#F6AE2D) → mist (#F1F9E7)

Recolored the **personal** event category from brand yellow to the pale-green mist token, across every surface. Only the category usage changed — brand yellow stays for the FAB, "Now" pill, active pills, and the Coming-up urgent bar.

- **[`app/globals.css`](app/globals.css)** — `--ff-cat-personal` now aliases `var(--color-mist)` (#F1F9E7) instead of `var(--color-yellow)`. Covers the week-strip dots and AgendaCard bars (which read the token via class).
- **[`app/(app)/today/page.tsx`](app/(app)/today/page.tsx)** — `CATEGORY_BAR.personal` `bg-yellow` → `bg-mist` (+ comment).
- **[`app/components/page.tsx`](app/components/page.tsx)** — sandbox cell 3's "Coffee with Maya" bar `bg-yellow` → `bg-mist` to match.

Verified the compiled CSS: `--ff-cat-personal: var(--color-mist)`, `--color-mist: #f1f9e7`, and `.bg-mist` are all emitted.

### AgendaCard — adopt the Today Events row structure

Replaced the Calendar AgendaCard's event-row layout with the Today screen's, keeping only the per-card day header ("Today" / "Tomorrow" / weekday).

- **[`components/calendar/agenda-card.tsx`](components/calendar/agenda-card.tsx)** — dropped the timeline circle; each row is now `[time] [category bar] [content]` exactly like Today: two-tone `font-medium` time (white number + white/70 uppercase period) in a `w-16` column, a `w-1 h-8` category bar, then a `flex-1` content block with a `font-display text-h4` title, an optional "Now" pill, and an optional meta line. `AgendaItem` gained optional `meta?` + `isNow?` (rendered only when present). Card wrapper, `scroll-mt-56`, active accent, and the empty-state are unchanged.
- **[`app/(app)/events/calendar/page.tsx`](app/(app)/events/calendar/page.tsx)** — the May 18 (Today) card's three events now carry `meta` + `isNow` to match `/today` exactly (Team standup · Work · 30 min · Now, etc.). Other days keep their existing data and render title-only rows in the same structure.
- **[`app/components/page.tsx`](app/components/page.tsx)** — sandbox cell 8 demo items carry `meta` + `isNow` so it mirrors cell 3.

### Fix — category colors were invisible (CSS bundler pruned the tokens)

The week-strip dots and AgendaCard bars referenced `--ff-cat-*` only through inline JSX `style={{ backgroundColor: var(--ff-cat-*) }}`. The CSS bundler (Lightning CSS via Tailwind v4) prunes custom properties that no *CSS rule* references — and it can't see inline styles — so it dropped all six `--ff-cat-*` tokens from the output. `var(--ff-cat-*)` then resolved to nothing → transparent dots and bars (i.e. nothing visible). (`--surface-card-*` survives because `Card` references it via a generated utility class.)

Fix: reference the tokens through Tailwind background classes instead of inline styles.
- **[`lib/categories.ts`](lib/categories.ts)** — replaced the var-name maps with `CATEGORY_BG_CLASS` / `CATEGORY_BG_CLASS_ON_ACCENT` (per-category Tailwind background-utility class strings referencing the tokens, which the scanner can see — instead of inline styles).
- **[`components/calendar/week-strip.tsx`](components/calendar/week-strip.tsx)** + **[`components/calendar/agenda-card.tsx`](components/calendar/agenda-card.tsx)** — apply those classes via `cn(...)` instead of inline `style`.

Verified the six `--ff-cat-*` tokens now appear in the compiled CSS and the generated category-color rules resolve, so the work/personal/health colors actually render.

### Calendar AgendaCard — add category color bar beside the circle

Second take on bringing the Today screen's category left-bars to the Calendar (the first attempt, which *replaced* the timeline circle on every row, was reverted). Per Sophia's pick: keep the circle **and** add the bar, on **all** day cards.

- **[`components/calendar/agenda-card.tsx`](components/calendar/agenda-card.tsx)** — each event row is now `[circle] [category bar] [time] [title]`. The bar (`w-1 h-5 rounded-pill`) is colored from the shared `--ff-cat-*` tokens (work #92D3F0 / personal #F6AE2D / health #7ABF94). Uncategorized events keep the bar slot but render it transparent so the time/title columns stay aligned.
- **[`lib/categories.ts`](lib/categories.ts)** — re-added `CATEGORY_COLOR_VAR` + `CATEGORY_COLOR_ON_ACCENT_VAR` token maps, now shared by the week-strip dots and the AgendaCard bars.
- **[`components/calendar/week-strip.tsx`](components/calendar/week-strip.tsx)** — re-pointed its dots at the shared maps (dropped the local duplicates).
- **[`app/components/page.tsx`](app/components/page.tsx)** — AgendaCard sandbox demo items carry categories to show the bars; re-escaped the Tabs-caption apostrophe to keep lint green.

The Calendar's mock data was already category-tagged, so e.g. the May 18 (Today) card shows blue / yellow / green bars for Team standup / Coffee with Maya / Yoga class — matching `/today` exactly. The Today screen still inlines `bg-sky`/`bg-yellow`/`bg-moss` + a local `EventCategory`/`CATEGORY_BAR` map — still flagged for a future DRY pass, not refactored.

### Calendar week strip — drop muted state, add category dots

The Calendar (Plans tab) day pills dimmed empty days with `opacity-50`, which read as "disabled" and hid that those days are tappable. Replaced that signal: every day is now equally readable, and small category-colored dots below the date show which days have events.

- **[`components/calendar/week-strip.tsx`](components/calendar/week-strip.tsx)** — removed the `!isActive && !hasItems && "opacity-50"` muted treatment (every inactive pill is now `bg-white/10 text-white`). Added an always-present indicator row (5px tall, `mt-[3px]`) so pill heights stay locked; it renders up to 3 dots (5×5px, round, 3px gap) — one per unique category present that day, ordered work → personal → health, capped at 3. Dot colors come from the `--ff-cat-*` tokens; on the yellow active/today pill they swap to the `*-on-accent` high-contrast variants.
- **[`app/globals.css`](app/globals.css)** — new `--ff-cat-work` / `--ff-cat-personal` / `--ff-cat-health` tokens (aliasing the existing `--color-sky` / `--color-yellow` / `--color-moss` palette, so one hex source), plus `*-on-accent` variants (#1A3A5C navy / #FFFFFF white / #2F5C40 dark green) for legibility on the yellow pill.
- **[`lib/categories.ts`](lib/categories.ts)** (new) — shared `EventCategory` type + `CATEGORY_ORDER` so the AgendaItem type, calendar data, and week strip reference one definition.
- **[`components/calendar/agenda-card.tsx`](components/calendar/agenda-card.tsx)** — `AgendaItem` gains an optional `category?: EventCategory` (uncategorized events render no dot — not an error).
- **[`app/(app)/events/calendar/page.tsx`](app/(app)/events/calendar/page.tsx)** — mock events tagged with categories: M 18 all three, T 19 work only (one categorized + one uncategorized event), W 20 work + health, F 22 personal only; S 17 / T 21 / S 23 stay empty. Other event days categorized too so every day with events shows a dot.

**Shared palette:** the new `--ff-cat-*` tokens alias the same hexes the Today screen's event left-bars use (`bg-sky`/`bg-yellow`/`bg-moss`). The Today screen still inlines those utilities + a local `EventCategory` union + `CATEGORY_BAR` map — a future DRY pass could repoint it at `lib/categories.ts` + the tokens. **Flagged, not auto-refactored** (out of scope). To-do-list and Countdown tabs also out of scope for this change.

No week-strip mockup exists under `_design-system-reference/preview/` — nothing to sync there (flagged).

### Icon set — remove `progress`, de-dupe `events`/`calendar`

Trimmed two redundant icons from the brand set.

- **Removed `ProgressIcon`** (a clock glyph that was only shown in the `/components` gallery — never used in a screen, and a near-duplicate of `CountdownIcon`).
- **De-duped `events` / `calendar`** — both were the identical calendar glyph. Kept **`CalendarIcon`** (its name matches the glyph; it's used in 3 correct spots) and removed `EventsIcon`. Repointed the "Plans" BottomNav tab (live app + sandbox) to `<CalendarIcon width={20} height={20} />` (sized to match the other 20px nav icons).

Files: [`components/ui/icons.tsx`](components/ui/icons.tsx) (deleted both defs), [`app/(app)/layout.tsx`](app/(app)/layout.tsx) (Plans tab icon), [`app/components/page.tsx`](app/components/page.tsx) (imports, gallery entries, BottomNav demo), [`_design-system-reference/preview/brand-iconography.html`](_design-system-reference/preview/brand-iconography.html) (removed both cells), [`_design-system-reference/preview/components-bottom-nav.html`](_design-system-reference/preview/components-bottom-nav.html) (Plans tab glyph → calendar).

### BottomNav FAB — match "Add" label gap to the other nav items

The "Add" circle sat too close to its "Add" label. Regular nav icons sit in a 26px box with ~3px internal whitespace below the glyph plus `gap-[3px]` (≈6px visual gap to the label); the FAB's solid 54px circle has no internal whitespace, so its `mt-[3px]` label gap looked half as tight. Bumped the FAB label to `mt-[6px]` so the visual spacing matches. The label stays bottom-aligned with the other labels (the bar is `items-end`); only the circle nudges up ~3px.

- [`components/ui/bottom-nav.tsx`](components/ui/bottom-nav.tsx) — `BottomNavFab` label `mt-[3px]` → `mt-[6px]`. Covers both the live app (FabMenu wraps BottomNavFab) and the `/components` sandbox demo.
- [`_design-system-reference/preview/components-bottom-nav.html`](_design-system-reference/preview/components-bottom-nav.html) — FAB label `margin-top:3px` → `6px`.

### BottomNav — rename "Events" tab to "Plans"

Renamed the bottom-nav label only (the underlying route stays `/events`, and the nav item `value` stays `"events"` so active-state logic is untouched — label is decoupled from route).

- [`app/(app)/layout.tsx`](app/(app)/layout.tsx) — app-shell BottomNav `label="Events"` → `"Plans"`.
- [`app/components/page.tsx`](app/components/page.tsx) — BottomNav sandbox demo label.
- [`_design-system-reference/preview/components-bottom-nav.html`](_design-system-reference/preview/components-bottom-nav.html) — DS reference nav label.
- [`app/(app)/events/layout.tsx`](app/(app)/events/layout.tsx) — ScreenTabs `ariaLabel` "Events sub-views" → "Plans sub-views" + comment, for consistency.

Left as-is: the `/events/*` routes/URLs, the Today screen's "Events" **section** header (a different element from the nav tab), and `EventsIcon`.

### Today screen — section header/pill copy + Anna's visit time

[`app/(app)/today/page.tsx`](app/(app)/today/page.tsx), synced to the [`/components`](app/components/page.tsx) sandbox:
- **Coming up** — Anna's visit now shows its time like the Countdown screen: "Thursday, May 21 · 9:30 AM" (added optional `time` to the `upcoming` type + `date · time` render).
- **Events** — header "Events" → "Today's events"; pill "3 today" → "3".
- **Top to-dos** — header "Top to-dos" → "Today's to-dos"; pill "1 of 3" → dynamic "N left" (`todos.length - doneCount`, initially "2 left", updates as boxes toggle).
- **Coming up** — pill "7 days" → "Next 7 days" (header unchanged).

### Calendar 12h times · Luca countdown 11d → 5d · Today 7-day pill

- **Calendar** ([`app/(app)/events/calendar/page.tsx`](app/(app)/events/calendar/page.tsx)) — converted every agenda time from 24h to US 12h (e.g., `14:00` → `2:00 PM`, `12:00` → `12:00 PM`, `8:00` → `8:00 AM`). Bumped the AgendaCard time column `min-w-10` → `min-w-16` ([`components/calendar/agenda-card.tsx`](components/calendar/agenda-card.tsx)) so the wider/variable AM-PM strings keep their titles aligned.
- **Countdown** ([`lib/countdown-data.ts`](lib/countdown-data.ts)) — Luca's Birthday party `11 days · Friday, May 29` → `5 days · Saturday, May 23` (today + 5 = Sat May 23). Still sorts second (3 < 5 < 17), so the screen order is unchanged.
- **Today** ([`app/(app)/today/page.tsx`](app/(app)/today/page.tsx)) — Coming-up second item updated to match (Luca 5d / Sat May 23). Count pill `3 days` → `7 days`, now read as a 7-day window: both Coming-up items (Anna 3d, Luca 5d) fall within it.
- **Sandbox** ([`app/components/page.tsx`](app/components/page.tsx)) — synced the CountdownItem sample and the Coming-up demo cell (Luca 5d / Sat May 23, pill `7 days`).

### Calendar Today card — mirror the Today screen's Events

With `/today` as the source of truth for Events/Top-to-dos, the Calendar's "Today" (May 18) agenda card was showing unrelated items (*Sprint planning* / *Weekend trip prep*). Replaced them with the Today screen's three Events — *Team standup* (9:30), *Coffee with Maya* (14:00), *Yoga class* (18:30) — same titles + moments, kept in the Calendar's 24h time convention (Today renders 12h AM/PM).

Scope confirmed with Sophia: `/events/todo` left as-is (keeps the "Grocery shopping" demo with the grouped-item expand/collapse), and `/events/countdown` unchanged (no Events/Top-to-dos; already consistent with Today's "Coming up").

### Date alignment — anchor everything to Monday, May 18, 2026

Made the app's hardcoded sample dates internally consistent around a single "today" = **Monday, May 18, 2026** (which is a real 2026-calendar Monday, so weekday math is real). Touched four screens + the sandbox:

- **Home** ([`app/(app)/page.tsx`](app/(app)/page.tsx)) — welcome subline "Tuesday, May 18" → "Monday, May 18" (+ matching Phase 6 comment).
- **Calendar** ([`app/(app)/events/calendar/page.tsx`](app/(app)/events/calendar/page.tsx)) — `TODAY_IDX` 14 → 17 so the default active pill is **"M 18"** (Monday) with its agenda card as "Today". May 1 = Friday was already correct, so no day-letter changes; updated the Yesterday/Today/Tomorrow comment markers (now May 17 / 18 / 19).
- **Countdown** ([`lib/countdown-data.ts`](lib/countdown-data.ts)) — recomputed all 10 `date` strings as `today + days` on the real 2026 calendar (e.g., Anna's visit 3d → Thursday, May 21; Year-end party 210d → Monday, December 14). `days` values unchanged.
- **Today** ([`app/(app)/today/page.tsx`](app/(app)/today/page.tsx)) — day-circle "TUE" → "MON"; the "Coming up" teaser now mirrors the top two soonest Countdown entries (Anna's visit 3d / Thu May 21 · Luca's Birthday party 11d / Fri May 29) instead of the unrelated Mom's birthday / Flight to Lisbon. Count pill "7 days" → "3 days" (soonest).
- **Sandbox** ([`app/components/page.tsx`](app/components/page.tsx)) — kept in sync: AgendaCard demo title "Tue 18" → "Mon 18"; FeaturedCountdown/CountdownItem sample dates; Coming-up demo cell now shows Anna's visit / Luca's Birthday party.

Decision flagged for review: "Coming up" on Today previously showed different items than Countdown; interpreted "correspond to the items" as making Today's teaser mirror the Countdown screen's top two. If you wanted to keep Mom's birthday / Flight to Lisbon and only shift their dates, say so and I'll revert that part.

### Today nav icon — target/crosshair → sun

The 4th nav slot (renamed Progress → Today earlier) was still showing a target/crosshair placeholder (`TargetIcon` — concentric circles + center dot). Swapped it for a sun (inner circle + 8 rounded rays).

**Reason:** the target reads as "focus" abstractly; the sun reads as "today / day" universally and stays distinct from the Events calendar icon at nav size (small).

**Implementation:** the existing `Svg` wrapper props were nav-tuned and preserved (`width=20 height=20 viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth=1.8`); only `name` flipped `target` → `today` (drives `data-icon`) and `strokeLinecap`/`strokeLinejoin="round"` were added for the rays. The viewBox already matched the reference 22×22 grid centered on (11, 11), so the supplied coordinates were used verbatim — no proportional recalculation needed.

**Drift found:** the icon was named `TargetIcon` (not `TodayIcon`) with `name="target"` — the Progress→Today rename had updated the nav `label`/`value` to "Today"/"today" but never the icon. Renamed `TargetIcon` → `TodayIcon` and the `data-icon` to `today`. `ProgressIcon` (a separate clock-style icon, only in the sandbox gallery) was left untouched — it is not the Today slot's icon.

**Files touched:**
- [`components/ui/icons.tsx`](components/ui/icons.tsx) — `TargetIcon` → `TodayIcon`, sun SVG, `name="today"`, rounded caps/joins; top comment notes the sun
- [`app/(app)/layout.tsx`](app/(app)/layout.tsx) — import + usage in the app-shell BottomNav (label "Today" already correct)
- [`app/components/page.tsx`](app/components/page.tsx) — import, `ALL_ICONS` entry (`target` → `today`), BottomNavSandbox usage
- [`_design-system-reference/preview/brand-iconography.html`](_design-system-reference/preview/brand-iconography.html) — icon cell + label `target` → `today`
- [`_design-system-reference/preview/components-bottom-nav.html`](_design-system-reference/preview/components-bottom-nav.html) — Today slot SVG

Typecheck clean; no new lint errors from this change (pre-existing lint findings in `_design-system-reference/ui_kits/mobile/*.jsx` and a couple of app files are unrelated and predate this task).

## 2026-05-21

### Token rename pass — names now describe usage

The `--text-*` type-scale had two tokens whose names were stale after the screen build-out, plus four tokens with zero consumers in src. Cleaned up so every token name matches the role it's actually played.

**[`app/globals.css`](app/globals.css):**
- `--text-tab-label` (11px) → **`--text-overline`** — never applied to Tabs after the `--text-nav-label` introduction. Real usage is uppercase pill labels ("Now"), brand overlines ("UP NEXT"), the `/today` day-circle "Tue" line, and WeekStrip day initials.
- `--text-nav-label` (16px) → **`--text-list-label`** — scope grew past nav into list rows. Real consumers are BottomNav items, Tabs, To-do rows, Settings rows, and AgendaCard item titles.
- Deleted `--text-body-large`, `--text-link`, `--text-button-small`, `--text-emphasis` — zero consumers in src. If they're needed later, re-add from the DS reference.

**Consumer files updated** (9 files, mechanical find/replace):
- `app/(app)/page.tsx`, `app/(app)/today/page.tsx`, `app/(app)/profile/page.tsx`
- `app/components/page.tsx` (sandbox showcase captions resynced)
- `components/ui/bottom-nav.tsx`, `components/ui/tabs.tsx`, `components/screen-tabs.tsx`
- `components/calendar/agenda-card.tsx`, `components/calendar/week-strip.tsx`

Comment-only references to the old token names refreshed alongside the rename (Home page family-pairing comment, AgendaCard scroll-math comment). Historical CHANGELOG entries left intact — they document what the names were at the time.

### Glass-card typography pass (Round 2)

Ten adjustments to bring every glass-card surface in line with the spec. Same family pairings, different role-by-role tokens:

| Surface | Change |
|---|---|
| Home Hero "Good job!" | `text-h4` → `text-h3` (larger level-up callout) |
| Today section labels (Events / Top to-dos / Coming up) | `font-body text-body` → `font-display text-h4` |
| Today Events AM/PM | `text-overline` (was `text-tab-label`) → `text-body` |
| Today Top to-dos titles | `font-display text-h4` → `font-body text-list-label` |
| Today Coming up "days" | `text-overline` → `text-body` |
| Profile "Your journey" stat labels | `text-caption` → `text-body` |
| Profile Settings row labels | `text-body` → `text-list-label` |
| Calendar AgendaCard item titles | `font-display text-h4` → `font-body text-list-label` |
| Calendar AgendaCard time line | `text-caption` → `text-body` |
| Countdown FeaturedCountdown + CountdownItem "days" | `text-caption` → `text-body` |

Sandbox at `/components` resynced 1:1 with the production cards so typography can be audited side-by-side.

### `/components` sandbox — glass-surface showcase + Card section fold

Built a comprehensive showcase grid below the Glass surface intro mirroring every production glass card 1:1 at phone content width (390px). Ten cells: Home Hero, Home UP NEXT, Today Events / To-dos / Coming up, Profile Stats + Settings, Calendar AgendaCard, Countdown FeaturedCountdown + CountdownItem.

Folded the standalone "Card" section into the renamed "Card / glass surface" section — they were both demonstrating the same primitive (`Card` emits the `--surface-card-*` tokens; no other variant). The 10-card showcase + raw-token reference cover what the standalone Card demos were proving.

## 2026-05-19

### Calendar — fix Today card cut at top after chrome growth

The Today card on `/events/calendar` was rendering with its top edge cut behind the sticky chrome. Cause: two unrelated DS standardization passes earlier today expanded the sticky chrome by ~20px (sticky `pt-4` → `pt-8` for the 32px page-top standard, and `text-h4` → `text-h3` for the screen-header standard) but the AgendaCard's `scroll-mt-48` (192px) wasn't updated. The post-edit chrome bottom (~208px) now exceeded the scroll-margin, leaving the target card's top ~10-16px behind the chrome.

**[`components/calendar/agenda-card.tsx`](components/calendar/agenda-card.tsx):**
- `scroll-mt-48` (192px) → **`scroll-mt-60`** (240px)
- Provides ~32px of breathing room over the new ~208px chrome bottom (matches the 4pt-grid 32px page-padding standard).
- Updated the inline comment with the sizing history and trimmed the Phase 6 follow-up note from "now blocking" to "still blocking, but no longer urgent" — the value is correct again until the next chrome change.

The underlying Phase 6 follow-up remains: tokenize the chrome height as a CSS variable so `scroll-margin-top` and the chrome geometry stay in sync automatically.

### Revert: Data alignment — Calendar / To-do-list / Countdown match Today's canonical "Tuesday, May 18"

Sophia reverted [a3c9e0b](https://github.com/Sophia-create94/focus-forest/commit/a3c9e0b) via `git revert` ([59498e0](https://github.com/Sophia-create94/focus-forest/commit/59498e0)). Reasoning belongs to the design call. Calendar back to TODAY = May 15 Friday; To-do-list back to "Grocery shopping" with 7 items; Countdown back to 10 items. Preceding commits (Profile h4 / Today interactive / Countdown font fix / glass-surface consolidation / page padding / Welcome exception / etc.) all preserved.

### Profile h4 section headings + Today interactive checkboxes + Countdown family fix

Four targeted fixes:

**Profile — Settings / Account section headings**
- [`app/(app)/profile/page.tsx`](app/(app)/profile/page.tsx) SectionHeading helper: `font-body text-caption font-medium text-white/65 pl-1 mb-2` → `font-display text-h4 text-white pl-1 mb-2`. The iOS-style muted group labels (small / caption / white/65) are now full Niramit Semi-Bold 16px headings in pure white. Affects every section labeled with this component: "Settings", "Account", and any future SectionHeading usage.

**Profile — "Your journey" stats card heading**
- StatsCard heading: `<p className="font-body text-body font-medium text-white/85 mb-3">` → `<h2 className="font-display text-h4 text-white mb-3">`. Token-aligned to the same h4 + pure white pattern as the section headings, and semantically upgraded from `<p>` to `<h2>` since it's a card-level heading.

**Today — interactive Top to-dos**
- [`app/(app)/today/page.tsx`](app/(app)/today/page.tsx) is now a Client Component with React `useState`. Each todo has an `id`; checkboxes wire to a `toggleDone(id)` handler via `onCheckedChange` (removed the `disabled` prop). The Top to-dos count pill is now dynamic — `${doneCount} of ${todos.length}` — so toggling re-renders the count (initially "1 of 3").
- Behavior mirrors the existing [`/events/todo`](app/(app)/events/todo/page.tsx) pattern.

**Countdown — CountdownItem font-family fix**
- [`components/countdown/countdown-item.tsx`](components/countdown/countdown-item.tsx) title: `font-body text-h4` → `font-display text-h4`. The h4 token is Display-family per the DS type-scale; pairing it with `font-body` was a family/token mismatch. Now matches the FeaturedCountdown title ("Anna's visit") exactly. Affects every CountdownItem title (e.g., "Luca's Birthday party", "Flight to Lisbon", etc.).

**Where Sophia meant "Calendar":** confirmed the example items "Anna's visit" and "Luca's Birthday party" both live in [`lib/countdown-data.ts`](lib/countdown-data.ts) — the rule applies to the **Countdown** screen, not Calendar. AgendaCard titles on Calendar were already at `font-display text-h4` from a prior pass.

### Type-scale cleanup + Profile spacing fix + Welcome exception

Four follow-up adjustments to the previous header/sub-header pass.

**Profile screen — 6px spacing removed:**
- [`app/(app)/profile/page.tsx`](app/(app)/profile/page.tsx) IdentitySection: `pt-1.5 pb-7` → `pb-7`. The 6px top-padding stacked on top of the page container's `py-8`, creating a 38px gap above the avatar instead of the standard 32px.

**Home — "Welcome!" exception:**
- Reverted [`app/(app)/page.tsx`](app/(app)/page.tsx): `text-h3` → `text-h1` (38px). "Welcome!" is the documented hero-greeting exception to the text-h3 screen-header standard. Home is the recruiter landing page; the greeting renders at h1 for first-impression impact. All other screens still use text-h3.
- Inline comment added explaining the exception.

**Type-scale token cleanup:**

`--text-body-small` was an exact duplicate of `--text-body` (both 14px / Regular 400 / lh 1.5). Removed in favor of `--text-body`. Code consumers swapped:
- [`app/(app)/today/page.tsx`](app/(app)/today/page.tsx) (6 spots)
- [`components/todo-row.tsx`](components/todo-row.tsx)
- [`components/ui/input.tsx`](components/ui/input.tsx)
- [`components/calendar/agenda-card.tsx`](components/calendar/agenda-card.tsx) (2 spots)

`--text-display` (56px) had one production consumer — [`components/countdown/featured-countdown.tsx`](components/countdown/featured-countdown.tsx) for the prominent day-count number. Replaced with `text-h1` (38px), so the featured countdown number shrinks 56→38px. Still bigger than the CountdownItem list rows below (which use text-h2 at 30px), so hierarchy is preserved (Featured 38 > Items 30). After this swap the token has zero consumers and was removed from `globals.css` + `type-scale.html`.

**DS type-scale.html updates:**
- Removed `--text-display` and `.t-display` CSS class + table row
- Removed `--text-body-small` and `.t-body-small` CSS class + table row (its usage description absorbed into `--text-body`'s description: "Default body, card content, list items, search input, timestamps")
- `--text-h1` sample: "Your Forest" → "Welcome!" with usage label updated to document the hero-greeting exception

**Side effect to verify on Vercel:**
- Profile screen: avatar + name now sit 6px higher (38→32 from AppHeader)
- Home: "Welcome!" greeting bumps back up to 38px (was 20px after the previous header standardization)
- Countdown screen featured card: day-count number shrinks 56→38px (still hero-prominent vs the 30px list rows)

### Screen headers standardized to text-h3 / sub-headers to text-h4

Enforced the DS rule that every screen's primary title uses `--text-h3` (20px Display Medium 500) and every screen sub-header (the descriptive subtitle directly below the title) uses `--text-h4` (16px Display Semi-Bold 600).

**Screen headers fixed:**

| Screen | Element | Before | After |
|---|---|---|---|
| Home | "Welcome!" | `text-h1` (38px) | `text-h3` |
| Events Calendar | "May 2026" | `text-h4` (16px) | `text-h3` |

Already correct: Today "Today", Profile USER_NAME, Events Todo "Grocery shopping", Events Countdown "Looking forward".

**Screen sub-headers fixed:**

| Screen | Element | Before | After |
|---|---|---|---|
| Home | "Tuesday, May 18 [Level 5]" subtitle | `font-body text-caption` (13px) | `font-display text-h4` |
| Today | "3 events · 3 to-dos · 2 coming up" | `font-body text-body-small` (14px) | `font-display text-h4` |
| Events Countdown | "{N} moments to look forward to" | `font-body text-body` (14px) | `font-display text-h4` |

Profile, Events Todo, and Events Calendar don't have a descriptive subtitle directly below their screen header — no sub-header changes there.

**Side effects of the change**:
- Home: the "Welcome!" greeting downsizes 38→20px and the date subtitle bumps 13→16px in Niramit. The Level 5 inline pill stays at `text-caption` (chip-style, doesn't compete with the heading).
- Today: subline goes from Source Sans 14 → Niramit Semi-Bold 16. More prominent.
- Countdown: subtitle goes from Source Sans 14 → Niramit Semi-Bold 16. More prominent.
- Calendar sticky header "May 2026" bumps 16→20px.

**Deliberately left alone** (different element categories, not screen sub-headers per Sophia's framing):
- Today section labels ("Events" / "Top to-dos" / "Coming up") — section-within-screen labels, currently `text-body-small font-medium`
- Profile SectionHeading components ("Settings", "Account") — iOS-style list group labels at `text-caption font-medium white/65`
- Profile "Your journey" stats card label — card content label at `text-body font-medium white/85`
- Card content titles (Home Hero "Good job!", FeaturedCountdown, CountdownItem, AgendaCard) — within-card content titles at `text-h3` / `text-h4`
- Stat number displays, avatar initials, pill chips, etc.

If you want section labels and card titles to also follow the h4 sub-header convention, that's a separate broader pass.

### Page padding standard — 16px sides / 32px top + bottom

Standardized screen-level padding across all app screens. Canonical recipe: `px-4 py-8` (16px sides, 32px top, 32px bottom). Both values consume canonical 4pt-grid tokens (`--space-4` and `--space-8`).

**Code changes:**

| Screen | Before | After |
|---|---|---|
| Home | `px-6 py-8` (24/32) | `px-4 py-8` |
| Today | `px-4 py-3` (16/12) | `px-4 py-8` |
| Profile | `px-6 pt-1 pb-7` (24/4/28) | `px-4 py-8` |
| Events Todo | header `px-4 py-3`, list `px-4 pb-5` | header `px-4 pt-8 pb-3`, list `px-4 pb-8` |
| Events Calendar | sticky `px-6 pt-4 pb-3`, cards `px-6 pt-4` | sticky `px-4 pt-8 pb-3`, cards `px-4 pt-4` |
| Events Countdown | `px-6 py-8` | `px-4 py-8` |
| Add stub | `p-4` | `px-4 py-8` |

**New DS file: `_design-system-reference/preview/spacing-page-layout.html`** — documents the standard with a stylized mobile-frame visual (16/32 padding markers on each edge), a spec list (token + Tailwind class mappings), and two notes covering documented exceptions and the rationale.

**Documented exceptions** (not the standard):
- **Lock screen** (`/lock`) — OS chrome, uses its own iOS-spec padding.
- **Calendar** (`/events/calendar`) — keeps `pb-[80vh]` on the cards container so any WeekStrip pill click can position its target AgendaCard flush to the top of the viewport. Top `pt-8` still applies to the sticky chrome.
- **`/components` sandbox** — exempt; uses its own dense grid layout for primitive matrices.

**Visible production changes** (verify on Vercel):
- Today screen: vertical padding bumped 12px → 32px on each side. Content sits lower below the AppHeader and has more breathing room above the BottomNav.
- Profile screen: top padding now 32 (was 4), bottom 32 (was 28). Side padding 16 (was 24).
- Home, Countdown: side padding tightened 24 → 16. Top/bottom unchanged.
- Events Todo: title header gains 20px of top breathing room, list bottom gains 12px.
- Events Calendar: sticky chrome sits 32 from top (was 16). Side padding tightened on both sticky bar and cards container.

### AgendaCard joins the canonical glass

Audit follow-up to the glass-surface consolidation: AgendaCard on the Calendar screen was the last remaining glass-like surface NOT using the `<Card>` primitive. Previously rendered a solid `bg-white/10` (inactive) / `bg-white/15` (active) fill with no border, no blur, no gradient — which Sophia spotted as the missing white border on Calendar.

**[`components/calendar/agenda-card.tsx`](components/calendar/agenda-card.tsx)** — refactored to `<Card asChild><section>`. The canonical `--surface-card-*` tokens now provide the gradient, blur, 20% white border, and 14px radius.

**Active vs inactive state change:** the previous bg-opacity differentiation (white/10 ↔ white/15) was dropped. Both states now use canonical glass; the yellow inset accent shadow (`shadow-[inset_4px_0_0_0_#F6AE2D]`) is the sole active-state indicator. The accent is strong enough on its own, and re-introducing bg-opacity shifts on top of canonical glass would re-introduce per-card visual variance — the very thing the consolidation was meant to remove.

**Full audit of every glass surface in the app — all now flow through `<Card>`:**
- Home "Good job!" hero ✓
- Home "UP NEXT" teaser ✓
- Today 3 section cards (Events, Top to-dos, Coming up) ✓
- Profile stats card + 2 settings cards ✓
- Countdown screen FeaturedCountdown + CountdownItem ✓
- Calendar AgendaCard ✓ (this commit)

**Other `bg-white/N` uses in the codebase are intentionally NOT cards** (different DS patterns):
- Today day-circle "TUE 18" — date label chip
- Today urgent accent bar — visual indicator
- WeekStrip day pills — interactive tab buttons
- Profile toggle switches — toggle UI
- Input primitive — form input pattern
- Checkbox checked state — checkbox primitive
- Button hover/active overlays — interactive state
- Lock screen iOS notifications — system chrome (deliberately opaque)
- Profile divider — 1px hairline

**Visible change on Calendar:** both agenda cards now show the canonical glass treatment — gradient, backdrop-blur, and the 20% white border that was missing before. Active card retains its yellow left accent.

### Glass surface consolidation — one canonical recipe

Collapsed the three production glass-card recipes into one. The `<Card>` primitive is now the single source of glass everywhere; plain-div + inline-gradient pattern eliminated.

**Canonical recipe (winning):** gradient `rgba(255,255,255, 0.18→0.06)` · `backdrop-blur-md` (12px) · `border-white/20` · `rounded-md` (14px). Previously the section-card variant; chosen because it was already in 4/6 production uses, has on-scale radius, and best border definition.

**`app/globals.css`:**
- `--surface-card-bg`: `0.15→0.05` → `0.18→0.06`
- `--surface-card-blur`: `blur(20px)` → `blur(12px)`
- `--surface-card-border`: 10% white → `20% white`
- `--surface-card-radius`: `15px` → `14px`
- Removed `--radius-glass: 15px` and `--radius-card: 16px` tokens (no remaining consumers)

**`_design-system-reference/colors_and_type.css`** (master): same updates as globals.css. Removed `--r-glass: 15px` and `--r-card: 16px`.

**Code refactor — every glass surface now flows through `<Card>`:**

- [`app/(app)/page.tsx`](app/(app)/page.tsx) — Home teaser refactored from plain `<div>` with inline gradient to `<Card>`. Updated header comment (the previous "Card tokens don't compose cleanly with caller overrides" rationale is now obsolete since every glass uses the same recipe).
- [`app/(app)/today/page.tsx`](app/(app)/today/page.tsx) — All three section cards (Events, Top to-dos, Coming up) now use `<Card>` instead of plain divs with `SECTION_GLASS_BG`. Removed all 3 inline gradient constants.
- [`app/(app)/today/page.tsx`](app/(app)/today/page.tsx) — **Today "Coming up" restructured**: countdown sub-cards (previously a 2-col grid of nested glass mini-cards) collapsed to a vertical list of bare rows inside the parent section Card. Each countdown row mirrors the Event row structure: day-count column + vertical accent bar + content (title + date subtitle). Urgent state: yellow day-count number + yellow accent bar (consistent with the work/personal/health category bars on Event rows).
- [`components/countdown/countdown-item.tsx`](components/countdown/countdown-item.tsx) — `<article>` with solid `bg-white/10` → `<Card asChild><article>` with canonical glass. (Countdown screen cards previously had no DS documentation — now folded into the canonical glass treatment.)
- [`components/countdown/featured-countdown.tsx`](components/countdown/featured-countdown.tsx) — `<section>` with solid `bg-white/15` → `<Card asChild><section>` with canonical glass. Yellow inset accent shadow preserved.

**`_design-system-reference/preview/components-glass-surface.html`** rewritten: was 3 variants + urgent modifier; now ONE canonical recipe shown three ways (top-level hero, section card with rows, urgent-row treatment). Includes guidance: "Do not nest glass surfaces — `backdrop-filter` inside another blurred element double-blurs and looks muddy. For sub-items inside a section card, render them as bare rows with optional accent bars."

**`_design-system-reference/preview/spacing-radii.html`:** removed the `glass` (15) and `card` (16) entries from the radii grid; prose updated to note the Card primitive's glass surface now uses `md` (14px) following the consolidation.

**Visible production changes** (verify on Vercel):
- Home "Good job!" hero card: border now 20% (was 10%) — more prominent; blur 12px (was 20px) — slightly less hazy; radius 14 (was 15) — −1px tighter.
- Home "UP NEXT" teaser: identical visual to before (was already canonical).
- Today three section cards: identical visual to before (was already canonical).
- Today "Coming up": **layout changed** — countdown sub-cards replaced with vertical rows inside the Coming up section. Urgent rows have yellow day-count + yellow accent bar.
- `/events/countdown` featured + list rows: now have the canonical glass treatment (gradient + blur + border) where they previously had a solid white-tint fill.

**Not changed:** `app/components/page.tsx` sandbox still uses the old visual references; deferred per Sophia's direction.

### Off-grid spacing cleanup (option c)

Surgical pass on arbitrary spacing literals where (a) the value was already on the Tailwind v4 spacing scale and just needed the utility name, or (b) the value was off-grid and could be rounded to the nearest scale step with a ≤2px shift.

**`app/(app)/profile/page.tsx` — 7 edits:**
- Pure renames (zero visual change):
  - `gap-[10px]` → `gap-2.5`
  - `gap-[6px]` → `gap-1.5`
  - `py-[14px]` → `py-3.5`
  - `p-[2px]` → `p-0.5`
  - `translate-x-[14px]` → `translate-x-3.5`
- Rounded to nearest grid step:
  - Edit-pencil button `w-[26px] h-[26px]` → `w-6 h-6` (26 → 24px, **-2px**)
  - "Level 5 · explorer" pill `py-[5px]` → `py-1.5` (5 → 6px, **+1px**)

**`components/calendar/agenda-card.tsx` — 1 edit:**
- Time column `min-w-[38px]` → `min-w-10` (38 → 40px, **+2px**)

**Deliberately left as off-grid** (interdependent, DS-spec, or no clean scale step):
- Profile toggle (`h-[22px]` track + `w-[18px] h-[18px]` thumb) — track-padding-thumb math is interlocked; rounding any single dimension breaks the render. Could be done as a coordinated rework if the toggle needs proportion changes anyway.
- BottomNav primitive `h-[82px] px-[10px] pb-[14px]` + FAB `w-[54px] h-[54px] -mt-[30px]` — DS-spec'd in `components-bottom-nav.html` / `components-fab.html`.
- StatusBar `h-[50px] pt-[14px]` — DS-spec'd iOS chrome.
- AppHeader `w-[30px] h-[30px] ml-[9px]` — DS-spec'd.
- Lock screen iOS chrome literals — intentional system-spec values.
- Button `pt-[14px] pb-[18px]` asymmetric padding — documented Niramit cap-height fix.
- Tabs/Input `pt-[9px] px-[14px] pb-[10px]` — DS-spec'd component values.
- Countdown `min-w-[52px]` / `min-w-[88px]` — Tailwind v4 default scale skips 13 and 22, so rounding to nearest utility would shift by 8px (`min-w-12`=48 or `min-w-14`=56; `min-w-20`=80 or `min-w-24`=96). Too aggressive for a spacing-discipline pass; leave for a focused countdown rework.

Build verified locally. Visible production changes: the Profile edit-pencil button shrinks 2px (still circular per `rounded-pill`), the Level 5 pill gains 1px vertical padding, and the Calendar agenda-card time column gains 2px of minimum width.

### Production consumes the new DS tokens

Round-trip completion of the DS-alignment work: now that the DS defines the tokens production uses, this pass swaps production's arbitrary literals for the named tokens. Zero visual change — pure token discipline.

**`app/globals.css` — token plumbing into the `@theme` block** so Tailwind v4 emits utilities:
- `--text-nav-label: 16px / 500 / lh 1` — for BottomNav, FAB, and Tab labels
- `--radius-checkbox: 3px` — Checkbox primitive
- `--radius-input: 10px` — Input primitive
- `--radius-glass: 15px` — Card primitive (alias of `--surface-card-radius`)
- `--radius-card: 16px` — Countdown cards

**Production refactor — 19 literal-to-token swaps across 11 files:**

| Swap | Spots | Files |
|---|---|---|
| `rounded-full` → `rounded-pill` | 13 | profile (×5), lock (×2), events/todo, app-header, bottom-nav (FAB), fab-menu (×2), agenda-card |
| `text-[16px]` → `text-nav-label` | 4 | bottom-nav (label + FAB label), tabs, screen-tabs |
| `text-[14px]` → `text-body-small` | 2 | input, todo-row |
| `text-[13px]` → `text-caption` | 1 | fab-menu (sub-action label) |
| `rounded-[3px]` → `rounded-checkbox` | 1 | checkbox primitive |
| `rounded-[10px]` → `rounded-input` | 1 | input primitive |
| `rounded-2xl` → `rounded-card` | 2 | countdown-item, featured-countdown |

**Deliberately left alone:**
- `app/layout.tsx:38` `text-[16px]` desktop-frame tagline — not a nav label; the DS has no Body/Regular 16px token (nav-label is weight 500). Legitimate DS gap.
- `app/components/page.tsx` sandbox uses — illustrative reference, untouched per established convention.
- `app-header.tsx` logo `text-[13px]` (Display/Bold 700) — no token at that family/weight combo.
- Lock screen iOS-chrome literals (`text-[15px]`, `text-[17px]`, `rounded-[6px]`, etc.) — system-font context, intentionally outside brand tokens.

**`_design-system-reference/preview/spacing-radii.html` prose updated:** revised the guidance to recommend `pill` (9999px) for ALL rounded UI elements (circles, pills, dots, avatars, FABs, badges). `pill` always renders correctly because it produces a circle on symmetric elements and a pill on asymmetric; `full` (50%) becomes an ellipse on non-square dimensions and is retained only for historical compatibility.

**Source-of-truth status:** code and DS now in full alignment. Future divergence is a code bug to fix, not a DS update.

### DS alignment pass — production is now reflected in the DS

Sophia's directive: align the Design System with what's currently in production (live on Vercel). Once everything is aligned, the DS is the new source of truth again.

**`_design-system-reference/preview/type-scale.html`:**
- `--text-h3` font-weight 600 → **500** (Medium); line-height 1.25 → 1.3
- `--text-h4` line-height 1.3 → **1.4**
- `--text-body` font-size 16 → **14px**
- `--text-caption` font-size 12 → **13px** (legibility bump, documented)
- `--text-emphasis` size now correctly inherits parent (was forced 16px); weight 600 applies to the `<em>` child
- `--text-h1` letter-spacing -0.01em → **-0.5px** (unit sync)
- `--text-h2` letter-spacing -0.005em → **-0.3px** (unit sync)
- h2 usage label: dropped "screen titles" (h2 is for in-page section headings only)
- h3 usage label: added "screen titles" (matches Today/Calendar/Countdown shipped practice)
- **New token row** `--text-nav-label` 16px / Body / Medium 500 — for BottomNav, FAB, and Tab labels (which previously rendered as off-token `text-[16px]` arbitraries)
- `--text-tab-label` (11px) sample updated to "UP NEXT" and usage relabeled "Tiny overlines, uppercase captions, AM/PM suffixes" — reflects actual shipped usage
- New footer note documenting the font-weight scale (300/400/500/600) plus the 700 reserved for the logo glyph

**`_design-system-reference/preview/spacing-radii.html`:**
- Added 4 component-specific radii to the grid alongside the canonical scale: **3px** (`checkbox`), **10px** (`input`), **15px** (`glass`), **16px** (`card`)
- Added prose distinguishing the canonical scale (xs / sm / md / lg / pill) from component-specific radii
- Clarified that `full` (50%) is reserved for elements that must be circular regardless of dimensions; for pill-shaped UI, use `pill` (9999px)

**`_design-system-reference/preview/components-bottom-nav.html`:**
- Label font-size 10px → **16px** (Medium 500) — matches shipped BottomNav
- FAB `border-radius: 50%` → **9999px** (brand pill token)

**`_design-system-reference/preview/components-fab.html`:**
- Sub-action button 46×46 → **52×52**
- Sub-action label 10px / Semi-Bold 600 → **13px / Medium 500**
- All `border-radius: 50%` → **9999px**

**`_design-system-reference/preview/components-app-header.html`:**
- Logo text 12px → **13px**
- Tab text 13px Regular → **16px / Medium 500**
- Logo `border-radius: 50%` → **9999px**

**`_design-system-reference/preview/components-buttons.html`:**
- Primary + Secondary button text color `#1a1a1a` → **`#0E0F0C`** (brand `--color-black`)
- Spec-card text-color callout updated to reference the token

**`_design-system-reference/preview/components-input.html`:**
- Input font-size 13.5px → **14px** (matches production `text-[14px]`; aligns to `--text-body-small` token)

**`_design-system-reference/preview/components-todo-rows.html`:**
- Row text font-size 13.5px → **14px** (same as input)

**`_design-system-reference/preview/brand-iconography.html`:**
- Added the 4 brand icons that were exported from `icons.tsx` but missing from the DS: **countdown**, **pencil**, **tree**, **chevron-right**. Each SVG matches its production export.

**`_design-system-reference/colors_and_type.css` (master):**
- Removed the deprecated tokens `--ff-green-header`, `--ff-green-card`, `--ff-green-soft`, and `--bg-elevated` (last consumer migrated; production uses translucent glass over `--ff-primary` directly)
- `.ff-btn-primary` / `.ff-btn-secondary` text color `#1a1a1a` → `var(--ff-black)`
- Added `--text-nav-label-size/weight/lh` (16/500/1)
- Added component-specific radii: `--r-checkbox: 3px`, `--r-input: 10px`, `--r-glass: 15px`, `--r-card: 16px`

**`_design-system-reference/preview/components-glass-surface.html` (NEW):**
- Created a canonical reference for the three glass surface variants used in production:
  - **Variant A** — Card primitive (`<Card>`): gradient 0.15→0.05, blur 20px, 10% border, radius 15px. Used by Home's "Good job!" card.
  - **Variant B** — Section card: gradient 0.18→0.06, blur 12px (Tailwind `backdrop-blur-md`), 20% border, radius 14px. Used by Home's "UP NEXT" teaser + Today's three section cards.
  - **Variant C** — Nested countdown: gradient 0.10→0.04, NO blur (inherits parent), 15% border, radius 8px. Used by Today's countdown sub-cards.
  - **Urgent modifier**: Variant C with yellow-tinted gradient (0.18→0.06 of `#F6AE2D`) + day-count switches to `text-yellow`.
- Includes "when to use each" guidance prose.

**Code fixes alongside the DS pass (small):**
- [components/ui/status-bar.tsx](components/ui/status-bar.tsx): in-app StatusBar font-family `font-body` → `font-system` (matches Lock screen's iOS-chrome treatment; was a code bug, not a DS sync item).
- [app/(app)/today/page.tsx](app/(app)/today/page.tsx): removed the incorrect "DS guidance suggests yellow" Phase 6 note on the Checkbox; the DS in fact prescribes white-tinted (`components-todo-rows.html`) and production matches.

**Source-of-truth status:** with this commit the DS is back to being the authoritative source. Any future divergence between code and DS is a code bug to fix, not a DS update.

### Today screen — calibration pass + DS sync

- **"Today" heading downsized** `text-h1` → `text-h3` (38 → 20px). Per the screen-title visual practice across the shipped mocks.
- **Subline bumped** `text-caption` → `text-body-small` (13 → 14px) to align with the in-section labels (Events / Top to-dos / Coming up).
- **Day-circle indicator** `w-10 h-10` → `w-11 h-11` (40 → 44px). Designed at 45px; rounded down by 1px to stay on the 4pt grid (44 / 48 are the on-scale neighbors) rather than introducing an arbitrary `w-[45px]`. 1px deviation from the design ask, in service of token discipline — surface if the visual difference matters.
- **To-do count corrected** "2 of 3" → "1 of 3" (one of three todos checked, not two).
- **DS sync — components-bottom-nav.html:** 4th nav slot label "Progress" → "Today" with the new concentric-circle Target SVG. Production already shipped this swap in commit `801c72d`; the canonical DS reference is now in sync.
- **DS sync — brand-iconography.html:** added a new `target` entry between `progress` and `profile`. Target is the Today nav glyph; Progress (clock-hands-in-circle) is kept since `ProgressIcon` is still an exported brand asset (used in the `/components` sandbox demo).
- **Typography rework flagged** for a future wave: `type-scale.html` labels `--text-h2` (30px) as "Section headings, screen titles" but the shipped screens use `--text-h3` (20px) for screen titles. Either the DS usage label needs updating (h3 = screen title) or the screens need rework to h2. Logged for separate decision.
- **Deferred docs-sync bucket** trimmed: `components-bottom-nav.html` Progress→Today and `brand-iconography.html` Target both landed this wave. Remaining bucket items (countdown / pencil / tree / chevron-right additions to `brand-iconography.html`; `--green-card` / `.progress-card` / `--text-h3` font-weight discrepancy / `components-buttons.html:71` `#1a1a1a`) untouched.

### Today screen — inspiration-mockup alignment

- **Section headers moved OUT of the glass cards.** Each of the three sections (Events / Top to-dos / Coming up) is now a `<section>` containing a header that floats on the primary canvas above the glass card. Header pattern: yellow icon + Body-family label + count pill on the right (`ml-auto`). The glass card below holds only row content; the in-card header + `mb-2` spacer have been removed. Inline `SectionHeader` helper keeps the three call sites identical without introducing a new component file.
- **Count pills** (`3 today` / `2 of 3` / `7 days`) get pill chrome: `bg-black/20 text-white/80 rounded-pill px-2 py-0.5` at `text-caption`. Sits darker than the day-circle's `bg-white/10` to read against the green canvas; same `rounded-pill` brand-token discipline as the Level 5 pill on Home.
- **Outer section spacing bumped** from `gap-3` to `gap-5` (12 → 20px). With the headers now living outside the cards, more breathing room between section groups keeps the rhythm legible.
- **Event time format → 12-hour with smaller AM/PM suffix.** Each event row's time slot is now an inline flex pair: the number renders at `text-body-small` (14px, Medium) and the period at `text-tab-label` (11px, uppercase) at `text-white/70`. Time column widened from `w-12` to `w-16` (48 → 64px) to fit "9:30 AM" / "2:00 PM" / "6:30 PM".
- **Sample data refreshed to match the inspiration mockup:**
  - Events: 9:30 AM Team standup (Work · 30 min, with NOW pill) / 2:00 PM Coffee with Maya (Joe's Coffee · 1 hr) / 6:30 PM Yoga class (Power Yoga Studio · 1 hr). NOW pill moved from Coffee → Team standup.
  - To-dos: Buy bread + orange juice / Send pictures to Mom (done, strikethrough) / Book dentist for next month.
  - Coming up: Mom's birthday (4 days, urgent) / Flight to Lisbon (6 days, normal). New `date` field on each item renders a third line per countdown card (`Saturday, May 22` / `Monday, May 24`).
- **Countdown cards now show three lines:** day count + "days" inline, bold title, date subtitle (`text-caption text-white/60`). Mirrors the inspiration's three-line stack.
- All values continue to consume DS tokens; no new arbitrary type/spacing/radius values introduced. Phase 6 follow-up logged for promoting the count-pill pattern to a small inline pill primitive if it recurs.

### DS-conformance sweep — Home + Today

- **`font-display`→`font-body` on Body-family tokens** across both screens. The DS `type-scale.html` groups tokens by family: Display family (Niramit) covers display / h1 / h2 / h3 / h4 / button / button-small; Body family (Source Sans 3) covers body-large / body / body-small / caption / tab-label / link / emphasis. Pairing `font-display` with a Body-family token (e.g., `font-display text-caption`) forced Niramit onto Body tokens and crossed family boundaries. Fixed 4 spots in Home and 7 spots in Today.
- **`rounded-full`→`rounded-pill`** in Home (4 spots: Level 5 pill, avatar circle, progress track, progress fill). `rounded-full` is a Tailwind built-in default, not a brand token; only `rounded-pill` consumes the DS `--radius-pill: 9999px` token. Both emit 9999px visually; the swap is for token discipline. Today was already correct.
- **Work-category bar reverted from `bg-sage` to `bg-sky`** in Today. The original spec wrongly claimed `#92D3F0` wasn't in the DS, but it IS the brand `--color-sky` token (globals.css line 169). The sage substitute went away; the mockup's intended work-blue now matches exactly.
- Updated screen-level comments in both files to document the DS-conformance pass; trimmed retired Phase 6 follow-ups; added a follow-up note about `--text-h3--font-weight: 500` in globals.css conflicting with type-scale.html's 600 (Rule 7 — HTML wins; token-data fix, separate sync wave).
- Build verified locally (all 11 routes generate).

### Today screen — new tab build, strict DS scale (Phase 5b)

- **New `/today` route** (`app/(app)/today/page.tsx`) — curated daily-action dashboard composed inline (no new component files). Three glass section cards: today's events (3 time-ordered rows with category color bars + "Now" pill), top to-dos (3 rows using the existing Checkbox primitive), coming up (2-col countdown grid with urgent-state yellow glass variant). Title block with "Today" heading + counts subline + day-circle indicator (40×40 `rounded-sm`).
- **Glass surface pattern matches Home teaser exactly** — plain `<div>` with explicit utility classes (gradient + `backdrop-blur-md` + `border border-white/20` + `rounded-md`), NOT the `<Card>` primitive. Card's tokenized `--surface-card-*` classes don't compose cleanly with caller overrides; the Home wave established the plain-div pattern for the same reason.
- **Three art-tier inline gradients** (per spec): section card glass (`rgba(255,255,255, 0.18→0.06)`), nested countdown card glass (`rgba(255,255,255, 0.10→0.04)`), urgent countdown yellow glass (`rgba(246,174,45, 0.18→0.06)`).
- **Type-token mappings** — spec referenced Tailwind defaults that aren't in the DS scale. Resolved: `text-3xl`→`text-h1` (38px), `text-2xl`→`text-h3` (20px, closest DS — no 24px token), `text-sm`→`text-body-small` (14px), `text-xs`→`text-caption` (13px, the 12px size was retired), `text-[10px]`→`text-tab-label` (11px).
- **Radius mappings** — `rounded-xl`→`rounded-md` (14px, matches Home teaser), `rounded-lg`→`rounded-sm` (8px exact), `rounded-full`→`rounded-pill`.
- **Category bar colors** — mockup's work-blue `#92D3F0` isn't in the DS; substituted `bg-sage` per spec. `personal`→`bg-yellow`, `health`→`bg-moss`. Multi-category palette tokens deferred to Phase 6.
- **Page padding** — `px-4 py-3 gap-3` (departs from Home's `px-6 py-8 gap-8`; tighter chrome justified by the 3-card dashboard density).
- **BottomNav: Progress slot replaced with Today** (`app/(app)/layout.tsx`) — lookup tables (`PATH_TO_ACTIVE_ITEM`, `PATH_TO_SHOWS_DOTS`, `NAV_ROUTES`) updated to remove `/progress` and add `/today`. The Progress `<BottomNavItem>` swapped for Today using the new `TargetIcon` (concentric circles). The `BottomNav` primitive itself (`components/ui/bottom-nav.tsx`) is surface-agnostic and unchanged — the nav-item composition has lived in the route-group layout since Phase 5a.
- **New icon: `TargetIcon`** (`components/ui/icons.tsx`) — concentric-circle target glyph for the Today nav slot, stroke-width 1.8 to match the other nav icons.
- **Deleted `/progress` route** (`app/(app)/progress/` directory removed entirely). Remaining `progress` references were audited: the `/components` sandbox still uses `value="progress"` and `<ProgressIcon />` to demonstrate the BottomNav primitive's prop API (illustrative, not a route link — left as-is). Historical narrative comments in `app/(app)/page.tsx`, `components/calendar/agenda-card.tsx`, and `app/components/page.tsx` mentioning "progress" left in place. `ProgressIcon` export retained — brand icon, deletion not in scope.
- **Checkbox checked-state divergence surfaced** — the primitive's checked state is white-tinted (`bg-white/30 border-white/50`), not yellow as the spec assumed. Shipped Today's to-dos with the existing primitive treatment (decision: divergence is primitive-level, not screen-level). Phase 6 follow-up logged.
- **Build verified locally** (`npm run build` passes; all 11 routes generate including `/today`, with no `/progress`). Preview server failed to bootstrap due to a harness-level node `process.cwd()` EPERM (not reproducible from the shell `pwd`); on-device verification deferred to Vercel deploy.
- Out of scope for this wave (deferred): AppHeader refactor (logo + wordmark + dots), Profile stats removal, Source Sans 3 font addition, all other route changes beyond `/today` add + `/progress` delete.

## 2026-05-06

- Scaffolded Next.js 16.2.4 project with TypeScript, Tailwind v4, App Router (initial commit).
- Installed and initialized shadcn/ui with Radix primitives and the Nova preset (`components.json`, `components/ui/`, `lib/utils.ts`).
- Connected GitHub `main` to Vercel for auto-deploy on push.
- Replaced the placeholder `CLAUDE.md` (was a bare `@AGENTS.md` re-export) with project-specific context: stack, design-system source of truth, conventions, status checklist, and workflow notes. `AGENTS.md` (Next.js 16 breaking-changes warning) is still imported at the top.
- Added this `CHANGELOG.md`.

### Phase 3 complete: design tokens translated to Tailwind v4

- Created `lib/fonts.ts` — Niramit + Source Sans 3 via `next/font/google`, weights 300/400/500/600/700.
- Updated `app/layout.tsx` — brand fonts applied to `<html>`, replaced default Geist, set metadata to "Focus Forest".
- Rewrote `app/globals.css` — brand `@theme` block (16 colors, 8 spacing steps, 6 radii, 3 shadows, 2 font families, 14 named text tokens); overrode shadcn's `--primary` and `--primary-foreground` to brand values in light + dark; switched base-layer `html` font from `font-sans` to `font-body`.
- Added glassmorphism surface variables at `:root` for header-nav, card, bottom-nav, plus FAB pressed state.
- Replaced `app/page.tsx` with Phase 3 verification page (throwaway; will be replaced in Phase 5).
- Fixed Niramit cap-height drift on verification button via asymmetric vertical padding (14/18 top/bottom); pattern documented for Phase 4 Button component.

## 2026-05-07

### Token tuning: `--text-button` 20px → 18px

- Reduced primary button text size to align with mobile UX guidelines (16-18px range for CTAs).
- Asymmetric padding (14/18) preserved — Niramit cap-height drift is font-metric-relative.

### Design system docs sync

- Updated `_design-system-reference/preview/type-scale.html` and `components-buttons.html` to match the live `--text-button: 18px` token.
- Removed outdated 20px rationale prose from buttons block; current rationale (mobile UX alignment) lives in this CHANGELOG.
- Reference and implementation now consistent for `--text-button`.

### Token tuning: `--text-button` 16px (was 18px)

- Reduced primary button text size to 16px after visual evaluation; better proportion against surrounding text and within mobile UX guidelines.
- Updated `_design-system-reference/` copies of type scale and buttons block to match.

### Token tuning: `--color-black` #0E0F0C (was #000000)

- Replaced pure black with near-black (#0E0F0C) for text legibility — pure black creates visual strain on screens; the warmer near-black complements Focus Forest's earthy palette.
- Shadow rgba(0,0,0,X) values unchanged — alpha already softens them.
- Updated `_design-system-reference/` color documentation to match.

### Token semantics fix: `--radius-pill` now true pill (9999px)

- Updated `--radius-pill` from 24px to 9999px so the token name matches its semantic meaning. 24px on a ~50px button left visible flat edges; 9999px renders as true pill.
- Removed redundant `--radius-full: 9999px` token (now duplicates `--radius-pill`).
- Primary CTA button uses `rounded-pill` for true pill rounding, matching the original Focus Forest design and modern primary-CTA conventions.
- Other radius tokens (`--radius-xs/sm/md/lg`) unchanged. Cards, inputs, and other surfaces continue using their existing radii.
- Master CSS `--r-pill` token value synced from 24px to 9999px; `--r-full` left in place.

### Pre-Phase 4a docs audit & sync

- Audited unsynced reference files for stale `--text-button`, `--color-black`, `--radius-pill`, and the experimental `--radius-button` token.
- Synced `_design-system-reference/preview/spacing-radii.html` and `README.md` pill-radius documentation to 9999px.
- Deferred to Phase 4: `ui_kits/mobile/index.html` `.jungle-cta` (24px → ?) and `.screen-tab` (24px → ?). These are reference implementations using hardcoded values; they'll be addressed when the corresponding components get built/ported.
- All other reference files confirmed in sync (no stale token references found).

### Phase 4a: Button component (primitive #1 of 7)

- Created `components/ui/button.tsx` with 3 variants (`primary` / `secondary` / `ghost`) × 5 states (default / hover / active / focus-visible / disabled). Default variant renamed from shadcn's `default` to `primary` to match design system semantics.
- Asymmetric Niramit padding baked into cva: 14/18 (top/bottom) for primary/secondary, 12.5/16.5 for ghost (1.5px border eats into padding to maintain 52px box). Focus ring uses `outline-yellow` (brand token), 2px solid + 2px offset, shared across variants per spec.
- `asChild` polymorphism via `Slot.Root` (radix-ui); icon auto-sizing via `[&_svg]:size-3.5` for 14px leading glyphs.
- Disabled text color uses `text-black/40` — brand `--color-black` plumbed through Tailwind's alpha modifier, preserving the token chain rather than arbitrary `rgba(0,0,0,0.4)`.
- Dropped shadcn's stock variants (`outline` / `destructive` / `link`), size scale (`xs` / `sm` / `lg` / `icon` + icon-* variants), and `aria-invalid` / `aria-expanded` styling — none specified in the design system.
- Created `app/components/page.tsx` — sandbox route at `/components` with the variant × state matrix on light + green canvas, in-context glass-card demo, and icon-with-label samples. Static state proofs via className overrides (no demo-only `state` prop). Added "View component sandbox →" link on verification page (`app/page.tsx`) using `text-link-on-dark` Sky color, underlined.
- Deferred audit follow-up: `_design-system-reference/preview/components-buttons.html:71` documents primary text color as `#1a1a1a` — pre-token-tuning artifact. Should sync to `text-black` (= `#0E0F0C` via brand token) alongside the other deferred reference items (`.jungle-cta` / `.screen-tab` radius). Future docs-sync pass.

### Phase 4b: Card component (primitive #2 of 7)

- Created `components/ui/card.tsx` with single `glass` variant consuming `--surface-card-*` tokens via Tailwind arbitrary classes (avoids style-prop footgun).
- Mirrors Button's structure: `cva` + `defaultVariants`, `asChild` polymorphism via `Slot.Root`, `data-slot`/`data-variant` attributes, `cn()` className merge.
- Architectural decision: `text-white` lives in the `glass` variant (not base) so future non-glass variants can flip text color without override gymnastics.
- Added Card section to `/components` sandbox with three demos: default usage, in-context Button composition, and `p-6` padding override (proves Tailwind-merge resolves base/caller conflicts correctly).
- Refactored verification page glass card from inline `style={{...}}` to `<Card className="relative">` — visual output unchanged, source of truth now lives in the primitive.
- Deferred: `--green-card` deprecated solid token + `.progress-card` UI-kit consumer remain in the Phase 4 follow-up bucket alongside `.jungle-cta` and `.screen-tab`.

### Phase 4b: Input component (primitive #3 of 7)

- Created `components/ui/input.tsx` with single `default` variant capturing all 11 reference spec properties (bg, border, radius, padding, font, color, placeholder, outline-none, focus bg-shift, disabled).
- Mirrors Button/Card cva structure but with two architecture deviations: no `Slot` import (no `asChild` — `<input>` is void), no `display` in base (lets `<input>` keep its natural `inline-block`).
- Three arbitrary geometry values per spec: `text-[13.5px]`, `py-[9px] px-[14px]`, `rounded-[10px]` — none match existing tokens, anti-proliferation kept them inline rather than introducing one-off `--input-*` tokens.
- Focus indicator is bg opacity shift (`white/18 → white/28`), not an outline ring — deliberate spec choice differentiating passive (input) vs. active (button) focus. Borderline for WCAG AAA, fine for AA.
- Added Input section to `/components` sandbox: 4 state demos (default empty / with value / focus frozen / disabled) + 1 search composition demo (Input + absolute SVG overlay, icon-on-right per spec).
- Search composition follows the reference's `relative` wrapper + absolute icon pattern; caller controls icon placement, padding-right, and color via parent classes. No icon props baked into Input.

### Phase 4b: Checkbox component (primitive #4 of 7)

- Created `components/ui/checkbox.tsx` wrapping `CheckboxPrimitive` from the existing `radix-ui` umbrella package (no new dependency — already installed for Button's `Slot.Root`). Free a11y: keyboard navigation, ARIA `role="checkbox"` + `aria-checked`, indeterminate support, form integration via Radix's hidden native input.
- Single `default` variant. Box geometry per reference: `size-[17px]`, `rounded-[3px]`, `border-[1.8px]` — none match existing scale, kept as arbitrary classes (anti-proliferation).
- Architectural pattern: border *width* in base (variant-agnostic, doesn't change with state), border *color* in variant (`border-white/75` default → `border-white/50` checked/indeterminate via `data-[state=checked]:` / `data-[state=indeterminate]:` Radix data attributes).
- Spec-silent additions for a11y: focus ring (Button-style emphatic `outline-yellow` 2/2px — passive focus would be insufficient on a 17px target), explicit `disabled:opacity-50 disabled:cursor-not-allowed` (cross-browser consistency).
- Indeterminate state shares checkmark visual with checked (D6 — `aria-checked="mixed"` preserves SR distinction; visual ambiguity acceptable until Phase 5 reveals a "select all" use case).
- SVG checkmark (12px polyline tick) inside `CheckboxPrimitive.Indicator`; uses `currentColor` so parent's `text-white` controls hue.
- Added Checkbox section to `/components` sandbox: 5 state demos (unchecked / checked / indeterminate / disabled / focus frozen) + with-label composition (two checkboxes wrapped in `<label>`, "Orange Juice" with static `line-through opacity-45` from the To-Do done-state reference).

### Phase 4b: Tabs component (primitive #5 of 7)

- Created `components/ui/tabs.tsx` with 4 components (Tabs / TabsList / TabsTrigger / TabsContent) wrapping `TabsPrimitive` from the existing `radix-ui` umbrella package. Free a11y: keyboard arrow-key navigation between triggers, ARIA `role="tablist"` / `tab` / `tabpanel`, focus management, `aria-selected` on active trigger.
- Visual investigation finding: the active-tab indicator is a WHITE underline (per `screen-todo.png` and `.tab-item.active` in the UI-kit), NOT yellow. Each component's active-state color matches its reference file — no inferred system-level color rule.
- cva on TabsList and TabsTrigger only. Tabs (Root) is layout-only; TabsContent has minimal inline focus-ring styling. cva pulls weight only where state-conditional behavior earns it.
- Architectural pattern carried from Checkbox: border *width* (`border-b-[2.5px]`) in base (variant-agnostic), border *color* (`border-b-transparent` → `data-[state=active]:border-b-white`) in variant (state-conditional).
- Three arbitrary geometry values per spec: `text-[13px]`, `pt-[9px] px-[14px] pb-[10px]`, `border-b-[2.5px]`. One token-aligned value: `px-3` for TabsList padding (12px matches `--spacing-3` exactly — token preferred when value lands on scale).
- Spec-silent additions for a11y: focus ring (yellow, matching Button/Checkbox/Input/TabsContent — consistent keyboard-nav indicator across the library), explicit `disabled:opacity-50 disabled:cursor-not-allowed`.
- TabsList is surface-agnostic (no bg in component); caller wraps in whatever surface fits the screen layout. Sandbox demo uses temporary `bg-[#4A9468]` (matches deprecated `--green-header` reference value) with disclosing caption — Phase 5 picks production surface.
- Reclassified `.screen-tab` (24px hardcoded radius in `ui_kits/mobile/index.html:24-26`) — investigation revealed it's preview-viewer chrome (the iPhone screen-switcher at the top of the preview HTML page), NOT a brand component. Removed from the deferred Phase 4 follow-up bucket entirely. The remaining bucket: `.jungle-cta`, `.progress-card` / deprecated `--green-card`, and `components-buttons.html:71` `#1a1a1a` text color sync.
- Source-of-truth hierarchy now explicit going forward: `_design-system-reference/preview/` files are authoritative; UI-kit (`ui_kits/mobile/`) is implementation reference; Screens.jsx is behavioral context; brand-faithful PNG renders (`assets/screens/*.png`) resolve visual ambiguity. When sources conflict, preview wins; absent a preview file, UI-kit + screenshot evidence is the next source.
- Added Tabs section to `/components` sandbox: working 3-tab switcher (Calendar / To-do-list / Countdown matching reference, default active = `todolist`) plus a separate disabled-tab demo. Real Radix-driven switching, no static frozen-state demos (the working tabs are keyboard-navigable; live demo proves all states).

### Phase 4b: Icon component(s) (primitive #6 of 7)

- Created `components/ui/icons.tsx` with 9 typed per-icon exports (`HomeIcon`, `EventsIcon`, `ProgressIcon`, `ProfileIcon`, `CalendarIcon`, `TodoIcon`, `TrashIcon`, `AddIcon`, `CountdownIcon`) plus a private `Svg` helper that handles a11y branching, slot attributes, and className merge.
- API shape: per-icon components (not generic-with-name lookup) for tree-shaking, TypeScript autocomplete, and ergonomic downstream usage. Matches lucide-react / heroicons / react-icons convention.
- Source-of-truth: 8 icons from `_design-system-reference/preview/brand-iconography.html`, plus `countdown` from `_design-system-reference/preview/components-fab.html` (cross-preview discrepancy — `brand-iconography.html` should sync to include countdown; added to deferred Phase 4 follow-up bucket).
- All paths/coords/dimensions/stroke widths/linecap behavior copied verbatim from references. `home` is fill-only (currentColor); the other 8 are stroke-only with per-icon stroke widths (1.6 / 1.8 / 2 / 2.5) and per-icon round-cap usage. No normalization.
- `currentColor` for stroke and fill — caller controls hue via parent `text-*` class. The hardcoded color overrides in `components-fab.html` (`stroke="#fff"`) and `components-bottom-nav.html` (`stroke="#3B7A57"`) are caller-context choices that Phase 5 BottomNav/FAB primitives will set via parent text color, not baked into the brand icon.
- Sizing: native dimensions default per source; caller overrides via Tailwind sizing classes (no `size` prop). Anti-proliferation — Tailwind's `size-4` / `size-5` / `size-6` etc. cover all needs.
- A11y: `aria-hidden="true"` by default (decorative). Caller can pass `aria-label="..."` to switch to `role="img"` + label (standalone-meaningful). Branching handled in shared `Svg` helper via inline ternary spread with `as const` type narrowing.
- `data-slot="icon"` + `data-icon={name}` on every output for testability/styling hooks.
- Added Icons section to `/components` sandbox: full 9-icon grid (native dimensions), size-variant demo (`size-4` / `size-5` / `size-6` / `size-8` on `HomeIcon`), color-variant demo (`text-white` / `text-yellow` / `text-moss` / `text-sky` proving `currentColor` inheritance).
- Existing inline SVGs (Button sandbox arrows / Plus / Checkmark, Input sandbox magnifying glass, Checkbox internal checkmark) are NOT in the brand icon set per `brand-iconography.html`; refactor deferred to Phase 6 polish if any are later elevated to brand status.
- Updated deferred Phase 4 follow-up bucket: `.jungle-cta` radius, `.progress-card` / deprecated `--green-card`, `components-buttons.html:71` `#1a1a1a` text color sync, and `brand-iconography.html` missing countdown.

### Phase 4b: BottomNav component (primitive #7 of 7 — final Phase 4b primitive)

- Created `components/ui/bottom-nav.tsx` with 3 component exports (BottomNav / BottomNavItem / BottomNavFab) following established compound pattern (matches Tabs).
- **Scope decision**: Static FAB only (Option A). The radial submenu with animation & state management deferred to Phase 6 polish. The static FAB is the base state rendered on all three app screens (Home, To-Do, Lock) and is complete and functional in Phase 4b.
- **BottomNav** (container): `<nav>` semantic landmark (implicit `role="navigation"`, no explicit role), surface-agnostic layout (no background color — primitive), flex row with `items-end justify-around`, 82px height, 10px horizontal padding, 14px bottom padding per spec.
- **BottomNavItem**: button-based nav item (5 total: Home / Events / Progress / Profile). Takes `icon` (React node), `label` (string), `value` (string), and click handler. Compares `value` against parent's `activeItem` prop; renders `aria-current="page"` when active. States: inactive `text-white/65`, active `text-yellow` (brand `--color-yellow`), hover opacity lift, active `scale-95`, focus `outline-yellow 2/2px` (matches Button/Checkbox/Tabs pattern). Wraps icon in 26px square container for consistent spacing.
- **BottomNavFab**: icon-only button (Add) lifted above the bar via `-mt-[30px]` negative margin. Yellow background with shadow, scale-down press feedback (`active:scale-95`), focus ring outlined in yellow. Wrapper div contains both FAB button and label below (Label below matching the reference layout). `aria-label="Add"` (icon-only button).
- **Active state mechanics**: Prop-driven (`<BottomNav activeItem="home">`). Phase 5 screens will layer `usePathname()` routing logic or wrap BottomNav in a higher-order component for production integration. Sandbox demonstrates prop-driven state with `useState` for testing each item's active styling.
- **Icon integration**: Icons passed as React nodes via `icon` prop. No icon imports in the primitive; Phase 5 screens choose which icons to pass. Sandbox uses all 5 nav icons (HomeIcon, EventsIcon, ProgressIcon, ProfileIcon, AddIcon).
- **Layout positioning**: Layout-flow by default (caller controls `position` via className). Sandbox wraps BottomNav in a fixed container to demo the final visual; this keeps the primitive flexible for Phase 5 integration.
- **Surface color**: BottomNav primitive is surface-agnostic (no `bg-[#4A9468]`). Sandbox wraps it in `bg-[#4A9468]` (deprecated `--green-header` temporary reference value) with disclosure caption — Phase 5 screen layout picks the production surface.
- **Focus ring collision note**: The FAB's `-mt-[30px]` lift extends its focus outline above the BottomNav boundary, which may visually collide with screen content. Acceptable for primitive; Phase 6 polish can verify in real screen contexts and adjust `outline-offset` if needed (documented in component comment).
- **Interaction**: Each item and the FAB accept `onClick` handlers. FAB has temporary `console.log` on click (Phase 6 will wire the radial submenu). Items' clicks are wired to `setActiveItem` state in the sandbox to demo active-state switching.
- **A11y**: `aria-current="page"` on active nav item (Radix-free pattern), `aria-label="Add"` on FAB (icon-only button), semantic `<nav>` landmark (no explicit role attribute). Focus ring follows Button/Checkbox/Tabs convention (`outline-yellow`).
- **Variant taxonomy**: Single variant on each component (BottomNav / BottomNavItem / BottomNavFab). No parametric variants — the active state is driven by the parent's `activeItem` prop, not a variant.
- Added BottomNav section to `/components` sandbox: working bottom-nav bar with all 5 items + FAB, live item-switching via click (useState-driven `activeItem` state), and FAB click console logging. Disclosure captions explain surface-agnostic primitive pattern and Phase 5 integration.
- **Phase 4b complete**: All 7 primitives built (Button → Card → Input → Checkbox → Tabs → Icons → BottomNav). Entire foundation primitive layer ready for Phase 5 screen integration.

## 2026-05-11

### Phase 5a: App shell & Home screen

- **File 1: PhoneFrame component** (`components/phone-frame.tsx`) — Responsive iPhone frame with single-tree architecture. Mobile (<md): full-height frameless container; Desktop (≥md): fixed 414×868 dimensions with bezeled frame, dynamic island (120×37px, top 12px, centered), and nested screen viewport with glassmorphism affordance. CSS variables in globals.css for all dimensions + shadow token. Responsive classes prevent children duplication. Applied Tailwind v4 arbitrary values for precise geometry (bezel 12px symmetric, outer radius 52px, inner radius 40px, island radius 20px).
- **File 2: App shell layout** (`app/(app)/layout.tsx`) — Shared route-group layout for Home and To-Do screens. Renders StatusBar + AppHeader (stubs with height contracts: 36px and 54px respectively) + main route content + BottomNav, wrapped in PhoneFrame with flex column layout. "use client" directive (usePathname + useRouter for navigation). PATH_TO_ACTIVE_ITEM lookup table maps routes to BottomNav active items. All five stub screens (add/events/profile/progress/todo) created as files in app/(app)/ subdirectories.
- **File 3: AppHeader component** (`components/app-header.tsx`) — Composite header bar (not a primitive) with logo (30×30 circle, white "ff" text, Niramit bold 12px), wordmark ("focusforest", Niramit 18px), and optional context menu dots (⋮, aria-hidden). Surface-agnostic (no background in component). Named export for consistency with Phase 4b. <header role="banner"> wrapper (explicit role required inside nested layouts).
- **File 4: StatusBar component** (`components/ui/status-bar.tsx`) — Production-scale status bar (h-[50px], time 17px, 20px padding matching AppHeader). Three inline SVGs (signal bars, wifi waves, battery) for OS chrome simulation. Static "9:41" time (Phase 6 will wire real time). aria-hidden="true" on root (zero semantic value). Type signature via React.HTMLAttributes avoids empty interface ESLint warning.
- **File 5: Home screen** (`app/(app)/page.tsx`) — Welcome hero, progress label, and glass card containing level copy (split across <br />), jungle scene (h-[220px]), and CTA button (positioned absolute). Typography uses canonical references: "Welcome!" (<h1>, font-display text-h1), "Your progress" (font-display text-h3 opacity-95), "Good job! / You reached level 5" (font-display font-semibold text-h3 in Card). Flex layout with px-6 py-8 gaps, content flex-1 overflow-y-auto.
- **File 5b: JungleIllustration component** (`components/jungle-illustration.tsx`) — SVG ported from reference (viewBox="0 0 357 268", preserveAspectRatio="xMidYMax slice"). Includes sky gradient, ground, background trees (0.75 opacity), three foreground trees, toucan, monkey, and frog with animated eye groups (animation logic deferred to Phase 6). aria-hidden="true" on root (decorative artwork). w-full h-full sizing for container fill.
- **Deleted**: `app/page.tsx` (Phase 3 verification page). Route group `app/(app)/` now serves the root `/` without adding a segment, making the old root page obsolete.
- **Updated**: `app/globals.css` with PhoneFrame CSS variables (--phone-frame-width: 414px, --phone-frame-height: 868px, --phone-frame-bezel: 12px, --phone-frame-outer-radius: 52px, --phone-frame-inner-radius: 40px, --phone-frame-island-width: 120px, --phone-frame-island-height: 37px, --phone-frame-island-top: 12px, --phone-frame-island-radius: 20px) and shadow token (--shadow-device: 0 13px 38px rgba(0,0,0,0.18), 0 3px 7px rgba(0,0,0,0.1), scaled 1.6× from reference).
- **Updated**: `app/components/page.tsx` (component sandbox) with BottomNav and PhoneFrame demo sections for developer reference; no behavioral changes to existing sandboxes.
- **Phase 5a complete**: Functional app shell with status bar, header, and home screen rendered in responsive PhoneFrame. Ready for browser verification on Vercel before proceeding to File 6 (To-Do screen).

### Phase 6: Jungle animation

- **SVG body swap** (`components/jungle-illustration.tsx`) — Full SVG content replaced with v1 source (richer geometry, better colors, improved depth). v2 component shell preserved (TypeScript, named export, aria-hidden, preserveAspectRatio). Four animation class hooks restored on tree groups (t1/t2/t3) and bird group (bird-group); two animation class hooks on frog-eye groups. Monkey remains static (no animation). Chronology note: Phase 5a initial creation of JungleIllustration used `id` attributes (t1/t2/t3, left-eye/right-eye) as placeholders; this swap corrects to v1's `class` attribute convention for animation binding.
- **Keyframes & class rules** (`app/globals.css`) — Appended new animation section after glassmorphism :root block (lines 299+). Four @keyframes (sway, sway2, birdBob, frogBlink) ported exactly from v1; five class-binding rules (.t1 / .t2 / .t3 / .bird-group / .frog-eye) with v1 durations, delays, and easing curves unchanged. Accessibility: @media (prefers-reduced-motion: reduce) disables all five animations on user preference.
- **Deferred Phase 6 follow-ups** — Animations for other screens tracked but not implemented (sequence TBD): FAB submenu expansion, todo-row delete slide, expand/collapse caret rotation, group-children max-height transition (v1 lines 610–615), lock-screen notification dismiss, lock-screen action-row press feedback (v1 line 752). These will be phased in as their respective screens are built.
- **Refinement from live URL feedback**: removed sky-highlight ellipse (`fill=#FFFDE7 opacity=0.07` at SVG end) from JungleIllustration. v1's atmospheric flourish read as a faint floating cloud at v2's production scale.
- **Phase 6 complete**: Jungle scene now animates on Home screen. Trees sway, bird bobs, frog blinks. Ready for browser re-verification and Phase 5b (To-Do screen with tab switching) or Phase 7 (additional animations for lock screen + FAB submenu).

### Phase 5a file 5: Home screen Card composition fix (post-ship correction)

- **Drift found**: `app/(app)/page.tsx` Card className had `flex flex-col items-center gap-4 relative` added during initial Phase 5a file fill-in (commit cf36d393) without explicit approval — original approval flow specified only `className="p-5"`. Fix: dropped drifted utilities (Option B clean drop) and replaced with explicit per-section spacing.
- **Composition correction**: Removed nested `h-[220px]` div that was cropping the toucan (visible at SVG y=78 of 268 viewBox). Replaced with `aspect-[357/268]` wrapper to match the SVG's native viewBox proportions, preserving the v1 `.progress-card` pattern. Card itself now has `p-0 overflow-hidden` for SVG corner clipping at the rounded card edges.
- **New section structure**: Text section ("Good job! / You reached level 5") now lives in its own `<div className="w-full px-5 pt-5 pb-4 text-center">` with intentional 16px gap to the jungle (replaces the implicit `gap-4`). Jungle wrapper changed from `h-[220px]` to `aspect-[357/268]` (renders at native proportions ~133% wider than tall). The Button's `bottom-[14px]` anchor reference changed from the 220px-tall fixed div to the taller aspect-ratio wrapper (visual position relative to ground line may shift slightly — tune post-deploy if needed).

### Drift corrections (Phase 5a post-ship discoveries)

A comprehensive audit of all Phase 4b primitives and Phase 5a files revealed three drift items that hadn't been previously caught, plus a clear root cause spanning all the drifts discovered across the project to date. This entry documents the new fixes and acknowledges the broader pattern.

**New drift fixes (this cycle):**

- **globals.css cleanup** (commit dd91c55) — Removed leftover `--phone-frame-inner-width: 390px` and `--phone-frame-inner-height: 844px` tokens (Phase 5a File 1 Bug 2 fix specified their removal; the spec didn't apply on disk). Added missing `--phone-frame-island-radius: 20px` token referenced by `phone-frame.tsx:33` (latent square-island visual bug on desktop frame view — now renders as the intended rounded pill). `--shadow-device` value left unchanged — file value (`0 13px 38px rgba(0,0,0,0.18), 0 3px 10px rgba(0,0,0,0.10), 0 0 0 1px #2a2a2a`) is the correct approved version; the original Phase 5a File 1 entry's description was inaccurate (named only two shadows with wrong values).
- **StatusBar real implementation** (commit f3f0e64) — Replaced 3-line height-only stub (`h-[36px]`, wrong by 14px vs. spec) with full Phase 5a File 4 production-scale composite. `h-[50px]`, asymmetric padding `pt-[14px] px-5 pb-0`, `flex items-center justify-between`, `aria-hidden="true"` root, "9:41" in `font-body font-semibold text-[17px] tracking-[0.01em]`, three inline SVGs (signal/wifi/battery) with paths ported verbatim from `_design-system-reference/ui_kits/mobile/StatusBar.jsx`. StatusBar sandbox section restored in `/components` page on bg-primary panel with island-contract explanation.
- **AppHeader real implementation** (commit 4f36163) — Replaced 3-line height-only stub (no logo, no wordmark, no `showDots` prop) with full Phase 5a File 3 composite. `<header role="banner">` wrapper (explicit role required inside nested layouts since `<header>` only implicitly gets the banner role when it's a direct child of `<body>`). 30×30 logo disc with white "ff" in `font-display font-bold text-[12px] tracking-[-0.02em]`. Wordmark "focusforest" in `font-display font-normal text-[18px] text-white ml-[9px] tracking-[-0.2px]`. Conditional context-menu dots block (`{showDots && <>...</>}`) with `flex-1` spacer + ⋮ glyph at `text-white text-[22px]`. API: `{ showDots = false }: { showDots?: boolean }`. AppHeader sandbox section restored in `/components` page with default and showDots variants on bg-primary panel.
- **showDots routing wire** (commit 43f1479) — Added `PATH_TO_SHOWS_DOTS: Record<string, boolean>` lookup in `app/(app)/layout.tsx` alongside existing `PATH_TO_ACTIVE_ITEM`. Only `/todo → true`; all other current routes default to `false`. Resolved via `const showDots = PATH_TO_SHOWS_DOTS[pathname] ?? false` (mirrors the activeItem pattern) and passed to `<AppHeader showDots={showDots} />`. Defensive `?? false` fallback protects against future stub routes not yet enumerated.

**Design call: logo bg = `bg-deep-forest` (Phase 5a interim).**

Cross-checking the AppHeader rebuild revealed the approved File 3 spec called for `bg-primary` on the logo — but v2 collapsed v1's two-tone brand scheme (lighter header chrome `#4A9468` + darker logo `#3B7A57`) into a single `--color-primary: #3B7A57`. So `bg-primary` on the logo against a `bg-primary` page surface would render invisible. Substituted `bg-deep-forest` (#094934, existing brand token) as a Phase 5a interim — visually darker than the brand-faithful rendering in `screen-home.png` (which shows a more modest contrast estimated around `#2E6244`), but uses an existing token rather than expanding the palette during a drift cycle. Phase 5d's planned glass surfaces will give the AppHeader its own lighter translucent layer, at which point the logo can return to `bg-primary` against that surface to match v1's two-tone pattern. Decision documented inline as a comment block above the logo div in `components/app-header.tsx`.

**Root cause: commit cf36d39 (May 11, 2026).**

All four file-level drifts caught across the project to date traced back to a single commit — `cf36d39`, the post-summary file fill-in event when missing Phase 5a files were regenerated to bridge the gap from a conversation summary. The bulk regeneration introduced seven undocumented inconsistencies in one commit:

File-level (four):
- `components/jungle-illustration.tsx`: `id` attributes on tree groups (t1/t2/t3) and frog-eye groups where the approved Phase 5a File 5 spec specified no attributes. Corrected during Phase 6 animation port (commit cf1c070) which replaced the entire SVG body with v1's class-attribute version.
- `app/(app)/page.tsx`: Card className extras (`flex flex-col items-center gap-4 relative`) where the approved Phase 5a File 5 spec specified only `p-5`. Corrected during the Home Card composition fix (commit ff2470c).
- `components/app-header.tsx`: 3-line height-only stub instead of the Phase 5a File 3 composite spec. Corrected in this audit (commit 4f36163).
- `components/ui/status-bar.tsx`: 3-line height-only stub at `h-[36px]` instead of the Phase 5a File 4 production-scale spec at `h-[50px]`. Corrected in this audit (commit f3f0e64).

Token-level (three, all in `app/globals.css`):
- Leftover `--phone-frame-inner-width: 390px` and `--phone-frame-inner-height: 844px` tokens that Phase 5a File 1 Bug 2 fix was supposed to remove. Corrected in this audit (commit dd91c55).
- Missing `--phone-frame-island-radius: 20px` token (referenced by phone-frame.tsx but undefined). Corrected in this audit (commit dd91c55).
- `--shadow-device` CHANGELOG description inaccuracy (file value was correct; description wasn't). Acknowledged in this audit.

**Workflow change.**

Read-back-before-commit is now mandatory for every code-modifying diff: output diff text → wait for approval → write file → read file back from disk → paste content for visual verification → wait for "on-disk verified, commit" → commit + push. This adds a checkpoint between "wrote the file" and "committed the file" — the gap where drift had been entering — for ~30 seconds extra per file. Effective starting with the first correction in this audit cycle (Diff 1, commit dd91c55).

### Phase 5a chrome polish: glass surface adoption

User feedback after viewing the live URL noted that the AppHeader and BottomNav appeared as a single flat green tone with the body — no visual hierarchy distinguishing the chrome bars from the content canvas. Investigation revealed that `_design-system-reference/preview/colors-product-greens.html` explicitly deprecates v1's `--green-header` (#4A9468) in favor of three glass surface tokens that have been defined in v2's `:root` block since Phase 3, but only the Card primitive was consuming them. The chrome polish cycle wires AppHeader and BottomNav to consume their respective surface tokens, restoring the canonical translucent-glass-over-bg-primary visual hierarchy.

The design system spec is explicit on this: "Glassmorphism is a layered technique, not a color. Documenting it as a flat hex causes flat green surfaces during developer handoff and breaks the visual hierarchy of the original design."

A second round of feedback after the initial adoption surfaced two additional issues: a sharp dark-to-lighter seam between StatusBar (flat) and AppHeader (glass), and the BottomNav "Add" label sitting visibly lower than the other four labels. Both were addressed within the same cycle.

**Five steps:**

- **Step 1: Sandbox cleanup** (commit 258405e) — Removed three `bg-[#4A9468]` placeholders in `app/components/page.tsx` (BottomNav sandbox, Tabs sandbox #1, Tabs sandbox #2 disabled-tab demo) and rewrote two captions that referenced the deprecated `--green-header` token and "Phase 5 screen layout will pick the production surface" deferral language. Replaced with `bg-primary` and accurate descriptions. Eliminates the last hardcoded greens from the codebase outside `jungle-illustration.tsx` (illustration palette — different category, art assets rather than brand UI tokens).
- **Step 2: AppHeader glass surface consumption** (commit e49340f) — Wired `--surface-header-nav-bg/blur/border` tokens to `components/app-header.tsx` via Tailwind arbitrary-property classes (`[background:var(--surface-header-nav-bg)]`, `[backdrop-filter:var(--surface-header-nav-blur)]`, `[-webkit-backdrop-filter:var(--surface-header-nav-blur)]`, `[border-bottom:var(--surface-header-nav-border)]`). Mirrors Card's `--surface-card-*` consumption pattern from Phase 4b. Logo reverted from `bg-deep-forest` (the audit-cycle Phase 5a interim) back to `bg-primary` — the brand-canonical color reads correctly against the now-lighter glass band. This step was later superseded by Step 4 (wrapper relocation) which moved the glass from AppHeader to a wrapper, but the architectural pattern of consuming surface tokens remains valid.
- **Step 3: BottomNav glass surface consumption** (de-facto landed in commit c005b94 alongside Step 5; see note below) — Same architectural move adapted to BottomNav with two key differences: glass classes added to the `bottomNavVariants` cva base array (rather than appended to a direct className string, since BottomNav uses cva for its container styling), and `border-top` instead of `border-bottom` (BottomNav sits at the bottom of the frame so its separator rule is on top, dividing it from content above). FAB lift mechanic, item active state logic, FAB aria-label, all six exports — unchanged.

  **Note on Step 3's commit attribution:** The Step 3 BottomNav glass content was approved, written, and read-back-verified per the workflow, but the git commit step was missed — the approval for commit wasn't relayed before the next diff (Step 5 FAB alignment) was applied. When Step 5's `git add components/ui/bottom-nav.tsx` ran, it picked up both Step 3's uncommitted glass content AND the new `pb-2` line. They landed together in commit c005b94 with a message describing only Step 5. Caught during Step 4's pre-CHANGELOG sanity check via `git show --stat` showing `+10/-1` for what should have been a single-word change. The work is correct on disk; the bundling is a commit-message attribution gap, documented here for traceability.
- **Step 4: Chrome wrapper refactor** (commit 9fa4c3d) — User feedback after deploy: StatusBar (flat `bg-primary`) above AppHeader (glass) created a visible dark-to-lighter seam, unlike the design system reference which shows a continuous glass band spanning both. Investigation found no `--surface-status-bar-*` tokens exist (StatusBar was intended transparent per the canonical spec, simulating OS chrome over the underlying app surface). Chose the wrapper approach — `app/(app)/layout.tsx` now wraps StatusBar + AppHeader in a single chrome surface div consuming `--surface-header-nav-*` tokens, both inner components transparent. Single continuous 18%→8% gradient spans all 104px of chrome (50px StatusBar + 54px AppHeader). `components/app-header.tsx` correspondingly removed its glass arbitrary-property classes (now an indirect consumer through the wrapper) and updated its file-header comment from "Glass surface:" to "Chrome surface:" explaining the wrapper-level relocation.
- **Step 5: BottomNav FAB label alignment** (commit c005b94, primary subject of the commit message) — Same feedback round noticed the "Add" label below the FAB sat visibly lower than the other four labels. Root cause: `BottomNavItem` button has `py-2` (8px bottom padding via `bottomNavItemVariants`); `BottomNavFab` wrapper had no padding. Under `items-end` parent layout, the 8px discrepancy was the visible misalignment. Fix: added `pb-2` to the `BottomNavFab` wrapper div. Phase 4b primitive bug — was present before chrome polish but became visible once the glass surface drew attention to the chrome's geometry. Reference `ui_kits/mobile/index.html` had the same architectural asymmetry but with `padding-bottom: 2px` vs `0px` (imperceptible); v2 amplified to `py-2` (8px) vs `0px` (visible).

**Architectural notes — three glass surface consumption patterns:**

- **Card** (Phase 4b): cva-based, glass classes in a `glass` variant. Used when the primitive has multiple variants and the glass is one of them.
- **BottomNav** (this cycle): cva-based, glass classes in the base array. Used when the primitive has only one variant family and the glass is base behavior, not opt-in.
- **Wrapper** (this cycle, Step 4): glass classes on a layout-level div with inner elements transparent. Used for chrome bands where multiple components share a single continuous surface (StatusBar + AppHeader as a unified top chrome band).

AppHeader briefly used "direct className with glass classes" as an interim during Step 2, but the wrapper relocation in Step 4 made AppHeader transparent again. The choice between "primitive consumes glass directly" vs. "wrapper provides glass" depends on whether the primitive is independently surfaced (Card stands alone on bg-primary) or part of a multi-component chrome band (StatusBar + AppHeader share a single surface).

**Relationship to earlier drift correction:**

The drift-correction entry's `bg-deep-forest` Phase 5a interim (committed at 4f36163, "Drift correction (Phase 5a File 3): AppHeader real implementation") assumed Phase 5d glass surfaces were future work — the original entry literally stated "Phase 5d's planned glass surfaces will give the AppHeader its own lighter translucent layer." The chrome polish investigation revealed Phase 5d infrastructure already existed (the three surface tokens were defined in Phase 3) — only the consumption was missing. The forward-looking statement in that earlier entry was fulfilled within days by this cycle.

**Workflow notes:**

All five diffs followed the read-back-before-commit workflow established in the prior audit cycle. The investigation phase before Step 1 — where the design system was audited rather than immediately adding a new lighter-green token to bridge the visual gap — was the critical inflection point. Without that audit, the cycle would have added a redundant flat token (likely `--color-primary-light` or similar) that would require removal at actual Phase 5d when the glass infrastructure was discovered to already exist.

The Step 3 commit bundling (documented in Step 3 above) revealed a gap in the workflow defense: read-back verifies on-disk content matches the approved diff, but doesn't verify that `git commit` actually fires before the next diff's `git add` runs. **Going forward, the workflow adds a step**: after each commit, the commit hash + `git log --oneline -1` confirmation is reported in chat; if the next diff's review starts without that confirmation showing the expected hash, the reviewer pauses and verifies.

The two additional fixes (chrome wrapper, FAB label) demonstrate the value of post-deploy visual verification: both issues were invisible at the diff-review stage and only emerged after looking at the live URL. The workflow tolerates this — corrections within the same cycle are tracked as part of the cycle rather than as separate drift events.

### Phase 5a file 6: To-Do screen

The To-Do screen at `/todo` is the second of Phase 5a's three core screens (Home → To-Do → Lock), replacing the 7-line stub created during File 2 (route group scaffolding). The screen composes a tab row (Calendar / To-do-list / Countdown), a centered "Grocery shopping" title, a search input with a magnifying-glass icon overlay, and a filtered todo list with expandable groups and per-row toggle/delete actions.

The page reuses the AppHeader showDots routing wired during the drift-correction cycle — the `/todo` route automatically renders the context-menu dots via the layout's `PATH_TO_SHOWS_DOTS` lookup, so `app/(app)/layout.tsx` is unchanged. Screen behavior is a verbatim port from `_design-system-reference/ui_kits/mobile/Screens.jsx` TodoScreen: same data shape, same handlers, same filter logic.

Three commits land the file (workflow: ScreenTabs primitive → TodoRow primitive → page composition):

- **3269aa5: `components/screen-tabs.tsx`** — configurable tab-row composite wrapping the Tabs primitive. API: `tabs: Array<{value, label}>`, `defaultValue: string`, optional `onValueChange`. Reusable for Phase 5b's Events screen (which also uses tabs). Renders TabsList + TabsTriggers only — no TabsContent panels, since screens compose their content below the row. All a11y (role tablist/tab, aria-selected, keyboard arrow nav) inherited from the Tabs primitive. White underline on active tab per the design system reference.
- **f3a14cc: `components/todo-row.tsx`** — single-row presentational composite. Props: `id`, `text`, `done`, optional `isSubRow`/`isGroup`/`expanded`/`childrenGroupId`, three callbacks (`onToggleDone`, `onRemove`, optional `onToggleExpand`). Renders drag handle (⠿ U+283F, aria-hidden — DnD not wired in Phase 5a), Checkbox primitive, text (line-through + 45% opacity when done), optional expand arrow on groups (∨ with static `-rotate-90` when collapsed; smooth transition is a Phase 6 follow-up), trash icon button (aria-labeled with item text). `isSubRow` indents 38px to align children with the parent's text column.
- **c6d180e: `app/(app)/todo/page.tsx`** — full implementation replacing the stub. Three useState hooks (`items`, `expanded` seeded `{ pancakes: true }`, `query`), three handlers (toggleDone / remove / toggleExpand), inline `match(text)` filter matching Screens.jsx exactly. Group iteration renders the parent TodoRow + a conditionally-rendered `<div id={groupId}>` containing the filtered children. The `groupId` (`todo-children-${parent.id}`) is referenced by the parent's `aria-controls` for screen-reader navigation. `INITIAL_TODOS` seeded verbatim from Screens.jsx (7 items including "Needed for Pancakes" with strawberries / bananas / flour children, expanded by default).

**Architectural decisions:**

- **ScreenTabs configurable from the start** (vs. hardcoded for To-Do) — Phase 5b's Events screen also uses tab navigation, so building configurable avoids a refactor 1-2 weeks later. Net cost lower than hardcoding now.
- **TodoRow flat with `isSubRow` prop** (vs. recursive component calling itself) — data model has depth-1 ceiling (parent + children, no grandchildren per Screens.jsx). Flat keeps iteration logic visible at the page level; recursive would add API complexity for a problem we don't have.
- **State lives entirely in the page** (no Context yet) — Phase 5a only has one screen consuming todo state. Phase 5d may introduce a `TodoContext` if multiple screens need shared access.
- **Conditional render for expand/collapse** (vs. CSS max-height transition) — matches Phase 5a's no-animation rule. Children removed from DOM when collapsed; Phase 6 swaps to v1's smooth `max-height: 0` transition.
- **`px-4` horizontal consistency across title / search / list** — v1 used 14px on list and 16px on title/search; v2 unifies at 16px for cleaner vertical alignment in the token system. 2px deviation accepted.
- **Search icon inline SVG, not a brand primitive** — magnifying glass is in the Phase 4b deferred follow-up bucket (not in `brand-iconography.html`'s 9-icon set). Matches the existing convention of inline SVGs for non-brand decorative icons. Elevating to a `SearchIcon` brand primitive is a Phase 6 polish call.
- **Tab state internal to ScreenTabs, no `onValueChange` from the page** — tabs are decorative in Phase 5a (Calendar/Countdown views don't exist yet). ScreenTabs handles its own state via `defaultValue="todolist"`. Phase 5b's Events screen will likely wire `onValueChange` to parent-controlled tab state.

**Token discipline notes (Tailwind v4 @theme + arbitrary value usage):**

- **screen-tabs.tsx**: zero classNames in the file. Pure compositional wrapper — all styling inherited from the Tabs primitive.
- **todo-row.tsx**: 5 justified arbitrary values (`pl-[38px]` sub-row indent, `text-[13.5px]` row text size, `text-[15px]` expand arrow size, `tracking-[-1px]` drag handle, `leading-[1.3]` row text line-height) — each surveyed against the @theme block and used only where no close token match exists. Tokens applied where possible: `text-body` for the drag handle (14px brand token), `p-0.5` for trash button padding (Tailwind default 2px), `px-1.5 py-2.5 gap-2` for row container. `opacity-45` uses Tailwind v4's native fine-grained opacity scale.
- **page.tsx**: zero arbitrary values. Full Tailwind default + brand token usage throughout (`px-4`, `py-3`, `pb-2`, `pb-5`, `pr-9`, `right-7`, `top-1/2`, `-translate-y-1/2`, `text-h3`, `w-full`).

**Phase 6 follow-ups added** (the existing Phase 6 jungle animation entry already tracks the first three — listed here so the running list stays consolidated):

- Row delete slide animation (v1's `@keyframes rowDelete` lines 528–531) — existing
- Expand/collapse caret rotation transition (smooth rotate-0 ↔ -rotate-90) — existing
- Group-children max-height transition (smooth open/collapse vs. current conditional render) — existing
- **NEW: trash button touch target** (`components/todo-row.tsx`): ~18×20px (14×16 TrashIcon + 2px padding each side). Below WCAG 2.5.8 minimum (24×24). Faithful to v1 spec but worth tracking. Phase 6 a11y pass should enlarge the touch target via button padding without changing the icon's visual dimensions.
- **NEW: `aria-controls` to non-rendered element when group collapsed** (`app/(app)/todo/page.tsx`): the parent expand button's `aria-controls={groupId}` references the children container's id, but that container is removed from DOM when collapsed (conditional render). Common React pattern, degrades gracefully, technically ARIA-inconsistent. Phase 6 a11y polish: either keep the container always-rendered with `hidden`/`aria-hidden` toggling instead of conditional rendering, or strip `aria-controls` from the parent button when collapsed.

**Closeout.** File 6 of Phase 5a complete. The `/todo` route is production-quality for the portfolio demo (interactive list, search filter, expand/collapse groups, toggle and delete actions, full keyboard a11y inherited from primitives). Remaining Phase 5a work: Lock screen, desktop frame integration, and closeout entry.

### Phase 5a file 7: Lock screen — audit, revert, and canonical-DS rebuild

The original File 7 lock screen (commits d53a6cb, cdca127, 1f31107 — all reverted) shipped with ~45 visual discrepancies against the canonical Design System source `_design-system-reference/preview/components-notification.html`. Root cause: the build referenced `screenlock.png` (from the now-deleted `uploads/` folder, OLD design) and `Screens.jsx` LockScreen (v1 implementation, not source-of-truth) instead of the canonical DS HTML.

**Audit categories (Phase A read-only investigation):**

- **Wrong wallpaper**: flat green `#2E6848` ↔ DS spec is a dawn gradient (peach → lavender → dusk blue), explicitly NOT a brand token per DS comment
- **Wrong fonts**: Niramit Display + Source Sans 3 ↔ DS spec is SF Pro system fonts (Pro Text + Pro Rounded)
- **Wrong date/clock order**: clock above date ↔ DS spec is date ABOVE clock per iOS convention
- **Wrong sizes**: 84px clock + 17px date ↔ DS spec is 96px clock + 22px date
- **Wrong notification material**: opaque white + Phase 4b shadow ↔ DS spec is translucent white + backdrop-blur(20px) + subtle shadow
- **Wrong action stack**: opaque sage green + dark text + variable height ↔ DS spec is translucent white + iOS blue text (#007AFF) + 57px fixed height
- **Extra elements not in DS spec**: dismiss × button, swipe hint text, picked-state highlight, useState for choice/dismissed
- **Wrong utility buttons**: light translucent + flex layout ↔ DS spec is dark translucent (rgba(0,0,0,0.25)) + absolute positioning at bottom:80px left:24px / right:24px
- **Wrong home indicator**: 128px wide at 28% white opacity, positioned via flex ↔ DS spec is 134px wide at 90% white opacity, absolute centered at bottom

**Remediation: six-commit cycle:**

- **7211173: Revert "Phase 5a file 7: Lock screen CHANGELOG entry (Diff 2 of 2)"** — removed the now-obsolete CHANGELOG entry documenting the wrong build.
- **0d68958: Revert "Phase 5a file 7: Lock screen page (Diff 1 of 2)"** — deleted the misaligned `app/lock/page.tsx`.
- **d62838d: Revert "Phase 5a file 7: add --color-lock-wallpaper token (Diff 0 of 2)"** — removed `--color-lock-wallpaper` from @theme. The wallpaper is OS-controlled per DS spec, not a brand token.
- **a89a4fa: Add Rules 7 and 8 to CLAUDE.md** — workflow rules to prevent recurrence. Rule 7 codifies the source-of-truth hierarchy (DS HTML authoritative; PNGs illustrative; Screens.jsx + v1-globals.css historical-only). Rule 8 requires DS HTML files be read in full BEFORE drafting any diagnostic or diff. Forward-pointer note added at the top of the existing "Design system source of truth" section so readers encounter the supersession alert before following the now-outdated priority list.
- **753a5a7: Add --font-system and --font-system-rounded tokens** to `app/globals.css`. System font fallback chains (Apple-first: -apple-system, BlinkMacSystemFont, "SF Pro Text" / "SF Pro Rounded", system-ui). Marked as NOT brand fonts via inline comment referencing components-notification.html. Tailwind v4 auto-generates `font-system` and `font-system-rounded` utilities. Used by the rebuilt lock page for OS-context chrome (status bar, clock, date, notification card, action stack).
- **69af3d6: Phase 5a file 7 rebuild: Lock screen page (canonical DS implementation)** — strict 1:1 transcription of components-notification.html. New `app/lock/page.tsx` + `app/lock/` directory.

**Architectural decisions (locked during Phase B):**

- **Strict DS compliance for action buttons** — real `<button>` elements (clickable, focusable) but no useState, no picked-state highlight, no choice tracking. The DS spec shows three buttons with no visible feedback; the rebuild matches exactly.
- **Inline status bar SVGs, not the brand StatusBar primitive** — the canonical DS status bar uses slightly different SVG proportions (signal 17×11 vs primitive 18×12; wifi 15×11 vs 16×12; battery has stroke-opacity 0.4 outer + filled inner + fill-opacity 0.4 nub vs primitive's all-solid). Strict DS compliance trumps primitive reuse for the lock route.
- **System fonts via new brand tokens** — `font-system` and `font-system-rounded` added to @theme. The lock screen exclusively uses these (no Niramit, no Source Sans 3) per DS spec.
- **Inline gradient wallpaper** — applied via React inline `style` prop on the wrapper div, with a code comment referencing components-notification.html and the OS-controlled rationale. No brand token added.

**Context adaptations (not DS deviations):**

- **`h-full` instead of `min-height: 560px`** — DS uses 560px on `.frame` because the preview HTML has no parent container; in v2 PhoneFrame provides the container, so `h-full` achieves the same fill-parent visual outcome. Documented in the file header comment.
- **Semantic upgrades over DS plain divs** — `<time dateTime="...">` wraps the clock and date for screen-reader a11y; `<article aria-labelledby>` + `<h2 id>` for the notification card. DS HTML uses plain `<div>` for these; v2 adds semantics without changing visuals.
- **`mb-[22px]` arbitrary for the clock's bottom margin** — Tailwind v4 doesn't generate a 22px-equivalent half-step margin utility (the default half-step scale stops at 3.5); arbitrary value used and verified to compile pre-commit.

**Workflow rules adopted (now in CLAUDE.md):**

- **Rule 7 — Design System source-of-truth hierarchy**: `_design-system-reference/preview/*.html` files are AUTHORITATIVE; PNGs are illustrative/historical; `Screens.jsx` and `v1-globals.css` are HISTORICAL v1 implementation references, NOT source of truth. When sources conflict, DS HTML always wins.
- **Rule 8 — Pre-build DS search**: Before drafting any diagnostic, plan, or diff for a new screen or component, run a DS search, identify every relevant `preview/*.html` file, and read each in full BEFORE drafting.

**Phase 6 follow-ups (NEW from this rebuild):**

- **Touch interaction polish on action buttons** — DS spec has no visible press feedback; Phase 6 may add subtle press-state visual (e.g., `bg-black/5` on `:active`) for UX clarity without breaking strict DS compliance.
- **StatusBar primitive divergence** — the canonical DS lock-screen status bar uses slightly different SVG proportions than the brand StatusBar primitive (documented above). Phase 6 polish could reconcile: either upgrade the brand primitive to match the canonical DS lock SB, or maintain divergence intentionally (app vs lock chrome distinct).

**What's NOT in the rebuild** (intentionally, per DS spec): the dismiss × button, the swipe hint text "swipe up to open", the picked-state highlight, the useState hooks for `choice` and `dismissed`, the brand `StatusBar` primitive reuse, the brand `Card` / `Button` primitives. None appear in components-notification.html.

**Closeout.** File 7 of Phase 5a now ships matching the canonical DS spec. Remaining Phase 5a work: File 8 (route refactor + unlock interaction + desktop frame) and File 9 (Phase 5a closeout entry).

## 2026-05-14

### Phase 5a closeout: route refactor, desktop frame, design system token additions

Phase 5a is now complete. The phase delivered nine files across three core mobile screens, the app shell, the design-system token additions to support a portfolio-grade desktop layer, and two workflow rules (Rule 7, Rule 8) added during the File 7 audit. This entry covers Files 8 and 9 in detail and consolidates the Phase 6 follow-up inventory and Phase 5b/5c roadmap that accumulated across the phase.

**Files built (1–9):**

- **File 1 — PhoneFrame** (`components/phone-frame.tsx`): responsive iPhone container, frameless on mobile and bezeled on desktop at the `md:` breakpoint.
- **File 2 — App shell layout** (`app/(app)/layout.tsx`): route-group layout composing StatusBar + AppHeader chrome band, main slot, and BottomNav, all wrapped in PhoneFrame.
- **File 3 — AppHeader** (`components/app-header.tsx`): logo + wordmark + optional context-menu dots. **Rebuilt during the audit cycle** after the post-summary fill-in (commit `cf36d39`) shipped a 3-line height-only stub instead of the approved File 3 composite.
- **File 4 — StatusBar** (`components/ui/status-bar.tsx`): production-scale status bar with inline signal/wifi/battery SVGs. **Rebuilt during the audit cycle** for the same root cause as File 3.
- **File 5 — Home screen** (`app/(app)/page.tsx`) + JungleIllustration (`components/jungle-illustration.tsx`): welcome hero, glass progress card, and animated jungle scene.
- **File 6 — To-Do screen** (`app/(app)/todo/page.tsx`) + ScreenTabs (`components/screen-tabs.tsx`) + TodoRow (`components/todo-row.tsx`): tabbed screen with search filter, expandable groups, per-row toggle/delete.
- **File 7 — Lock screen** (`app/lock/page.tsx`): canonical-DS lock screen with dawn-gradient wallpaper, OS-context system fonts, translucent notification card, action stack, utility buttons. **Rebuilt to canonical DS compliance** after the initial build was found to carry ~45 visual discrepancies against `_design-system-reference/preview/components-notification.html`. The rebuild prompted the introduction of Rule 7 (Design System source-of-truth hierarchy) and Rule 8 (Pre-build Design System search) to CLAUDE.md.
- **File 8 — Phase B**: route refactor + unlock pill + desktop frame layer. See Phase B narrative below.
- **File 9 — Closeout**: this entry plus CLAUDE.md updates (Rule 9, token references, Routing section).

**Phase B narrative — the routing pivot.**

Phase B was originally scoped as a three-part change: (1) move the Lock screen from `/lock` to `/` so the unlock interaction becomes the recruiter's entry experience; (2) wire the lock-screen home indicator pill as a Next.js `Link` so it actually navigates; (3) add a desktop frame layer with title and tagline above the iPhone mockup at the `md:` breakpoint. The first scope shipped (commits `b8b074b` through `eea9fe9`) and was verified locally and on Vercel.

Deployed sanity check told a different story. The unlock interaction proved non-intuitive: the most visually prominent CTAs on the lock screen — the three-button action stack ("I will do it later", "Start tracking", "I am done") — are presentational per the canonical Design System spec and produce no navigation. The actual entry affordance is the 134×5px home indicator pill at the bottom of the screen, which is by design the smallest visual element on the page. A recruiter landing on `/` would see three large buttons that look like calls-to-action, click one, see nothing happen, and have no obvious next step. The pill's role as the entry point is legible only after the user has already learned the iOS unlock gesture in another context — which is exactly the kind of out-of-band knowledge a portfolio landing page should not require.

The pivot reverted lock-as-entry to home-as-entry. The Home screen at `/` is now the recruiter's first impression: animated jungle scene, glass progress card, "Welcome!" hero, immediate visual interest. The Lock screen moved to `/lock` as a linkable standalone showcase — still 1:1 canonical-DS-compliant, still reachable from a portfolio case-study link, but no longer the entry path. The revert landed across five commits (`336217a` through `6db06ef`).

The pivot is the most useful part of the Phase 5a story for a future reader. The lesson is not "we built the wrong thing" — review approved the original scope and the implementation matched the brief. The lesson is that deployed sanity checks catch a class of failure that diff review and local browsing cannot: the gap between *what an interaction does* and *what an interaction looks like it does*, in the eyes of someone who hasn't read the spec. The workflow change that came out of File 7 (post-deploy visual verification as a mandatory checkpoint) paid for itself in File 8 within the same phase.

The desktop frame layer (Phase B's third scope) landed in commits `eea9fe9`, `21ca4a0`, and `1cc8840`. At the `md:` breakpoint and above, `app/layout.tsx` renders an outer chrome layer with the title "Focus Forest" and tagline "Your motivational calendar" above a centered iPhone mockup, all over a warm cream backdrop (`bg-cream`). Below `md:` the layout is unchanged — the phone fills the viewport edge-to-edge as before. The desktop frame is portfolio chrome only: a recruiter visiting the deployed URL on a laptop sees the framed mockup; a phone visitor sees the mobile-first app directly.

**Design system updates.**

- **New token `--color-cream` (#FDFBD4)** — warm cream, used exclusively as the desktop frame background at the `md:` breakpoint. Portfolio chrome only; not used inside the app. Generates `bg-cream`, `text-cream`, and `border-cream` utilities via Tailwind v4's `@theme` block.
- **Existing `--color-cream: #F1F9E7` renamed to `--color-mist`** — the prior name didn't fit the pale-green tone; `mist` is the brand-token name for soft highlights and illustrative fills used inside the app (jungle scene accents, soft surface tones). Generates `bg-mist`, `text-mist`, and `border-mist` utilities.
- **DS reference files updated** to match: `colors_and_type.css` (token rename in master CSS), `_design-system-reference/README.md` (60-30-10 prose now references Mist instead of Cream), `_design-system-reference/preview/colors-accent.html` (swatch label renamed and new "Portfolio chrome" section added documenting the warm cream), `_design-system-reference/preview/colors-ratio.html` (accent-breakdown label renamed). Landed atomically in commit `85dfaa7`.
- **Rule 9 added to CLAUDE.md** — local build verification before push. Full text in CLAUDE.md; the rule formalizes the practice of running `npm run build` locally and confirming the build passes before any push to GitHub for Vercel deploy.

**Final routing.**

- `/` — Home screen (recruiter landing).
- `/lock` — Lock screen (standalone showcase, no app shell, no BottomNav).
- `/todo` — To-Do screen.
- `/events`, `/progress`, `/profile`, `/add` — stub routes from File 2 scaffolding, awaiting Phase 5b screens.
- `/components` — primitive sandbox.

The desktop frame layer in `app/layout.tsx` applies to all routes at the `md:` breakpoint and above.

**Case study note — recruiter journey.**

Live URL: https://focus-forest-v2.vercel.app (auto-deployed from `main`).

A recruiter visiting the deployed URL on a laptop lands at `/` and sees the Home screen rendered inside a portfolio-framed iPhone mockup: warm cream backdrop, "Focus Forest" title and tagline above the device, animated jungle scene and glass progress card inside. They can navigate to the To-Do screen via the BottomNav (one of the two production-ready interactive screens), or follow an external portfolio link to `/lock` to see the canonical-DS Lock screen as a separate showcase. The desktop frame chrome makes the iPhone mockup feel intentional rather than orphaned, and the warm-cream backdrop softens the green-heavy in-app palette without competing with it. On a phone, the chrome falls away and the app fills the viewport.

### Phase 6 follow-up inventory

Consolidated from Phase 5a entries. Categorized by concern.

**Animation:**

- FAB submenu radial expansion (deferred during File 2 / BottomNav primitive).
- Todo-row delete slide (v1's `@keyframes rowDelete`).
- Expand/collapse caret rotation transition (smooth `rotate-0` ↔ `-rotate-90` vs. current static class swap).
- Group-children max-height transition (smooth open/collapse vs. current conditional render).
- Lock-screen notification dismiss (not in canonical DS; optional).
- Lock-screen action-row press feedback (subtle background tint on `:active` for UX clarity without breaking strict DS compliance).

**Accessibility:**

- Trash button touch target (`components/todo-row.tsx`): ~18×20px is below WCAG 2.5.8's 24×24 minimum. Faithful to v1 spec; Phase 6 a11y pass should enlarge via button padding without changing icon dimensions.
- `aria-controls` on the parent expand button references the children container id, but the container is removed from the DOM when collapsed. Either keep always-rendered with `hidden` / `aria-hidden` toggling, or strip `aria-controls` when collapsed.
- Lock-screen action stack: three mutually-exclusive choices. Semantically a radio group — consider `role="radiogroup"` on the container and `aria-checked` / `aria-pressed` on the children.

**Code quality:**

- `cn()` consistency across composites — some composites use template-literal interpolation, others use the `cn()` helper. Standardize on `cn()`.
- Shadow tokenization — repeated arbitrary box-shadow values across components could be promoted to named tokens.
- StatusBar primitive vs. canonical DS lock-screen status bar — SVG proportions differ (signal 18×12 vs 17×11; wifi 16×12 vs 15×11; battery solid vs. stroke-opacity-0.4 outer with filled inner). Reconcile by either upgrading the brand primitive to match the canonical DS, or by maintaining intentional app-vs-lock divergence.

**Phase 5a additions (newly surfaced during this phase):**

- `font-semibold` on the Home Card heading overrides `text-h3`'s medium weight. Either introduce a `text-h3-semibold` variant token or revise the design call to bring the heading weight back in line with the type-scale token.
- Introduce a `text-lead` or `text-tagline` intermediate body token (roughly 16–18px, weight 400) between `text-body` (14px) and the headings. Hero tagline use cases currently fall back to an arbitrary 16px size because no scale token covers this range — the desktop frame tagline is the current consumer.
- Expand DS reference documentation for the new `--color-cream` beyond the "Portfolio chrome" section in `colors-accent.html` if other surfaces adopt it.
- Token grouping in the `app/globals.css` `@theme` block — group cream with the yellows, group mist with the greens for readability. Cosmetic file-organization change; no behavior impact.
- Utility-icon position recalibration on `/lock` — the flashlight and camera buttons currently sit at `bottom-20` (80px from bottom), which reads as too high relative to the home indicator pill at `bottom-2`. Update both the DS HTML and the implementation to `bottom-6` or `bottom-7` for a more grounded composition.

**Optional:**

- Atmospheric refinement for the desktop frame background (subtle radial gradient or vignette in cream tones) — may not be needed; revisit after the deployed view sits for a few days.

### Phase 5b/5c roadmap

**Phase 5b — new screens and interactions:**

- Calendar screen at `/calendar` (design locked separately; implementation prompt forthcoming). Rename the "Events" BottomNav tab to "Calendar" and route it to `/calendar`. To-Do integration is TBD — likely fold as a "List view" toggle inside Calendar via `ScreenTabs`, or keep `/todo` as a standalone URL with no nav entry.
- Multi-list dashboard (deferred from Phase 5a).
- Archive folder (deferred from Phase 5a).
- Add-item flow via FAB (currently the FAB exists in the BottomNav but has no submenu — deferred).
- Drag-and-drop reorder for todo items (deferred from Phase 5a).

**Phase 5c — semantic polish:**

- Action-stack routing differentiation on `/lock`: "I will do it later" → `/todo` with deferred state; "Start tracking" → `/` with active focus-session indicator; "I am done" → `/` with completed state. Currently all three buttons are presentational per the canonical DS spec, which is correct under the showcase-page framing of `/lock` — wiring them would convert `/lock` from a DS-faithful showcase to a functional entry point, which is a different design call.
- Animation work consolidated from the Phase 6 list above.
