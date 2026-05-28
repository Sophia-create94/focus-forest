import { redirect } from "next/navigation"

// Plans root redirect — direct URL hits to /plans land on the
// To-Do sub-view by default. The Plans section has no own page
// content; its layout renders the ScreenTabs strip plus whichever
// sub-route is active (todo / calendar / countdown).

export default function PlansPage() {
  redirect("/plans/todo")
}
