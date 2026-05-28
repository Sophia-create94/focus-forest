"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  CalendarIcon,
  TodoIcon,
  CountdownIcon,
} from "@/components/ui/icons";
import { Checkbox } from "@/components/ui/checkbox";
import { CATEGORY_BG_CLASS, type EventCategory } from "@/lib/categories";

// Today screen — curated daily-action dashboard.
//
// Composition (top-to-bottom):
// 1. Title block: "Today" heading + counts subline + day-circle indicator
// 2. Events section — header (outside) + <Card> with 3 event rows
// 3. Top to-dos section — header (outside) + <Card> with 3 to-do rows
// 4. Coming up section — header (outside) + <Card> with N countdown rows
//    (bare rows; no nested cards)
//
// Glass surface (2026-05-19 consolidation): every glass surface uses
// the <Card> primitive emitting canonical --surface-card-* tokens.
// Three previously-distinct glass recipes (Card primitive / Section
// card / Nested countdown) collapsed to one. The Coming up section's
// countdown sub-cards have been restructured as bare rows inside the
// parent Card, mirroring the Events row structure for visual rhythm
// (day-count column + content column, similar to time-column +
// content column on Events).
//
// Urgent state: previously rendered as a yellow-tinted nested glass.
// Now expressed as yellow day-count text + a yellow vertical accent
// bar (consistent with the category bars on Event rows).
//
// Token substitutions from the spec:
// - spec text-3xl → text-h1 for Today heading
// - "Today" screen title uses text-h3 (20px). type-scale.html labels
//   h2 (30px) as "Section headings, screen titles" but the shipped
//   practice is h3 for screen titles
// - subline → text-body (14px), matches the section labels
// - spec text-2xl → text-h3 (20px, closest DS — no 24px token)
// - spec text-sm → text-body (14px)
// - spec text-xs → text-caption (13px, the 12px size was retired)
// - spec text-[10px] → text-overline (11px, +0.02em)
//
// Day-circle indicator: 44×44 (w-11 h-11). The 4pt grid yields 40 / 44 /
// 48; the design target was 45 so we rounded DOWN by 1px to stay on
// scale rather than introducing an arbitrary w-[45px].
//
// Category color mapping lives in lib/categories.ts (CATEGORY_BG_CLASS)
// — the single source of truth shared with the Calendar week-strip dots
// and AgendaCard bars. work → bg-sky, personal → bg-coral, health →
// bg-moss.
//
// Phase 6 follow-ups:
// - Dynamic day/date in title block + day-circle indicator
// - Real data wiring (events, to-dos, countdowns from a store)
// - To-do interaction (tap toggles done state with reward animation)
// - "Now" pill conditional rendering based on actual current time
// - Multi-category color palette — semantic category tokens
//   (--category-work / --category-personal / --category-health)
//   layered on top of sky/yellow/moss if more categories arrive
// - Sheet/expanded view for each section (tap header → full list)
// - Checkbox checked state (white-tinted, bg-white/30) is DS-correct
//   per components-todo-rows.html. The Today inspiration mockup
//   showed yellow but that's a mockup-vs-DS divergence to resolve
//   separately if the yellow direction wins.
// - "Count pill" pattern (`3 today` / `1 of 3` / `7 days`) — if this
//   recurs elsewhere, promote to a small inline pill primitive
// - --text-h3--font-weight: 500 in globals.css vs. 600 in
//   type-scale.html (Rule 7 — HTML wins; fix is a token-data edit)
// - Full IA pivot (AppHeader, Profile stats removal) — separate wave

const events: {
  time: string;
  period: "AM" | "PM";
  title: string;
  meta: string;
  category: EventCategory;
  isNow?: boolean;
}[] = [
  { time: "9:30", period: "AM", title: "Team standup", meta: "Work · 30 min", category: "work", isNow: true },
  { time: "2:00", period: "PM", title: "Coffee with Maya", meta: "Joe's Coffee · 1 hr", category: "personal" },
  { time: "6:30", period: "PM", title: "Yoga class", meta: "Power Yoga Studio · 1 hr", category: "health" },
];

const INITIAL_TODOS: { id: string; title: string; done: boolean }[] = [
  { id: "bread-oj", title: "Buy bread + orange juice", done: false },
  { id: "mom-pics", title: "Send pictures to Mom", done: true },
  { id: "dentist", title: "Book dentist for next month", done: false },
];

// Mirrors the top two soonest entries from lib/countdown-data.ts so the
// Today "Coming up" teaser stays consistent with the dedicated Countdown
// screen. `urgent` is a Today-only flag (soonest item highlighted).
const upcoming: {
  title: string;
  days: number;
  date: string;
  time?: string;
  urgent: boolean;
}[] = [
  { title: "Anna's visit", days: 3, date: "Thursday, May 21", time: "9:30 AM", urgent: true },
  { title: "Luca's Birthday party", days: 5, date: "Saturday, May 23", urgent: false },
];

// Section header — icon + label on the left, count pill on the right,
// floating on the canvas above the glass card.
function SectionHeader({
  icon,
  label,
  count,
}: {
  icon: React.ReactNode;
  label: string;
  count: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-2 px-1">
      <span className="w-4 h-4 text-yellow flex-none">{icon}</span>
      <span className="font-display text-h4 text-white">
        {label}
      </span>
      <span className="ml-auto bg-black/20 text-white/80 rounded-pill px-2 py-0.5 font-body text-caption">
        {count}
      </span>
    </div>
  );
}

export default function TodayPage() {
  const [todos, setTodos] = useState(INITIAL_TODOS);

  const toggleDone = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const doneCount = todos.filter((t) => t.done).length;

  return (
    <div className="flex-1 flex flex-col gap-5 px-4 py-8 overflow-y-auto">
      {/* 1. Title block */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-h3 text-white leading-none">Today</h1>
          <p className="font-display text-h4 text-white/80 mt-1.5">
            3 events · 3 to-dos · 2 coming up
          </p>
        </div>
        <div
          className="flex-none w-11 h-11 rounded-sm bg-white/10 border border-white/20 flex flex-col items-center justify-center"
          aria-hidden
        >
          <span className="font-body text-overline font-medium text-white/70 uppercase">
            Mon
          </span>
          <span className="font-body text-body font-medium text-white leading-none mt-0.5">
            18
          </span>
        </div>
      </div>

      {/* 2. Events section */}
      <section>
        <SectionHeader
          icon={<CalendarIcon className="w-4 h-4" />}
          label="Events"
          count="3"
        />
        <Card className="p-3">
          <ul>
            {events.map((event, i) => (
              <li
                key={event.title}
                className={`flex items-center gap-3 py-2 ${
                  i < events.length - 1 ? "border-b border-white/10" : ""
                }`}
              >
                <span className="w-16 flex items-baseline gap-1 flex-none">
                  <span className="font-body text-body font-medium text-white tracking-tight">
                    {event.time}
                  </span>
                  <span className="font-body text-body font-medium text-white/70 uppercase">
                    {event.period}
                  </span>
                </span>
                <span
                  className={`w-1 h-8 rounded-pill flex-none ${
                    CATEGORY_BG_CLASS[event.category]
                  }`}
                  aria-hidden
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-h4 text-white truncate">
                      {event.title}
                    </span>
                    {event.isNow ? (
                      <span className="inline-block px-1.5 py-0.5 rounded-pill bg-yellow text-black font-body text-overline font-medium uppercase">
                        Now
                      </span>
                    ) : null}
                  </div>
                  <p className="font-body text-body text-white/60 mt-0.5 truncate">
                    {event.meta}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      {/* 3. Top to-dos section */}
      <section>
        <SectionHeader
          icon={<TodoIcon className="w-4 h-4" />}
          label="To-dos"
          count={`${todos.length - doneCount} left`}
        />
        <Card className="p-3">
          <ul>
            {todos.map((todo, i) => (
              <li
                key={todo.id}
                className={`flex items-center gap-3 py-2 ${
                  i < todos.length - 1 ? "border-b border-white/10" : ""
                }`}
              >
                <Checkbox
                  checked={todo.done}
                  onCheckedChange={() => toggleDone(todo.id)}
                  aria-label={todo.title}
                />
                <span
                  className={`font-body text-list-label ${
                    todo.done ? "text-white/50 line-through" : "text-white"
                  }`}
                >
                  {todo.title}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      {/* 4. Coming up section — bare rows inside one glass card.
          Urgent state: yellow day-count number + yellow vertical accent
          bar (consistent with Event row category bars). */}
      <section>
        <SectionHeader
          icon={<CountdownIcon className="w-4 h-4" />}
          label="Coming up"
          count="Next 7 days"
        />
        <Card className="p-3">
          <ul>
            {upcoming.map((item, i) => (
              <li
                key={item.title}
                className={`flex items-center gap-3 py-2 ${
                  i < upcoming.length - 1 ? "border-b border-white/10" : ""
                }`}
              >
                <span className="w-16 flex items-baseline gap-1 flex-none">
                  <span
                    className={`font-display text-h3 leading-none ${
                      item.urgent ? "text-yellow" : "text-white"
                    }`}
                  >
                    {item.days}
                  </span>
                  <span className="font-body text-body text-white/70">
                    days
                  </span>
                </span>
                <span
                  className={`w-1 h-8 rounded-pill flex-none ${
                    item.urgent ? "bg-yellow" : "bg-white/10"
                  }`}
                  aria-hidden
                />
                <div className="flex-1 min-w-0">
                  <p className="font-display text-h4 text-white truncate">
                    {item.title}
                  </p>
                  <p className="font-body text-body text-white/60 mt-0.5 truncate">
                    {item.time ? `${item.date} · ${item.time}` : item.date}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </section>
    </div>
  );
}
