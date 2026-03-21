"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

const GLYPHS = [".", ".", ".", "\u00b7", "\u00b7", "\u2727", "\u25c7", "\u25c8"] as const;
const COLORS = [
  "var(--gsp-lavender)",
  "var(--gsp-rose)",
  "var(--gsp-lilac)",
  "var(--gsp-mauve)",
];

interface Particle {
  x: number;
  y: number;
  glyph: string;
  color: string;
  opacity: number;
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

function generateParticles(
  cols: number,
  rows: number,
  count: number,
  seed: number
): Particle[] {
  const rand = seededRandom(seed);
  const particles: Particle[] = [];
  const centerX = cols / 2;
  const centerY = rows / 2;

  for (let i = 0; i < count; i++) {
    const x = Math.floor(rand() * cols);
    const y = Math.floor(rand() * rows);

    // Distance from center (0-1, normalized)
    const dx = (x - centerX) / centerX;
    const dy = (y - centerY) / centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Density: higher chance of keeping particles near center
    if (rand() > 1 - dist * 0.6) continue;

    // Opacity: 10-18% range, higher toward center, fades at edges
    const baseOpacity = 0.18 - dist * 0.08;
    const opacity = Math.max(0.10, Math.min(0.18, baseOpacity));

    particles.push({
      x,
      y,
      glyph: GLYPHS[Math.floor(rand() * GLYPHS.length)],
      color: COLORS[Math.floor(rand() * COLORS.length)],
      opacity,
    });
  }

  return particles;
}

function buildGrid(cols: number, rows: number, particles: Particle[]): string {
  // Create empty grid
  const grid: string[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => " ")
  );

  // We can't use inline color per character in a <pre> without spans,
  // so we'll render with spans in JSX instead
  for (const p of particles) {
    if (p.y >= 0 && p.y < rows && p.x >= 0 && p.x < cols) {
      grid[p.y][p.x] = p.glyph;
    }
  }

  return grid.map((row) => row.join("")).join("\n");
}

export function AtmosphericBg({ className }: { className?: string }) {
  const cols = 120;
  const rows = 30;
  const seed = 42;

  const particles = useMemo(
    () => generateParticles(cols, rows, 200, seed),
    []
  );

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden select-none",
        className
      )}
      aria-hidden="true"
    >
      <pre className="absolute inset-0 flex items-center justify-center font-mono text-caption leading-tight">
        <code className="relative">
          {/* Base empty grid for sizing */}
          <span className="invisible">
            {buildGrid(cols, rows, [])}
          </span>
          {/* Overlay particles with color */}
          {particles.map((p, i) => (
            <span
              key={i}
              className="absolute"
              style={{
                left: `${p.x}ch`,
                top: `${p.y * 1.4}em`,
                color: p.color,
                opacity: p.opacity,
              }}
            >
              {p.glyph}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
