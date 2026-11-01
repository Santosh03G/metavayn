import assert from "node:assert/strict";

const X0 = 350;
const Y0 = 240;
const cos30 = Math.cos(Math.PI / 6);
const sin30 = Math.sin(Math.PI / 6);

function pt(x, y, z) {
  const px = X0 + (x - z) * cos30;
  const py = Y0 - y + (x + z) * sin30;
  return `${px.toFixed(1)},${py.toFixed(1)}`;
}

function boxFaces(x1, x2, y1, y2, z1, z2) {
  const top = `${pt(x1, y2, z1)} ${pt(x2, y2, z1)} ${pt(x2, y2, z2)} ${pt(x1, y2, z2)}`;
  const front = `${pt(x1, y1, z2)} ${pt(x2, y1, z2)} ${pt(x2, y2, z2)} ${pt(x1, y2, z2)}`;
  const side = `${pt(x2, y1, z2)} ${pt(x2, y1, z1)} ${pt(x2, y2, z1)} ${pt(x2, y2, z2)}`;
  return { top, front, side };
}

const mod1 = boxFaces(-180, -65, 0, 150, -60, 60);
const mod2 = boxFaces(-60, 60, 0, 150, -60, 60);
const mod3 = boxFaces(65, 180, 0, 150, -60, 60);

assert.ok(!mod1.top.includes("NaN"), "mod1 top face points must not contain NaN");
assert.ok(!mod2.front.includes("NaN"), "mod2 front face points must not contain NaN");
assert.ok(!mod3.side.includes("NaN"), "mod3 side face points must not contain NaN");

console.log("Calculated isometric points successfully:", {
  mod1Top: mod1.top,
  mod2Front: mod2.front,
});
