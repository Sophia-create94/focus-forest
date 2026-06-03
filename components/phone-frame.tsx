import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PhoneFrameProps {
  children: ReactNode;
  className?: string;
}

export function PhoneFrame({ children, className }: PhoneFrameProps) {
  return (
    <div
      data-phone-frame
      className={cn(
        // Mobile-first (< md:): fill the device viewport directly.
        // w-screen + h-[100dvh] decouple sizing from the parent flex
        // chain. Prior `w-full h-full` collapsed to 0 on real iOS
        // Safari because `min-h-screen` on body and `flex-1` on the
        // wrapper don't propagate an explicit height for percentage
        // resolution — h-full resolved to 0%, the whole frame
        // disappeared, and body's bg-cream showed through.
        //
        // 100dvh = dynamic viewport height; adjusts as iOS Safari's
        // URL bar shows/hides. Supported in Chrome 108+, Safari 15.4+,
        // Firefox 101+.
        //
        // bg-primary is the defensive underlay so any brief moment
        // before child content renders shows brand green rather than
        // body's cream. overflow-hidden clips any content that tries
        // to spill out of the device frame.
        "relative w-screen h-[100dvh] overflow-hidden bg-primary",
        // Desktop (md:+): framed 414×868 device with black bezel and
        // device shadow, centered inside the cream chrome layer.
        // md:w/h override the mobile viewport dimensions; md:bg-black
        // overrides bg-primary for the bezel surface.
        "md:w-[var(--phone-frame-width)] md:h-[var(--phone-frame-height)]",
        "md:rounded-[var(--phone-frame-outer-radius)]",
        "md:bg-black md:shadow-[var(--shadow-device)]",
        className
      )}
    >
      {/* Dynamic island: hidden on mobile, visible on desktop.
       * Positioned at top inside screen viewport, z-indexed above content.
       * StatusBar shares this top band with flex justify-between;
       * the island sits centered between left and right groups. */}
      <div
        aria-hidden="true"
        className={cn(
          "hidden md:block",
          "absolute left-1/2 -translate-x-1/2 pointer-events-none",
          "w-[var(--phone-frame-island-width)] h-[var(--phone-frame-island-height)]",
          "top-[var(--phone-frame-island-top)]",
          "rounded-[var(--phone-frame-island-radius)] bg-black z-30"
        )}
      />

      {/* Screen viewport: fullscreen on mobile, inset bezel on desktop.
       *
       * On desktop the rounding is done via clip-path (not
       * border-radius + overflow:hidden). Chromium promotes the
       * viewport to a composited layer because descendants use
       * backdrop-filter (AppHeader, BottomNav) and react portal
       * (FabMenu). For composited layers, border-radius + overflow:
       * hidden does NOT clip the layer's bg-color paint — only DOM
       * children. The result is that the green bg-primary canvas
       * inside paints rectangularly, bleeding into the bezel curve
       * at the four corners. clip-path is honored at the compositor
       * level and clips both paint AND children.
       *
       * `isolate` is kept so the viewport remains a proper stacking
       * context for the portal overlay z-index. */}
      <div
        className={cn(
          "absolute inset-0 overflow-hidden isolate",
          "md:inset-[var(--phone-frame-bezel)]",
          "md:[clip-path:inset(0_round_var(--phone-frame-inner-radius))]"
        )}
      >
        {children}
      </div>
    </div>
  );
}
