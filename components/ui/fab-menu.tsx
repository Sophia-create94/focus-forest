"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { useRouter } from "next/navigation"

import { BottomNavFab } from "@/components/ui/bottom-nav"
import {
  AddIcon,
  CalendarIcon,
  TodoIcon,
  CountdownIcon,
} from "@/components/ui/icons"
import { cn } from "@/lib/utils"

// FabMenu — the central BottomNav FAB plus its expansion overlay
// and three sub-actions (Calendar / To-do-list / Countdown). Owns
// the isExpanded state internally.
//
// Renders in two DOM locations:
// - The BottomNavFab button stays in the BottomNav's flex slot
//   (rendered inline by this component)
// - The overlay + sub-actions render via createPortal into the
//   layout's outer container (selector: [data-fab-portal]) so
//   absolute inset-0 scopes the dim overlay to the iPhone frame
//   rather than leaking onto the desktop cream chrome
//
// FAB icon: AddIcon, rotated to 45deg (→ ×) when expanded with
// transition-transform duration-200 ease-out for a smooth toggle.
// FAB background: bg-yellow (default) → bg-moss when expanded,
// matching the design preview's "open" treatment. tailwind-merge
// in cn() resolves the bg conflict against BottomNavFab's cva base.
//
// Sub-actions: arc layout with the middle one (To-do-list)
// elevated via mb-10 (40px upward offset). Each sub-action is a
// 52×52 white circle containing the existing brand icon stroked
// in text-primary (#3B7A57). Click closes the menu and routes
// to the corresponding Events sub-view.
//
// Phase 6 follow-ups (consolidated):
// - Spring fan-out animation for sub-actions (currently appear instant)
// - Smooth fade for the overlay (currently appears instant)
// - Escape key closes the menu
// - Focus management: focus moves to first sub-action on expand,
//   returns to FAB on collapse
// - Reduce-motion respect for FAB rotation + sub-action animations
// - Sub-action click opens inline add-modal at current screen
//   instead of navigating to the section
// - Real CRUD: actual "add new" flows wired to data sources

type SubActionSpec = {
  icon: React.ReactNode
  label: string
  route: string
  elevated?: boolean
}

const SUB_ACTIONS: SubActionSpec[] = [
  {
    icon: <CalendarIcon width={22} height={22} />,
    label: "Calendar",
    route: "/plans/calendar",
  },
  {
    icon: <TodoIcon width={22} height={22} />,
    label: "To-do-list",
    route: "/plans/todo",
    elevated: true,
  },
  {
    icon: <CountdownIcon width={22} height={22} />,
    label: "Countdown",
    route: "/plans/countdown",
  },
]

function FabMenu() {
  const [isExpanded, setIsExpanded] = React.useState(false)
  const [portalTarget, setPortalTarget] = React.useState<Element | null>(null)
  const router = useRouter()

  // Locate the portal target after mount. The layout's outer div
  // carries data-fab-portal so the overlay's absolute inset-0 stays
  // scoped to the iPhone frame.
  React.useEffect(() => {
    setPortalTarget(document.querySelector("[data-fab-portal]"))
  }, [])

  const close = React.useCallback(() => setIsExpanded(false), [])

  const handleSubAction = (route: string) => {
    close()
    router.push(route)
  }

  return (
    <>
      <BottomNavFab
        icon={
          <AddIcon
            className={cn(
              "transition-transform duration-200 ease-out",
              isExpanded && "rotate-45"
            )}
          />
        }
        label={isExpanded ? "Close" : "Add"}
        aria-expanded={isExpanded}
        aria-haspopup="menu"
        onClick={() => setIsExpanded((v) => !v)}
        className={cn(isExpanded && "bg-moss hover:bg-moss")}
      />

      {isExpanded && portalTarget &&
        createPortal(
          <>
            <button
              type="button"
              aria-label="Close menu"
              onClick={close}
              className="absolute inset-0 z-30 bg-black/40 cursor-pointer"
            />
            <div
              role="menu"
              aria-label="Add new item"
              className="absolute bottom-24 left-0 right-0 z-40 flex items-end justify-around px-8"
            >
              {SUB_ACTIONS.map((action) => (
                <SubAction
                  key={action.route}
                  icon={action.icon}
                  label={action.label}
                  elevated={action.elevated}
                  onClick={() => handleSubAction(action.route)}
                />
              ))}
            </div>
          </>,
          portalTarget
        )}
    </>
  )
}

type SubActionProps = {
  icon: React.ReactNode
  label: string
  elevated?: boolean
  onClick: () => void
}

function SubAction({ icon, label, elevated, onClick }: SubActionProps) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "flex flex-col items-center cursor-pointer",
        // Yellow focus ring matching the brand convention shared by
        // Button, BottomNav, ScreenTabs.
        "outline-none focus-visible:outline-2 focus-visible:outline-yellow focus-visible:outline-offset-2 rounded-pill",
        // Middle sub-action sits 40px higher than its siblings to
        // form the arc shape.
        elevated && "mb-10"
      )}
    >
      <div
        className={cn(
          "size-[52px] rounded-pill bg-white text-primary",
          "flex items-center justify-center",
          "shadow-[0_4px_18px_rgba(0,0,0,0.3)]",
          "transition-transform duration-150 ease-out",
          "active:scale-95"
        )}
      >
        {icon}
      </div>
      <span className="font-body text-caption font-medium text-white mt-2 [text-shadow:0_1px_6px_rgba(0,0,0,0.5)]">
        {label}
      </span>
    </button>
  )
}

export { FabMenu }
