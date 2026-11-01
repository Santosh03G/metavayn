/**
 * Motion Tokens (Motion Pass 1)
 *
 * Single source of truth for site-wide animation timings and easing curves.
 * Calm, precise, engineering deceleration curves.
 */

import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";

if (typeof window !== "undefined") {
  gsap.registerPlugin(CustomEase);
  // Register exact custom cubic-bezier curves
  CustomEase.create("metavaynEaseOut", "0.22, 1, 0.36, 1");
  CustomEase.create("metavaynEaseInOut", "0.65, 0, 0.35, 1");
}

export const MOTION_TOKENS = {
  easings: {
    // Primary calm CAD deceleration curve (CSS)
    easeOut: "cubic-bezier(0.22, 1, 0.36, 1)",
    // Mechanical turnaround / reversal curve (CSS)
    easeInOut: "cubic-bezier(0.65, 0, 0.35, 1)",
    // GSAP custom format names registered with CustomEase
    gsapEaseOut: "metavaynEaseOut",
    gsapEaseInOut: "metavaynEaseInOut",
  },
  durations: {
    fast: 0.4, // 400ms: micro-interactions, active part cross-fades, button shifts
    base: 0.8, // 800ms: model line draw-on, rotation shifts, section-cut wipe
    slow: 1.2, // 1200ms: large ambient reveals, background drifts
  },
} as const;

export type MotionDurations = typeof MOTION_TOKENS.durations;
export type MotionEasings = typeof MOTION_TOKENS.easings;
