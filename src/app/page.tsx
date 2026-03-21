import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/sonner";
import { AsciiHero } from "@/components/ascii-hero";
import { InstallCommand } from "@/components/install-command";
import { TerminalMock } from "@/components/terminal-mock";
import { PipelineViz } from "@/components/pipeline-viz";
import { FeatureCard } from "@/components/feature-card";

const GITHUB_URL = "https://github.com/jubscodes/get-shit-pretty";

const features = [
  {
    title: "Brand Strategy",
    description:
      "Discover positioning, voice, and verbal identity from a single brief. AI-driven research distilled into actionable brand foundations.",
  },
  {
    title: "Design Tokens",
    description:
      "OKLCH color palettes, spacing scales, and radius tokens generated as CSS custom properties. Dark-first, accessible by default.",
  },
  {
    title: "Type & Color",
    description:
      "Fluid type scales and expression palettes tuned for terminal and web. Every value has a rationale, not just a number.",
  },
  {
    title: "Component Foundations",
    description:
      "shadcn/ui primitives mapped to your brand tokens. Button, card, badge, and more — ready for your codebase.",
  },
  {
    title: "Terminal Native",
    description:
      "Built for Claude Code, OpenCode, Gemini CLI, and Codex. No browser required. Design engineering from your terminal.",
  },
  {
    title: "Open Source",
    description:
      "MIT licensed. Inspect every prompt, every agent, every skill. Fork it, extend it, make it yours.",
  },
] as const;

export default function Home() {
  return (
    <>
      <Toaster position="bottom-center" />

      {/* ===== HERO ===== */}
      <section
        id="main"
        className="py-gsp-12 md:py-gsp-16"
      >
        <div className="mx-auto max-w-[1200px] px-gsp-4 sm:px-gsp-6 lg:px-gsp-8 text-center">
          <p className="text-overline text-primary mb-gsp-4">
            Design Engineering
          </p>
          {/* Headline — animated ASCII shade blocks */}
          <AsciiHero />

          {/* Subhead */}
          <p className="text-body text-muted-foreground leading-loose max-w-lg mx-auto mb-gsp-8">
            A design engineering system for AI coding agents.
            <br />
            Brand identity to production code, from your terminal.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-gsp-4 mb-gsp-12">
            <InstallCommand />
            <Link
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-9 gap-1.5 px-4 rounded-sm border border-border bg-background text-sm font-medium whitespace-nowrap transition-all hover:border-primary/50 hover:text-primary focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              View on GitHub {"\u2192"}
            </Link>
          </div>

          {/* Terminal Mock */}
          <TerminalMock
            className="max-w-2xl mx-auto text-left"
            title="gsp"
          >
            <div className="space-y-1">
              <p className="text-gsp-bright font-bold">
                /gsp: {"\u25c7\u25c7"}
              </p>
              <p className="text-muted-foreground">&nbsp;</p>
              <p className="text-muted-foreground">
                {"\u25c6"} brand-strategy{" "}
                <span className="text-gsp-accent">complete</span>
              </p>
              <p className="text-muted-foreground">
                {"\u25c6"} design-tokens{" "}
                <span className="text-gsp-accent">complete</span>
              </p>
              <p className="text-muted-foreground">
                {"\u25c8"}{" "}
                <span className="text-primary font-bold">
                  component-foundations
                </span>{" "}
                <span className="text-muted-foreground">in progress</span>
              </p>
              <p className="text-muted-foreground">
                {"\u25c7"} build{" "}
                <span className="text-muted-foreground">pending</span>
              </p>
              <p className="text-muted-foreground">
                {"\u25c7"} review{" "}
                <span className="text-muted-foreground">pending</span>
              </p>
            </div>
          </TerminalMock>
        </div>
      </section>


      {/* ===== WHAT IS GSP ===== */}
      <section className="py-gsp-16 md:py-gsp-24">
        <div className="mx-auto max-w-[1200px] px-gsp-4 sm:px-gsp-6 lg:px-gsp-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gsp-8 lg:gap-gsp-12 items-center">
            {/* Prose */}
            <div className="lg:col-span-5">
              <p className="text-overline text-primary mb-gsp-4">
                How It Works
              </p>
              <h2 className="text-h2 text-foreground mb-gsp-6">
                A design engineer in your terminal
              </h2>
              <div className="space-y-4 text-body text-muted-foreground">
                <p>
                  GSP is a design engineering system that runs inside AI coding
                  agents. It takes a brand brief and produces everything from
                  strategy to production code — design tokens, type scales,
                  color palettes, component foundations.
                </p>
                <p>
                  It follows a dual-diamond process: first branding (discover,
                  strategize, define identity, build system), then project
                  (brief, research, design, build, review). Each phase produces
                  real artifacts, not just plans.
                </p>
                <p>
                  Works with Claude Code, OpenCode, Gemini CLI, and Codex.
                  Install once, run anywhere.
                </p>
              </div>
            </div>

            {/* Terminal */}
            <div className="lg:col-span-7">
              <TerminalMock title="brand-identity">
                <div className="space-y-1">
                  <p className="text-gsp-bright">
                    $ gsp brand-identity --project acme
                  </p>
                  <p className="text-muted-foreground">&nbsp;</p>
                  <p className="text-gsp-accent">
                    {"\u25c6"} Brand Strategy
                  </p>
                  <p className="text-muted-foreground pl-4">
                    Positioning: Developer-first design tools
                  </p>
                  <p className="text-muted-foreground pl-4">
                    Voice: Technical, direct, witty
                  </p>
                  <p className="text-muted-foreground">&nbsp;</p>
                  <p className="text-gsp-accent">
                    {"\u25c6"} Design Tokens
                  </p>
                  <p className="text-muted-foreground pl-4">
                    --color-primary: oklch(0.754 0.155 77.29)
                  </p>
                  <p className="text-muted-foreground pl-4">
                    --color-surface: oklch(0.18 0 0)
                  </p>
                  <p className="text-muted-foreground pl-4">
                    --radius-sm: 2px
                  </p>
                  <p className="text-muted-foreground">&nbsp;</p>
                  <p className="text-gsp-accent">
                    {"\u25c6"} Type Scale
                  </p>
                  <p className="text-muted-foreground pl-4">
                    display-1: clamp(3.5rem, 8vw + 1rem, 10rem)
                  </p>
                  <p className="text-muted-foreground pl-4">
                    body: 1rem / 1.4
                  </p>
                  <p className="text-muted-foreground">&nbsp;</p>
                  <p className="text-foreground">
                    {"\u2713"} Written to .design/branding/acme/
                  </p>
                </div>
              </TerminalMock>
            </div>
          </div>
        </div>
      </section>


      {/* ===== PIPELINE ===== */}
      <section className="py-gsp-16 md:py-gsp-24">
        <div className="mx-auto max-w-[1200px] px-gsp-4 sm:px-gsp-6 lg:px-gsp-8 text-center">
          <p className="text-overline text-primary mb-gsp-4">
            The Process
          </p>
          <h2 className="text-h2 text-foreground mb-gsp-12">
            Dual diamond. Brand to build.
          </h2>
          <PipelineViz />
        </div>
      </section>


      {/* ===== FEATURES GRID ===== */}
      <section className="py-gsp-16 md:py-gsp-24">
        <div className="mx-auto max-w-[1200px] px-gsp-4 sm:px-gsp-6 lg:px-gsp-8">
          <div className="text-center mb-gsp-12">
            <p className="text-overline text-primary mb-gsp-4">
              Capabilities
            </p>
            <h2 className="text-h2 text-foreground">
              Six tools in one pipeline
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gsp-6">
            {features.map((feature) => (
              <FeatureCard
                key={feature.title}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== META SIGNAL ===== */}
      <section className="py-gsp-8">
        <div className="mx-auto max-w-[1200px] px-gsp-4 sm:px-gsp-6 lg:px-gsp-8">
          <Separator className="mb-gsp-6" />
          <p className="text-caption text-muted-foreground tracking-wider text-center">
            This site was designed by GSP.
          </p>
        </div>
      </section>

      {/* ===== CTA FOOTER ===== */}
      <section className="py-gsp-16 md:py-gsp-24">
        <div className="mx-auto max-w-[1200px] px-gsp-4 sm:px-gsp-6 lg:px-gsp-8 text-center">
          <h2 className="text-h2 text-foreground mb-gsp-8">
            Code is commodity, your brand is not
          </h2>
          <div className="flex flex-col items-center gap-gsp-4">
            <InstallCommand />
            <Link
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-body-sm text-muted-foreground transition-colors hover:text-foreground"
              style={{
                transitionDuration: "var(--gsp-motion-normal)",
                transitionTimingFunction: "var(--gsp-motion-easing)",
              }}
            >
              View on GitHub {"\u2192"}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
