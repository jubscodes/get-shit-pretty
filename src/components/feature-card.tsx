import { cn } from "@/lib/utils";

interface FeatureCardProps {
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({ title, description, className }: FeatureCardProps) {
  return (
    <div
      className={cn(
        "bg-card border border-border rounded-md p-6",
        "transition-colors hover:border-muted-foreground/30",
        className
      )}
      style={{
        transitionDuration: "var(--gsp-motion-normal)",
        transitionTimingFunction: "var(--gsp-motion-easing)",
      }}
    >
      <span className="text-primary text-body" aria-hidden="true">
        {"\u25c6"}
      </span>
      <h3 className="text-h3 text-foreground mt-gsp-3 mb-gsp-2">{title}</h3>
      <p className="text-body-sm text-muted-foreground">{description}</p>
    </div>
  );
}
