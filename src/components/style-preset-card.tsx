import { cn } from "@/lib/utils";

interface StylePresetCardProps {
  name: string;
  colors: string[];
  constraint: string;
  nameClassName?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function StylePresetCard({
  name,
  colors,
  constraint,
  nameClassName,
  className,
  style,
}: StylePresetCardProps) {
  return (
    <div
      className={cn("p-6 transition-opacity hover:opacity-90", className)}
      style={{
        transitionDuration: "var(--gsp-motion-normal)",
        transitionTimingFunction: "var(--gsp-motion-easing)",
        ...style,
      }}
    >
      <p className={cn("mb-gsp-3", nameClassName)}>{name}</p>
      <div className="flex items-center gap-gsp-2 mb-gsp-3">
        {colors.map((color) => (
          <span
            key={color}
            className="size-4 rounded-full border border-white/10"
            style={{ backgroundColor: color }}
            aria-hidden="true"
          />
        ))}
      </div>
      <p
        className="text-caption opacity-60"
        style={{ fontFamily: "inherit" }}
      >
        {constraint}
      </p>
    </div>
  );
}
