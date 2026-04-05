"use client";

import { useRef } from "react";
import LiquidGlassLib from "liquid-glass-react";

interface LiquidGlassPanelProps {
  children: React.ReactNode;
}

export function LiquidGlass({ children }: LiquidGlassPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%", height: "100%" }}>
      <LiquidGlassLib
        mouseContainer={containerRef}
        displacementScale={50}
        blurAmount={0.04}
        saturation={160}
        aberrationIntensity={1.5}
        elasticity={0.08}
        cornerRadius={16}
        overLight={false}
        padding="20px"
        style={{
          border: "1px solid rgba(255,255,255,0.18)",
          boxShadow:
            "0 8px 32px rgba(0,0,0,0.4), inset 0 4px 20px rgba(255,255,255,0.15)",
        }}
      >
        {children}
      </LiquidGlassLib>
    </div>
  );
}
