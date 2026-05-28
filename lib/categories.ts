// Event categories — the single source of truth for the work /
// personal / health type, render order, and color mapping. Shared by
// the Today event bars, the Calendar week-strip dots, and the
// AgendaCard event-row bars so they can't drift.

export type EventCategory = "work" | "personal" | "health"

// Canonical render order for category indicators (dots / bars):
// work → personal → health. Used to keep ordering consistent and to
// cap multi-category days at the first three.
export const CATEGORY_ORDER: readonly EventCategory[] = [
  "work",
  "personal",
  "health",
]

// Tailwind background-color utility per category, drawn straight from
// the brand palette (app/globals.css @theme). THE single source of
// truth for category → color: the Today event bars, the Calendar
// week-strip dots, and the AgendaCard event-row bars all read this, so
// they can't drift. To recolor a category, change it here and nowhere
// else.
//
// (We previously routed these through a dedicated category-token
// indirection layer applied as arbitrary CSS-var classes. That caused
// two problems: the bundler pruned the tokens when only referenced via
// inline style, and the indirection served stale across dev-server CSS
// chunks so the Calendar lagged the Today screen on recolors. Direct
// palette utilities — identical to what Today uses — remove both.)
export const CATEGORY_BG_CLASS: Record<EventCategory, string> = {
  work: "bg-sky", //       #92D3F0 light blue
  personal: "bg-coral", // #ff9f79 coral
  health: "bg-moss", //    #7ABF94 light green
}
