import fs from "fs";
import path from "path";

const targetDirs = ["src", "public"];
const rootFiles = ["tailwind.config.ts", "next.config.mjs"];
const extensions = [".ts", ".tsx", ".css", ".js", ".mjs", ".json", ".html"];

const findings = [];

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");

  lines.forEach((line, index) => {
    const hexMatches = line.match(/#(?:[0-9a-fA-F]{3,8})\b/g) || [];
    const rgbaMatches = line.match(/rgba?\([^)]+\)/g) || [];
    const gradientMatches = line.match(/gradient\([^)]*\)/gi) || [];
    const blueprintMatches = line.match(/\b(?:blueprint-(?:deep|cyanotype|signal|dimension|linen|graphite|redline))\b/g) || [];

    const matches = [...new Set([...hexMatches, ...rgbaMatches, ...gradientMatches, ...blueprintMatches])];

    matches.forEach((m) => {
      let role = "general";
      if (line.includes("color") || line.includes("fill") || line.includes("stroke")) role = "graphics / vector / material";
      if (line.includes("bg-") || line.includes("background")) role = "background";
      if (line.includes("text-") || line.includes("color:")) role = "typography / text";
      if (line.includes("border-") || line.includes("border")) role = "border / divider";
      if (m.includes("gradient")) role = "gradient (banned)";

      findings.push({
        file: path.relative(process.cwd(), filePath).replace(/\\/g, "/"),
        line: index + 1,
        match: m,
        role,
        rawLine: line.trim(),
      });
    });
  });
}

function walkDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const fullPath = path.join(dir, f);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (f !== "node_modules" && f !== ".next" && f !== ".git" && f !== "verification") {
        walkDir(fullPath);
      }
    } else if (extensions.includes(path.extname(f))) {
      scanFile(fullPath);
    }
  }
}

targetDirs.forEach((d) => walkDir(d));
rootFiles.forEach((f) => {
  if (fs.existsSync(f)) scanFile(f);
});

const counts = {};
const fileCounts = {};
findings.forEach((item) => {
  counts[item.match] = (counts[item.match] || 0) + 1;
  fileCounts[item.file] = (fileCounts[item.file] || 0) + 1;
});

const report = {
  totalFindings: findings.length,
  uniqueColorMatches: Object.keys(counts).length,
  colorFrequencies: counts,
  filesAuditedCount: Object.keys(fileCounts).length,
  fileFrequencies: fileCounts,
  findings,
};

fs.writeFileSync("audit-report.json", JSON.stringify(report, null, 2), "utf-8");
console.log(`Audited ${findings.length} occurrences across ${Object.keys(fileCounts).length} files.`);
