import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Reference: _design-system-reference/preview/components-input.html.
// outline-none deliberate — focus indicator is the bg opacity shift,
// not a ring (per spec).
const inputVariants = cva(
  "outline-none disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default: [
          "bg-white/18 border border-white/25",
          "text-white placeholder:text-white/45",
          "font-body text-body",
          "py-[9px] px-[14px]",
          "rounded-input",
          "focus:bg-white/28",
        ].join(" "),
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Input({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"input"> &
  VariantProps<typeof inputVariants>) {
  return (
    <input
      data-slot="input"
      data-variant={variant}
      className={cn(inputVariants({ variant, className }))}
      {...props}
    />
  )
}

export { Input, inputVariants }
