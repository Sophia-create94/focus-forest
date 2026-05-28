import * as React from "react"

import { cn } from "@/lib/utils"

// Brand icon set — 8 icons from preview/brand-iconography.html plus
// 1 (countdown) from preview/components-fab.html (deferred sync to
// add to iconography.html). Each icon faithfully reproduces its source
// SVG; currentColor for stroke/fill; aria-hidden by default unless
// aria-label is provided.
//
// TodayIcon is a sun (inner circle + 8 rays). It replaced the earlier
// target/crosshair when the 4th nav slot became "Today" — the sun
// reads as "today / day" universally and stays distinct from the
// Events calendar icon at nav size.

type SvgProps = React.SVGProps<SVGSVGElement>

function Svg({
  name,
  children,
  "aria-label": ariaLabel,
  className,
  ...props
}: SvgProps & { name: string; children: React.ReactNode }) {
  return (
    <svg
      data-slot="icon"
      data-icon={name}
      {...(ariaLabel
        ? { role: "img" as const, "aria-label": ariaLabel }
        : { "aria-hidden": true as const })}
      className={cn(className)}
      {...props}
    >
      {children}
    </svg>
  )
}

export function HomeIcon(props: SvgProps) {
  return (
    <Svg name="home" width={22} height={20} viewBox="0 0 22 20" fill="currentColor" {...props}>
      <path d="M9 19v-6h4v6h5v-8h3L11 1 1 11h3v8z" />
    </Svg>
  )
}

export function ProfileIcon(props: SvgProps) {
  return (
    <Svg name="profile" width={20} height={20} viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <circle cx="11" cy="7" r="4" />
      <path d="M3 20c0-4.4 3.6-8 8-8s8 3.6 8 8" />
    </Svg>
  )
}

export function CalendarIcon(props: SvgProps) {
  return (
    <Svg name="calendar" width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </Svg>
  )
}

export function TodoIcon(props: SvgProps) {
  return (
    <Svg name="to-do" width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" {...props}>
      <polyline points="9 11 12 14 22 4" />
      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
    </Svg>
  )
}

export function TrashIcon(props: SvgProps) {
  return (
    <Svg name="trash" width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </Svg>
  )
}

export function AddIcon(props: SvgProps) {
  return (
    <Svg name="add" width={22} height={22} viewBox="0 0 26 26" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" {...props}>
      <line x1="13" y1="4" x2="13" y2="22" />
      <line x1="4" y1="13" x2="22" y2="13" />
    </Svg>
  )
}

export function CountdownIcon(props: SvgProps) {
  return (
    <Svg name="countdown" width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </Svg>
  )
}

export function PencilIcon(props: SvgProps) {
  return (
    <Svg name="pencil" width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </Svg>
  )
}

export function TreeIcon(props: SvgProps) {
  return (
    <Svg name="tree" width={14} height={14} viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2 4.5 12H8L3 19h7v3h4v-3h7l-5-7h3.5L12 2z" />
    </Svg>
  )
}

export function ChevronRightIcon(props: SvgProps) {
  return (
    <Svg name="chevron-right" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="9 6 15 12 9 18" />
    </Svg>
  )
}

export function TodayIcon(props: SvgProps) {
  return (
    <Svg name="today" width={20} height={20} viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="11" cy="11" r="3.5" />
      <line x1="11" y1="2" x2="11" y2="3.5" />
      <line x1="11" y1="18.5" x2="11" y2="20" />
      <line x1="2" y1="11" x2="3.5" y2="11" />
      <line x1="18.5" y1="11" x2="20" y2="11" />
      <line x1="4.5" y1="4.5" x2="5.5" y2="5.5" />
      <line x1="16.5" y1="16.5" x2="17.5" y2="17.5" />
      <line x1="4.5" y1="17.5" x2="5.5" y2="16.5" />
      <line x1="16.5" y1="5.5" x2="17.5" y2="4.5" />
    </Svg>
  )
}
