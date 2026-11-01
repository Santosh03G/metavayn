/**
 * Metavayn Motion System Tokens
 * Strict engineering motion: calm, precise, zero bounce, zero overshoot.
 */

export const MOTION = {
  easings: {
    // Primary calm CAD deceleration curve
    cadEase: [0.16, 1, 0.3, 1] as const,
    // Direct mechanical trigger / click
    cadSnap: [0.25, 0.1, 0.25, 1] as const,
    // Linear drafting indicator
    linear: [0, 0, 1, 1] as const,
  },
  durations: {
    fast: 0.15,       // 150ms: hover, focus, micro-interactions
    normal: 0.3,      // 300ms: drawer open, tab switch, filter
    deliberate: 0.5,  // 500ms: section cut wipe, page transition
  },
} as const;

/**
 * Section Cut Wipe Animation Variants
 * Max 500ms duration.
 */
export const sectionCutVariants = {
  initial: {
    clipPath: "inset(0 0 100% 0)",
    opacity: 0.95,
  },
  animate: {
    clipPath: "inset(0 0 0% 0)",
    opacity: 1,
    transition: {
      duration: MOTION.durations.deliberate,
      ease: MOTION.easings.cadEase,
    },
  },
  exit: {
    clipPath: "inset(100% 0 0% 0)",
    opacity: 0.95,
    transition: {
      duration: MOTION.durations.deliberate * 0.8,
      ease: MOTION.easings.cadSnap,
    },
  },
};
