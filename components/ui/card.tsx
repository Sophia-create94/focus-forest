import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

// Glass tokens (--surface-card-*) consumed via Tailwind arbitrary
// properties rather than inline style — keeps consumer style-prop
// pass-through from wiping out the glass effect.
const cardVariants = cva(
  "block p-4",
  {
    variants: {
      variant: {
        glass: [
          "text-white",
          "[background:var(--surface-card-bg)]",
          "[backdrop-filter:var(--surface-card-blur)]",
          "[-webkit-backdrop-filter:var(--surface-card-blur)]",
          "[border:var(--surface-card-border)]",
          "[border-radius:var(--surface-card-radius)]",
        ].join(" "),
      },
    },
    defaultVariants: {
      variant: "glass",
    },
  }
)

function Card({
  className,
  variant = "glass",
  asChild = false,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof cardVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "div"

  return (
    <Comp
      data-slot="card"
      data-variant={variant}
      className={cn(cardVariants({ variant, className }))}
      {...props}
    />
  )
}

export { Card, cardVariants }
