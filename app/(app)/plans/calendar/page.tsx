"use client"

import * as React from "react"

import { WeekStrip } from "@/components/calendar/week-strip"
import { AgendaCard, type AgendaItem } from "@/components/calendar/agenda-card"

// Calendar sub-view at /plans/calendar.
//
// The horizontal strip renders the full month of May 2026 (31 days,
// idx 0–30); the vertical scroll renders an AgendaCard for every
// day too. Past days, today, and future days all appear as cards in
// chronological order — past days are accessible by scrolling up
// from Today. Days without items show an empty-card design ("Nothing
// planned" placeholder in muted text); days with items show their
// items list. Strip pills for empty days are opacity-50 muted so
// users can see at a glance which days have agenda content.
//
// Day indexing: May 1, 2026 = Friday at idx 0. TODAY_IDX = 17
// (Monday May 18). Day letter cycle F S S M T W T starts May 1 =
// Friday.
//
// On mount, the useEffect runs three positioning steps:
// 1. Scroll Today's card flush below the sticky chrome via
//    scrollIntoView({ behavior: "auto" }). Without this, the page
//    would mount at scrollTop=0 showing Friday May 1 at the top of
//    the cards area — user would have to scroll down to find Today.
//    AgendaCard's scroll-mt-48 ensures Today lands at the right
//    flush position.
// 2. (Horizontal strip centering for Today's pill — implemented in
//    its own [activeIdx] effect so it handles both mount and every
//    subsequent activeIdx change uniformly.)
// 3. Wire the IntersectionObserver. A hasUserScrolled flag inside
//    the effect gates setActiveIdx calls so the observer's initial
//    mount-time firings don't override activeIdx (which starts at
//    TODAY_IDX). The flag flips to true on the first scroll event
//    (the on-mount Today scroll triggers it), at which point the
//    observer drives activeIdx based on which card crosses the band.
//
// pb-[80vh] on the cards container gives the last few cards enough
// room below them for scrollIntoView to position them at the top of
// the visible area. Without this, the last cards can't scroll past
// the bottom of the scroll container.
//
// Phase 6 follow-ups (consolidated):
//
// Phase 6a — Dynamic calendar dates (next planned iteration):
// - Extract buildCurrentMonth() into lib/calendar-data.ts: takes
//   a Date, returns { monthLabel, todayIdx, days, dayNames }.
//   Computes daysInMonth via new Date(year, month + 1, 0).getDate(),
//   day-of-week per day via date.getDay(), rotated dayNames anchored
//   to the month's first weekday, and todayIdx as date.getDate() - 1.
// - Replace hardcoded MONTH / TODAY_IDX / DAY_NAMES in this file
//   with the buildCurrentMonth() output called at component mount.
// - Items stay hardcoded for the portfolio demo, but as a separate
//   ITEMS_BY_OFFSET: Record<number, AgendaItem[]> map keyed by
//   relative-to-today offset (-1 = Yesterday, 0 = Today, +1 = Tomorrow,
//   etc.), merged into the generated days. So items always sit on
//   today / tomorrow / etc., regardless of what the actual calendar
//   month is.
// - h2 month heading reads from monthLabel (e.g., "May 2026" today,
//   "June 2026" on June 1, etc.).
// - Optional but cheap: setInterval midnight-check (every ~60s
//   compare current date to the date used on mount; if changed,
//   re-run buildCurrentMonth and update state). Handles "page open
//   across midnight" without requiring user re-mount.
// - Edge cases to handle in implementation:
//   - Today = 1st of month → no Yesterday in the current MONTH array;
//     getDayTitle's TODAY_IDX - 1 lookup would point to idx -1 which
//     doesn't exist. Guard with idx >= 0 check or skip the relative
//     label and fall back to the day name.
//   - Today = last day of month → no Tomorrow in MONTH; similar guard
//   - No cross-month bridging for now (a "tomorrow" that's in the
//     next month is out of scope for v3 single-month calendar)
//
// Other Phase 6 follow-ups (lower priority than 6a):
// - Disambiguate repeated day-name titles (5 Mondays, 5 Tuesdays,
//   etc. all currently render with bare day names; could append the
//   date number "Monday 9", "Monday 16" for unambiguous scroll
//   context)
// - Tokenize pb-[80vh] on cards container via a spacing token
// - Tokenize opacity-50 muted state as a semantic utility
// - Smarter horizontal scroll sync (active pill follows vertical card)
// - "Back to today" affordance now that the strip scrolls far
// - prefers-reduced-motion in scrollIntoView calls
// - IntersectionObserver scroll-root via React context

type Day = {
  dayLetter: string
  dayNumber: number
  items: AgendaItem[]
}

const TODAY_IDX = 17

const MONTH: Day[] = [
  // Week 1 partial — May 1 Friday through May 2 Saturday
  { dayLetter: "F", dayNumber: 1, items: [] },
  { dayLetter: "S", dayNumber: 2, items: [] },
  // Week 2 — May 3 Sunday through May 9 Saturday
  { dayLetter: "S", dayNumber: 3, items: [] },
  { dayLetter: "M", dayNumber: 4, items: [] },
  { dayLetter: "T", dayNumber: 5, items: [] },
  { dayLetter: "W", dayNumber: 6, items: [] },
  { dayLetter: "T", dayNumber: 7, items: [] },
  { dayLetter: "F", dayNumber: 8, items: [] },
  { dayLetter: "S", dayNumber: 9, items: [] },
  // Week 3 — May 10 Sunday through May 16 Saturday
  { dayLetter: "S", dayNumber: 10, items: [] },
  { dayLetter: "M", dayNumber: 11, items: [] },
  { dayLetter: "T", dayNumber: 12, items: [] },
  { dayLetter: "W", dayNumber: 13, items: [] },
  // May 14 Thursday
  {
    dayLetter: "T",
    dayNumber: 14,
    items: [
      { time: "8:00 AM", title: "Stand-up meeting", category: "work" },
      { time: "2:00 PM", title: "Design review", category: "work" },
    ],
  },
  // May 15 Friday
  {
    dayLetter: "F",
    dayNumber: 15,
    items: [
      { time: "9:00 AM", title: "Morning run", category: "health" },
      { time: "12:00 PM", title: "Team standup", category: "work" },
      { time: "6:00 PM", title: "Sports session", category: "health" },
    ],
  },
  // May 16 Saturday
  {
    dayLetter: "S",
    dayNumber: 16,
    items: [
      { time: "10:00 AM", title: "Morning yoga", category: "health" },
      { time: "7:00 PM", title: "Movie night", category: "personal" },
    ],
  },
  // Week 4 — May 17 Sunday through May 23 Saturday
  // May 17 Sunday — Yesterday (empty; showcases the empty-card design)
  { dayLetter: "S", dayNumber: 17, items: [] },
  // May 18 Monday — TODAY. Items mirror the Today screen's Events
  // (app/(app)/today/page.tsx) — same titles + moments, in the
  // calendar's 24h convention (Today renders 12h AM/PM). All three
  // categories present → three dots on the active pill.
  {
    dayLetter: "M",
    dayNumber: 18,
    items: [
      { time: "9:30 AM", title: "Team standup", category: "work", meta: "Work · 30 min" },
      { time: "2:00 PM", title: "Coffee with Maya", category: "personal", meta: "Joe's Coffee · 1 hr" },
      { time: "6:30 PM", title: "Yoga class", category: "health", meta: "Power Yoga Studio · 1 hr" },
    ],
  },
  // May 19 Tuesday — Tomorrow
  {
    dayLetter: "T",
    dayNumber: 19,
    items: [
      { time: "10:00 AM", title: "Farmer's market", category: "personal" },
      { time: "7:00 PM", title: "Dinner with friends", category: "personal" },
    ],
  },
  // May 20 Wednesday
  {
    dayLetter: "W",
    dayNumber: 20,
    items: [
      { time: "11:00 AM", title: "Brunch", category: "personal" },
      { time: "4:00 PM", title: "Plan next week", category: "work" },
    ],
  },
  { dayLetter: "T", dayNumber: 21, items: [] },
  // May 22 Friday — personal only demo
  {
    dayLetter: "F",
    dayNumber: 22,
    items: [{ time: "6:00 PM", title: "Team happy hour", category: "personal" }],
  },
  { dayLetter: "S", dayNumber: 23, items: [] },
  // Week 5 — May 24 Sunday through May 30 Saturday
  { dayLetter: "S", dayNumber: 24, items: [] },
  {
    dayLetter: "M",
    dayNumber: 25,
    items: [{ time: "9:00 AM", title: "Dentist", category: "health" }],
  },
  {
    dayLetter: "T",
    dayNumber: 26,
    items: [
      { time: "11:00 AM", title: "Doctor appointment", category: "health" },
      { time: "4:00 PM", title: "Coffee with Maya", category: "personal" },
    ],
  },
  { dayLetter: "W", dayNumber: 27, items: [] },
  {
    dayLetter: "T",
    dayNumber: 28,
    items: [{ time: "7:30 PM", title: "Birthday dinner", category: "personal" }],
  },
  { dayLetter: "F", dayNumber: 29, items: [] },
  {
    dayLetter: "S",
    dayNumber: 30,
    items: [{ time: "11:00 AM", title: "Brunch with parents", category: "personal" }],
  },
  // Week 6 partial — May 31 Sunday
  { dayLetter: "S", dayNumber: 31, items: [] },
]

// Order anchored to MONTH idx 0. For May 2026 that's Friday May 1, so
// DAY_NAMES[0] = "Friday" and DAY_NAMES[idx % 7] returns the correct
// day-of-week label for any idx. When the month changes (Phase 6
// dynamic dates), this rotation shifts accordingly.
const DAY_NAMES = [
  "Friday",
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
]

function getDayTitle(idx: number): string {
  if (idx === TODAY_IDX - 1) return "Yesterday"
  if (idx === TODAY_IDX) return "Today"
  if (idx === TODAY_IDX + 1) return "Tomorrow"
  return DAY_NAMES[idx % 7] ?? "Day"
}

export default function CalendarPage() {
  const [activeIdx, setActiveIdx] = React.useState<number>(TODAY_IDX)
  const cardRefs = React.useRef<(HTMLElement | null)[]>([])
  const stripRef = React.useRef<HTMLDivElement>(null)
  // The sticky calendar chrome (month label + WeekStrip). The observer
  // callback reads its bottom edge to filter out cards that have
  // scrolled behind the chrome — see the chromeBot filter below.
  const chromeRef = React.useRef<HTMLDivElement>(null)
  // Distinguishes the first run of the horizontal-strip-centering
  // effect (which fires on mount with the initial activeIdx) from
  // subsequent runs (which fire on click/scroll-driven activeIdx
  // changes). First run uses behavior: "auto" so the user doesn't see
  // a horizontal scroll animation on page load; subsequent runs use
  // "smooth" so the strip pans gracefully when the active pill
  // changes.
  const isInitialStripScroll = React.useRef(true)
  // Flag flipped on by handleDayClick before scrolling, off after the
  // smooth scroll animation completes. While true, the
  // IntersectionObserver callback skips activeIdx updates — without
  // this, the observer fires for every card whose top crosses the
  // intersection band during the click-induced scroll, rapidly
  // cycling activeIdx through every intermediate card. That caused
  // (a) the strip's active-pill highlight to flicker between pills
  // as the scroll passes through, and (b) activeIdx sometimes
  // settling on a neighbor card instead of the click target. With
  // the flag, activeIdx changes once (to the click target) and
  // stays there through the animation.
  const isProgrammaticScroll = React.useRef(false)
  const scrollEndTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(
    null
  )
  // Tracks the requestAnimationFrame id of the active custom-smooth
  // scroll animation (see smoothScrollVertically below). Used to
  // cancel an in-flight animation when a new click arrives, so two
  // RAF loops don't race for control of scrollTop.
  const animationFrameId = React.useRef<number | null>(null)

  // Custom smooth scroll for the cards container. Replaces
  // scrollIntoView({ behavior: "smooth" }) so we control duration
  // precisely — the browser's smooth scroll scales duration with
  // distance, which makes short clicks feel abrupt (~150-200ms) and
  // long clicks feel right (~800ms). With this helper, short scrolls
  // are stretched to a minimum of 400ms and long scrolls are capped
  // at 1200ms, with ease-in-out cubic for natural acceleration/
  // deceleration. The "T 3 → S 28" long-scroll reference behavior is
  // preserved (distance * 0.5 ≈ 1000ms at 2000px, near the cap).
  const smoothScrollVertically = (
    scrollRoot: HTMLElement,
    finalScrollTop: number
  ): number => {
    if (animationFrameId.current !== null) {
      cancelAnimationFrame(animationFrameId.current)
      animationFrameId.current = null
    }

    const startTop = scrollRoot.scrollTop
    const distance = finalScrollTop - startTop
    if (Math.abs(distance) < 1) return 0

    const duration = Math.max(
      400,
      Math.min(1200, Math.abs(distance) * 0.5)
    )
    const startTime = performance.now()

    const ease = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      scrollRoot.scrollTop = startTop + distance * ease(progress)
      if (progress < 1) {
        animationFrameId.current = requestAnimationFrame(step)
      } else {
        animationFrameId.current = null
      }
    }

    animationFrameId.current = requestAnimationFrame(step)
    return duration
  }

  // Auto-scroll the horizontal strip so the active pill is centered
  // in the visible strip area. Runs on any activeIdx change — click-
  // driven (handleDayClick) and scroll-driven (IntersectionObserver)
  // alike — keeping the strip visually synchronized with whichever
  // card is currently active. Without this, the active pill can sit
  // at the edge of the visible strip area or be partially clipped.
  //
  // Behavior gating: the effect also runs once on mount (when
  // activeIdx is at its initial TODAY_IDX value), so the first run
  // uses behavior: "auto" to silently land Today's pill at center.
  // Subsequent runs use behavior: "smooth" for a graceful pan.
  React.useEffect(() => {
    const strip = stripRef.current
    const pill = strip?.children[activeIdx] as HTMLElement | undefined
    if (strip && pill) {
      const offset =
        pill.offsetLeft + pill.clientWidth / 2 - strip.clientWidth / 2
      strip.scrollTo({
        left: offset,
        behavior: isInitialStripScroll.current ? "auto" : "smooth",
      })
      isInitialStripScroll.current = false
    }
  }, [activeIdx])

  React.useEffect(() => {
    const scrollRoot = document.querySelector("main")
    if (!scrollRoot) return

    // Step 1 — position the inner scroll on Today's card. Direct
    // scrollTop assignment (vs scrollIntoView) so only <main> moves;
    // scrollIntoView also scrolls every ancestor scroll container
    // including the document, which pushes the iPhone frame up out
    // of the desktop browser viewport. Same math as handleDayClick
    // so the on-mount and click-driven positions agree.
    //
    // Without this, the page would mount at scrollTop=0 showing
    // Friday May 1 at the top of the cards area — user would have
    // to scroll down to find Today.
    const todayCard = cardRefs.current[TODAY_IDX]
    if (todayCard) {
      const SCROLL_MT_PX = 224  // matches scroll-mt-56 on AgendaCard
      const targetTop =
        todayCard.getBoundingClientRect().top -
        scrollRoot.getBoundingClientRect().top +
        scrollRoot.scrollTop
      scrollRoot.scrollTop = targetTop - SCROLL_MT_PX
    }

    // (Horizontal strip centering lives in its own [activeIdx]
    // effect above and runs on every activeIdx change.)

    // Step 2 — wire a scroll listener that drives activeIdx based on
    // which card is currently the topmost one sitting below the
    // sticky chrome.

    // Scroll-driven active-pill selection. Replaces the previous
    // IntersectionObserver approach, which relied on a narrow
    // rootMargin band to pick the "active" card. On mobile (small
    // dvh, dynamic URL bar) the band ended up close enough to the
    // sticky chrome that the only in-band card was sometimes one
    // whose top had already scrolled BEHIND the chrome — visually
    // hidden but logically "active." The pill the user saw didn't
    // match the card right below the WeekStrip.
    //
    // The scroll listener instead reads every card's rect on each
    // scroll frame and picks the card with the smallest top that is
    // still at or below the chrome's bottom — i.e. the topmost card
    // the user can actually see beneath the WeekStrip. With 31
    // cards this is sub-ms per frame.
    //
    // hasUserScrolled gates the first run: the on-mount Today
    // scroll fires a scroll event before activeIdx should be driven
    // by the listener, so we wait for that initial scroll to land
    // and let activeIdx stay at TODAY_IDX through the first frame.
    let hasUserScrolled = false
    const onScroll = () => {
      if (!hasUserScrolled) {
        hasUserScrolled = true
        return
      }
      if (isProgrammaticScroll.current) return
      const chromeBot =
        chromeRef.current?.getBoundingClientRect().bottom ?? 0
      let topmost = Infinity
      let topmostIdx = -1
      cardRefs.current.forEach((card, idx) => {
        if (!card) return
        const top = card.getBoundingClientRect().top
        if (top >= chromeBot - 5 && top < topmost) {
          topmost = top
          topmostIdx = idx
        }
      })
      if (topmostIdx >= 0) setActiveIdx(topmostIdx)
    }
    scrollRoot.addEventListener("scroll", onScroll, { passive: true })

    return () => {
      scrollRoot.removeEventListener("scroll", onScroll)
      if (scrollEndTimeout.current) {
        clearTimeout(scrollEndTimeout.current)
        scrollEndTimeout.current = null
      }
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current)
        animationFrameId.current = null
      }
    }
  }, [])

  const handleDayClick = (idx: number) => {
    setActiveIdx(idx)

    // Engage the isProgrammaticScroll gate during the smooth scroll
    // animation. The gate suppresses IntersectionObserver activeIdx
    // updates so the active pill doesn't flicker through every card
    // the scroll passes — activeIdx stays at the click target until
    // the scroll completes.
    //
    // Gate release is duration-based: smoothScrollVertically returns
    // the exact RAF animation duration, and the timeout releases the
    // gate at duration + 100ms buffer.
    const scrollRoot = document.querySelector("main")
    if (!scrollRoot) return

    const target = cardRefs.current[idx]
    if (!target) return

    // MUST stay in sync with scroll-mt-52 on AgendaCard. Two scroll
    // paths land active cards in different places:
    //   1. scrollIntoView (on mount + handleDayClick fallback) — uses
    //      the card element's scroll-margin-top via CSS.
    //   2. smoothScrollVertically (click-driven custom scroll, below)
    //      — uses this literal because it computes scrollTop directly.
    // If these drift, click-to-scroll positions cards differently
    // from on-mount Today positioning. Phase 6 follow-up: hoist this
    // to a CSS variable so both paths read the same source of truth.
    const SCROLL_MT_PX = 224  // matches scroll-mt-56 on AgendaCard
    const targetTop =
      target.getBoundingClientRect().top -
      scrollRoot.getBoundingClientRect().top +
      scrollRoot.scrollTop
    const finalScrollTop = targetTop - SCROLL_MT_PX

    isProgrammaticScroll.current = true
    if (scrollEndTimeout.current) {
      clearTimeout(scrollEndTimeout.current)
    }

    const duration = smoothScrollVertically(scrollRoot, finalScrollTop)

    if (duration === 0) {
      // Target already at desired position; no scroll, release gate
      // immediately so subsequent user scrolls aren't suppressed.
      isProgrammaticScroll.current = false
    } else {
      scrollEndTimeout.current = setTimeout(() => {
        isProgrammaticScroll.current = false
        scrollEndTimeout.current = null
      }, duration + 100)
    }
  }

  return (
    <>
      <div
        ref={chromeRef}
        className="sticky top-[46px] z-10 bg-primary px-4 pt-8 pb-6"
      >
        <h2 className="font-display text-h3 text-white mb-3">May 2026</h2>
        <WeekStrip
          ref={stripRef}
          activeIdx={activeIdx}
          onDayClick={handleDayClick}
          weekData={MONTH}
        />
      </div>

      <div className="flex flex-col gap-6 px-4 pt-4 pb-[80vh]">
        {/* Render an AgendaCard for every day of the month —
            chronological order from Friday May 1 (idx 0) through
            Sunday May 31 (idx 30). Past days sit above Today in DOM
            order; the on-mount scrollIntoView(Today) positions Today
            flush below the chrome, so past days are above the
            visible viewport on mount. User scrolls up to reveal
            past days, down for future days. */}
        {MONTH.map((day, idx) => (
          <AgendaCard
            key={idx}
            ref={(el) => {
              cardRefs.current[idx] = el
            }}
            title={getDayTitle(idx)}
            items={day.items}
            isActive={activeIdx === idx}
            scrollIdx={idx}
          />
        ))}
      </div>
    </>
  )
}
