import assert from "node:assert/strict";

async function runTest() {
  console.log("Running motion-foundation unit test...");

  let motionModule;
  try {
    motionModule = await import("../src/lib/motion/index.ts");
  } catch (err) {
    console.error("Failed to import src/lib/motion/index.ts:", err.message);
    process.exit(1);
  }

  const { MOTION_TOKENS, usePrefersReducedMotion, useScrub } = motionModule;

  // 1. Check Easing Tokens
  assert.ok(MOTION_TOKENS, "MOTION_TOKENS must be defined");
  assert.equal(
    MOTION_TOKENS.easings.easeOut,
    "cubic-bezier(0.22, 1, 0.36, 1)",
    "easeOut token mismatch"
  );
  assert.ok(
    MOTION_TOKENS.easings.easeInOut,
    "easeInOut token must be defined"
  );

  // 2. Check Duration Tokens
  assert.equal(MOTION_TOKENS.durations.fast, 0.4, "fast duration must be 0.4s");
  assert.equal(MOTION_TOKENS.durations.base, 0.8, "base duration must be 0.8s");
  assert.equal(MOTION_TOKENS.durations.slow, 1.2, "slow duration must be 1.2s");

  // 3. Check Hooks
  assert.equal(typeof usePrefersReducedMotion, "function", "usePrefersReducedMotion must be a function");
  assert.equal(typeof useScrub, "function", "useScrub must be a function");

  console.log("All motion foundation tests passed successfully!");
}

runTest().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
