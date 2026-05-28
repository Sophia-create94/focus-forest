// Reference: _design-system-reference/preview/components-app-header.html
// Reference: _design-system-reference/preview/brand-logo.html (canonical logo)
// Reference: _design-system-reference/preview/colors-product-greens.html (glass surface tokens)
// Top app bar: logo + wordmark on the left; optional context-menu dots on
// the right via the showDots prop (path-driven by the layout — see
// app/(app)/layout.tsx PATH_TO_SHOWS_DOTS).
// <header role="banner"> — explicit role required inside nested layouts
// since <header> only implicitly gets the banner role when it's a direct
// child of <body>.
// Chrome surface: The translucent glass band that visually contains the
// AppHeader (and StatusBar above it) is now applied by a wrapper div in
// app/(app)/layout.tsx, consuming --surface-header-nav-* tokens. AppHeader
// itself is transparent — it renders against whatever surface wraps it.
// This unifies the StatusBar + AppHeader into a single continuous gradient
// matching the design system reference.

export function AppHeader({ showDots = false }: { showDots?: boolean }) {
  return (
    <header
      role="banner"
      className="h-[54px] flex-shrink-0 flex items-center px-5"
    >
      {/* Logo bg-primary reads against the header's glass surface
          (--surface-header-nav-*). The translucent overlay creates the
          lighter contrast band that v1 approximated with deprecated
          flat color #4A9468. */}
      <div
        aria-hidden="true"
        className="w-[30px] h-[30px] rounded-pill bg-primary text-white font-display font-bold text-[13px] tracking-[-0.02em] flex items-center justify-center"
      >
        ff
      </div>
      <span className="font-display font-normal text-[18px] text-white ml-[9px] tracking-[-0.2px]">
        focusforest
      </span>
      {showDots && (
        <>
          <div className="flex-1" />
          <span aria-hidden="true" className="text-white text-[22px]">
            ⋮
          </span>
        </>
      )}
    </header>
  )
}
