# Motion Pass 1: Technical Design Specification

**Date:** 2026-11-01  
**Status:** Approved  
**Branch:** `motion-1`  
**Palette:** D2 (Royal `#2347E0`, Black `#050505`, Paper `#F1EEE6`, Copper `#F0A06A`, Pale-Blue `#9DB2FF`)  
**Scope:** Motion, choreography, and interaction physics only. Palette, copy, and layout remain strictly unchanged.

---

## 1. Overview & Objectives

Implement **Motion Pass 1** across the Metavayn website:
1. **Engineering Motion Aesthetic:** Restrained, precise, zero bounce, zero cartoon overshoot.
2. **Smooth Scroll Integration:** Lenis with `lerp: 0.1` synchronized with GSAP ticker, disabled on reduced motion and input focus.
3. **Choreographed Page Load:** Under 2.0s total, headline and copy fully readable by 0.95s.
4. **Signature Section Cuts:** Isometric $30^\circ$ clip-path wipes with a 24px $45^\circ$ hatch band between contrasting surfaces.
5. **About Signature Moment ("Idea to Product"):** Full-section 150vh pinned scrub featuring word-by-word quote reveal and a 3-stage SVG AHU evolution (Hand sketch $\to$ Technical CAD with dimensions $\to$ Royal filled render).
6. **Responsive & Accessible Interactions:** Cursor spring tilt on 3D models, magnetic button hover, and instant static fallback under `prefers-reduced-motion`.
7. **Performance Targets:** $\ge 60\text{ fps}$ on standard profiles, $\ge 45\text{ fps}$ on 4x CPU-throttled profiles, mobile Lighthouse $\ge 85$.

---

## 2. Motion Foundation (`src/lib/motion/`)

### Easing Tokens
- `easeOut`: `cubic-bezier(0.22, 1, 0.36, 1)` (Decisive CAD deceleration).
- `easeInOut`: `cubic-bezier(0.65, 0, 0.35, 1)` (Calm mechanical reversal).

### Duration Tokens
- `fast`: `0.4s` (Hover states, button shifts, active part cross-fades).
- `base`: `0.8s` (3D rotation shifts, wireframe line draws, section cut wipes).
- `slow`: `1.2s` (Atmospheric reveals, plant room drifting background).

### Lenis Smooth Scroll Configuration
- **Instance Setup:** `new Lenis({ lerp: 0.1, smoothWheel: true, orientation: 'vertical' })`.
- **GSAP Sync:** Synchronized via `lenis.on('scroll', ScrollTrigger.update)` and `gsap.ticker.add((time) => lenis.raf(time * 1000))`.
- **Input Focus Guards:** Global `focusin` and `focusout` event listeners pause Lenis (`lenis.stop()`) when `input`, `textarea`, `select`, or `[role="dialog"]` elements are focused, and resume (`lenis.start()`) on blur.
- **Accessibility:** If `(prefers-reduced-motion: reduce)` matches, Lenis is completely destroyed.

---

## 3. Detailed Component & Section Specifications

### 3.1 Page Load Choreography (Home)
- **Nav Fade-in:** `0.00s – 0.60s` (`opacity: 0 -> 1`).
- **Hero Headline & Copy Reveal:** `<SplitLines>` masked slide-up:
  - Line 1: `0.10s – 0.70s`
  - Line 2: `0.18s – 0.78s` (80ms stagger)
  - Tagline: `0.26s – 0.86s`
  - Body paragraph: `0.35s – 0.95s`
- **Hero 3D Wireframe Draw:** `0.40s – 1.20s` (Black edges draw on over 0.8s).
- **Hero 3D Fills:** `1.20s – 1.70s` (Paper mesh faces fade in over 0.5s; copper pipework resolves).
- **CTA Buttons:** `1.60s – 2.00s` (Fade in with subtle $y: 8\text{px} \to 0\text{px}$ slide).
- Total duration: **2.00s** (Readable by 0.95s).

### 3.2 SectionCut Component (`<SectionCut>`)
- Sits between contrasting surface transitions (Hero $\to$ About, About $\to$ What We Do, What We Do $\to$ Approach, Approach $\to$ CTA).
- **Isometric 30-Degree Angle:** Dynamic clip-path angled at $30^\circ$:
  `clip-path: polygon(0 calc(p * 100% - delta), 100% calc(p * 100% + delta), 100% 100%, 0 100%)`.
- **24px Hatch Band:** A 24px wide ribbon along the cutting boundary displaying a $45^\circ$ hatch pattern in the incoming surface's opposite contrast shade at **40% opacity**, settling smoothly to 0% as the scrub reaches completion.
- **Duration:** 0.9s scrubbed to scroll via ScrollTrigger.
- **Flush Nav Fix:** About section starts flush under the sticky nav (`top: 0`), with SectionCut handling the surface transition seamlessly.

### 3.3 About: "Idea to Product" Signature Moment
- **Desktop ($\ge 1280\text{px}$):**
  - Section is pinned (`pin: true`) for **150vh** of scroll.
  - Left column (H2, subheading, paragraph) remains anchored and fully readable.
  - **Quote Word Reveal:** Real HTML text where each word span interpolates from **20% opacity to 100% opacity** in sequence as scroll progress $p$ goes from $0 \to 1$.
  - **3-Stage SVG AHU Evolution (`<IdeaToProductGraphic>`):**
    - Geometry matches the 3-module AHU from `M1AirHandlingUnit` at $30^\circ$ isometric projection.
    - **Stage 1 ($p = 0.00 \to 0.35$):** Rough hand-drawn royal strokes (`#2347E0`), SVG displacement noise filter for wobble, double strokes, stroke-dashoffset draw-on.
    - **Stage 2 ($p = 0.35 \to 0.65$):** Sketch dissolves, crisp black drafting lines (`#050505`) draw on with royal dimension witness lines (un-numbered).
    - **Stage 3 ($p = 0.65 \to 1.00$):** Faces fill with royal tonal shades: Top `#DCE3FC`, Long face `#B9C6FA`, End face `#8FA3F5`; copper handles fade in (`#F0A06A`).
- **Mobile ($< 1280\text{px}$):** Unpinned; SVG renders inline at full width, scrubbing smoothly as the section scrolls past.

### 3.4 What We Do 3D Motion
- Stage remains pinned while list scrolls.
- Active item change triggers:
  - Unit rotates **$6^\circ$ to $8^\circ$** along vertical $Y$ axis over **0.8s** (`easeInOut`).
  - Highlighted subassemblies cross-fade to copper (`#F0A06A`) over **0.4s** (`fast` duration).
  - Explode gap values interpolate smoothly ($0.65 \leftrightarrow 0.75$) with no sudden jumps.

### 3.5 Approach Timeline Scroll Fill
- **Desktop:** Horizontal connecting line fills left to right. As leading edge reaches each step node ($p = 0.0, 0.33, 0.66, 1.0$), circular node fills with royal and step heading brightens from **40% to 100% opacity**.
- **Mobile:** Connects vertically, filling top-to-bottom with the same node and heading brightening.

### 3.6 Value Proposition & CTA Ambient Drift
- **Value Proposition:** Statement *"You bring the product vision. We bring the engineering capability."* is a large masked line reveal, scrubbed line-by-line.
- **CTA Plant Room Drift:** Architectural plan view SVG in paper at **12% opacity** (`rgba(241, 238, 230, 0.12)`) with dashed copper pipe routes drifting slowly (max 24px over section). Pauses execution when off-screen via `IntersectionObserver`.

### 3.7 Interaction Physics
- **Hero 3D Cursor Spring Tilt:** Model tilts up to $4^\circ$ toward cursor with spring physics: **stiffness $k = 90$**, **damping $c = 20$**. Disabled on touch devices (`(hover: none)`).
- **Magnetic Button Hover:** Buttons translate up to $4\text{px}$ towards cursor with `fast` duration (`0.4s`, `easeOut`). Resets to $(0, 0)$ on mouse leave. Focus states unaffected. No custom cursor, trails, or glow.

---

## 4. Performance, Accessibility & Verification Targets

- **Frame Rate:** $\ge 60\text{ fps}$ on standard profile; $\ge 45\text{ fps}$ on 4x CPU-throttled profile.
- **Accessibility:** Pinned sections maintain standard DOM spacer flow (Tab key navigation, Page Down / Up, and anchor navigation function without hindrance).
- **Reduced Motion:** If `prefers-reduced-motion: reduce` is active, all animations resolve immediately to their 100% completed final states.
- **Audit & Deliverables:**
  - Automated Playwright videos (1280px & 375px) in `/reports/motion-1/videos/`.
  - Frame rate telemetry and animation token registry table.
  - WCAG 2.1 AA contrast audit (0 failures target).
  - Mobile Lighthouse performance $\ge 85$.
