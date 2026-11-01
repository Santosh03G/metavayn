const X0 = 360;
const Y0 = 310;
const cos30 = Math.cos(Math.PI / 6);
const sin30 = Math.sin(Math.PI / 6);

function pt(x, y, z) {
  const px = X0 + (x - z) * cos30;
  const py = Y0 - y + (x + z) * sin30;
  return [Number(px.toFixed(1)), Number(py.toFixed(1))];
}

const points = [
  pt(-190, -18, 60),
  pt(190, -18, 60),
  pt(190, -18, -60),
  pt(-190, 0, -60),
  pt(-180, 150, -60),
  pt(180, 150, -60),
  pt(180, 150, 60),
  pt(-180, 150, 60),
  pt(85, 175, -35),
  pt(155, 175, 35),
];

const xs = points.map(p => p[0]);
const ys = points.map(p => p[1]);

console.log("X Bounds:", Math.min(...xs), "to", Math.max(...xs));
console.log("Y Bounds:", Math.min(...ys), "to", Math.max(...ys));
