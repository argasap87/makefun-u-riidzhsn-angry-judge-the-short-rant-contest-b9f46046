// Angry Judge: The Short Rant Contest — make.fun bounty
// u-riidzhsn-angry-judge-the-short-rant-contest-b9f46046
// Writes one short funny rant (1–400 chars) to /output/entry.txt.
// Pure Node/TypeScript, no external dependencies, no network, no Pillow.
// Hook: a hotel shower with exactly three temperatures — the knob's one
// sacred position (10:15) gives four perfect seconds before the toilet
// on floor three flushes. Punchline: the stopwatch shrine.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const LINE =
  "Hotel showers speak exactly three dialects: arctic, lukewarm apology, and instant lobster. The knob has one sacred position — 10:15 — where the water is perfect for four seconds before the toilet on floor three flushes and scalds me. I've timed it. My stopwatch has a shrine now.";

// Gate guard: the sealed scorer only accepts UTF-8 text of 1–400 chars,
// not only white space. Refuse loudly rather than writing an invalid entry.
const chars = [...LINE].length;
if (chars < 1 || chars > 400 || LINE.trim().length === 0) {
  console.error(
    `gate failed: line is ${chars} chars (must be 1–400, non-blank)`,
  );
  process.exit(1);
}

// Reviser gate (second session): the entry is ONE rant text, so reject any
// embedded newline/carriage-return that would split it.
if (LINE.includes("\n") || LINE.includes("\r")) {
  console.error("gate failed: line must be a single line (no newline)");
  process.exit(1);
}

// Reviser gate (second session, genuine addition): reject invisible control
// and zero-width characters the newline guard cannot see — e.g. NUL, ESC,
// tab, U+200B zero-width space, U+FEFF BOM. A stray invisible char would
// survive the length/blank/newline checks yet corrupt the sealed text the
// judge reads (and could silently inflate the char count).
if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F\u200B-\u200F\u2028\u2029\uFEFF]/.test(LINE)) {
  console.error("gate failed: line contains invisible control characters");
  process.exit(1);
}

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", LINE, "utf8");

// Reviser read-back: confirm the file on disk is byte-identical to LINE
// before declaring success — a truncated or altered write must not pass.
if (readFileSync("/output/entry.txt", "utf8") !== LINE) {
  console.error("gate failed: /output/entry.txt does not match the line");
  process.exit(1);
}
console.log(`wrote /output/entry.txt (${chars} chars)`);
