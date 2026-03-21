import { cn } from "@/lib/utils";

interface PipelineNode {
  label: string;
  status: "completed" | "active" | "pending";
}

const brandingNodes: PipelineNode[] = [
  { label: "Discover", status: "completed" },
  { label: "Strategy", status: "completed" },
  { label: "Identity", status: "completed" },
  { label: "System", status: "completed" },
];

const projectNodes: PipelineNode[] = [
  { label: "Brief", status: "completed" },
  { label: "Research", status: "completed" },
  { label: "Design", status: "active" },
  { label: "Build", status: "pending" },
  { label: "Review", status: "pending" },
];

function NodeGlyph({ status }: { status: PipelineNode["status"] }) {
  switch (status) {
    case "completed":
      return (
        <span className="text-foreground" aria-hidden="true">
          {"\u25c6"}
        </span>
      );
    case "active":
      return (
        <span
          className="text-primary font-bold"
          style={{
            textShadow: "0 0 8px var(--gsp-lavender), 0 0 16px var(--gsp-lavender)",
          }}
          aria-hidden="true"
        >
          {"\u25c8"}
        </span>
      );
    case "pending":
      return (
        <span className="text-muted-foreground" aria-hidden="true">
          {"\u25c7"}
        </span>
      );
  }
}

function Connector({ className }: { className?: string }) {
  return (
    <span
      className={cn("text-border font-mono", className)}
      aria-hidden="true"
    >
      {"\u2500\u2500\u2500"}
    </span>
  );
}

function VerticalConnector() {
  return (
    <span
      className="text-border font-mono block text-center"
      aria-hidden="true"
    >
      {"\u2502"}
    </span>
  );
}

function PipelineRow({
  label,
  nodes,
  vertical = false,
}: {
  label: string;
  nodes: PipelineNode[];
  vertical?: boolean;
}) {
  if (vertical) {
    return (
      <div className="flex flex-col items-center gap-gsp-1">
        <span className="text-overline text-foreground font-bold uppercase tracking-widest mb-gsp-2">
          {label}
        </span>
        {nodes.map((node, i) => (
          <div key={node.label} className="flex flex-col items-center">
            <div className="flex items-center gap-gsp-2">
              <NodeGlyph status={node.status} />
              <span
                className={cn(
                  "text-body-sm font-mono",
                  node.status === "completed" && "text-foreground",
                  node.status === "active" && "text-primary font-bold",
                  node.status === "pending" && "text-muted-foreground"
                )}
              >
                {node.label}
              </span>
            </div>
            {i < nodes.length - 1 && <VerticalConnector />}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-gsp-3">
      <span className="text-overline text-foreground font-bold uppercase tracking-widest">
        {label}
      </span>
      <div className="flex items-center gap-gsp-2">
        {nodes.map((node, i) => (
          <div key={node.label} className="flex items-center gap-gsp-2">
            <div className="flex flex-col items-center gap-gsp-1">
              <NodeGlyph status={node.status} />
              <span
                className={cn(
                  "text-caption font-mono whitespace-nowrap",
                  node.status === "completed" && "text-foreground",
                  node.status === "active" && "text-primary font-bold",
                  node.status === "pending" && "text-muted-foreground"
                )}
              >
                {node.label}
              </span>
            </div>
            {i < nodes.length - 1 && <Connector />}
          </div>
        ))}
      </div>
    </div>
  );
}

function buildAriaLabel(): string {
  const brandStatus = brandingNodes
    .map((n) => `${n.label}: ${n.status}`)
    .join(", ");
  const projectStatus = projectNodes
    .map((n) => `${n.label}: ${n.status}`)
    .join(", ");
  return `Dual diamond pipeline visualization. Branding phase: ${brandStatus}. Project phase: ${projectStatus}.`;
}

export function PipelineViz({ className }: { className?: string }) {
  return (
    <div
      className={cn("flex flex-col items-center", className)}
      role="img"
      aria-label={buildAriaLabel()}
    >
      {/* Desktop: horizontal rows */}
      <div className="hidden md:flex flex-col gap-gsp-8">
        <PipelineRow label="Branding" nodes={brandingNodes} />
        <PipelineRow label="Project" nodes={projectNodes} />
      </div>

      {/* Mobile: vertical layout */}
      <div className="flex md:hidden flex-col gap-gsp-8">
        <PipelineRow label="Branding" nodes={brandingNodes} vertical />
        <PipelineRow label="Project" nodes={projectNodes} vertical />
      </div>
    </div>
  );
}
