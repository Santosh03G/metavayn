# Metavayn Engineering & Design Guidelines: Theme D2

## 1. D2 Palette Tokens (Single Source of Truth)

All colors are strictly mapped to CSS variables and Tailwind theme keys. No hardcoded hex or arbitrary `bg-[#...]` classes may be used outside token definitions.

| CSS Variable | Tailwind Key | Hex / RGBA | Role / Usage |
| :--- | :--- | :--- | :--- |
| `--black` | `black` | `#050505` | Contrast sections, footer, headings on paper |
| `--royal` | `royal` | `#2347E0` | Hero and key section fields, primary fills on paper |
| `--royal-hover` | `royal-hover` | `#1B3AC4` | Hover/pressed state for royal fills |
| `--paper` | `paper` | `#F1EEE6` | Light sections, text on royal and black |
| `--paper-line` | `paper-line` | `rgba(5, 5, 5, 0.14)` | Hairlines, borders, and dividers on paper |
| `--copper` | `copper` | `#F0A06A` | Accent: pipework, at most ONE highlight per screen |
| `--pale-blue` | `pale-blue` | `#9DB2FF` | Thin lines, links, and small graphics on black |
| `--redline` | `redline` | `#E5484D` | Graphics only (revision clouds, delta borders) |
| `--redline-text` | `redline-text` | `#B3261E` | Red text on paper only (5.6:1 contrast) |

---

## 2. Section System

Sections strictly alternate between three surfaces. No page may be rendered entirely in one color.

- **Royal Section (`surface="royal"`):**
  - Background: `--royal` (`#2347E0`)
  - Text: `--paper` (`#F1EEE6`)
  - Links: `--paper` underlined
  - Lines & hairlines: `--paper` (`#F1EEE6`)
- **Black Section (`surface="black"`):**
  - Background: `--black` (`#050505`)
  - Text: `--paper` (`#F1EEE6`)
  - Links & thin lines: `--pale-blue` (`#9DB2FF`)
- **Paper Section (`surface="paper"`):**
  - Background: `--paper` (`#F1EEE6`)
  - Text: `--black` (`#050505`)
  - Links: `--royal` (`#2347E0`) underlined
  - Dividers: `--paper-line` (`rgba(5, 5, 5, 0.14)`)

### Page Sequences:
- **Hero:** Royal field.
- **Footer:** Black field.
- **Contact & Careers:** Paper surfaces (quiet pages).
- **Home:** Alternates: Royal (Hero) $\rightarrow$ Paper (About) $\rightarrow$ Black (What We Do) $\rightarrow$ Paper (Approach Teaser & Value Prop) $\rightarrow$ Black (Partner CTA).
- **Services & Industries:** Alternate Paper and Black, with Royal used for one featured block each (e.g. Mechanical Design M2 sheet metal unfold on Services).
- **Our Approach:** Royal for the sequence stage, with the Validate step drawn on a Paper sheet so redline marks read clearly.

---

## 3. Allowed Colour Pairings & Contrast Ratios

Only the following text and background combinations are permitted:

| Pairing | Contrast Ratio | WCAG Compliance | Permitted Elements |
| :--- | :--- | :--- | :--- |
| `--paper` on `--royal` | **5.9:1** | AA | Body copy, headings, secondary button text |
| `--black` on `--paper` | **17.6:1** | AAA | Body copy, headings, secondary button text |
| `--paper` on `--black` | **17.6:1** | AAA | Body copy, headings |
| `--pale-blue` on `--black` | **9.9:1** | AAA | Links, small labels, thin lines, secondary button text |
| `--royal` on `--paper` | **5.9:1** | AA | Links, primary buttons, prominent text |
| `--black` on `--copper` | **9.6:1** | AAA | Text on copper accent fills |
| `--redline-text` on `--paper` | **5.6:1** | AA | Red validation text, error messages on paper |

---

## 4. Forbidden Rules

- **FORBIDDEN:** `--royal` text or thin lines on `--black` (only 3:1 contrast; thick graphics are fine, text is not).
- **FORBIDDEN:** `--black` text on `--royal` (only 3:1 contrast).
- **FORBIDDEN:** `--copper` text on `--paper` or on `--royal` (copper is for fills, lines, and graphics only).
- **FORBIDDEN:** `--redline` for text on any surface (use `--redline-text` on paper only).
- **FORBIDDEN:** Opacity used to dim text (e.g. `text-white/60`); use an explicit token instead (`--pale-blue` or `--paper`).

---

## 5. Anti-Slop & Craft Rules

1. **Zero Gradients:** No gradients anywhere in the codebase (`gradient(` is banned). Solid flat colors only.
2. **Zero Blue Glow / Colored Shadows:** No tinted or blue-glow box-shadows. Shadows are subtle black at low opacity or omitted entirely.
3. **Copper Budget:** Copper (`--copper`) is permitted on **at most ONE element per screen** (e.g., a pipe, a scrubber bend line, a single small accent). Never use copper for every CTA.
4. **Focus Rings:** 2px solid ring with 2px offset on all interactive elements:
   - On royal: `--paper` ring with `--royal` offset.
   - On paper: `--royal` ring with `--paper` offset.
   - On black: `--pale-blue` ring with `--black` offset.
5. **3D Flat-Color Rendering:** All 3D materials must render exact hex values using `meshBasicMaterial` with `toneMapped={false}`, `gl.toneMapping = THREE.NoToneMapping`, and sRGB output.

---

## 6. Banned Colours List

The following old palette tokens and hex values are completely banned and must never appear in code:
- `#06142B` (Old Section Deep)
- `#0D2B52` (Old Cyanotype)
- `#2F7BFF` (Old Signal Blue)
- `#7FB2FF` (Old Dimension Line)
- `#EEF2F6` (Old Linen)
- `#1B2430` (Old Graphite)
- Any brass / gold accent colors
- All `blueprint-*` Tailwind classes
