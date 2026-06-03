import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Reference: _design-system-reference/preview/components-bottom-nav.html
// Reference: _design-system-reference/preview/colors-product-greens.html (glass surface tokens)
// BottomNav is a layout container for the five nav items + central FAB.
// The FAB uses negative margin (-mt-30px) to lift above the bar baseline.
// Focus ring may visually collide with screen content above BottomNav due
// to the lift; acceptable for primitive — Phase 6 can adjust outline-offset
// if needed in real screen contexts.
// Glass surface: consumes --surface-bottom-nav-* tokens via Tailwind
// arbitrary properties (translucent white gradient + 20px backdrop blur
// over the bg-primary canvas, 1px white-12% border-top). Mirrors
// AppHeader's and Card's surface-token consumption pattern.

type BottomNavContextType = {
  activeItem?: string
}

const BottomNavContext = React.createContext<BottomNavContextType | undefined>(
  undefined
)

function useBottomNavContext() {
  const context = React.useContext(BottomNavContext)
  if (!context) {
    throw new Error("BottomNavItem must be used inside a <BottomNav> component")
  }
  return context
}

const bottomNavVariants = cva(
  [
    // The bar's design height is 82px with labels resting 14px above its
    // baseline. On devices with a home indicator (iOS standalone), the
    // safe-area inset is folded into BOTH the height and the bottom
    // padding: the extra height extends the glass/green background down
    // through the safe area so it sits flush at the physical bottom with
    // no page-background gap, while the matching bottom padding lifts the
    // labels to rest just above the home indicator. Where there is no
    // safe area (desktop/browser) the inset resolves to 0 and the bar is
    // unchanged at 82px / 14px.
    "w-full h-[calc(82px_+_env(safe-area-inset-bottom))] px-[10px] pb-[calc(14px_+_env(safe-area-inset-bottom))]",
    "flex items-end justify-around",
    "relative",
    "[background:var(--surface-bottom-nav-bg)]",
    "[backdrop-filter:var(--surface-bottom-nav-blur)]",
    "[-webkit-backdrop-filter:var(--surface-bottom-nav-blur)]",
    "[border-top:var(--surface-bottom-nav-border)]",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const bottomNavItemVariants = cva(
  [
    "flex flex-col items-center gap-[3px]",
    "cursor-pointer disabled:cursor-not-allowed",
    "outline-none focus-visible:outline-2 focus-visible:outline-yellow focus-visible:outline-offset-2",
    "transition-colors duration-150",
    "px-3 py-2",
    "text-white/65",
    "data-[active=true]:text-yellow",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const bottomNavFabVariants = cva(
  [
    "w-[54px] h-[54px] -mt-[30px] rounded-pill",
    "bg-yellow text-white",
    "flex items-center justify-center",
    "shadow-[0_4px_16px_rgba(0,0,0,0.3)]",
    "cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
    "outline-none focus-visible:outline-2 focus-visible:outline-yellow focus-visible:outline-offset-2",
    "transition-all duration-150 ease-out",
    "hover:bg-[#E29A28]",
    "active:scale-95",
    "z-20 relative",
    "[&_svg]:text-white [&_svg]:pointer-events-none",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const bottomNavLabelVariants = cva(
  "font-body text-list-label text-white",
  {
    variants: {
      variant: {
        default: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface BottomNavProps extends React.HTMLAttributes<HTMLElement> {
  activeItem?: string
  variant?: VariantProps<typeof bottomNavVariants>["variant"]
}

function BottomNav({
  className,
  variant = "default",
  activeItem,
  children,
  ...props
}: BottomNavProps) {
  return (
    <BottomNavContext.Provider value={{ activeItem }}>
      <nav
        data-slot="bottom-nav"
        data-variant={variant}
        className={cn(bottomNavVariants({ variant, className }))}
        {...props}
      >
        {children}
      </nav>
    </BottomNavContext.Provider>
  )
}

interface BottomNavItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode
  label: string
  value: string
  variant?: VariantProps<typeof bottomNavItemVariants>["variant"]
}

function BottomNavItem({
  className,
  variant = "default",
  icon,
  label,
  value,
  ...props
}: BottomNavItemProps) {
  const { activeItem } = useBottomNavContext()
  const isActive = activeItem === value

  return (
    <button
      type="button"
      data-slot="bottom-nav-item"
      data-variant={variant}
      data-active={isActive ? "true" : "false"}
      className={cn(bottomNavItemVariants({ variant, className }))}
      aria-current={isActive ? "page" : undefined}
      {...props}
    >
      <div className="w-[26px] h-[26px] flex items-center justify-center text-current">
        {icon}
      </div>
      <span className={bottomNavLabelVariants({ variant })}>{label}</span>
    </button>
  )
}

interface BottomNavFabProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode
  label: string
  variant?: VariantProps<typeof bottomNavFabVariants>["variant"]
}

function BottomNavFab({
  className,
  variant = "default",
  icon,
  label,
  ...props
}: BottomNavFabProps) {
  return (
    <div className="flex flex-col items-center pb-2">
      <button
        type="button"
        data-slot="bottom-nav-fab"
        data-variant={variant}
        className={cn(bottomNavFabVariants({ variant, className }))}
        aria-label={label}
        {...props}
      >
        {icon}
      </button>
      {/* mt-[6px] (not 3px like the icon items' gap) matches the
          *visual* gap of the regular items: their glyph sits in a
          26px box with ~3px internal whitespace below it, so the
          effective glyph-to-label gap is ~6px. The FAB's solid circle
          has no internal whitespace, so it needs the full 6px to read
          as the same spacing. Label stays bottom-aligned with the
          other labels (items-end pins the row); only the circle nudges
          up by 3px. */}
      <span className="font-body text-list-label text-white mt-[6px]">{label}</span>
    </div>
  )
}

export {
  BottomNav,
  BottomNavItem,
  BottomNavFab,
  bottomNavVariants,
  bottomNavItemVariants,
  bottomNavFabVariants,
}
