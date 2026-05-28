import type { Countdown } from "@/lib/countdown-data"
import { Card } from "@/components/ui/card"

// CountdownItem — list row for non-featured countdowns. Sits below
// the FeaturedCountdown in chronological order.
//
// Glass surface (2026-05-19 consolidation): uses the <Card> primitive
// emitting canonical --surface-card-* tokens (single glass recipe
// across the product). Previously used a solid bg-white/10 — no DS
// reference existed for that treatment.
//
// Layout: fixed-width number column on the left (visually aligns
// the days across rows even when titles wrap or vary), title + date
// stacked on the right.
//
// Number uses text-h2 (30px / 500); the "days" label below uses
// text-caption (13px / 400 / lh 1.4) — small enough to read as a
// unit label without competing with the number above. Title uses
// font-display text-h4 (16px / 600 Niramit) to match the
// FeaturedCountdown title family. Date is text-body (14px / 400) in
// muted white.

type CountdownItemProps = {
  countdown: Countdown
}

function CountdownItem({ countdown }: CountdownItemProps) {
  const { title, days, date, time } = countdown

  return (
    <Card asChild>
      <article className="flex items-center gap-4">
        <div className="flex flex-col items-center min-w-[52px]">
          <span className="font-display text-h2 text-white leading-none">
            {days}
          </span>
          <span className="font-body text-body text-white/70 mt-1">
            days
          </span>
        </div>
        <div className="flex flex-col flex-1 min-w-0">
          <h3 className="font-display text-h4 text-white">{title}</h3>
          <p className="font-body text-body text-white/65">
            {time ? `${date} · ${time}` : date}
          </p>
        </div>
      </article>
    </Card>
  )
}

export { CountdownItem }
