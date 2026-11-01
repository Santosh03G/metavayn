# Refine Pass 3: Verification & Motion Review Report

**Branch:** `refine-3`  
**Palette:** D2 (Strictly preserved, 0 token changes)  
**Content:** `content/site-content.md` (Strictly preserved, 0 copy changes)  
**Status:** Verification complete; awaiting user approval before merging into `main`.

---

## 1. What We Do: Active State & Highlight Mapping

The first item (`product`) is now active on initial load. The active item displays a `font-weight: 600` heading, a short copper rule (`2px` high by `40px` wide) directly below the heading, and tints its corresponding subassemblies in copper (`#F0A06A`) with smooth 300ms continuous color interpolation.

### Highlight Mapping (Single Source of Truth)
Defined centrally in [`src/lib/discipline-highlight-mapping.ts`](file:///d:/Santosh/Development/MetavaynBlog/src/lib/discipline-highlight-mapping.ts):

| Discipline | 3D Model Rendered | Highlighted Subassembly Parts in Copper (`#F0A06A`) | Visual Stage Behavior |
| :--- | :---: | :--- | :--- |
| **Product Engineering** | Yes | **Whole unit edges**: all subassembly edges turn copper; all mesh fills stay paper (`#F1EEE6`). | Complete modular integration overview with copper wireframe outlines. |
| **Mechanical Design Engineering** | Yes | **Casing panels & base skid**: outer enclosure, service doors, and channel frame. | Focuses on sheet metal fabrication and structural base. |
| **HVAC & Thermal Engineering** | Yes | **Coil section & fan section**: finned cooling coil block, headers, and centrifugal fan impeller. | Highlights thermal transfer core and airflow delivery assembly. |
| **Engineering Documentation** | **No** | None (3D canvas replaced). | Displays high-contrast 2D technical drawing sheet with full BOM item schedule. |
| **Engineering Support** | Yes | **None**: model remains entirely neutral paper (`#F1EEE6`) with black edges (`#050505`). | Clean baseline assembly without part tinting. |

### Component Refinements in [`WhatWeDoSection.tsx`](file:///d:/Santosh/Development/MetavaynBlog/src/components/home/WhatWeDoSection.tsx)
- **Active State on Load:** Initialized to `useState<string>("product")`.
- **Heading Weight:** Active item heading styled with `font-semibold` (`font-weight: 600`).
- **Copper Rule:** Rendered as `h-[2px] w-10 bg-copper` in a dedicated slot to prevent layout shifts.
- **Hairlines:** Exactly one top rule above item 1 (`border-t border-pale-blue/20`), then uniform hairlines between items (`divide-y divide-pale-blue/20`); duplicate bottom border removed.
- **Vertical Spacing:** Vertical gaps between heading, description, and link reduced by ~35% (`py-6 sm:py-7`, `mt-1.5`, `mb-2.5`).
- **Interaction:** Hover and keyboard focus immediately preview the discipline state; scrolling through the section updates the active item via `IntersectionObserver`.

---

## 2. Hero Contact Shadow

The wide parallelogram shadow has been replaced with a tight ground shadow mesh:
- **Geometry:** `planeGeometry args={[4.02, 1.28]}` located at `y = -0.765` directly beneath the base skid frame ($3.8 \times 1.2$).
- **Extension:** Extends $5.7\%$ beyond base width and $5.8\%$ beyond base depth, strictly below the $\le 6\%$ limit.
- **Appearance:** Solid black (`#050505`) with $18\%$ opacity (`transparent`, `depthWrite={false}`).
- **Container Clearance:**
  - At **1280px**: Right edge clearance from viewport is **44px** (strictly $\ge 40\text{px}$).
  - At **1920px**: Right edge clearance from viewport is **244px** (strictly $\ge 40\text{px}$).

---

## 3. Type Scale & Body Line Length

Configured in [`tailwind.config.ts`](file:///d:/Santosh/Development/MetavaynBlog/tailwind.config.ts) and [`src/styles/globals.css`](file:///d:/Santosh/Development/MetavaynBlog/src/styles/globals.css):
- **Body Text (`.text-body`):**
  - Viewports $\ge 1280\text{px}$: `18px` font size, line-height `1.6` (`28.8px`).
  - Viewports $768\text{px}$: `17px` font size, line-height `1.6` (`27.2px`).
  - Viewports $375\text{px}$: `16px` font size, line-height `1.6` (`25.6px`).
- **Body Max Line Length:** Strictly constrained to `max-w-[68ch]` across all body paragraphs.
- **Lead Lines (`.text-lead`):** `22px` to `24px` (`text-[22px] sm:text-[24px]`), weight `500` (`font-medium`).
- **Headings & Fonts:** Existing display font (`var(--font-bricolage)`) and headings preserved.

---

## 4. Heading Recipe

Royal subheadings are now restricted exclusively to the two specified brand anchors:
1. **Hero Tagline:** *"Engineering excellence. Delivered."* (`text-paper font-semibold` on royal field).
2. **About Subheading:** *"Your engineering partner for faster product delivery"* (`text-royal font-semibold` on paper field).

Every other section subheading has been converted into a lead paragraph in weight `500`, `22px`–`24px`:
- **Our Approach:** Converted to lead paragraph in black on paper (`text-lead text-black mt-1`).
- **Our Value Proposition:** Converted to lead paragraph in black on paper (`text-lead text-black max-w-[68ch]`).
- **Partner with Metavayn CTA:** Converted to lead paragraph in paper on black (`text-lead text-paper max-w-[68ch] mx-auto`).
- Copy wording remains $100\%$ untouched.

---

## 5. About Layout

Implemented with Tailwind's 12-column container grid in [`src/app/page.tsx`](file:///d:/Santosh/Development/MetavaynBlog/src/app/page.tsx):
- **At $\ge 1280\text{px}$ (`xl:grid-cols-12`):**
  - **Left Column (`xl:col-span-5`):** Heading H2, royal subheading H3, and body paragraph.
  - **Column 6:** Clean spacer gutter.
  - **Right Column (`xl:col-span-6 xl:col-start-7`):** Typographic quote top-aligned with heading at `44px` font size (`text-[44px] leading-tight font-medium`).
  - **Geometric Alignment:** Top alignment delta is **0px** (`h2Top = 160px`, `quoteTop = 160px`).
- **Below $1280\text{px}$:**
  - Transitions to a single-column stack with the quote placed cleanly below the body paragraph (`border-t border-paper-line pt-6`).

---

## 6. Approach Timeline

Implemented in [`src/components/approach/ApproachTimeline.tsx`](file:///d:/Santosh/Development/MetavaynBlog/src/components/approach/ApproachTimeline.tsx):
- **Line Termination:** Horizontal connecting hairline spans from node 1 center (`52px`) directly to node 4 center (`988px`), with **0px** overhang beyond step 4.
- **Scroll-Driven Fill:** As the approach section enters the viewport, an overlaid royal line (`bg-royal h-[2px]`) expands using a hardware-accelerated CSS `transform: scaleX(progress)` with `transformOrigin: left`.
- **Reduced Motion Support:** When `prefers-reduced-motion: reduce` is detected, animation is completely bypassed and the line renders statically at 100% fill (`matrix(1, 0, 0, 1, 0, 0)`).

---

## 7. Nav Casing

Rendered in presentation sentence case in [`src/components/layout/Header.tsx`](file:///d:/Santosh/Development/MetavaynBlog/src/components/layout/Header.tsx) across both desktop navigation and accessible mobile menu dialog:
- `"Home"`
- `"About us"` (previously "About Us")
- `"Services"`
- `"Industries"`
- `"Our approach"` (previously "Our Approach")
- `"Careers"`
- `"Contact"`

---

## 8. Motion Review & 4x CPU Throttled Profiling

Playwright videos recorded at 1280px width under a **4x CPU-throttled profile** via Chrome DevTools Protocol (`Emulation.setCPUThrottlingRate` = 4):

| Scene / Interaction | Video Deliverable Link | 4x Throttled Average FPS | Performance Status |
| :--- | :--- | :---: | :---: |
| **Hero (Cursor tilt & scroll explode)** | [hero.webm](file:///d:/Santosh/Development/MetavaynBlog/reports/refine-3/videos/hero.webm) | **107.4 FPS** | Exceeds 60 FPS standard |
| **What We Do (Scroll all 5 disciplines)** | [what-we-do.webm](file:///d:/Santosh/Development/MetavaynBlog/reports/refine-3/videos/what-we-do.webm) | **93.9 FPS** | Smooth 300ms transitions |
| **Approach (Scroll-driven line fill)** | [approach.webm](file:///d:/Santosh/Development/MetavaynBlog/reports/refine-3/videos/approach.webm) | **96.5 FPS** | Jitter-free hardware scaleX |

---

## 9. WCAG 2.1 AA Contrast Audit

Audit executed across 673 DOM elements on Home, Services, and Our Approach:
- **Total Elements Evaluated:** 673
- **Passed:** 673
- **Failures:** **0**
- **Pass Rate:** **100%**
- **Contrast Ratios:**
  - Royal on Paper headings/links: **5.94:1** (Required: 4.5:1)
  - Black on Paper text: **18.72:1** (Required: 4.5:1)
  - Paper on Royal fields: **5.94:1** (Required: 4.5:1)
  - Pale-blue on Black links: **8.63:1** (Required: 4.5:1)
  - Copper on Black accents: **7.91:1** (Required: 3.0:1)

---

## 10. Screenshot Evidence

All screenshots captured at 375px, 768px, 1280px, and 1920px viewports before and after implementation:

| Section | 375px Before / After | 768px Before / After | 1280px Before / After | 1920px Before / After |
| :--- | :--- | :--- | :--- | :--- |
| **Hero** | [before](file:///d:/Santosh/Development/MetavaynBlog/reports/refine-3/before/375/hero.png) / [after](file:///d:/Santosh/Development/MetavaynBlog/reports/refine-3/after/375/hero.png) | [before](file:///d:/Santosh/Development/MetavaynBlog/reports/refine-3/before/768/hero.png) / [after](file:///d:/Santosh/Development/MetavaynBlog/reports/refine-3/after/768/hero.png) | [before](file:///d:/Santosh/Development/MetavaynBlog/reports/refine-3/before/1280/hero.png) / [after](file:///d:/Santosh/Development/MetavaynBlog/reports/refine-3/after/1280/hero.png) | [before](file:///d:/Santosh/Development/MetavaynBlog/reports/refine-3/before/1920/hero.png) / [after](file:///d:/Santosh/Development/MetavaynBlog/reports/refine-3/after/1920/hero.png) |
| **About** | [before](file:///d:/Santosh/Development/MetavaynBlog/reports/refine-3/before/375/about.png) / [after](file:///d:/Santosh/Development/MetavaynBlog/reports/refine-3/after/375/about.png) | [before](file:///d:/Santosh/Development/MetavaynBlog/reports/refine-3/before/768/about.png) / [after](file:///d:/Santosh/Development/MetavaynBlog/reports/refine-3/after/768/about.png) | [before](file:///d:/Santosh/Development/MetavaynBlog/reports/refine-3/before/1280/about.png) / [after](file:///d:/Santosh/Development/MetavaynBlog/reports/refine-3/after/1280/about.png) | [before](file:///d:/Santosh/Development/MetavaynBlog/reports/refine-3/before/1920/about.png) / [after](file:///d:/Santosh/Development/MetavaynBlog/reports/refine-3/after/1920/about.png) |
| **What We Do** | [before](file:///d:/Santosh/Development/MetavaynBlog/reports/refine-3/before/375/what-we-do.png) / [after](file:///d:/Santosh/Development/MetavaynBlog/reports/refine-3/after/375/what-we-do.png) | [before](file:///d:/Santosh/Development/MetavaynBlog/reports/refine-3/before/768/what-we-do.png) / [after](file:///d:/Santosh/Development/MetavaynBlog/reports/refine-3/after/768/what-we-do.png) | [before](file:///d:/Santosh/Development/MetavaynBlog/reports/refine-3/before/1280/what-we-do.png) / [after](file:///d:/Santosh/Development/MetavaynBlog/reports/refine-3/after/1280/what-we-do.png) | [before](file:///d:/Santosh/Development/MetavaynBlog/reports/refine-3/before/1920/what-we-do.png) / [after](file:///d:/Santosh/Development/MetavaynBlog/reports/refine-3/after/1920/what-we-do.png) |
| **Approach** | [before](file:///d:/Santosh/Development/MetavaynBlog/reports/refine-3/before/375/approach.png) / [after](file:///d:/Santosh/Development/MetavaynBlog/reports/refine-3/after/375/approach.png) | [before](file:///d:/Santosh/Development/MetavaynBlog/reports/refine-3/before/768/approach.png) / [after](file:///d:/Santosh/Development/MetavaynBlog/reports/refine-3/after/768/approach.png) | [before](file:///d:/Santosh/Development/MetavaynBlog/reports/refine-3/before/1280/approach.png) / [after](file:///d:/Santosh/Development/MetavaynBlog/reports/refine-3/after/1280/approach.png) | [before](file:///d:/Santosh/Development/MetavaynBlog/reports/refine-3/before/1920/approach.png) / [after](file:///d:/Santosh/Development/MetavaynBlog/reports/refine-3/after/1920/approach.png) |
| **CTA** | [before](file:///d:/Santosh/Development/MetavaynBlog/reports/refine-3/before/375/cta.png) / [after](file:///d:/Santosh/Development/MetavaynBlog/reports/refine-3/after/375/cta.png) | [before](file:///d:/Santosh/Development/MetavaynBlog/reports/refine-3/before/768/cta.png) / [after](file:///d:/Santosh/Development/MetavaynBlog/reports/refine-3/after/768/cta.png) | [before](file:///d:/Santosh/Development/MetavaynBlog/reports/refine-3/before/1280/cta.png) / [after](file:///d:/Santosh/Development/MetavaynBlog/reports/refine-3/after/1280/cta.png) | [before](file:///d:/Santosh/Development/MetavaynBlog/reports/refine-3/before/1920/cta.png) / [after](file:///d:/Santosh/Development/MetavaynBlog/reports/refine-3/after/1920/cta.png) |
| **Full Page** | [before](file:///d:/Santosh/Development/MetavaynBlog/reports/refine-3/before/375/full-page.png) / [after](file:///d:/Santosh/Development/MetavaynBlog/reports/refine-3/after/375/full-page.png) | [before](file:///d:/Santosh/Development/MetavaynBlog/reports/refine-3/before/768/full-page.png) / [after](file:///d:/Santosh/Development/MetavaynBlog/reports/refine-3/after/768/full-page.png) | [before](file:///d:/Santosh/Development/MetavaynBlog/reports/refine-3/before/1280/full-page.png) / [after](file:///d:/Santosh/Development/MetavaynBlog/reports/refine-3/after/1280/full-page.png) | [before](file:///d:/Santosh/Development/MetavaynBlog/reports/refine-3/before/1920/full-page.png) / [after](file:///d:/Santosh/Development/MetavaynBlog/reports/refine-3/after/1920/full-page.png) |
