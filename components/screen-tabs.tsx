"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

// ScreenTabs — URL-driven section tab strip. Each tab is a Next.js
// Link to a sub-route; active state derived from usePathname() via
// prefix match. Used by section-level layouts (currently
// app/(app)/plans/layout.tsx) to provide consistent in-app tab
// navigation across sub-routes.
//
// Refactored from a Radix Tabs state-driven implementation after the
// Events section refactor revealed the parallel EventsTabs component
// mistake: the Radix Tabs primitive provides button + role="tab"
// semantics (panel switching), which are wrong for URL navigation
// (anchor + aria-current="page"). One component, one mode — keeping
// it URL-driven only avoids the "two components in one trench coat"
// dual-mode complexity since this is the only navigation tab strip
// pattern in the app.
//
// Phase 6 follow-up: future tab strips should reuse this component
// rather than creating parallel ones, to maintain a single tab pattern
// across the design system.
//
// Sticky positioning baked in — this component IS the section chrome
// strip. bg-primary opaque background covers content scrolling beneath.
// Computed height ≈ 46px (typography + padding + borders); the
// Calendar sub-route's WeekStrip offsets to top-[46px] to stack
// below this strip. Phase 6 follow-up: tokenize the strip height as
// a CSS variable so the WeekStrip and AgendaCard offsets reference
// a single source of truth.

type ScreenTab = {
  href: string
  label: string
}

export type ScreenTabsProps = {
  tabs: readonly ScreenTab[]
  ariaLabel?: string
}

export function ScreenTabs({ tabs, ariaLabel }: ScreenTabsProps) {
  const pathname = usePathname()
  return (
    <nav
      aria-label={ariaLabel ?? "Section sub-views"}
      className={cn(
        "sticky top-0 z-20 bg-primary",
        "flex border-b border-white/10 px-3"
      )}
    >
      {tabs.map((tab) => {
        const isActive = pathname.startsWith(tab.href)
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "font-body text-list-label",
              "pt-[9px] px-[14px] pb-[10px]",
              "border-b-[2.5px]",
              "transition-colors duration-150",
              "outline-none focus-visible:outline-2 focus-visible:outline-yellow focus-visible:outline-offset-2",
              isActive
                ? "text-white border-b-white font-semibold"
                : "text-white/60 border-b-transparent hover:text-white/80"
            )}
          >
            {tab.label}
          </Link>
        )
      })}
    </nav>
  )
}
