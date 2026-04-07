"use client";

import { useState, useCallback } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const INSTALL_COMMAND = "npx get-shit-pretty";

export function InstallCommand({ className, command }: { className?: string; command?: string }) {
  const [copied, setCopied] = useState(false);
  const cmd = command ?? INSTALL_COMMAND;

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(cmd);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  }, []);

  return (
    <div
      className={cn(
        "group inline-flex items-center gap-gsp-3 h-9 bg-primary border border-primary rounded-sm px-4 font-mono text-body-sm text-primary-foreground",
        "transition-colors hover:bg-primary/90",
        className
      )}
      style={{
        transitionDuration: "var(--gsp-motion-normal)",
        transitionTimingFunction: "var(--gsp-motion-easing)",
      }}
    >
      <code className="select-all">{cmd}</code>
      <button
        onClick={handleCopy}
        className="shrink-0 p-1 text-primary-foreground/60 hover:text-primary-foreground rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={copied ? "Copied" : "Copy install command to clipboard"}
        style={{
          transitionDuration: "var(--gsp-motion-normal)",
          transitionTimingFunction: "var(--gsp-motion-easing)",
        }}
      >
        {copied ? (
          <Check className="size-4" aria-hidden="true" />
        ) : (
          <Copy className="size-4" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
