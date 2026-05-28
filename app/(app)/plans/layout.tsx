import * as React from "react"

import { ScreenTabs } from "@/components/screen-tabs"

// Plans section layout — composes the sticky ScreenTabs strip
// above whichever sub-route renders inside children. The (app)
// route group's parent layout provides the main scroll container;
// ScreenTabs handles its own sticky positioning within that scroll
// context. Layout itself is a Server Component (no client features
// needed); ScreenTabs is the client boundary.
//
// Tab order and labels preserved from the existing UI: Calendar,
// To-do-list, Countdown. Default landing for the "Plans" BottomNav
// tab (route /plans) is /plans/todo so the To-do-list tab is
// active by default.

const PLANS_TABS = [
  { href: "/plans/calendar", label: "Calendar" },
  { href: "/plans/todo", label: "To-do-list" },
  { href: "/plans/countdown", label: "Countdown" },
] as const

export default function PlansLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <ScreenTabs tabs={PLANS_TABS} ariaLabel="Plans sub-views" />
      <div>{children}</div>
    </>
  )
}
