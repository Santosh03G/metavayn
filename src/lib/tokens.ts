/**
 * Metavayn Design Tokens - Theme D2 Palette
 * Source of truth for styling, colors, and layout constraints.
 */

export const TOKENS = {
  colors: {
    black: "#050505",          // Contrast sections, footer, headings on paper
    royal: "#2347E0",          // Hero and key section fields, primary fills on paper
    royalHover: "#1B3AC4",     // Hover/pressed for royal fills
    paper: "#F1EEE6",          // Light sections, text on royal and black
    paperLine: "rgba(5, 5, 5, 0.14)", // Hairlines and dividers on paper
    copper: "#F0A06A",         // Accent: pipework, one highlight per screen
    paleBlue: "#9DB2FF",       // Thin lines, links and small graphics on black
    redline: "#E5484D",        // Graphics only (revision clouds)
    redlineText: "#B3261E",    // Red text on paper only
  },
  typography: {
    maxMeasure: "75ch",        // Maximum line length for readability
  },
  drawing: {
    sheetScale: "1:1",
    standard: "Engineering Drawing Standard",
    dwgPrefix: "DWG-2026",
    revision: "01",
  },
} as const;