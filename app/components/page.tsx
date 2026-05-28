"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BottomNav, BottomNavItem, BottomNavFab } from "@/components/ui/bottom-nav";
import { PhoneFrame } from "@/components/phone-frame";
import { StatusBar } from "@/components/ui/status-bar";
import { AppHeader } from "@/components/app-header";
import { AgendaCard } from "@/components/calendar/agenda-card";
import { FeaturedCountdown } from "@/components/countdown/featured-countdown";
import { CountdownItem } from "@/components/countdown/countdown-item";
import {
  HomeIcon,
  TodayIcon,
  ProfileIcon,
  CalendarIcon,
  TodoIcon,
  TrashIcon,
  AddIcon,
  CountdownIcon,
  PencilIcon,
  TreeIcon,
  ChevronRightIcon,
} from "@/components/ui/icons";

const ALL_ICONS = [
  { name: "home", Component: HomeIcon },
  { name: "today", Component: TodayIcon },
  { name: "profile", Component: ProfileIcon },
  { name: "calendar", Component: CalendarIcon },
  { name: "to-do", Component: TodoIcon },
  { name: "trash", Component: TrashIcon },
  { name: "add", Component: AddIcon },
  { name: "countdown", Component: CountdownIcon },
  { name: "pencil", Component: PencilIcon },
  { name: "tree", Component: TreeIcon },
  { name: "chevron-right", Component: ChevronRightIcon },
] as const;

// State-override class strings depict hover / pressed / focus visually
// without real interaction. The "default" column has real :hover :active
// :focus-visible behavior; the rest are frozen via className.
const STATE_OVERRIDES = {
  primary: {
    hover: "bg-[#E29A28]",
    pressed: "bg-yellow-dark shadow-none",
    focus: "outline-2 outline-yellow outline-offset-2 shadow-none",
  },
  secondary: {
    hover: "bg-[#D78A07]",
    pressed: "bg-[#C97D08] shadow-none",
    focus: "outline-2 outline-yellow outline-offset-2 shadow-none",
  },
  ghost: {
    hover: "bg-white/8",
    pressed: "bg-white/15",
    focus: "outline-2 outline-yellow outline-offset-2",
  },
} as const;

const VARIANT_LABELS = {
  primary: "Start tracking",
  secondary: "Add task",
  ghost: "Later",
} as const;

type Variant = keyof typeof STATE_OVERRIDES;

function Cell({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2">
      {children}
      <span className="font-body text-caption opacity-70">{label}</span>
    </div>
  );
}

function StateRow({ variant, rowLabel }: { variant: Variant; rowLabel: string }) {
  const text = VARIANT_LABELS[variant];
  const o = STATE_OVERRIDES[variant];
  return (
    <div className="grid grid-cols-[100px_repeat(5,minmax(0,1fr))] gap-3 items-center">
      <span className="font-display text-h4">{rowLabel}</span>
      <Cell label="default"><Button variant={variant}>{text}</Button></Cell>
      <Cell label="hover"><Button variant={variant} className={o.hover}>{text}</Button></Cell>
      <Cell label="pressed"><Button variant={variant} className={o.pressed}>{text}</Button></Cell>
      <Cell label="focus"><Button variant={variant} className={o.focus}>{text}</Button></Cell>
      <Cell label="disabled"><Button variant={variant} disabled>{text}</Button></Cell>
    </div>
  );
}

function ClearableSearchDemo() {
  const [query, setQuery] = useState("");
  return (
    <div className="relative">
      <Input
        aria-label="Clearable search demo"
        placeholder="Search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full pr-9"
      />
      {query && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => setQuery("")}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-white/70 hover:text-white cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-yellow focus-visible:outline-offset-2 rounded-pill"
        >
          <svg
            aria-hidden="true"
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <line x1="3.5" y1="3.5" x2="10.5" y2="10.5" />
            <line x1="10.5" y1="3.5" x2="3.5" y2="10.5" />
          </svg>
        </button>
      )}
    </div>
  );
}

function BottomNavSandbox() {
  const [activeItem, setActiveItem] = useState("home");
  const [fabClickCount, setFabClickCount] = useState(0);

  return (
    <div className="flex flex-col gap-6 p-8 bg-primary rounded-lg text-white">
      <h3 className="font-display text-h3">Bottom navigation bar</h3>

      <div className="flex flex-col gap-2">
        <span className="font-body text-caption text-white/70">
          Five nav items + central FAB. Active item highlighted in yellow. Sandbox
          sits on the production canvas (bg-primary), the same surface BottomNav
          renders above in the app shell.
        </span>
        <div className="bg-primary rounded-lg overflow-hidden pt-10">
          <BottomNav activeItem={activeItem}>
            <BottomNavItem
              icon={<HomeIcon />}
              label="Home"
              value="home"
              onClick={() => setActiveItem("home")}
            />
            <BottomNavItem
              icon={<CalendarIcon width={20} height={20} />}
              label="Plans"
              value="plans"
              onClick={() => setActiveItem("plans")}
            />
            <BottomNavFab
              icon={<AddIcon />}
              label="Add"
              onClick={() => setFabClickCount((c) => c + 1)}
            />
            <BottomNavItem
              icon={<TodayIcon />}
              label="Today"
              value="today"
              onClick={() => setActiveItem("today")}
            />
            <BottomNavItem
              icon={<ProfileIcon />}
              label="Profile"
              value="profile"
              onClick={() => setActiveItem("profile")}
            />
          </BottomNav>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="font-body text-caption text-white/70">
          Currently active: <span className="text-yellow font-semibold">{activeItem}</span>
        </span>
        <span className="font-body text-caption text-white/70">
          FAB clicked: <span className="text-yellow font-semibold">{fabClickCount}</span> {fabClickCount === 1 ? "time" : "times"}
        </span>
      </div>
    </div>
  );
}

// Wraps each cell in the glass-surface showcase: label + caption
// above, card below, all constrained to phone content width so
// typography renders at production scale.
function ShowcaseCell({
  name,
  source,
  children,
}: {
  name: string;
  source: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 max-w-[390px]">
      <div className="flex flex-col gap-0.5">
        <h4 className="font-display text-h4 text-yellow">{name}</h4>
        <span className="font-body text-caption text-white/55">{source}</span>
      </div>
      {children}
    </div>
  );
}

// Comprehensive showcase: every production glass card rendered at
// phone content width (max-w-[390px]) so font sizes can be compared
// in one place. Mirrors what Sophia sees on each route.
function ShowcaseGrid() {
  const sampleCountdown = {
    id: "demo-1",
    title: "Anna's visit",
    days: 3,
    date: "Thursday, May 21",
    time: "9:30 AM",
  };
  const sampleListCountdown = {
    id: "demo-2",
    title: "Luca's Birthday party",
    days: 5,
    date: "Saturday, May 23",
  };
  return (
    <div className="flex flex-col gap-10">
      {/* 1. Home — Hero card */}
      <ShowcaseCell
        name="1. Home — Hero (level up)"
        source="app/(app)/page.tsx · header text-h3"
      >
        <Card className="p-0 overflow-hidden flex flex-col">
          <div className="w-full px-5 pt-5 pb-4 text-center">
            <p className="font-display text-h3 text-white">
              Good job!
              <br />
              You reached level 5
            </p>
          </div>
          <div className="w-full aspect-[357/268] relative bg-gradient-to-br from-moss/30 via-primary to-primary flex items-center justify-center">
            <span className="font-body text-caption text-white/55">
              [JungleIllustration]
            </span>
          </div>
        </Card>
      </ShowcaseCell>

      {/* 2. Home — UP NEXT teaser */}
      <ShowcaseCell
        name="2. Home — UP NEXT teaser"
        source="app/(app)/page.tsx · h4 + body"
      >
        <Card className="flex items-center gap-2.5 px-3 py-2.5">
          <div className="flex-none w-8 h-8 rounded-pill overflow-hidden bg-black/25 border border-white/20 flex items-center justify-center">
            <span className="font-body text-caption text-white/70">🦥</span>
          </div>
          <div className="flex-1 min-w-0 flex flex-col gap-1">
            <div className="flex items-baseline gap-1.5">
              <span className="font-body text-overline font-medium uppercase tracking-widest text-yellow">
                UP NEXT
              </span>
              <span className="font-display text-h4 text-white leading-none">
                Sloth
              </span>
            </div>
            <p className="font-body text-body text-white/80 leading-tight">
              Check off 7 more to-dos to unlock a sloth
            </p>
            <div className="h-1 rounded-pill bg-black/20 overflow-hidden mt-0.5">
              <div
                className="h-full bg-yellow rounded-pill"
                style={{ width: "65%" }}
              />
            </div>
          </div>
        </Card>
      </ShowcaseCell>

      {/* 3. Today — Events section card */}
      <ShowcaseCell
        name="3. Today — Events section"
        source="app/(app)/today/page.tsx · h4 section header + h4 row title + body AM/PM + body meta + overline 'Now' pill"
      >
        <section>
          <div className="flex items-center gap-2 mb-2 px-1">
            <CalendarIcon className="w-4 h-4 text-yellow flex-none" />
            <span className="font-display text-h4 text-white">
              Events
            </span>
            <span className="ml-auto bg-black/20 text-white/80 rounded-pill px-2 py-0.5 font-body text-caption">
              3
            </span>
          </div>
          <Card className="p-3">
            <ul>
              <li className="flex items-center gap-3 py-2 border-b border-white/10">
                <span className="w-16 flex items-baseline gap-1 flex-none">
                  <span className="font-body text-body font-medium text-white tracking-tight">
                    9:30
                  </span>
                  <span className="font-body text-body font-medium text-white/70 uppercase">
                    AM
                  </span>
                </span>
                <span className="w-1 h-8 rounded-pill flex-none bg-sky" aria-hidden />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-h4 text-white truncate">
                      Team standup
                    </span>
                    <span className="inline-block px-1.5 py-0.5 rounded-pill bg-yellow text-black font-body text-overline font-medium uppercase">
                      Now
                    </span>
                  </div>
                  <p className="font-body text-body text-white/60 mt-0.5 truncate">
                    Work · 30 min
                  </p>
                </div>
              </li>
              <li className="flex items-center gap-3 py-2">
                <span className="w-16 flex items-baseline gap-1 flex-none">
                  <span className="font-body text-body font-medium text-white tracking-tight">
                    2:00
                  </span>
                  <span className="font-body text-body font-medium text-white/70 uppercase">
                    PM
                  </span>
                </span>
                <span className="w-1 h-8 rounded-pill flex-none bg-coral" aria-hidden />
                <div className="flex-1 min-w-0">
                  <span className="font-display text-h4 text-white truncate">
                    Coffee with Maya
                  </span>
                  <p className="font-body text-body text-white/60 mt-0.5 truncate">
                    Joe&apos;s Coffee · 1 hr
                  </p>
                </div>
              </li>
            </ul>
          </Card>
        </section>
      </ShowcaseCell>

      {/* 4. Today — Top to-dos section card */}
      <ShowcaseCell
        name="4. Today — Top to-dos section"
        source="app/(app)/today/page.tsx · h4 section header + list-label items"
      >
        <section>
          <div className="flex items-center gap-2 mb-2 px-1">
            <TodoIcon className="w-4 h-4 text-yellow flex-none" />
            <span className="font-display text-h4 text-white">
              To-dos
            </span>
            <span className="ml-auto bg-black/20 text-white/80 rounded-pill px-2 py-0.5 font-body text-caption">
              2 left
            </span>
          </div>
          <Card className="p-3">
            <ul>
              <li className="flex items-center gap-3 py-2 border-b border-white/10">
                <Checkbox aria-label="Buy bread + orange juice" />
                <span className="font-body text-list-label text-white">
                  Buy bread + orange juice
                </span>
              </li>
              <li className="flex items-center gap-3 py-2 border-b border-white/10">
                <Checkbox defaultChecked aria-label="Send pictures to Mom" />
                <span className="font-body text-list-label text-white/50 line-through">
                  Send pictures to Mom
                </span>
              </li>
              <li className="flex items-center gap-3 py-2">
                <Checkbox aria-label="Book dentist for next month" />
                <span className="font-body text-list-label text-white">
                  Book dentist for next month
                </span>
              </li>
            </ul>
          </Card>
        </section>
      </ShowcaseCell>

      {/* 5. Today — Coming up section card */}
      <ShowcaseCell
        name="5. Today — Coming up section"
        source="app/(app)/today/page.tsx · h4 section header + body 'days'"
      >
        <section>
          <div className="flex items-center gap-2 mb-2 px-1">
            <CountdownIcon className="w-4 h-4 text-yellow flex-none" />
            <span className="font-display text-h4 text-white">
              Coming up
            </span>
            <span className="ml-auto bg-black/20 text-white/80 rounded-pill px-2 py-0.5 font-body text-caption">
              Next 7 days
            </span>
          </div>
          <Card className="p-3">
            <ul>
              <li className="flex items-center gap-3 py-2 border-b border-white/10">
                <span className="w-16 flex items-baseline gap-1 flex-none">
                  <span className="font-display text-h3 leading-none text-yellow">
                    3
                  </span>
                  <span className="font-body text-body text-white/70">
                    days
                  </span>
                </span>
                <span className="w-1 h-8 rounded-pill flex-none bg-yellow" aria-hidden />
                <div className="flex-1 min-w-0">
                  <p className="font-display text-h4 text-white truncate">
                    Anna&apos;s visit
                  </p>
                  <p className="font-body text-body text-white/60 mt-0.5 truncate">
                    Thursday, May 21 · 9:30 AM
                  </p>
                </div>
              </li>
              <li className="flex items-center gap-3 py-2">
                <span className="w-16 flex items-baseline gap-1 flex-none">
                  <span className="font-display text-h3 leading-none text-white">
                    5
                  </span>
                  <span className="font-body text-body text-white/70">
                    days
                  </span>
                </span>
                <span className="w-1 h-8 rounded-pill flex-none bg-white/10" aria-hidden />
                <div className="flex-1 min-w-0">
                  <p className="font-display text-h4 text-white truncate">
                    Luca&apos;s Birthday party
                  </p>
                  <p className="font-body text-body text-white/60 mt-0.5 truncate">
                    Saturday, May 23
                  </p>
                </div>
              </li>
            </ul>
          </Card>
        </section>
      </ShowcaseCell>

      {/* 6. Profile — Stats card "Your journey" */}
      <ShowcaseCell
        name="6. Profile — Your journey (stats)"
        source="app/(app)/profile/page.tsx · h4 title + h2 numbers + body labels"
      >
        <Card className="p-4">
          <h2 className="font-display text-h4 text-white mb-3">
            Your journey
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: "47", label: "Trees grown" },
              { value: "12", label: "Day streak" },
              { value: "247", label: "Tasks done" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center">
                <span className="font-display text-h2 text-white leading-none">
                  {stat.value}
                </span>
                <span className="font-body text-body text-white/70 mt-2 text-center">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </ShowcaseCell>

      {/* 7. Profile — Settings list card */}
      <ShowcaseCell
        name="7. Profile — Settings list"
        source="app/(app)/profile/page.tsx · list-label rows, no header"
      >
        <Card className="p-0 overflow-hidden flex flex-col">
          <div className="flex items-center px-4 py-3.5 text-white font-body text-list-label">
            <span className="flex-1">Notifications</span>
            <span
              aria-hidden
              className="relative w-9 h-[22px] rounded-pill p-0.5 bg-yellow"
            >
              <span className="block w-[18px] h-[18px] rounded-pill bg-white translate-x-3.5" />
            </span>
          </div>
          <div aria-hidden className="h-px bg-white/10 mx-4" />
          <div className="flex items-center px-4 py-3.5 text-white font-body text-list-label">
            <span className="flex-1">Daily forest visit</span>
            <span className="font-body text-body text-white/70 mr-2">
              9:00 AM
            </span>
            <ChevronRightIcon className="text-white/40" />
          </div>
          <div aria-hidden className="h-px bg-white/10 mx-4" />
          <div className="flex items-center px-4 py-3.5 text-white font-body text-list-label">
            <span className="flex-1">Privacy</span>
            <ChevronRightIcon className="text-white/40" />
          </div>
        </Card>
      </ShowcaseCell>

      {/* 8. Calendar — AgendaCard */}
      <ShowcaseCell
        name="8. Calendar — AgendaCard"
        source="components/calendar/agenda-card.tsx · h4 day-header + Today-style event rows (time + bar + h4 title + meta + Now)"
      >
        <AgendaCard
          title="Today"
          isActive
          scrollIdx={0}
          items={[
            { time: "9:30 AM", title: "Team standup", category: "work", meta: "Work · 30 min" },
            { time: "2:00 PM", title: "Coffee with Maya", category: "personal", meta: "Joe's Coffee · 1 hr" },
            { time: "6:30 PM", title: "Yoga class", category: "health", meta: "Power Yoga Studio · 1 hr" },
          ]}
        />
      </ShowcaseCell>

      {/* 9. Countdown — FeaturedCountdown (the reference card) */}
      <ShowcaseCell
        name="9. Countdown — FeaturedCountdown"
        source="components/countdown/featured-countdown.tsx · h4 title + body 'days' · REFERENCE"
      >
        <FeaturedCountdown countdown={sampleCountdown} />
      </ShowcaseCell>

      {/* 10. Countdown — CountdownItem list row */}
      <ShowcaseCell
        name="10. Countdown — CountdownItem"
        source="components/countdown/countdown-item.tsx · h4 title + body 'days'"
      >
        <CountdownItem countdown={sampleListCountdown} />
      </ShowcaseCell>
    </div>
  );
}

export default function ComponentsPage() {
  return (
    <main className="flex-1 flex flex-col gap-12 px-8 py-10 md:pt-32 max-w-[1200px] mx-auto">
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-h1">Component sandbox</h1>
        <p className="font-body text-body text-grey max-w-2xl">
          Visual proofs for Phase 4 primitives. The &ldquo;default&rdquo; column
          has real interactive behavior; the other columns freeze each state
          via className override for visual demonstration only.
        </p>
      </header>

      <section className="flex flex-col gap-8">
        <h2 className="font-display text-h2">Button</h2>

        <div className="flex flex-col gap-6 p-8 bg-white border border-grey-lighter rounded-lg">
          <h3 className="font-display text-h3">Light surface</h3>
          <StateRow variant="primary" rowLabel="Primary" />
          <StateRow variant="secondary" rowLabel="Secondary" />
          <p className="font-body text-caption text-grey italic">
            Ghost is reserved for the green canvas — not rendered on light surfaces.
          </p>
        </div>

        <div className="flex flex-col gap-6 p-8 bg-primary rounded-lg text-white">
          <h3 className="font-display text-h3">Green canvas</h3>
          <StateRow variant="primary" rowLabel="Primary" />
          <StateRow variant="secondary" rowLabel="Secondary" />
          <StateRow variant="ghost" rowLabel="Ghost" />
        </div>
      </section>

      <section className="flex flex-col gap-8">
        <h2 className="font-display text-h2">Card / glass surface</h2>

        <div className="flex flex-col gap-8 p-8 bg-primary rounded-lg text-white">
          <h3 className="font-display text-h3">Green canvas</h3>

          <p className="font-body text-body text-white/85 max-w-2xl">
            Single canonical recipe (2026-05-19 consolidation): gradient
            0.18→0.06 white-alpha · <code>backdrop-blur-md</code> · 20%
            white border · 14px radius. Every glass surface in production
            flows through the <code>&lt;Card&gt;</code> primitive. The
            ten cells below mirror every production card 1:1 at the
            real phone content width (390px) so typography can be
            compared side-by-side. See
            <code> _design-system-reference/preview/components-glass-surface.html</code>
            for the canonical DS doc.
          </p>

          <p className="font-body text-body text-white/85 max-w-2xl">
            Typography standard (post-2026-05-21 pass): every card
            header is <code>font-display text-h4</code> (16px / 600
            Niramit); every card sub-header / supporting line is
            <code> font-body text-body</code> (14px / 400 Source Sans 3
            at white/65-70). Matches the Countdown FeaturedCountdown
            reference at <code>/plans/countdown</code>.
          </p>

          <ShowcaseGrid />

          {/* Token-level demo — raw --surface-card-* CSS variables, no
              Card primitive. Useful for showing the underlying tokens. */}
          <div className="flex flex-col gap-2 max-w-[390px]">
            <span className="font-body text-caption text-white/70">
              Raw token reference: <code>--surface-card-*</code> applied via
              inline style (without the <code>&lt;Card&gt;</code> primitive).
            </span>
            <div
              className="p-4"
              style={{
                background: "var(--surface-card-bg)",
                backdropFilter: "var(--surface-card-blur)",
                WebkitBackdropFilter: "var(--surface-card-blur)",
                border: "var(--surface-card-border)",
                borderRadius: "var(--surface-card-radius)",
              }}
            >
              <p className="font-body text-body">
                This Card-equivalent is built from inline style consuming the
                canonical tokens directly. Visually identical to a
                <code> &lt;Card&gt;</code>.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-8">
        <h2 className="font-display text-h2">Input</h2>

        <div className="flex flex-col gap-6 p-8 bg-primary rounded-lg text-white">
          <h3 className="font-display text-h3">Green canvas</h3>

          <div className="flex flex-col gap-4 max-w-md">
            <div className="flex flex-col gap-2">
              <span className="font-body text-caption text-white/70">Default · empty</span>
              <Input className="w-full" placeholder="Search" />
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-body text-caption text-white/70">Default · with value</span>
              <Input className="w-full" defaultValue="pancake" />
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-body text-caption text-white/70">Focus (frozen via className override)</span>
              <Input className="w-full bg-white/28" defaultValue="pancake" />
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-body text-caption text-white/70">Disabled</span>
              <Input className="w-full" disabled placeholder="Disabled input" />
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-body text-caption text-white/70">
                Clearable: × appears in the right slot once the user types; click to clear.
              </span>
              <ClearableSearchDemo />
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-8">
        <h2 className="font-display text-h2">Checkbox</h2>

        <div className="flex flex-col gap-6 p-8 bg-primary rounded-lg text-white">
          <h3 className="font-display text-h3">Green canvas</h3>

          <div className="flex gap-8 flex-wrap">
            <div className="flex flex-col items-center gap-2">
              <Checkbox />
              <span className="font-body text-caption text-white/70">unchecked</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Checkbox defaultChecked />
              <span className="font-body text-caption text-white/70">checked</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Checkbox defaultChecked="indeterminate" />
              <span className="font-body text-caption text-white/70">indeterminate</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Checkbox disabled />
              <span className="font-body text-caption text-white/70">disabled</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Checkbox className="outline-2 outline-yellow outline-offset-2" />
              <span className="font-body text-caption text-white/70">focus (frozen)</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 max-w-md">
            <span className="font-body text-caption text-white/70">
              With label (composition via wrapping label element)
            </span>
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox />
                <span className="font-body text-body">Bread</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox defaultChecked />
                <span className="font-body text-body line-through opacity-45">Orange Juice</span>
              </label>
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-8">
        <h2 className="font-display text-h2">Tabs</h2>

        <div className="flex flex-col gap-6 p-8 bg-primary rounded-lg text-white">
          <h3 className="font-display text-h3">Green canvas</h3>

          <div className="flex flex-col gap-2">
            <span className="font-body text-caption text-white/70">
              Working switcher (Calendar / To-do-list / Countdown). Click to change active tab.
            </span>
            <div className="bg-primary rounded-lg overflow-hidden">
              <Tabs defaultValue="todolist">
                <TabsList>
                  <TabsTrigger value="calendar">Calendar</TabsTrigger>
                  <TabsTrigger value="todolist">To-do-list</TabsTrigger>
                  <TabsTrigger value="countdown">Countdown</TabsTrigger>
                </TabsList>
                <TabsContent value="calendar" className="p-4 font-body text-body">
                  Calendar panel content.
                </TabsContent>
                <TabsContent value="todolist" className="p-4 font-body text-body">
                  To-do-list panel content.
                </TabsContent>
                <TabsContent value="countdown" className="p-4 font-body text-body">
                  Countdown panel content.
                </TabsContent>
              </Tabs>
            </div>
            <span className="font-body text-caption text-white/55">
              Container is the production canvas (bg-primary). Tabs is surface-agnostic
              — renders against whatever canvas it&apos;s placed on.
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-body text-caption text-white/70">
              With one disabled tab.
            </span>
            <div className="bg-primary rounded-lg overflow-hidden">
              <Tabs defaultValue="active">
                <TabsList>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="disabled" disabled>Disabled</TabsTrigger>
                  <TabsTrigger value="other">Other</TabsTrigger>
                </TabsList>
                <TabsContent value="active" className="p-4 font-body text-body">
                  Active panel content.
                </TabsContent>
                <TabsContent value="other" className="p-4 font-body text-body">
                  Other panel content.
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-8">
        <h2 className="font-display text-h2">Icons</h2>

        <div className="flex flex-col gap-6 p-8 bg-primary rounded-lg text-white">
          <h3 className="font-display text-h3">Green canvas</h3>

          <div className="flex flex-col gap-2">
            <span className="font-body text-caption text-white/70">
              Full brand icon set (13 icons, displayed uniformly at 16×16)
            </span>
            <div className="flex gap-6 flex-wrap items-end">
              {ALL_ICONS.map(({ name, Component }) => (
                <div key={name} className="flex flex-col items-center gap-2">
                  <Component className="size-4" />
                  <span className="font-body text-caption text-white/70">{name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-body text-caption text-white/70">
              Size override via Tailwind className (caller-controlled, no size prop)
            </span>
            <div className="flex gap-6 items-end">
              <div className="flex flex-col items-center gap-2"><HomeIcon className="size-4" /><span className="font-body text-caption text-white/70">size-4 (16px)</span></div>
              <div className="flex flex-col items-center gap-2"><HomeIcon className="size-5" /><span className="font-body text-caption text-white/70">size-5 (20px)</span></div>
              <div className="flex flex-col items-center gap-2"><HomeIcon className="size-6" /><span className="font-body text-caption text-white/70">size-6 (24px)</span></div>
              <div className="flex flex-col items-center gap-2"><HomeIcon className="size-8" /><span className="font-body text-caption text-white/70">size-8 (32px)</span></div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-body text-caption text-white/70">
              Color via parent text-* class (currentColor inheritance)
            </span>
            <div className="flex gap-6 items-end">
              <div className="flex flex-col items-center gap-2 text-white"><HomeIcon className="size-6" /><span className="font-body text-caption">text-white</span></div>
              <div className="flex flex-col items-center gap-2 text-yellow"><HomeIcon className="size-6" /><span className="font-body text-caption">text-yellow</span></div>
              <div className="flex flex-col items-center gap-2 text-moss"><HomeIcon className="size-6" /><span className="font-body text-caption">text-moss</span></div>
              <div className="flex flex-col items-center gap-2 text-sky"><HomeIcon className="size-6" /><span className="font-body text-caption">text-sky</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-8">
        <h2 className="font-display text-h2">BottomNav</h2>

        <BottomNavSandbox />
      </section>

      <section className="flex flex-col gap-8">
        <h2 className="font-display text-h2">StatusBar</h2>

        <div className="flex flex-col gap-6 p-8 bg-primary rounded-lg text-white">
          <h3 className="font-display text-h3">Green canvas</h3>
          <div className="flex flex-col gap-2">
            <span className="font-body text-caption text-white/70">
              Production-scale OS chrome simulation (h-[50px], 17px time). Center
              band ~140px reserved for the dynamic island contract; flex
              justify-between keeps left/right groups out of that space.
              aria-hidden on root — purely decorative chrome.
            </span>
            <StatusBar />
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-8">
        <h2 className="font-display text-h2">AppHeader</h2>

        <div className="flex flex-col gap-6 p-8 bg-primary rounded-lg text-white">
          <h3 className="font-display text-h3">Green canvas</h3>
          <div className="flex flex-col gap-3">
            <span className="font-body text-caption text-white/70">
              Default — no context-menu dots (used on every route except To-Do).
            </span>
            <AppHeader />
          </div>
          <div className="flex flex-col gap-3">
            <span className="font-body text-caption text-white/70">
              With dots — vertical ⋮ menu glyph on the right (used on To-Do, others TBD).
              The layout reads pathname → PATH_TO_SHOWS_DOTS lookup → boolean prop.
            </span>
            <AppHeader showDots />
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-8">
        <h2 className="font-display text-h2">iPhone Frame</h2>

        <div className="flex flex-col gap-6 p-8 bg-white border border-grey-lighter rounded-lg">
          <h3 className="font-display text-h3">Responsive behavior</h3>

          <div className="flex flex-col gap-2 mb-4">
            <span className="font-body text-caption text-grey">
              Resize your browser to see responsive behavior. Below 768px (md breakpoint), the frame collapses and content fills the mobile container. At 768px and above, the full bezeled frame appears with fixed dimensions.
            </span>
          </div>

          <div className="h-[600px] md:h-auto flex justify-center">
            <PhoneFrame>
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-white via-sky/20 to-white/80 p-6 gap-4">
                <div className="font-display text-h2 text-center text-black">
                  Screen content
                </div>
                <div className="font-body text-body text-center text-black/70">
                  This is where app screens (Home, To-Do, Lock) will render.
                </div>
                <div className="mt-4 px-6 py-3 bg-black text-white rounded-lg font-body text-caption">
                  Bezel: 12px symmetric • Island: 120×37 @ top 12px
                </div>
              </div>
            </PhoneFrame>
          </div>
        </div>
      </section>
    </main>
  );
}
