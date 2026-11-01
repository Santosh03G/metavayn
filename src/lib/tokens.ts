/**
 * Metavayn Design Tokens
 * Source of truth for styling, colors, and layout constraints.
 */

export const TOKENS = {
  colors: {
    sectionDeep: "#06142B",    // Base canvas / darkest surface
    cyanotype: "#0D2B52",      // Blueprint surface
    signalBlue: "#2F7BFF",     // Interactive accent
    dimensionLine: "#7FB2FF",  // Drafting lines & CAD borders
    linen: "#EEF2F6",          // Light section cuts background
    graphite: "#1B2430",       // Text on light background
    redline: "#E5484D",        // Revision markups & validation moments
  },
  typography: {
    maxMeasure: "75ch",        // Maximum line length for readability
  },
  drawing: {
    sheetScale: "1:1",
    standard: "ISO 128 / ASME Y14.5",
    dwgPrefix: "MV-2026",
    revision: "01",
  },
} as const;
