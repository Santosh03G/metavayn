import fs from "fs";
import path from "path";

const BANNED_PATTERNS = [
  "#06142B",
  "#0D2B52",
  "#2F7BFF",
  "#7FB2FF",
  "#EEF2F6",
  "#1B2430",
  "gradient(",
  "blueprint-deep",
  "blueprint-linen",
  "blueprint-dimension",
  "blueprint-signal",
  "blueprint-cyanotype",
  "blueprint-graphite",
  "blueprint-redline",
  "--color-deep",
  "--color-cyanotype",
  "--color-signal",
  "--color-dimension",
  "--color-linen",
  "--color-graphite",
  "--color-redline",
];

const EXTENSIONS = [".ts", ".tsx", ".js", ".jsx", ".css", ".json", ".html"];
const IGNORE_DIRS = ["node_modules", ".git", ".next", "reports", "audit-report.json", "audit-results.json"];

function scanDirectory(dir, findings) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.relative(process.cwd(), fullPath).replace(/\\/g, "/");

    if (IGNORE_DIRS.some((d) => relPath.startsWith(d) || entry.name === d)) {
      continue;
    }

    if (entry.isDirectory()) {
      scanDirectory(fullPath, findings);
    } else {
      const ext = path.extname(entry.name);
      if (EXTENSIONS.includes(ext) && !relPath.startsWith("scripts/verify-zero-old-colors.mjs") && !relPath.startsWith("scripts/audit-colors.mjs")) {
        const content = fs.readFileSync(fullPath, "utf-8");
        const lines = content.split("\n");
        lines.forEach((line, idx) => {
          for (const pattern of BANNED_PATTERNS) {
            if (line.toLowerCase().includes(pattern.toLowerCase())) {
              findings.push({
                file: relPath,
                line: idx + 1,
                pattern,
                snippet: line.trim(),
              });
            }
          }
        });
      }
    }
  }
}

const findings = [];
scanDirectory(process.cwd(), findings);

console.log("=== BANNED COLOR & GRADIENT SEARCH RESULTS ===");
console.log(`Total Banned Matches Found: ${findings.length}`);
if (findings.length > 0) {
  console.log("Matches found:");
  findings.forEach((f) => {
    console.log(`  ${f.file}:${f.line} -> matched "${f.pattern}" in: ${f.snippet}`);
  });
  process.exit(1);
} else {
  console.log("SUCCESS: 0 matches found for any banned old color or gradient( across the entire repository!");
  process.exit(0);
}
