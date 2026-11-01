# Industries Page Technical Design Specification

**Date:** 2026-11-01  
**Status:** Approved  
**Branch:** `feature/industries-page`  
**Palette:** D2 Royal / Black / Paper / Copper / Pale-Blue  

---

## 1. Overview & Goals

Build the dedicated **Industries** page (`/industries`) for the Metavayn engineering website.

### Core Objectives
1. **Content Integrity:** Present the 5 core engineering sectors strictly using copy from [`content/site-content.md`](file:///d:/Santosh/Development/MetavaynBlog/content/site-content.md#L148-L172).
2. **Master-Detail Index + Stage Layout:** On desktop ($\ge 1024\text{px}$), present a large index list on the left with a sticky, centered visual stage on the right that cross-fades per industry.
3. **Signature Section-Cut Wipe:** Implement a dynamic CAD cutting plane wipe (`Approach A`) that sweeps across the stage during industry transitions with Section A–A callout arrows and a copper hairline edge.
4. **Model & Asset Reuse:** Reuse existing 3D models and drafting components (M1 AHU with aerodynamic streamlines, M3 weldment joint, technical drawing sheet + BOM table, M4 assembly turntable, and procedural geometric modular blocks). Zero heavy external assets.
5. **Mobile Responsiveness:** Under $1024\text{px}$, convert to a clean sequence of vertically stacked sections with an inline lightweight visual for each industry.
6. **Accessibility & Contrast:** Fully accessible keyboard navigation, ARIA states, static fallback for `prefers-reduced-motion`, and 100% WCAG 2.1 AA contrast compliance.

---

## 2. Information Architecture & D2 Surface Alternation

Per D2 system rules (*"Services and Industries alternate paper and black with royal used for one featured block each. Footer is black."*):

```
+-------------------------------------------------------------+
| 1. Header & Intro: Paper Surface (bg-paper text-black)      |
|    H1: "Industries we serve"                                |
|    Lead: "We provide engineering support for organizations  |
|           operating in engineering-intensive industries."   |
+-------------------------------------------------------------+
| 2. Main Interactive Index & Stage: Black Surface (bg-black) |
|    Left Column (Cols 1-5): 5 Industries Index List          |
|    Right Column (Cols 7-12): Sticky Stage with Cut Wipe     |
+-------------------------------------------------------------+
| 3. Featured Multi-Disciplinary OEM Integration (bg-royal)   |
|    Featured block highlighting cross-domain capability      |
+-------------------------------------------------------------+
| 4. Partner CTA Section (bg-black text-paper)                |
|    "Partner with Metavayn" / "Have an engineering challenge?|
+-------------------------------------------------------------+
| 5. Global Footer (bg-black)                                 |
+-------------------------------------------------------------+
```

---

## 3. The 5 Industry Visuals (Asset Reuse)

| Industry | Visual ID | Asset Reuse Strategy | Visual Composition & Palette Tokens |
| :--- | :---: | :--- | :--- |
| **Industrial Equipment** | `industrial` | [`M3WeldmentCallout.tsx`](file:///d:/Santosh/Development/MetavaynBlog/src/components/canvas/M3WeldmentCallout.tsx) | 3D heavy-machinery structural ISMC joint with reinforcing gusset plate; joint faces in paper `#F1EEE6`, black edges `#050505`, and welded bead seams in copper `#F0A06A` with CAD weld callout overlay. |
| **HVAC & Thermal Systems** | `hvac` | [`M1AirHandlingUnit.tsx`](file:///d:/Santosh/Development/MetavaynBlog/src/components/canvas/M1AirHandlingUnit.tsx) | Horizontal isometric AHU unit with coil block tinted copper `#F0A06A`; dynamic aerodynamic streamline curves in `pale-blue` (`#9DB2FF`) flowing through intake louvers, across filters/coils, and exiting through discharge duct. |
| **Manufacturing** | `manufacturing` | [`BomTable.tsx`](file:///d:/Santosh/Development/MetavaynBlog/src/components/drawing/BomTable.tsx) & drafting frame | Standard 2D CAD blueprint sheet in black surface with pale-blue borders, numbered part callout balloons (`①`, `②`, `③`), and production BOM table (Item, Part Number, Description, Material, Qty). |
| **OEM Product Development** | `oem` | [`CADModelView.tsx`](file:///d:/Santosh/Development/MetavaynBlog/src/components/canvas/CADModelView.tsx) | Precision machined mechanical assembly (parametric flange with shaft bore and bolt circle) rotating smoothly on a turntable axis (`autoRotate: true`); paper body, black CAD wireframe, copper center bore sleeve. |
| **Engineering & Technology** | `tech` | Pure Three.js procedural primitives | Abstract geometric capacity visualization: 3 core modular blocks (client team) in paper `#F1EEE6` with black edges, and 2 extension modular blocks in copper `#F0A06A` and pale-blue `#9DB2FF` smoothly docking into the assembly. |

---

## 4. Dual-Layer Section-Cut Wipe Engine

### Visual Anatomy
When an industry switch is triggered (via scroll threshold, click, or keyboard focus):
1. **Layer 1 (Underlying):** Renders the outgoing industry visual.
2. **Layer 2 (Overlying):** Renders the incoming industry visual, masked with a hardware-accelerated CSS `clip-path: inset(0 0 0 X%)` revealing the new scene from left to right.
3. **Cutting Plane Line:** A vertical 1.5px copper (`#F0A06A`) hairline translates in perfect sync with the clipping edge across 400ms:
   - Top datum marker: `▲ SECTION A–A` in `font-mono text-[9px] text-copper`.
   - Bottom datum marker: `▼` in `text-copper`.
   - Motion curve: `cubic-bezier(0.16, 1, 0.3, 1)` (`--ease-cad-deliberate`).
4. **Transition Complete:** Once progress reaches 100%, Layer 1 is updated, Layer 2 resets, and the cutting datum line fades out cleanly.

### Reduced Motion Guarantee
If `prefers-reduced-motion: reduce` is enabled:
- The cutting plane translation and clipping wipe are completely bypassed.
- The visual instantly cross-fades without motion.

---

## 5. Mobile Responsiveness

- **Breakpoints:**
  - $\ge 1024\text{px}$ (`lg:`): Master-detail 12-column layout with sticky centered stage.
  - $< 1024\text{px}$: Vertically stacked sequence where each industry renders its index number, title, description, and an inline, lightweight visual card.
- **Performance Budget:** Zero layout jumping, no horizontal overflowing, 60+ FPS on 4x throttled mobile profiles.

---

## 6. Implementation Plan & Deliverables

1. **Data Layer:** Create `src/lib/industries-data.ts` containing the 5 industry definitions, verbatim descriptions, and visual metadata.
2. **Visual Components:**
   - `src/components/industries/IndustrialVisual.tsx` (M3 structural weldment).
   - `src/components/industries/HvacAirflowVisual.tsx` (M1 with aerodynamic streamlines).
   - `src/components/industries/ManufacturingVisual.tsx` (2D drawing sheet + BOM table).
   - `src/components/industries/OemTurntableVisual.tsx` (M4 parametric flange turntable).
   - `src/components/industries/ModularTeamVisual.tsx` (Procedural modular capacity blocks).
3. **Stage Coordinator:**
   - `src/components/industries/IndustryStage.tsx` (Dual-layer container with animated CAD cutting plane).
   - `src/components/industries/IndustriesInteractiveSection.tsx` (Left index list + sticky stage with IntersectionObserver).
4. **Page Assembly:** `src/app/industries/page.tsx` assembling Paper header, Black interactive section, Royal featured block, Black CTA, and Footer.
5. **Verification & Audit:**
   - Automated Playwright screenshots (375, 768, 1280, 1920).
   - Frame rate verification of the section-cut wipe under 4x CPU throttling.
   - Automated WCAG 2.1 AA contrast audit (0 failures target).
