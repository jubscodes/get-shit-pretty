import { cn } from "@/lib/utils";

interface TerminalMockProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export function TerminalMock({
  children,
  className,
  title = "terminal",
}: TerminalMockProps) {
  return (
    <div
      className={cn(
        "bg-card border border-border rounded-none overflow-hidden",
        className
      )}
      role="img"
      aria-label={`Terminal window showing ${title}`}
    >
      {/* Window chrome */}
      <div className="flex items-center gap-gsp-2 px-4 py-2 border-b border-border">
        <span
          className="size-2.5 rounded-full bg-muted-foreground/30"
          aria-hidden="true"
        />
        <span
          className="size-2.5 rounded-full bg-muted-foreground/30"
          aria-hidden="true"
        />
        <span
          className="size-2.5 rounded-full bg-muted-foreground/30"
          aria-hidden="true"
        />
        <span className="ml-gsp-2 text-caption text-muted-foreground">
          {title}
        </span>
      </div>
      {/* Terminal content */}
      <div className="p-4 font-mono text-body-sm leading-relaxed overflow-x-auto">
        {children}
      </div>
    </div>
  );
}
