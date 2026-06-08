import { PhoneFrame } from "@/components/phone-frame"
import { StatusBar } from "@/components/ui/status-bar"
import Link from "next/link"

// Lock screen for the /lock route. Strict 1:1 implementation of
// _design-system-reference/preview/components-notification.html (canonical
// Design System source per Rule 7).
//
// Presentational — no useState, no "use client" directive. Action buttons
// are real <button> elements (clickable, focusable) but produce no visible
// feedback per DS spec (no picked state, no choice tracking).
//
// Context adaptation: DS uses min-height of 560px on the frame because
// the preview file has no parent container; in v2 PhoneFrame provides the
// container, so h-full achieves the same fill-parent visual outcome.
//
// Wallpaper is an inline dawn gradient — explicitly NOT a brand token per
// DS comment: "Lock-screen wallpaper is NOT a Focus Forest design token...
// user-controlled at the OS level. The only Focus Forest-owned element on
// the lock screen is the notification card content."
//
// System fonts (font-system, font-system-rounded) consumed for OS-context
// chrome (status bar, date, clock, notification card, action stack).
// font-display Niramit / font-body Source Sans 3 NOT used here — strict
// DS compliance simulates iPhone OS chrome.
//
// Home indicator: interactive <Link> to / with subtle hover/focus-visible
// polish (opacity lift on hover, yellow focus ring matching Button/Checkbox/Tabs).
// Brand-consistent affordance without breaking DS spec.

export default function LockPage() {
  return (
    <PhoneFrame>
      <div
        className="relative h-full"
        style={{
          background:
            "linear-gradient(180deg, #DB9590 0%, #B494BF 50%, #52729C 100%)",
        }}
      >
        {/* Status bar — shared StatusBar primitive so it matches the rest of
            the app 1:1 (same time, icons, sizing as a real iPhone). A subtle
            drop-shadow keeps the white chrome legible over the wallpaper. */}
        <StatusBar className="[filter:drop-shadow(0_1px_2px_rgba(0,0,0,0.25))]" />

        {/* Lock-screen content (status bar is full-bleed above; everything
            else gets the standard horizontal padding) */}
        <div className="px-4">
        {/* Lock icon */}
        <div className="flex justify-center mt-0.5 mb-1.5 [filter:drop-shadow(0_1px_2px_rgba(0,0,0,0.25))]">
          <svg aria-hidden="true" width="14" height="17" viewBox="0 0 14 17" fill="#fff">
            <path d="M7 0a4 4 0 014 4v3h1.2c.4 0 .8.4.8.9v8c0 .5-.4.9-.8.9H1.8c-.4 0-.8-.4-.8-.9V8c0-.5.4-.9.8-.9H3V4a4 4 0 014-4zm0 1.5A2.5 2.5 0 004.5 4v3h5V4A2.5 2.5 0 007 1.5z" />
          </svg>
        </div>

        {/* Date — ABOVE clock per iOS spec */}
        <time
          dateTime="2030-06-03"
          className="block text-center text-white font-system-rounded text-[22px] font-medium leading-[1.2] mb-3.5 [text-shadow:0_1px_2px_rgba(0,0,0,0.25)]"
        >
          Monday, June 3
        </time>

        {/* Clock */}
        <time
          dateTime="09:41"
          className="block text-center text-white font-system-rounded text-[96px] font-light leading-none mb-[22px] [text-shadow:0_1px_2px_rgba(0,0,0,0.25)]"
        >
          9:41
        </time>

        {/* Notification card — translucent white + backdrop blur */}
        <article
          aria-labelledby="lock-notif-title"
          className="bg-white/95 [backdrop-filter:blur(20px)] [-webkit-backdrop-filter:blur(20px)] rounded-[18px] p-3.5 shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
        >
          <div className="flex items-center gap-2 mb-[5px]">
            <div
              aria-hidden="true"
              className="size-6 rounded-[6px] bg-primary flex items-center justify-center text-white font-system-rounded text-[13px] font-bold flex-shrink-0"
            >
              ff
            </div>
            <span className="flex-1 font-system text-[13px] font-medium uppercase tracking-[0.3px] text-[rgba(60,60,67,0.6)]">
              focusforest
            </span>
            <span className="font-system text-[13px] text-[rgba(60,60,67,0.6)]">
              now
            </span>
          </div>
          <h2
            id="lock-notif-title"
            className="font-system text-[15px] font-semibold text-[rgba(0,0,0,0.9)] leading-[1.3] mb-0.5"
          >
            Time for sports
          </h2>
          <p className="font-system text-[15px] text-[rgba(0,0,0,0.8)] leading-[1.35]">
            You wanted to do sports today. Please choose from the below.
          </p>
        </article>

        {/* Action stack — translucent white + backdrop blur */}
        <div className="mt-2 bg-white/85 [backdrop-filter:blur(20px)] [-webkit-backdrop-filter:blur(20px)] rounded-[14px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
          <button
            type="button"
            className="block w-full h-[57px] px-4 bg-transparent border-b-[0.5px] border-[rgba(60,60,67,0.18)] font-system text-[17px] text-[#007AFF] text-center cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-yellow focus-visible:outline-offset-2"
          >
            I will do it later
          </button>
          <button
            type="button"
            className="block w-full h-[57px] px-4 bg-transparent border-b-[0.5px] border-[rgba(60,60,67,0.18)] font-system text-[17px] text-[#007AFF] text-center cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-yellow focus-visible:outline-offset-2"
          >
            Start tracking
          </button>
          <button
            type="button"
            className="block w-full h-[57px] px-4 bg-transparent font-system text-[17px] text-[#007AFF] text-center cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-yellow focus-visible:outline-offset-2"
          >
            I am done
          </button>
        </div>
        </div>

        {/* Utility buttons — flashlight (left) and camera (right), anchored
            near the bottom edge just above the home indicator, matching a
            real iPhone lock screen. Decorative: no pointer cursor. */}
        <button
          type="button"
          aria-label="Flashlight"
          className="absolute bottom-8 left-6 size-[50px] rounded-pill bg-black/25 flex items-center justify-center cursor-default outline-none focus-visible:outline-2 focus-visible:outline-yellow focus-visible:outline-offset-2"
        >
          <svg width="23" height="23" viewBox="0 0 22 22" fill="#fff" aria-hidden="true">
            <path d="M7.4 5h7.2l-1.1-2.4a1.2 1.2 0 00-1.1-.7H9.6a1.2 1.2 0 00-1.1.7L7.4 5zM6.8 6.4a.9.9 0 00-.3.7v1.5c0 .4.2.7.5.9l.6.3v9.6c0 1 .8 1.7 1.7 1.7h3.4c1 0 1.7-.8 1.7-1.7V9.8l.6-.3c.3-.2.5-.5.5-.9V7.1a.9.9 0 00-.3-.7H6.8z" />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Camera"
          className="absolute bottom-8 right-6 size-[50px] rounded-pill bg-black/25 flex items-center justify-center cursor-default outline-none focus-visible:outline-2 focus-visible:outline-yellow focus-visible:outline-offset-2"
        >
          <svg width="22" height="20" viewBox="0 0 22 20" fill="#fff" aria-hidden="true">
            <path d="M3 5h2.8l1.5-2.5h7.4L16.2 5H19a2 2 0 012 2v9a2 2 0 01-2 2H3a2 2 0 01-2-2V7a2 2 0 012-2zm8 3.5a4 4 0 100 8 4 4 0 000-8z" />
          </svg>
        </button>

        {/* Home indicator — Link to / with subtle hover/focus polish */}
        <Link
          href="/"
          className="absolute left-1/2 bottom-2 -translate-x-1/2 w-[134px] h-[5px] bg-white/90 rounded-[3px] cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-yellow focus-visible:outline-offset-2 hover:bg-white active:scale-95 transition-all duration-150"
          aria-label="Go to home"
        />
      </div>
    </PhoneFrame>
  )
}
