import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Tabs as TabsPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

// Reference: _design-system-reference/ui_kits/mobile/index.html .tab-item
// (no preview file exists; UI-kit is the implementation reference for Tabs).
// focus ring + disabled styling are spec-silent additions for a11y.
const tabsListVariants = cva(
  "flex",
  {
    variants: {
      variant: {
        default: "border-b border-white/10 px-3",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const tabsTriggerVariants = cva(
  [
    "font-body text-list-label",
    "pt-[9px] px-[14px] pb-[10px]",
    "border-b-[2.5px] border-b-transparent",
    "cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
    "outline-none focus-visible:outline-2 focus-visible:outline-yellow focus-visible:outline-offset-2",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "text-white/60",
          "data-[state=active]:text-white",
          "data-[state=active]:border-b-white",
          "data-[state=active]:font-semibold",
        ].join(" "),
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn(className)}
      {...props}
    />
  )
}

function TabsList({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> &
  VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant, className }))}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger> &
  VariantProps<typeof tabsTriggerVariants>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      data-variant={variant}
      className={cn(tabsTriggerVariants({ variant, className }))}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(
        "outline-none focus-visible:outline-2 focus-visible:outline-yellow focus-visible:outline-offset-2",
        className
      )}
      {...props}
    />
  )
}

export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  tabsListVariants,
  tabsTriggerVariants,
}
