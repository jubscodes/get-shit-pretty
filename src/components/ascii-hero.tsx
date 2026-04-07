"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const SHADES = ["░", "▒", "▓", "█"] as const;

// Full version — desktop (lg+)
const LINES_FULL = [
  " ▓▓▓▓▓▓  ▓▓▓▓▓▓▓ ▓▓▓▓▓▓▓▓     ▓▓▓▓▓▓▓ ▓▓   ▓▓ ▓▓ ▓▓▓▓▓▓▓▓     ▓▓▓▓▓▓  ▓▓▓▓▓▓  ▓▓▓▓▓▓▓ ▓▓▓▓▓▓▓▓ ▓▓▓▓▓▓▓▓ ▓▓    ▓▓",
  "▓▓       ▓▓         ▓▓        ▓▓      ▓▓   ▓▓ ▓▓    ▓▓        ▓▓   ▓▓ ▓▓   ▓▓ ▓▓         ▓▓       ▓▓     ▓▓  ▓▓",
  "░░   ░░░ ░░░░░      ░░        ░░░░░░░ ░░░░░░░ ░░    ░░        ░░░░░░  ░░░░░░  ░░░░░      ░░       ░░      ░░░░",
  "░░    ░░ ░░         ░░             ░░ ░░   ░░ ░░    ░░        ░░      ░░   ░░ ░░         ░░       ░░       ░░",
  " ▒▒▒▒▒▒  ▒▒▒▒▒▒▒    ▒▒        ▒▒▒▒▒▒▒ ▒▒   ▒▒ ▒▒    ▒▒        ▒▒      ▒▒   ▒▒ ▒▒▒▒▒▒▒    ▒▒       ▒▒       ▒▒",
];

// Stacked version — tablet + mobile (will be center-padded at render time)
const LINES_STACKED_RAW = [
  " ▓▓▓▓▓▓  ▓▓▓▓▓▓▓ ▓▓▓▓▓▓▓▓",
  "▓▓       ▓▓         ▓▓",
  "░░   ░░░ ░░░░░      ░░",
  "░░    ░░ ░░         ░░",
  " ▒▒▒▒▒▒  ▒▒▒▒▒▒▒    ▒▒",
  "",
  " ▓▓▓▓▓▓▓ ▓▓   ▓▓ ▓▓ ▓▓▓▓▓▓▓▓",
  "▓▓      ▓▓   ▓▓ ▓▓    ▓▓",
  "░░░░░░░ ░░░░░░░ ░░    ░░",
  "     ░░ ░░   ░░ ░░    ░░",
  " ▒▒▒▒▒▒▒ ▒▒   ▒▒ ▒▒    ▒▒",
  "",
  " ▓▓▓▓▓▓  ▓▓▓▓▓▓  ▓▓▓▓▓▓▓ ▓▓▓▓▓▓▓▓ ▓▓▓▓▓▓▓▓ ▓▓    ▓▓",
  "▓▓   ▓▓ ▓▓   ▓▓ ▓▓         ▓▓       ▓▓     ▓▓  ▓▓",
  "░░░░░░  ░░░░░░  ░░░░░      ░░       ░░      ░░░░",
  "░░      ░░   ░░ ░░         ░░       ░░       ░░",
  " ▒▒      ▒▒   ▒▒ ▒▒▒▒▒▒▒    ▒▒       ▒▒       ▒▒",
];

// Center-pad all lines to the width of the longest line
function centerPad(lines: string[]): string[] {
  const maxLen = Math.max(...lines.map((l) => l.length));
  return lines.map((l) => {
    if (l === "") return " ".repeat(maxLen);
    const pad = Math.floor((maxLen - l.length) / 2);
    return " ".repeat(pad) + l + " ".repeat(maxLen - l.length - pad);
  });
}

const LINES_STACKED = centerPad(LINES_STACKED_RAW);

type Breakpoint = "sm" | "lg";

function useBreakpoint(): Breakpoint {
  const [bp, setBp] = useState<Breakpoint>("lg");

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setBp(mq.matches ? "lg" : "sm");
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return bp;
}

function buildCharMap(
  lines: string[],
): { row: number; col: number; base: number }[] {
  const chars: { row: number; col: number; base: number }[] = [];
  for (let r = 0; r < lines.length; r++) {
    for (let c = 0; c < lines[r].length; c++) {
      const ch = lines[r][c];
      const idx = SHADES.indexOf(ch as (typeof SHADES)[number]);
      if (idx !== -1) {
        chars.push({ row: r, col: c, base: idx });
      }
    }
  }
  return chars;
}

function useShimmer(
  preRef: React.RefObject<HTMLPreElement | null>,
  lines: string[],
) {
  useEffect(() => {
    const pre = preRef.current;
    if (!pre) return;

    const charMap = buildCharMap(lines);
    const textNodes: { node: Text; start: number }[] = [];
    let offset = 0;
    const walker = document.createTreeWalker(pre, NodeFilter.SHOW_TEXT);
    let node: Text | null;
    while ((node = walker.nextNode() as Text | null)) {
      textNodes.push({ node, start: offset });
      offset += node.textContent?.length ?? 0;
    }

    const shimmerCount = Math.floor(charMap.length * 0.08);
    let activeSet = new Set<number>();

    const interval = setInterval(() => {
      for (const idx of activeSet) {
        const entry = charMap[idx];
        const globalPos =
          lines.slice(0, entry.row).reduce((s, l) => s + l.length + 1, 0) +
          entry.col;
        for (const tn of textNodes) {
          const localPos = globalPos - tn.start;
          if (
            localPos >= 0 &&
            localPos < (tn.node.textContent?.length ?? 0)
          ) {
            const txt = tn.node.textContent!;
            tn.node.textContent =
              txt.slice(0, localPos) + SHADES[entry.base] + txt.slice(localPos + 1);
            break;
          }
        }
      }

      activeSet = new Set<number>();
      while (activeSet.size < shimmerCount) {
        activeSet.add(Math.floor(Math.random() * charMap.length));
      }

      for (const idx of activeSet) {
        const entry = charMap[idx];
        const globalPos =
          lines.slice(0, entry.row).reduce((s, l) => s + l.length + 1, 0) +
          entry.col;
        const shift = Math.random() > 0.5 ? 1 : -1;
        const newShade =
          SHADES[Math.max(0, Math.min(SHADES.length - 1, entry.base + shift))];

        for (const tn of textNodes) {
          const localPos = globalPos - tn.start;
          if (
            localPos >= 0 &&
            localPos < (tn.node.textContent?.length ?? 0)
          ) {
            const txt = tn.node.textContent!;
            tn.node.textContent =
              txt.slice(0, localPos) + newShade + txt.slice(localPos + 1);
            break;
          }
        }
      }
    }, 400);

    return () => clearInterval(interval);
  }, [preRef, lines]);
}

export function AsciiHero() {
  const bp = useBreakpoint();
  const lines = bp === "lg" ? LINES_FULL : LINES_STACKED;
  const preRef = useRef<HTMLPreElement>(null);
  useShimmer(preRef, lines);

  return (
    <h1
      className="mb-gsp-8 text-center overflow-hidden"
      aria-label="Get Shit Pretty"
    >
      <pre
        key={bp}
        ref={preRef}
        className={`font-mono text-foreground leading-[1.15] inline-block select-none ${
          bp === "lg"
            ? "text-left text-[clamp(0.5rem,1.1vw,1rem)]"
            : "text-center text-[clamp(0.45rem,2.5vw,0.75rem)]"
        }`}
        aria-hidden="true"
      >
        {lines.join("\n")}
      </pre>
    </h1>
  );
}
