import { cn } from "@/lib/utils"
import type { Countdown } from "@/lib/countdown-data"
import { Card } from "@/components/ui/card"

// FeaturedCountdown — the soonest upcoming countdown, surfaced
// prominently at the top of the Countdown screen as a glass card
// with a yellow left accent (echoing the Calendar's active-card
// treatment).
//
// Glass surface (2026-05-19 consolidation): uses the <Card> primitive
// emitting canonical --surface-card-* tokens (single glass recipe
// across the product). Previously used a solid bg-white/15 with
// custom radius — both now canonicalized via Card.
//
// Layout mirrors the CountdownItem list rows below it: fixed-width
// number column on the left (number stacked above a "days" label),
// title + date on the right. The featured card differentiates from
// the list rows via:
//   (a) larger number — text-h1 (38px / 500) vs text-h2 (30/500)
//   (b) yellow inset left accent
// Same fundamental layout means the eye moves consistently between
// the featured card and the list rows.
//
// Display refinements for boundary cases:
// - days === 0 → "today" in the left column at text-h2 size, no
//   "days" label below
// - days === 1 → "tomorrow" at text-h2 size, same treatment
// - days > 1   → number at text-h1 + "days" caption label
//   (current data starts at 3 so the boundary paths are defensive)
//
// Phase 6 follow-ups (consolidated):
// - Pluralization and unit refinement (hours/minutes for sub-day,
//   weeks/months for very distant)
// - "yesterday" / past-event handling once days can go negative
// - Tokenize the yellow inset shadow as shadow-active-accent
//   (shared with AgendaCard's active state)

type FeaturedCountdownProps = {
  countdown: Countdown
}

function FeaturedCountdown({ countdown }: FeaturedCountdownProps) {
  const { title, days, date, time } = countdown

  const boundaryLabel =
    days === 0 ? "today" : days === 1 ? "tomorrow" : null

  return (
    <Card asChild>
      <section
        className={cn(
          "p-5 pl-6",
          "shadow-[inset_4px_0_0_0_#F6AE2D]",
          "transition-all duration-200 ease-out",
          "flex items-center gap-4"
        )}
      >
        <div className="flex flex-col items-center min-w-[88px]">
          {boundaryLabel ? (
            <span className="font-display text-h2 text-white leading-none">
              {boundaryLabel}
            </span>
          ) : (
            <>
              <span className="font-display text-h1 text-white leading-none">
                {days}
              </span>
              <span className="font-body text-body text-white/85 mt-2">
                days
              </span>
            </>
          )}
        </div>
        <div className="flex flex-col flex-1 min-w-0">
          <h2 className="font-display text-h4 text-white mb-1">{title}</h2>
          <p className="font-body text-body text-white/70">
            {time ? `${date} · ${time}` : date}
          </p>
        </div>
      </section>
    </Card>
  )
}

export { FeaturedCountdown }
