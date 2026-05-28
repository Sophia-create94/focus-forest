import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

// Asymmetric vertical padding (14 top / 18 bottom for primary/secondary;
// 12.5 / 16.5 for ghost where the 1.5px border eats into the box) is the
// design-system fix for Niramit Medium's high cap-height.
// Reference: _design-system-reference/preview/components-buttons.html.
const buttonVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap select-none",
    "h-[52px] min-w-[120px] max-w-[280px] box-border",
    "rounded-pill font-display text-button",
    "cursor-pointer disabled:cursor-not-allowed",
    "transition-all duration-150 ease-out",
    "outline-none focus-visible:outline-2 focus-visible:outline-yellow focus-visible:outline-offset-2 focus-visible:shadow-none",
    "[&_svg]:size-3.5 [&_svg]:shrink-0 [&_svg]:pointer-events-none",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: [
          "bg-yellow text-black border-0",
          "px-4 pt-[14px] pb-[18px]",
          "shadow-[0_4px_12px_rgba(0,0,0,0.15)]",
          "hover:bg-[#E29A28]",
          "active:bg-yellow-dark active:shadow-none",
          "disabled:bg-grey-light disabled:text-black/40 disabled:shadow-none",
        ].join(" "),
        secondary: [
          "bg-yellow-dark text-black border-0",
          "px-4 pt-[14px] pb-[18px]",
          "shadow-[0_4px_12px_rgba(0,0,0,0.15)]",
          "hover:bg-[#D78A07]",
          "active:bg-[#C97D08] active:shadow-none",
          "disabled:bg-grey-light disabled:text-black/40 disabled:shadow-none",
        ].join(" "),
        ghost: [
          "bg-transparent text-white border-[1.5px] border-white",
          "pt-[12.5px] pb-[16.5px] px-[14.5px]",
          "hover:bg-white/8",
          "active:bg-white/15",
          "disabled:bg-transparent disabled:border-white/30 disabled:text-white/30",
        ].join(" "),
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
)

function Button({
  className,
  variant = "primary",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      className={cn(buttonVariants({ variant, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
