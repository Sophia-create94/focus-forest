"use client"

import * as React from "react"

import { Card } from "@/components/ui/card"
import {
  ChevronRightIcon,
  PencilIcon,
  TreeIcon,
} from "@/components/ui/icons"
import { cn } from "@/lib/utils"
import { USER_NAME } from "@/lib/user"

// Profile screen (Phase 5b v5).
//
// Five sections stacked vertically: identity, stats card, settings
// header + card, account header + card. No page title — the identity
// section's avatar + name establish context, and the BottomNav
// "Profile" tab is shown active by the app shell. Standard AppHeader
// chrome at the top is rendered by the parent layout.
//
// Surface tokens:
// - bg-primary canvas (page wrapper)
// - bg-moss (avatar) — accent green from _design-system-reference/
//   preview/colors-accent.html
// - bg-yellow / text-black (edit badge, level pill, toggle ON)
// - <Card variant="glass"> for the stats card and the two settings
//   cards — same translucent-white surface as Home's stats card
//
// Sample profile stats data lives inline as a const; Phase 6
// follow-up: pull from a real user-data layer (USER_NAME is already
// a lib/user.ts export so the name display picks up the user's
// initial automatically — "S" today).
//
// Phase 6 follow-ups (consolidated):
// - Sign out / Delete account: proper destructive-action token +
//   confirmation modal flow (Delete row deferred entirely per spec)
// - Toggle: lift the inline Toggle into a DS primitive in
//   components/ui/ once a second screen needs it
// - Edit badge: 26x26 visible hit target is below the WCAG 44x44
//   touch minimum; either expand padding/touch area or add a
//   surrounding hit zone in Phase 6
// - TreeIcon: if the inlined pine SVG ends up feeling off-brand
//   alongside the rest of the line-icon set, design a custom one
// - Avatar image upload flow (currently letter initial only)
// - Real auth state so name/initial come from a user context
//   instead of the lib/user.ts placeholder

type StatsRow = {
  value: string
  label: string
}

const STATS: readonly StatsRow[] = [
  { value: "47", label: "Trees grown" },
  { value: "12", label: "Day streak" },
  { value: "247", label: "Tasks done" },
]

export default function ProfilePage() {
  // Toggle state for the two settings rows; inlined here pending a
  // DS Toggle primitive. Both default ON to match the spec.
  const [notificationsOn, setNotificationsOn] = React.useState(true)
  const [soundOn, setSoundOn] = React.useState(true)

  return (
    <div className="flex flex-col px-4 py-8">
      <IdentitySection />
      <StatsCard />
      <SectionHeading>Settings</SectionHeading>
      <Card className="p-0 overflow-hidden flex flex-col">
        <ToggleRow
          label="Notifications"
          checked={notificationsOn}
          onChange={setNotificationsOn}
        />
        <Divider />
        <ToggleRow
          label="Sound effects"
          checked={soundOn}
          onChange={setSoundOn}
        />
        <Divider />
        <ChevronRow label="Daily forest visit" trailingValue="9:00 AM" />
        <Divider />
        <ChevronRow label="Privacy" />
      </Card>
      <SectionHeading className="mt-6">Account</SectionHeading>
      <Card className="p-0 overflow-hidden flex flex-col">
        <ChevronRow label="Help and support" />
        <Divider />
        <ChevronRow label="About Focus Forest" />
        <Divider />
        <SignOutRow />
      </Card>
    </div>
  )
}

// ── Identity section ──────────────────────────────────────────────
// Avatar + edit badge on the left, name + level pill stacked on the
// right. Avatar is 80x80 moss circle; edit badge is a 26x26 yellow
// circle with a 2px primary-green ring for visual lift off the
// avatar (positioned bottom-right of the avatar). box-content keeps
// the 26x26 the inner size so the ring sits outside.
function IdentitySection() {
  const initial = USER_NAME.charAt(0).toUpperCase()
  return (
    <section className="flex items-center gap-4 pb-7">
      <div className="relative flex-shrink-0">
        {/* Optical centering of the initial.
         *
         *  flex items-center centers the line typographically,
         *  which for Niramit at 38px in an 80px circle leaves the
         *  glyph ~4px below the circle's geometric center — the
         *  font's baseline metrics include room for descenders the
         *  "S" doesn't use. Pixel-measured by scanning the
         *  rendered screenshot's white pixels (with the edit-badge
         *  quadrant excluded). A -4px transform on the inner span
         *  lands the glyph within 0.5px of center (~26px of
         *  whitespace above and below the glyph).
         *
         *  Inline `transform` instead of the Tailwind `-translate-y-*`
         *  utility — in v4 those emit the new `translate:` CSS
         *  property which composes unpredictably with inline-block
         *  baseline alignment here. Plain `transform: translateY`
         *  is unambiguous. */}
        <div
          aria-hidden="true"
          className="w-20 h-20 rounded-pill bg-moss flex items-center justify-center font-display text-white text-[38px] font-medium leading-none"
        >
          <span style={{ transform: "translateY(-4px)" }}>{initial}</span>
        </div>
        <button
          type="button"
          aria-label="Edit profile"
          className={cn(
            "absolute bottom-0 right-0",
            "w-6 h-6 box-content rounded-pill",
            "bg-yellow text-white",
            "border-2 border-primary",
            "flex items-center justify-center",
            "cursor-pointer outline-none",
            "focus-visible:outline-2 focus-visible:outline-yellow focus-visible:outline-offset-2"
          )}
        >
          <PencilIcon />
        </button>
      </div>
      <div className="flex flex-col gap-2.5 min-w-0">
        <h1 className="font-display text-h3 text-white">{USER_NAME}</h1>
        <span className="inline-flex items-center gap-1.5 self-start bg-yellow text-black rounded-pill px-3 py-1.5">
          <TreeIcon />
          <span className="font-body text-caption font-normal">
            Level 5 · explorer
          </span>
        </span>
      </div>
    </section>
  )
}

// ── Stats card — "Your journey" ───────────────────────────────────
// Translucent glass card with a label + 3-column number grid.
function StatsCard() {
  return (
    <Card className="p-4 mb-8">
      <h2 className="font-display text-h4 text-white mb-3">
        Your journey
      </h2>
      <div className="grid grid-cols-3 gap-2">
        {STATS.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center">
            <span className="font-display text-h2 text-white leading-none">
              {stat.value}
            </span>
            <span className="font-body text-body text-white/70 mt-2 text-center">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </Card>
  )
}

// ── Section heading (Settings / Account) ──────────────────────────
// Uses the DS --text-h4 token (16px / Display / Semi-Bold 600) in
// pure white. Previously rendered at text-caption white/65 (iOS-
// style muted group label); promoted to h4 in the heading-tokenization
// pass.
function SectionHeading({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <h2
      className={cn(
        "font-display text-h4 text-white pl-1 mb-2",
        className
      )}
    >
      {children}
    </h2>
  )
}

// Hairline divider between settings rows. 0.5px is approximated by
// a 1px white/10 border (the lower opacity keeps it perceptually
// hairline against the glass surface).
function Divider() {
  return <div aria-hidden="true" className="h-px bg-white/10 mx-4" />
}

// ── Row primitives ────────────────────────────────────────────────
const ROW_BASE =
  "flex items-center px-4 py-3.5 text-white font-body text-list-label"

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (next: boolean) => void
}) {
  return (
    <div className={ROW_BASE}>
      <span className="flex-1">{label}</span>
      <Toggle checked={checked} onChange={onChange} ariaLabel={label} />
    </div>
  )
}

function ChevronRow({
  label,
  trailingValue,
}: {
  label: string
  trailingValue?: string
}) {
  return (
    <button
      type="button"
      className={cn(
        ROW_BASE,
        "w-full text-left cursor-pointer outline-none",
        "focus-visible:outline-2 focus-visible:outline-yellow focus-visible:-outline-offset-2"
      )}
    >
      <span className="flex-1">{label}</span>
      {trailingValue && (
        <span className="font-body text-body text-white/70 mr-2">
          {trailingValue}
        </span>
      )}
      <ChevronRightIcon className="text-white/40" />
    </button>
  )
}

function SignOutRow() {
  return (
    <button
      type="button"
      className={cn(
        ROW_BASE,
        "w-full text-left cursor-pointer outline-none font-medium",
        "focus-visible:outline-2 focus-visible:outline-yellow focus-visible:-outline-offset-2"
      )}
    >
      Sign out
    </button>
  )
}

// ── Inline Toggle ─────────────────────────────────────────────────
// 36x22 track, 18x18 knob, 2px inset. Yellow track when ON, white/20
// when OFF. Knob is white; translates the track width minus the knob
// minus 2*inset. Phase 6: lift into components/ui/toggle.tsx.
function Toggle({
  checked,
  onChange,
  ariaLabel,
}: {
  checked: boolean
  onChange: (next: boolean) => void
  ariaLabel: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative w-9 h-[22px] rounded-pill p-0.5 transition-colors duration-150 cursor-pointer",
        "outline-none focus-visible:outline-2 focus-visible:outline-yellow focus-visible:outline-offset-2",
        checked ? "bg-yellow" : "bg-white/20"
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "block w-[18px] h-[18px] rounded-pill bg-white",
          "transition-transform duration-150 ease-out",
          checked ? "translate-x-3.5" : "translate-x-0"
        )}
      />
    </button>
  )
}
