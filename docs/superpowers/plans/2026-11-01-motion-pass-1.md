# Motion Pass 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement Motion Pass 1 across the Metavayn website: foundation motion tokens, site-wide Lenis smooth scrolling with focus guards, choreographed page load under 2.0s, $30^\circ$ hatched section-cut wipes, About "Idea to Product" 150vh pinned signature scrub, interactive spring physics, and comprehensive performance profiling.

**Architecture:** Next.js 15 client-side motion layer combining GSAP (with ScrollTrigger) and Lenis. GSAP drives scroll-scrubbed timelines and pinning; Lenis provides smooth inertial scrolling synchronized with GSAP's ticker. Components animate only `transform`, `opacity`, and `clip-path` with will-change applied strictly during motion. All motions cleanly bypass into static final states under `prefers-reduced-motion: reduce`.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS, GSAP 3.12, Lenis 1.1, Three.js, `@react-three/fiber`, Playwright.

**Spec:** [`docs/superpowers/specs/2026-11-01-motion-pass-1-design.md`](file:///d:/Santosh/Development/MetavaynBlog/docs/superpowers/specs/2026-11-01-motion-pass-1-design.md)

## Global Constraints
- **Zero Layout Changes:** Palette (D2 tokens), copy (from `content/site-content.md`), and structural layout remain strictly unchanged.
- **Hardware-Accelerated Properties Only:** Animate only `transform`, `opacity`, and `clip-path`. No layout-triggering properties (`width`, `height`, `margin`, `top`, `left`).
- **Performance Budget:** $\ge 60\text{ fps}$ on standard profiles, $\ge 45\text{ fps}$ on a 4x CPU-throttled profile, mobile Lighthouse performance $\ge 85$.
- **Reduced Motion:** Every animation resolves to its final completed state with zero motion when `prefers-reduced-motion` matches.

---

### Task 1: Motion Foundation (`src/lib/motion/` & Lenis Provider with Focus Guards)

**Files:**
- Create: `src/lib/motion/tokens.ts`
- Create: `src/lib/motion/usePrefersReducedMotion.ts`
- Create: `src/lib/motion/useScrub.ts`
- Create: `src/lib/motion/index.ts`
- Create: `src/components/layout/SmoothScrollProvider.tsx`
- Modify: `src/app/layout.tsx`
- Test: `scripts/test-motion-foundation.mjs`

**Interfaces:**
- Produces: `MOTION_TOKENS`, `usePrefersReducedMotion()`, `useScrub()`, `<SmoothScrollProvider>`

- [ ] **Step 1: Write failing test for motion foundation**
  Create `scripts/test-motion-foundation.mjs` checking token exports, hook existence, and Lenis focus guard behavior.
- [ ] **Step 2: Run test to confirm failure**
  Run `node scripts/test-motion-foundation.mjs` to confirm module absence.
- [ ] **Step 3: Implement `src/lib/motion/tokens.ts` & hooks**
  Export `easeOut`, `easeInOut`, `durations` (`fast: 0.4`, `base: 0.8`, `slow: 1.2`), `usePrefersReducedMotion`, and `useScrub`.
- [ ] **Step 4: Implement `src/components/layout/SmoothScrollProvider.tsx`**
  Mount Lenis with `lerp: 0.1`, GSAP ticker integration, reduced-motion bypass, and global `focusin`/`focusout` listeners disabling Lenis on input/modal focus.
- [ ] **Step 5: Wrap root layout in `SmoothScrollProvider`**
  Update `src/app/layout.tsx`.
- [ ] **Step 6: Run test and build check**
  Run `node scripts/test-motion-foundation.mjs` and `npm run build` to confirm pass.
- [ ] **Step 7: Commit**
  `git add src/lib/motion/ src/components/layout/SmoothScrollProvider.tsx src/app/layout.tsx scripts/test-motion-foundation.mjs; git commit -m "feat(motion): implement motion foundation tokens, hooks, and Lenis provider"`

---

### Task 2: Text Reveal Component & Hero Page Load Choreography

**Files:**
- Create: `src/lib/motion/SplitLines.tsx`
- Modify: `src/components/canvas/M1AirHandlingUnit.tsx` (wireframe draw-on and paper fill transition)
- Modify: `src/app/page.tsx` (orchestrated intro timeline)

**Interfaces:**
- Produces: `<SplitLines>` text reveal component
- Consumes: `MOTION_TOKENS`, `usePrefersReducedMotion`

- [ ] **Step 1: Implement `src/lib/motion/SplitLines.tsx`**
  Split text into lines using real HTML overflow-hidden mask wrappers with 80ms staggered slide-up and opacity fade.
- [ ] **Step 2: Implement Hero 3D wireframe-to-fill load animation in `M1AirHandlingUnit.tsx`**
  Add `isLoaded` animation state: black edge lines draw over 0.8s, then mesh faces fade to paper over 0.5s.
- [ ] **Step 3: Orchestrate Page Load in `src/app/page.tsx`**
  Header fades in (0.6s), headline reveals via `<SplitLines>`, 3D model draws and fills, buttons fade in (total $\le 2.0\text{s}$, readable at 0.95s).
- [ ] **Step 4: Verify Page Load Timing with Playwright script**
  Verify headline readability under 1.0s and total sequence under 2.2s.
- [ ] **Step 5: Commit**
  `git add src/lib/motion/SplitLines.tsx src/components/canvas/M1AirHandlingUnit.tsx src/app/page.tsx; git commit -m "feat(motion): implement SplitLines and hero page load choreography"`

---

### Task 3: SectionCut Transition Component ($30^\circ$ Isometric Clip & $45^\circ$ Hatch Band)

**Files:**
- Create: `src/lib/motion/SectionCut.tsx`
- Modify: `src/components/layout/SectionCut.tsx`
- Modify: `src/app/page.tsx` (replace hard section edges)

**Interfaces:**
- Produces: `<SectionCut fromSurface={...} toSurface={...}>`

- [ ] **Step 1: Implement `<SectionCut>` component**
  - ScrollTrigger-driven 30-degree isometric clip-path wipe over 0.9s scroll scrub.
  - 24px wide hatch band along the cutting edge with $45^\circ$ cross-hatch lines at 40% opacity in opposite shade, settling to 0.
  - Flush nav transition: About section starts flush under the nav, eliminating the royal strip.
- [ ] **Step 2: Apply `<SectionCut>` across Home page transitions**
  Hero $\to$ About, About $\to$ What We Do, What We Do $\to$ Approach, Approach $\to$ CTA.
- [ ] **Step 3: Verify visual alignment and flush nav state**
  Confirm 0px royal band visible under sticky nav above About.
- [ ] **Step 4: Commit**
  `git add src/lib/motion/SectionCut.tsx src/components/layout/SectionCut.tsx src/app/page.tsx; git commit -m "feat(motion): implement 30-degree isometric SectionCut transitions with 45-degree hatch band"`

---

### Task 4: About "Idea to Product" Signature Scrub (Full-Section 150vh Pin)

**Files:**
- Create: `src/components/home/IdeaToProductGraphic.tsx`
- Modify: `src/app/page.tsx` (About section full-pin and word-by-word quote reveal)

**Interfaces:**
- Produces: `<IdeaToProductGraphic progress={...}>`
- Consumes: `useScrub`, `MOTION_TOKENS`

- [ ] **Step 1: Implement `IdeaToProductGraphic.tsx`**
  - 30-degree isometric AHU SVG matching hero model geometry.
  - Phase 1 ($p = 0.00 \to 0.35$): Hand-drawn royal sketch with SVG displacement wobble filter and stroke-dashoffset draw-on.
  - Phase 2 ($p = 0.35 \to 0.65$): Clean black drafting lines with royal dimension witness lines.
  - Phase 3 ($p = 0.65 \to 1.00$): Tonal royal facet fills (`#DCE3FC`, `#B9C6FA`, `#8FA3F5`) and copper handles.
- [ ] **Step 2: Implement 150vh full-section pin and word-by-word quote reveal in `src/app/page.tsx`**
  - Pinned for 150vh on desktop ($\ge 1280\text{px}$). Left text stays anchored.
  - Quote words interpolate from 20% to 100% opacity in sequence.
  - Mobile: unpinned inline scrub.
- [ ] **Step 3: Verify About scroll scrub and reduced-motion fallback**
  Confirm full-section pin, word reveal, and graphic state transitions.
- [ ] **Step 4: Commit**
  `git add src/components/home/IdeaToProductGraphic.tsx src/app/page.tsx; git commit -m "feat(motion): implement About Idea to Product 150vh pinned signature scrub"`

---

### Task 5: What We Do 3D Motion Refinements

**Files:**
- Modify: `src/components/canvas/M1AirHandlingUnit.tsx`
- Modify: `src/components/home/WhatWeDoSection.tsx`

**Interfaces:**
- Consumes: `MOTION_TOKENS`

- [ ] **Step 1: Implement vertical turntable rotation and gap interpolation in `M1AirHandlingUnit.tsx`**
  - 6° to 8° vertical $Y$-axis rotation on item change over 0.8s with `easeInOut`.
  - Explode gap values interpolate smoothly between active states.
- [ ] **Step 2: Refine What We Do active state transitions in `WhatWeDoSection.tsx`**
  Smooth 0.4s cross-fade of copper highlights.
- [ ] **Step 3: Verify frame rate and smooth rotation**
  Check that rotation and gap adjustments cause zero sudden jumps.
- [ ] **Step 4: Commit**
  `git add src/components/canvas/M1AirHandlingUnit.tsx src/components/home/WhatWeDoSection.tsx; git commit -m "feat(motion): add turntable rotation and smooth gap interpolation to What We Do"`

---

### Task 6: Approach Timeline Brightening & Value Proposition Masked Reveal

**Files:**
- Modify: `src/components/approach/ApproachTimeline.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Enhance `ApproachTimeline.tsx`**
  - Scroll-driven left-to-right fill on desktop, top-to-bottom on mobile.
  - Each step node and heading brightens from 40% to 100% opacity when the line reaches it; node fills with royal.
- [ ] **Step 2: Add scrubbed masked reveals for Value Proposition in `src/app/page.tsx`**
  - Line 1: *"You bring the product vision."* (Masked line reveal, scrubbed).
  - Line 2: *"We bring the engineering capability."* (Masked line reveal, scrubbed).
- [ ] **Step 3: Verify scroll progression and text readability**
  Test with Playwright script.
- [ ] **Step 4: Commit**
  `git add src/components/approach/ApproachTimeline.tsx src/app/page.tsx; git commit -m "feat(motion): implement Approach timeline brightening and Value Prop masked reveals"`

---

### Task 7: CTA Plant Room Plan Drift & Spring Interaction Physics

**Files:**
- Create: `src/components/home/PlantRoomPlanBackground.tsx`
- Modify: `src/components/canvas/Scene.tsx` (spring cursor tilt)
- Modify: `src/components/ui/Button.tsx` (magnetic hover shift)
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Implement `PlantRoomPlanBackground.tsx`**
  Architectural plant room SVG drawing in paper at 12% opacity with dashed copper pipe lines drifting slowly (max 24px), paused when off-screen.
- [ ] **Step 2: Implement cursor spring tilt in `Scene.tsx`**
  Second-order spring physics (stiffness 90, damping 20, max 4° tilt). Disabled on touch devices.
- [ ] **Step 3: Implement magnetic hover shift in `Button.tsx`**
  Up to 4px translate towards cursor with fast duration (0.4s). Focus states unaffected.
- [ ] **Step 4: Verify interaction physics**
  Confirm zero cursor trails, zero glow, and smooth magnetic response.
- [ ] **Step 5: Commit**
  `git add src/components/home/PlantRoomPlanBackground.tsx src/components/canvas/Scene.tsx src/components/ui/Button.tsx src/app/page.tsx; git commit -m "feat(motion): implement CTA plant room drift and interactive spring physics"`

---

### Task 8: Performance Profiling, Video Recording & Verification Suite

**Files:**
- Create: `scripts/record-motion1-videos.mjs`
- Create: `reports/motion-1/`

- [ ] **Step 1: Record Playwright Motion Videos**
  Record 15–25s videos (1280px & 375px) in `/reports/motion-1/videos/`:
  - `page-load.webm`
  - `about-scroll.webm` (1280 & 375)
  - `what-we-do-scroll.webm`
  - `approach-scroll.webm` (1280 & 375)
  - `cta.webm`
- [ ] **Step 2: Measure 4x CPU-Throttled Frame Rates**
  Confirm $\ge 45\text{ fps}$ under 4x CPU throttle and $\ge 60\text{ fps}$ unthrottled.
- [ ] **Step 3: Accessibility & Keyboard Navigation Audit**
  Verify Tab key focus order, Page Down / Page Up navigation through pinned sections, and anchor link jumps.
- [ ] **Step 4: Run Contrast & Lighthouse Audits**
  Confirm 0 WCAG contrast failures and mobile performance $\ge 85$.
- [ ] **Step 5: Generate Final Motion Report Artifact**
  Compile `/reports/motion-1/report.md` and present to user for approval before merging.
- [ ] **Step 6: Commit**
  `git add scripts/record-motion1-videos.mjs reports/motion-1/; git commit -m "test(motion): add automated verification suite and performance benchmarks"`
