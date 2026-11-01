import fs from "fs";
import path from "path";

const TARGET_STRINGS = [
  "DPR:",
  "VIEW: 3D",
  "CURSOR TILT",
  "SCROLL DOWN TO EXPLODE",
  "SCALE:",
  "GENERAL ARRANGEMENT",
  "PHASE STATUS:",
  "ORGANIZATION / STANDARDS",
  "ISO",
  "verified",
  "certified",
  "compliant",
  "MV-",
  "DWG REF:",
  "SECTION CUT",
  "COMPANY OVERVIEW",
  "CORE OBJECTIVE",
  "STRUCTURED WORKFLOW",
  "PROCESS WORKFLOW",
  "CAPABILITIES INDEX",
  "INSPECT",
  "ACTIVE MAPPING",
  "+0,0",
  "R3F/GL",
];

const IGNORE_DIRS = ["node_modules", ".git", ".next", "reports", "audit-report.json", "audit-results.json"];

const findings = [];

function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    const rel = path.relative(process.cwd(), full).replace(/\\/g, "/");
    if (IGNORE_DIRS.some((d) => rel.startsWith(d) || entry.name === d)) continue;

    if (entry.isDirectory()) {
      scanDir(full);
    } else if (/\.(tsx|ts|jsx|js|css)$/.test(entry.name) && !rel.startsWith("scripts/")) {
      const content = fs.readFileSync(full, "utf-8");
      const lines = content.split("\n");
      lines.forEach((line, idx) => {
        TARGET_STRINGS.forEach((target) => {
          if (line.toLowerCase().includes(target.toLowerCase())) {
            findings.push({
              file: rel,
              line: idx + 1,
              target,
              text: line.trim(),
            });
          }
        });
      });
    }
  }
}

scanDir(process.cwd());

fs.writeFileSync("deleted-strings-inventory.json", JSON.stringify(findings, null, 2));
console.log(`Found ${findings.length} target occurrences across files.`);
