import * as React from "react"

import { cn } from "@/lib/utils"

// Reference: _design-system-reference/ui_kits/mobile/StatusBar.jsx
// Production-scale OS chrome simulation: time on left, three icons on right.
// Center band (~140px) reserved for the dynamic island; flex justify-between
// keeps left/right groups out of that space.
// aria-hidden — purely decorative chrome with zero semantic value.

type StatusBarProps = React.HTMLAttributes<HTMLDivElement>

export function StatusBar({ className, ...props }: StatusBarProps) {
  return (
    <div
      data-slot="status-bar"
      aria-hidden="true"
      className={cn(
        "h-[50px] flex-shrink-0",
        "pt-[14px] px-5 pb-0",
        "flex items-center justify-between",
        className
      )}
      {...props}
    >
      <span className="font-system font-semibold text-[17px] text-white tracking-[0.01em]">
        9:41
      </span>
      <div className="flex items-center gap-[5px]">
        {/* Signal */}
        <svg width="18" height="12" viewBox="0 0 18 12" fill="white">
          <rect x="0" y="7" width="3.2" height="5" rx="0.8" />
          <rect x="4.7" y="4.5" width="3.2" height="7.5" rx="0.8" />
          <rect x="9.4" y="2" width="3.2" height="10" rx="0.8" />
          <rect x="14.1" y="0" width="3.2" height="12" rx="0.8" opacity="0.3" />
        </svg>
        {/* WiFi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="white">
          <path d="M8 10a1.3 1.3 0 110 2.6A1.3 1.3 0 018 10z" />
          <path d="M3.5 6.2a6.4 6.4 0 019 0L11.1 7.6a4.5 4.5 0 00-6.2 0L3.5 6.2z" />
          <path d="M.5 3.3a10.4 10.4 0 0115 0L14.1 4.7a8.6 8.6 0 00-12.2 0L.5 3.3z" />
        </svg>
        {/* Battery */}
        <svg width="26" height="13" viewBox="0 0 26 13" fill="none">
          <rect
            x="0.6"
            y="0.6"
            width="22"
            height="11.8"
            rx="2.8"
            stroke="white"
            strokeWidth="1.3"
          />
          <rect x="2" y="2" width="16.5" height="9" rx="1.8" fill="white" />
          <path d="M24.1 4.5v4a2 2 0 000-4z" fill="white" opacity="0.55" />
        </svg>
      </div>
    </div>
  )
}
