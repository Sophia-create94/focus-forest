import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Checkbox as CheckboxPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

// Reference: _design-system-reference/preview/components-todo-rows.html.
// focus ring + indeterminate styling are spec-silent additions for a11y.
const checkboxVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center",
    "size-[17px] rounded-checkbox border-[1.8px]",
    "cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
    "outline-none focus-visible:outline-2 focus-visible:outline-yellow focus-visible:outline-offset-2",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "border-white/75 text-white",
          "data-[state=checked]:bg-white/30 data-[state=checked]:border-white/50",
          "data-[state=indeterminate]:bg-white/30 data-[state=indeterminate]:border-white/50",
        ].join(" "),
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Checkbox({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root> &
  VariantProps<typeof checkboxVariants>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      data-variant={variant}
      className={cn(checkboxVariants({ variant, className }))}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center">
        <svg
          className="size-3"
          viewBox="0 0 14 14"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <polyline points="3 7 6 10 11 4" />
        </svg>
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox, checkboxVariants }
