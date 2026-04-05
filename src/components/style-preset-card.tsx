import { cn } from "@/lib/utils";

interface StylePresetCardProps {
  name: string;
  description: string;
  heroStyle: React.CSSProperties;
  heroContent?: React.ReactNode;
  infoStyle?: React.CSSProperties;
  nameClassName?: string;
  className?: string;
}

export function StylePresetCard({
  name,
  description,
  heroStyle,
  heroContent,
  infoStyle,
  nameClassName,
  className,
}: StylePresetCardProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-md border border-border transition-all hover:border-primary/40",
        className
      )}
      style={{
        transitionDuration: "var(--gsp-motion-normal)",
        transitionTimingFunction: "var(--gsp-motion-easing)",
      }}
    >
      {/* Visual hero area */}
      <div
        className="relative h-48 flex items-end p-6"
        style={heroStyle}
      >
        {heroContent}
        <p
          className={cn("relative z-10 text-xl font-bold", nameClassName)}
          style={{ fontFamily: "inherit" }}
        >
          {name}
        </p>
      </div>
      {/* Info bar */}
      <div
        className="px-6 py-4 border-t border-border bg-card"
        style={infoStyle}
      >
        <p className="text-caption text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
