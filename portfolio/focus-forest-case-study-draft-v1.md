# Focus Forest — Case Study Draft

> **Draft v1** — captured during Phase 4b completion (May 2026).
> To be refined after Phase 5 (screen assembly) and Phase 7 (portfolio polish).
> Status: working draft, not yet for publication.

---

## Shipping a production app as a designer, with AI tools as the implementation layer

Focus Forest is a motivational calendar app I've been carrying as an idea since 2022. During a mentorship that year, I noticed people struggled with three specific things: **forgetting appointments and events, difficulty adding non-time-based items to their calendars, and an inability to customize what their calendar showed them.** I designed it, researched it, and prototyped three key screens in Figma — and then it sat in my files.

In 2025, four years into my career as a Product Designer and increasingly curious about how AI tools change a designer's workflow, I decided to finally build it. Not as a coding exercise — **I had never written a single line of React or CSS before this project** — but as an experiment in *directing* AI tools to ship production code, with me staying firmly in the architect/director seat.

This case study covers the workflow I built, the specific moments that taught me how AI tools succeed and fail, and what I'd do differently.

---

## The AI workflow

The project uses four tools across distinct roles:

- **Claude Design** — initial design system setup. Typography, colors, components. Used for the foundation, then stopped.
- **Claude Chat** — strategy, planning, prompt drafting, diff review. Functions as my UX/AI workflow specialist assistant.
- **Claude Code** — actual file creation and editing. Reads source files, proposes implementation plans, generates code diffs.
- **Cursor** — backup IDE for inspection and small manual edits.
- **Vercel** — automatic deployment from `main` on every push.

Information flow: I describe a goal to Claude Chat in plain language → Claude Chat drafts a structured prompt → I copy-paste it into Claude Code → Claude Code returns a plan or diff → I paste it back into Claude Chat → we review together → I approve → Claude Code applies → **I verify on the live URL**.

**My role is the live-URL verifier and design decision-maker.** Claude Chat reviews diffs because I can't read React fluently. I review the rendered URL because that's where my four years of UX/UI judgment lives. The role separation isn't a workaround for my limitation — it's the entire point.

---

## A prompt framework I developed

Early in the project I learned that prompt quality determined output quality. I converged on a four-part structure:

- **ROLE** — Who should the AI be? *"You are a Senior Frontend Engineer specialized in working with AI tools in UX/UI."*
- **CONTEXT** — What's the situation? *"I'm building a motivational calendar app for users who struggle with organizing events."*
- **TASK** — What do you want? *"Generate a step-by-step plan to..."*
- **OUTCOME** — What format? *"Short, clear bullet points."*

The more context I gave, the better the output. Examples helped. This framework became my standard for every meaningful prompt.

---

## Two decisions worth sharing

### 1. Protecting design intent from premature systematization

Mid-project, while building the Tabs component, the AI tools articulated a clean-sounding rule: *"Yellow = action affordances; white = navigation."* It sounded crisp and useful.

The next day I was about to build BottomNav. Before sending the prompt, I uploaded the BottomNav reference file and added a note: *"I want to keep the yellow color for 'Add'."*

I'd seen what was about to happen. Applied to BottomNav, the rule would have stripped the yellow from the active state. But yellow was a deliberate design decision. As I put it at the time:

> *"AI goes after strict rules and it's missing the human perspective and emotions on UX workflows. Yellow color is much more attractive and present to a user to click on than white."*

We retracted the system-level rule. Each component's reference governs its own colors — Tabs uses white because its reference shows white; BottomNav uses yellow because its reference shows yellow. No unifying rule. And that was the right answer.

**The lesson:** AI tools generalize. Designers protect human meaning. The job is knowing when a tidy rule should yield to a specific design intent.

### 2. Catching issues only visible at the live URL

After we built the BottomNav component, the code compiled, no build errors, the diff looked clean. I refreshed the live URL and immediately flagged three issues in a single message:

1. **The FAB's top half was clipped** by the sandbox wrapper's `overflow-hidden`.
2. **Clicking the FAB seemed to do nothing** — it used `console.log`, which requires opening browser dev tools. Bad UX.
3. **A React DOM warning** about an unrecognized prop (which led to refactoring the component to use React Context).

All three were invisible in code review. They only surface if someone actually looks at the rendered URL with a designer's eye.

> *"A developer would have known that's working in the code but just not in this preview, and trusted the code more."*

**My 'limitation' of not reading code becomes a strength.** I test everything visually because I have no other verification surface, which catches UX issues code-fluent reviewers might accept.

---

## What was hard

**Claude Design's weekly usage limits.** I hit the limit fast and had to wait to complete the design system. My workaround: use Claude Design *only* for design system setup; move all subsequent work to other tools.

**Direct prompting inside the Claude Design chat produced unexpected results.** What worked better was using a separate chat to draft prompts with full project context, then copy-pasting those structured prompts into the relevant Design System block. Essentially, one chat became the prompt engineer for the other.

**Trusting AI output I couldn't fully read.** When Claude Code returned 80 lines of React with cva variants, Claude Chat reviewed it, but final approval was mine. I picked up enough code knowledge to understand what was happening at a high level, but the live URL stayed my real verification layer. Trust calibration was learned, not immediate.

---

## What was easier than expected

The Claude Code ↔ Claude Chat handoff. Going in, I didn't know what to expect from the multi-tool workflow. Once the role separation was clear — Claude Chat as strategist, Claude Code as implementer, me as director — the cycle became fluid.

---

## What I'd do differently

- Plan Claude Design sessions more efficiently. Combine multiple changes into single sessions; defer anything that could be done later in Claude Code to avoid hitting the limit.
- Use a separate prompt-engineering chat for Claude Design from day one, instead of discovering the pattern by accident.

---

## What this project taught me

AI tools work best when role separation is deliberate. AI is fast at producing code. Designers are precise about meaning. When the workflow is structured so each does what it does best — and verification happens at the layer where the designer's skills actually live — the resulting product carries both.

The case study isn't "AI built my app." It's: **I designed a workflow where AI handled the implementation, my design judgment handled the verification, and the resulting product carries both signatures.**

---

## Status (to be updated as project progresses)

- Live demo: [Vercel URL — to add]
- Component sandbox: [/components route — to add]
- GitHub: [repo URL — to add]

Built with Next.js 16, TypeScript, Tailwind CSS v4, Radix UI, and shadcn/ui patterns. Design system: 16 color tokens, 14 type tokens, 7 typed component primitives (Button, Card, Input, Checkbox, Tabs, Icons, BottomNav) — each with consistent cva structure, accessibility, and reference adherence.

---

## Notes for refinement (Draft v2 and beyond)

Sections to add after Phase 5 (screens assembly):
- A third specific decision drawn from screen-level composition work
- Screenshot gallery once screens are live
- Specific interaction/animation challenge if FAB radial submenu becomes interesting

Sections to add after Phase 7 (portfolio polish):
- Final reflection / what I took into the next project
- Outcome metrics (if applicable — recruiter feedback, etc.)
- Refinements to the "What was hard" section once full project is in view

Open quotes worth weaving in:
- *"AI goes after strict rules and it's missing the human perspective and emotions on UX workflows."*
- *"Yellow color is much more attractive and present to a user to click on than white."*
- *"Working with AI can be a huge time saver, but still I need to verify as a UX Designer."*
- *"A developer would have known that's working in the code but just not in this preview, and trusted the code more."*

Style notes for refinement:
- Keep designer's voice — concrete, observation-driven
- Avoid generic "I used AI" language; show specific workflow patterns
- Honest about pain points (Claude Design limits, trust calibration)
- Don't oversell role separation as more deliberate than it actually was at the time
