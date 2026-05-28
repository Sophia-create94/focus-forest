// Sample countdown data. Items are user-generated in the real app —
// Phase 6 follow-up: CRUD via FAB + modal to add new countdowns,
// tap-to-edit on existing items, swipe- or tap-to-delete UI.
//
// Sorted ascending by `days` so the first entry is the soonest. The
// Countdown screen surfaces that entry as the featured countdown at
// the top (with a yellow accent echoing the Calendar's active-card
// treatment), and renders the rest as list rows below.
//
// Phase 6 follow-ups for the data model:
// - Compute `days` dynamically from a stored target Date using
//   new Date() rather than hardcoded values, with pluralization
//   and unit refinement (hours/minutes for sub-day countdowns,
//   "today" / "tomorrow" / "yesterday" boundaries, weeks/months
//   for distant items)
// - Past-event handling: when days < 0, archive automatically or
//   surface in a separate "Recent" section
// - Category tagging / color-coding (personal / work / travel / …)
// - Sort options (by date asc, by category, manual reorder)
// - Empty state when the user has no countdowns yet

export type Countdown = {
  id: string
  title: string
  days: number
  /** Human-readable date string, e.g., "Thursday, May 21" */
  date: string
  /** Optional human-readable time, e.g., "9:30 AM" */
  time?: string
}

// Dates computed from today = Monday, May 18, 2026 (date = today + days,
// real 2026 calendar weekdays). Keep `days` and `date` in sync if either
// is edited.
export const COUNTDOWNS: Countdown[] = [
  {
    id: "1",
    title: "Anna's visit",
    days: 3,
    date: "Thursday, May 21",
    time: "9:30 AM",
  },
  {
    id: "2",
    title: "Luca's Birthday party",
    days: 5,
    date: "Saturday, May 23",
  },
  {
    id: "3",
    title: "Marathon training kickoff",
    days: 17,
    date: "Thursday, June 4",
  },
  {
    id: "4",
    title: "Trip to Greece",
    days: 31,
    date: "Thursday, June 18",
  },
  {
    id: "5",
    title: "Maya's wedding",
    days: 45,
    date: "Thursday, July 2",
  },
  {
    id: "6",
    title: "Summer concert",
    days: 60,
    date: "Friday, July 17",
    time: "8:00 PM",
  },
  {
    id: "7",
    title: "Parents' anniversary dinner",
    days: 78,
    date: "Tuesday, August 4",
    time: "7:00 PM",
  },
  {
    id: "8",
    title: "Hiking trip to the Alps",
    days: 100,
    date: "Wednesday, August 26",
  },
  {
    id: "9",
    title: "Conference in Berlin",
    days: 145,
    date: "Saturday, October 10",
  },
  {
    id: "10",
    title: "Year-end party",
    days: 210,
    date: "Monday, December 14",
    time: "7:00 PM",
  },
]
