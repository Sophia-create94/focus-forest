import { Card } from "@/components/ui/card";
import { JungleIllustration } from "@/components/jungle-illustration";

// Home screen.
//
// Composition:
// 1. Welcome heading + subline with hardcoded date + inline Level 5
//    pill.
// 2. <Card> holding the "Good job!" prose + JungleIllustration.
// 3. "Up next" teaser sitting 24px below the hero card (matching the
//    Calendar AgendaCard inter-card gap-6), also a <Card>.
//
// Glass surface (2026-05-19 consolidation): every glass surface in
// production uses the <Card> primitive, which emits the canonical
// --surface-card-* tokens (gradient 0.18→0.06, blur 12px, 20% white
// border, 14px radius). Three previously-distinct glass recipes
// collapsed to one for visual consistency; see DS file
// components-glass-surface.html.
//
// Token substitutions from the spec (DS doesn't ship 12px after the
// recent legibility pass that retired 10/12):
// - spec text-xs (12px) → text-caption (13px) for body text
// - spec text-xs (12px) → text-overline (11px) for the UP NEXT
//   overline only (spec preferred smaller for the overline)
// - spec text-sm (14px) → text-body (14px), exact match
//
// DS-conformance pass (2026-05-19):
// - font-display→font-body on Body-family tokens (caption / body /
//   overline) per the DS type-scale.html family grouping
// - rounded-full→rounded-pill so all pill radii consume the brand
//   --radius-pill token rather than the Tailwind default
//
// Art-tier exceptions (intentional, per spec):
// - Brown hex fills inside the sloth silhouette SVG
//
// Phase 6 follow-ups:
// - Dynamic date in the welcome subline (currently hardcoded
//   "Monday, May 18")
// - HomeTeaser tap target → animal-gallery sheet (currently
//   presentational, no handler)
// - Real progress tracking — the 65% fill is hardcoded
// - Animal silhouette refinement (sloth) + additional animals
// - Glass surface as a reusable DS token / utility now that the
//   pattern recurs in Home teaser + Today section cards + Today
//   countdown cards
// - LevelBadgeInline + Profile LevelPill unified primitive if a
//   third variant emerges
// - --text-h3--font-weight: 500 in globals.css vs. 600 in
//   type-scale.html (Rule 7 — HTML wins; fix is a token-data edit)
// - Full IA pivot (AppHeader, routing, BottomNav refresh, Profile
//   stats) — separate prompt wave

export default function HomePage() {
  return (
    <div className="flex-1 flex flex-col gap-8 px-4 py-8 overflow-y-auto">
      <div>
        {/* "Welcome!" is the documented hero-greeting exception to the
         *  text-h3 screen-header standard. Home is the recruiter
         *  landing page; the welcome greeting renders at text-h1
         *  (38px) for first-impression impact. All other screen
         *  headers use text-h3. */}
        <h1 className="font-display text-h1 text-white">Welcome!</h1>
        <p className="font-display text-h4 text-white/80 mt-1.5">
          Monday, May 18
          <span className="inline-block ml-1.5 px-2 py-0.5 bg-yellow/20 border border-yellow/50 rounded-pill text-white text-caption font-medium">
            Level 5
          </span>
        </p>
      </div>

      <div>
        <Card className="p-0 overflow-hidden flex flex-col">
          <div className="w-full px-5 pt-5 pb-4 text-center">
            <p className="font-display text-h3 text-white">
              Good job!
              <br />
              You reached level 5
            </p>
          </div>

          <div className="w-full aspect-[357/268] relative">
            <JungleIllustration />
          </div>
        </Card>

        <Card className="mt-6 flex items-center gap-2.5 px-3 py-2.5">
          <div className="flex-none w-8 h-8 rounded-pill overflow-hidden bg-black/25 border border-white/20 flex items-center justify-center">
            <svg
              width="20"
              height="20"
              viewBox="0 0 30 24"
              className="opacity-80"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <ellipse cx="15" cy="16" rx="10" ry="6.5" fill="#8E7355" />
              <circle cx="15" cy="9" r="6" fill="#A88B6B" />
              <ellipse cx="15" cy="10.5" rx="4" ry="3" fill="#5E4A36" />
              <ellipse cx="11.5" cy="9.5" rx="2" ry="1.8" fill="#A88B6B" />
              <ellipse cx="18.5" cy="9.5" rx="2" ry="1.8" fill="#A88B6B" />
              <circle cx="12" cy="9.5" r="0.9" fill="#222" />
              <circle cx="18" cy="9.5" r="0.9" fill="#222" />
              <ellipse cx="15" cy="11.5" rx="0.7" ry="0.5" fill="#3E2723" />
              <path
                d="M5 16 Q3 19 5 22"
                stroke="#8E7355"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M25 16 Q27 19 25 22"
                stroke="#8E7355"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
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
      </div>
    </div>
  );
}
