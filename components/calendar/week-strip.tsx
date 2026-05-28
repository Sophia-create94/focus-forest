"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import {
  CATEGORY_ORDER,
  CATEGORY_BG_CLASS,
  type EventCategory,
} from "@/lib/categories"

// WeekStrip — horizontal-scrollable day strip rendering a calendar
// month from a weekData prop. Despite the legacy name (kept to avoid
// import churn through the Calendar iterations), this component now
// renders the full month (typically 30–31 days) with scroll-snap and
// the no-scrollbar utility for a clean mobile-app feel.
//
// Pills:
// - Fixed width w-12 (48px) so they overflow the container and require
//   horizontal scroll
// - snap-center for snap-to-pill scrolling
// - All pills clickable AND equally readable — empty days are no longer
//   dimmed. The old opacity-50 muted state read as "disabled" in mobile
//   UI grammar, hiding that empty days are tappable. Whether a day has
//   events is now signalled by category dots instead (see below).
//
// Active state — driven by activeIdx prop:
// - active:   bg-yellow + text-black + black/70 day letter
// - inactive: bg-white/10 + text-white + white/70 letter (same for
//             every day regardless of whether it has events)
//
// Category-dot indicator row:
// - Every pill reserves a 5px-tall row (mt-[3px]) below the date so
//   pill heights stay locked whether or not the day has events.
// - Dots are a FORECAST — they tell you what's on a day you haven't
//   opened yet. The active/today pill shows NO dots: you're already
//   looking at that day's agenda below, which is the real forecast, so
//   dots there would just duplicate the agenda's category bars.
// - For inactive days with events, up to 3 dots (5×5px, round, 3px gap)
//   render — one per unique category present that day, ordered work →
//   personal → health (CATEGORY_ORDER). Days with >3 unique categories
//   cap at 3. Dot colors come from the shared CATEGORY_BG_CLASS map.
//
// forwardRef forwards the ref to the scroll container so the parent
// page can position the strip's initial scrollLeft (centering Today's
// pill on mount).
//
// Phase 6 follow-ups:
// - Smarter horizontal scroll sync as user scrolls vertically through
//   agenda cards (bidirectional sync)
// - "Back to today" affordance now that the strip can scroll far from
//   today

type StripDay = {
  dayLetter: string
  dayNumber: number
  items: readonly { category?: EventCategory }[]
}

// Unique categories present on a day, in canonical order, capped at 3.
function categoriesForDay(
  items: readonly { category?: EventCategory }[]
): EventCategory[] {
  const present = new Set<EventCategory>()
  for (const it of items) {
    if (it.category) present.add(it.category)
  }
  return CATEGORY_ORDER.filter((c) => present.has(c)).slice(0, 3)
}

type WeekStripProps = {
  activeIdx: number
  onDayClick: (idx: number) => void
  weekData: readonly StripDay[]
}

// Order anchored to MONTH idx 0. For May 2026 that's Friday May 1.
// When the calendar is updated to a different month (or made dynamic
// per Phase 6 follow-up), this array shifts so DAY_NAMES[0] matches
// the day-of-week of the month's first day.
const DAY_NAMES = [
  "Friday",
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
] as const

const WeekStrip = React.forwardRef<HTMLDivElement, WeekStripProps>(
  ({ activeIdx, onDayClick, weekData }, ref) => {
    return (
      <div
        ref={ref}
        className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-1.5"
      >
        {weekData.map((day, idx) => {
          const isActive = idx === activeIdx
          const dayName = DAY_NAMES[idx % 7] ?? "Day"
          // Dots only on inactive pills — the active day's agenda below
          // is the forecast, so dots there would duplicate it.
          const categories = isActive ? [] : categoriesForDay(day.items)
          return (
            <button
              key={idx}
              type="button"
              onClick={() => onDayClick(idx)}
              aria-label={`${dayName} ${day.dayNumber}`}
              aria-pressed={isActive}
              className={cn(
                "flex-shrink-0 w-12 snap-center",
                "flex flex-col items-center justify-center py-2.5 rounded-md",
                // transition-all + 200ms ease-out (was transition-colors
                // 150ms): smoother bg/text transition when activeIdx
                // changes, especially noticeable during user scroll when
                // pills swap active state in rapid succession.
                "transition-all duration-200 ease-out",
                "cursor-pointer",
                "outline-none focus-visible:outline-2 focus-visible:outline-yellow focus-visible:outline-offset-2",
                isActive
                  ? "bg-yellow text-black"
                  : "bg-white/10 text-white hover:bg-white/15"
              )}
            >
              <span
                className={cn(
                  "font-body text-overline mb-1",
                  isActive ? "text-black/70" : "text-white/70"
                )}
              >
                {day.dayLetter}
              </span>
              <span className="font-display text-h4">{day.dayNumber}</span>
              {/* Indicator row — always present (locks pill height); dots
                  render only on inactive days that have categorized
                  events (the active pill's `categories` is forced empty). */}
              <div
                aria-hidden="true"
                className="flex items-center justify-center gap-[3px] h-[5px] mt-[3px]"
              >
                {categories.map((cat) => (
                  <span
                    key={cat}
                    className={cn(
                      "w-[5px] h-[5px] rounded-full",
                      CATEGORY_BG_CLASS[cat]
                    )}
                  />
                ))}
              </div>
            </button>
          )
        })}
      </div>
    )
  }
)

WeekStrip.displayName = "WeekStrip"

export { WeekStrip }
