"use client";

import { useEffect, useRef } from "react";

const SHADES = ["░", "▒", "▓", "█"] as const;

const LINES = [
  " ▓▓▓▓▓▓  ▓▓▓▓▓▓▓ ▓▓▓▓▓▓▓▓     ▓▓▓▓▓▓▓ ▓▓   ▓▓ ▓▓ ▓▓▓▓▓▓▓▓     ▓▓▓▓▓▓  ▓▓▓▓▓▓  ▓▓▓▓▓▓▓ ▓▓▓▓▓▓▓▓ ▓▓▓▓▓▓▓▓ ▓▓    ▓▓",
  "▓▓       ▓▓         ▓▓        ▓▓      ▓▓   ▓▓ ▓▓    ▓▓        ▓▓   ▓▓ ▓▓   ▓▓ ▓▓         ▓▓       ▓▓     ▓▓  ▓▓",
  "░░   ░░░ ░░░░░      ░░        ░░░░░░░ ░░░░░░░ ░░    ░░        ░░░░░░  ░░░░░░  ░░░░░      ░░       ░░      ░░░░",
  "░░    ░░ ░░         ░░             ░░ ░░   ░░ ░░    ░░        ░░      ░░   ░░ ░░         ░░       ░░       ░░",
  " ▒▒▒▒▒▒  ▒▒▒▒▒▒▒    ▒▒        ▒▒▒▒▒▒▒ ▒▒   ▒▒ ▒▒    ▒▒        ▒▒      ▒▒   ▒▒ ▒▒▒▒▒▒▒    ▒▒       ▒▒       ▒▒",
];

// Build a map of which positions are shade characters (not spaces)
function buildCharMap(lines: string[]): { row: number; col: number; base: number }[] {
  const chars: { row: number; col: number; base: number }[] = [];
  for (let r = 0; r < lines.length; r++) {
    for (let c = 0; c < lines[r].length; c++) {
      const ch = lines[r][c];
      const idx = SHADES.indexOf(ch as typeof SHADES[number]);
      if (idx !== -1) {
        chars.push({ row: r, col: c, base: idx });
      }
    }
  }
  return chars;
}

const CHAR_MAP = buildCharMap(LINES);

export function AsciiHero() {
  const preRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const pre = preRef.current;
    if (!pre) return;

    // Flatten all text nodes for direct character manipulation
    const textNodes: { node: Text; start: number }[] = [];
    let offset = 0;
    const walker = document.createTreeWalker(pre, NodeFilter.SHOW_TEXT);
    let node: Text | null;
    while ((node = walker.nextNode() as Text | null)) {
      textNodes.push({ node, start: offset });
      offset += node.textContent?.length ?? 0;
    }

    // Convert LINES into a flat string to find global offsets
    const flat = LINES.join("\n");

    // Pick ~8% of shade chars to shimmer
    const shimmerCount = Math.floor(CHAR_MAP.length * 0.08);
    let activeSet = new Set<number>();

    const interval = setInterval(() => {
      // Restore previous shimmered chars
      for (const idx of activeSet) {
        const entry = CHAR_MAP[idx];
        const globalPos = LINES.slice(0, entry.row).reduce((s, l) => s + l.length + 1, 0) + entry.col;
        for (const tn of textNodes) {
          const localPos = globalPos - tn.start;
          if (localPos >= 0 && localPos < (tn.node.textContent?.length ?? 0)) {
            const txt = tn.node.textContent!;
            tn.node.textContent = txt.slice(0, localPos) + SHADES[entry.base] + txt.slice(localPos + 1);
            break;
          }
        }
      }

      // Pick new random set
      activeSet = new Set<number>();
      while (activeSet.size < shimmerCount) {
        activeSet.add(Math.floor(Math.random() * CHAR_MAP.length));
      }

      // Shimmer: shift each to a random adjacent shade
      for (const idx of activeSet) {
        const entry = CHAR_MAP[idx];
        const globalPos = LINES.slice(0, entry.row).reduce((s, l) => s + l.length + 1, 0) + entry.col;
        const shift = Math.random() > 0.5 ? 1 : -1;
        const newShade = SHADES[Math.max(0, Math.min(SHADES.length - 1, entry.base + shift))];

        for (const tn of textNodes) {
          const localPos = globalPos - tn.start;
          if (localPos >= 0 && localPos < (tn.node.textContent?.length ?? 0)) {
            const txt = tn.node.textContent!;
            tn.node.textContent = txt.slice(0, localPos) + newShade + txt.slice(localPos + 1);
            break;
          }
        }
      }
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <h1 className="mb-gsp-8 text-center overflow-x-auto" aria-label="Get Shit Pretty">
      <pre
        ref={preRef}
        className="font-mono text-foreground text-[clamp(0.5rem,1.4vw,1rem)] leading-[1.15] inline-block text-left select-none"
        aria-hidden="true"
      >
        {LINES.join("\n")}
      </pre>
    </h1>
  );
}
