import { FeaturedCountdown } from "@/components/countdown/featured-countdown"
import { CountdownItem } from "@/components/countdown/countdown-item"
import { COUNTDOWNS } from "@/lib/countdown-data"

// Countdown screen at /plans/countdown. Renders user countdowns
// sorted ascending by `days`:
// - The soonest (first entry) is the FeaturedCountdown — a prominent
//   glass card with a yellow left accent ("watch this next").
// - The rest render as CountdownItem rows below, fixed-width number
//   column on the left so days align across rows.
//
// Sample data lives in lib/countdown-data.ts; in the production
// app this comes from user input (Phase 6 CRUD).
//
// No pb-[80vh] here (unlike the Calendar page). Calendar uses that
// scroll-runway padding so any pill click can position its card
// flush to the top of the visible area — that interaction doesn't
// exist on Countdown. Scrolling stops at the last card with the
// standard py-8 bottom padding (32px) so the last item isn't flush
// with the viewport's bottom edge.

export default function CountdownPage() {
  const featured = COUNTDOWNS[0]
  const rest = COUNTDOWNS.slice(1)

  return (
    <div className="px-4 py-8">
      <h1 className="font-display text-h3 text-white mb-1">
        Looking forward
      </h1>
      <p className="font-display text-h4 text-white/85 mb-6">
        {COUNTDOWNS.length} moments to look forward to
      </p>

      <FeaturedCountdown countdown={featured} />

      <div className="flex flex-col gap-2 mt-4">
        {rest.map((countdown) => (
          <CountdownItem key={countdown.id} countdown={countdown} />
        ))}
      </div>
    </div>
  )
}
