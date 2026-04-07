interface FrostedGlassProps {
  children: React.ReactNode;
}

export function FrostedGlass({ children }: FrostedGlassProps) {
  return (
    <div className="relative size-full rounded-2xl overflow-hidden">
      {/* Gradient highlight overlay — directional light on glass */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.15), transparent 50%)",
        }}
      />
      {/* Glass surface */}
      <div
        className="relative size-full rounded-2xl p-5"
        style={{
          background: "rgba(255,255,255,0.12)",
          backdropFilter: "blur(12px) saturate(180%)",
          WebkitBackdropFilter: "blur(12px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.20)",
          boxShadow:
            "0 8px 32px rgba(31,38,135,0.20), inset 0 1px 0 rgba(255,255,255,0.40)",
        }}
      >
        {children}
      </div>
    </div>
  );
}
