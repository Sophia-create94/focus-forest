"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { CATEGORY_BG_CLASS, type EventCategory } from "@/lib/categories"

// AgendaCard — Calendar screen's per-day card listing time + title
// items. Two cards on /calendar v1: Today (Tue) and Tomorrow (Wed).
// Active state is driven by the parent page's IntersectionObserver
// reading data-card-idx and updating which card has the yellow left
// accent.
//
// Glass surface (2026-05-19 glass-surface consolidation): uses the
// <Card> primitive emitting canonical --surface-card-* tokens.
// Previously rendered a solid bg-white/N fill with no border; folded
// into the canonical glass treatment so every glass surface in the
// product shares one recipe (see DS components-glass-surface.html).
//
// Active vs inactive: the previous bg-opacity differentiation
// (white/10 ↔ white/15) was dropped — the yellow inset accent
// shadow is the sole active-state indicator. The accent is strong
// enough on its own; bg-opacity shifts on top of canonical glass
// would re-introduce per-card visual variance.
//
// Yellow left accent uses inset box-shadow so the accent traces the
// rounded corners; border-left renders unevenly at radii. Phase 6
// follow-up: tokenize the accent (a shadow-active-accent utility
// mapped to the yellow brand color in globals.css).
//
// scroll-mt-56 (224px) clears the combined sticky chrome — ScreenTabs
// + Month heading + WeekStrip + breathing room — and lands the target
// card with its title and all items fully visible below the chrome.
// Used by both on-mount Today positioning (scrollIntoView in the
// Calendar page useEffect) and click-to-scroll on WeekStrip pills
// (handleDayClick → SCROLL_MT_PX) so every card lands at the same
// flush position relative to the chrome. Both paths MUST stay in
// sync — see SCROLL_MT_PX comment in calendar/page.tsx.
//
// Sizing history (Goldilocks tuning, four iterations and counting):
// - scroll-mt-48 (192px) shipped with ScreenTabs ~42 + chrome ~120
//   (sticky pt-4, h4 month heading) — ~10px breathing room.
// - Bumped to scroll-mt-60 (240px) after chrome grew by ~20px from
//   two DS standardization passes (sticky pt-4 → pt-8 and h4 → h3
//   on the month heading). Too aggressive: ~52px gap below chrome
//   exposed the prior day's card peeking through.
// - Reduced to scroll-mt-52 (208px) + chrome pb-3 → pb-6.
//   Calculated chrome_bottom ~197 → 13px buffer above prior card.
//   But click-driven scroll path (handleDayClick) had a hardcoded
//   SCROLL_MT_PX = 192 still pointing at the old value — so clicks
//   landed cards 16px higher than scrollIntoView did, causing the
//   cut Sophia saw in her W 13 / S 23 screenshots.
// - Synced SCROLL_MT_PX 192 → 208 to match scroll-mt-52. Better,
//   but Sophia reported "still a bit cutting off" — the calculated
//   chrome_bottom (197) was an underestimate; real chrome_bottom
//   appears to be ~210-215px (likely Tailwind preflight line-height
//   inheritance pushing h2 effective height up, plus WeekStrip pills
//   rendering a few px taller than the py-2.5 + overline + h4 math).
// - Final (this iteration): scroll-mt-56 (224px). With chrome pb-6
//   kept at 24px, chrome_bottom estimated ~213 (vs measured ~197
//   from the math); gap above prior card buffer = 224 - 24 - 213
//   = -13... wait, prior_card_bottom = 200, chrome_bottom estimated
//   ~213 → prior card hidden by 13px buffer ✓. Active card top at
//   224, chrome_bottom ~213 → 11px breathing room below chrome ✓.
//
// Phase 6 follow-up (no longer "blocking" since the value is now
// safe across the measurement uncertainty band, but still
// recommended): tokenize chrome height as a CSS variable so
// scroll-margin-top and chrome geometry share one source of truth.
// Four iterations of manual tuning across two files (this one +
// calendar/page.tsx SCROLL_MT_PX) is the clear signal that the
// coupling needs to be explicit.
//
// Phase 6 follow-up (still blocking, but no longer urgent):
// tokenize the chrome height as a CSS variable so scroll-margin-top
// and the chrome layer geometry share one source of truth.
// Currently any change to ScreenTabs padding, Month heading,
// WeekStrip pills, or chrome wrapper padding requires manually
// re-measuring and updating this value.

type AgendaItem = {
  time: string
  title: string
  // Optional event category — drives the row's color bar + the
  // week-strip dot indicators. Items without a category render a
  // transparent bar / no dot (treated as uncategorized, not an error).
  category?: EventCategory
  // Optional supporting line under the title (e.g. "Work · 30 min").
  meta?: string
}

type AgendaCardProps = {
  title: string
  items: AgendaItem[]
  isActive: boolean
  scrollIdx: number
}

const AgendaCard = React.forwardRef<HTMLElement, AgendaCardProps>(
  ({ title, items, isActive, scrollIdx }, ref) => {
    const reactId = React.useId()
    const titleId = `agenda-card-title-${reactId}`
    return (
      <Card asChild>
        <section
          ref={ref}
          data-card-idx={scrollIdx}
          aria-labelledby={titleId}
          className={cn(
            "p-4 scroll-mt-56",
            // transition-all + 200ms ease-out (was transition-colors
            // 150ms): smoother active-state shift, includes the inset
            // yellow accent shadow's appearance/disappearance which
            // transition-colors didn't cover (shadow needs transition-
            // shadow or transition-all).
            "transition-all duration-200 ease-out",
            isActive && "shadow-[inset_4px_0_0_0_#F6AE2D]"
          )}
        >
          <h3
            id={titleId}
            className="font-display text-h4 text-white mb-3"
          >
            {title}
          </h3>
          {items.length > 0 ? (
            <ul>
              {items.map((item, i) => {
                // Split "9:30 AM" → number + period for the Today screen's
                // two-tone time treatment (bright white number + dimmer
                // uppercase period, both font-medium). Falls back to the
                // whole string as the number if there's no period.
                const lastSpace = item.time.lastIndexOf(" ")
                const timeNum =
                  lastSpace === -1 ? item.time : item.time.slice(0, lastSpace)
                const timePeriod =
                  lastSpace === -1 ? "" : item.time.slice(lastSpace + 1)
                return (
                  // Row structure mirrors the Today screen's Events rows:
                  // time column → category color bar → content (title +
                  // optional "Now" pill + optional meta). No timeline circle.
                  <li
                    key={i}
                    className={cn(
                      "flex items-center gap-3 py-2",
                      i < items.length - 1 && "border-b border-white/10"
                    )}
                  >
                    <span className="w-16 flex items-baseline gap-1 flex-none">
                      <span className="font-body text-body font-medium text-white tracking-tight">
                        {timeNum}
                      </span>
                      {timePeriod && (
                        <span className="font-body text-body font-medium text-white/70 uppercase">
                          {timePeriod}
                        </span>
                      )}
                    </span>
                    {/* Category color bar — color from the shared
                        CATEGORY_BG_CLASS map. Uncategorized → transparent. */}
                    <span
                      aria-hidden="true"
                      className={cn(
                        "w-1 h-8 rounded-pill flex-none",
                        item.category
                          ? CATEGORY_BG_CLASS[item.category]
                          : "bg-transparent"
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <span className="block font-display text-h4 text-white truncate">
                        {item.title}
                      </span>
                      {item.meta ? (
                        <p className="font-body text-body text-white/60 mt-0.5 truncate">
                          {item.meta}
                        </p>
                      ) : null}
                    </div>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="font-body text-body text-white/40">
              Nothing planned
            </p>
          )}
        </section>
      </Card>
    )
  }
)

AgendaCard.displayName = "AgendaCard"

export { AgendaCard }
export type { AgendaItem }
