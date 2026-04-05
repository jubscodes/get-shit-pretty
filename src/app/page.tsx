import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/sonner";
import { AsciiHero } from "@/components/ascii-hero";
import { InstallCommand } from "@/components/install-command";
import { TerminalMock } from "@/components/terminal-mock";
import { PipelineViz } from "@/components/pipeline-viz";
import { StylePresetCard } from "@/components/style-preset-card";

const GITHUB_URL = "https://github.com/jubscodes/get-shit-pretty";

const stylePresets = [
  {
    name: "CYBERPUNK",
    colors: ["#00FFFF", "#FF00FF", "#FFFF00", "#0A0A0F"],
    constraint: "never: border-radius above 4px",
    nameClassName: "font-bold text-body tracking-widest uppercase",
    style: {
      backgroundColor: "#0A0A0F",
      border: "1px solid rgba(0, 255, 255, 0.3)",
      boxShadow: "0 0 16px rgba(0, 255, 255, 0.2)",
      clipPath:
        "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
      color: "#00FFFF",
      fontFamily: "Orbitron, sans-serif",
    },
  },
  {
    name: "nothing",
    colors: ["#FFFFFF", "#999999", "#D71921", "#000000"],
    constraint: "never: shadows or blur",
    nameClassName: "text-body font-normal",
    style: {
      backgroundColor: "#000000",
      border: "1px solid #222222",
      borderRadius: "12px",
      color: "#E8E8E8",
      fontFamily: "Space Grotesk, system-ui, sans-serif",
    },
  },
  {
    name: "NEUBRUTALISM",
    colors: ["#000000", "#FFD700", "#FF6B6B", "#FFFFFF"],
    constraint: "never: box-shadow with blur > 0",
    nameClassName: "font-bold text-body uppercase tracking-wide",
    style: {
      backgroundColor: "#FFFFFF",
      border: "3px solid #000000",
      boxShadow: "4px 4px 0px 0px #000000",
      borderRadius: "0px",
      color: "#000000",
      fontFamily: "Space Grotesk, sans-serif",
      transform: "rotate(1deg)",
    },
  },
  {
    name: "liquid glass",
    colors: ["#007AFF", "#5856D6", "#FF2D55", "#F2F2F7"],
    constraint: "never: hard edges or sharp corners",
    nameClassName: "text-body font-semibold",
    style: {
      backgroundColor: "rgba(242, 242, 247, 0.85)",
      border: "0.5px solid rgba(255, 255, 255, 0.8)",
      boxShadow: "0 8px 32px rgba(31, 38, 135, 0.15)",
      borderRadius: "16px",
      color: "#1C1C1E",
      fontFamily: "-apple-system, system-ui, sans-serif",
    },
  },
  {
    name: "BAUHAUS",
    colors: ["#D02020", "#1040C0", "#F0C020", "#FFFFFF"],
    constraint: "never: organic curves in structural elements",
    nameClassName: "font-extrabold text-body uppercase tracking-wide",
    style: {
      backgroundColor: "#FFFFFF",
      border: "4px solid #000000",
      boxShadow: "8px 8px 0px 0px #000000",
      borderRadius: "0px",
      color: "#000000",
      fontFamily: "Outfit, sans-serif",
    },
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
                /gsp- {"\u25c7\u25c7"}
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


      {/* ===== STYLE PRESETS ===== */}
      <section className="py-gsp-16 md:py-gsp-24">
        <div className="mx-auto max-w-[1200px] px-gsp-4 sm:px-gsp-6 lg:px-gsp-8">
          <div className="text-center mb-gsp-12">
            <p className="text-overline text-primary mb-gsp-4">
              Style Presets
            </p>
            <h2 className="text-h2 text-foreground mb-gsp-6">
              Start with taste, not a blank canvas
            </h2>
            <p className="text-body text-muted-foreground max-w-2xl mx-auto mb-gsp-6">
              35 design languages. Each one is a complete opinion — colors, type,
              shape, constraints, interaction patterns. Pick one as your
              foundation, then let the pipeline refine it.
            </p>
            <p className="font-mono text-body-sm text-muted-foreground">
              /gsp-style &quot;something dark and techy&quot;{" "}
              <span className="text-foreground">
                {"\u2192"} cyberpunk, terminal, modern-dark
              </span>
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gsp-6 mb-gsp-8">
            {stylePresets.map((preset) => (
              <StylePresetCard
                key={preset.name}
                name={preset.name}
                colors={[...preset.colors]}
                constraint={preset.constraint}
                nameClassName={preset.nameClassName}
                style={preset.style}
              />
            ))}
          </div>
          <p className="text-body-sm text-muted-foreground text-center">
            35 presets total — from swiss-minimalist to vaporwave.
          </p>
        </div>
      </section>

      {/* ===== EXPERTISE SKILLS ===== */}
      <section className="py-gsp-16 md:py-gsp-24">
        <div className="mx-auto max-w-[1200px] px-gsp-4 sm:px-gsp-6 lg:px-gsp-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gsp-8 lg:gap-gsp-12 items-center">
            {/* Prose */}
            <div className="lg:col-span-5">
              <p className="text-overline text-primary mb-gsp-4">
                Expertise Skills
              </p>
              <h2 className="text-h2 text-foreground mb-gsp-6">
                Seven design disciplines, each one standalone
              </h2>
              <p className="text-body text-muted-foreground">
                Pipeline skills invoke these during orchestration. You can also
                run any of them directly — real design tools, not wrappers.
              </p>
            </div>

            {/* Terminal */}
            <div className="lg:col-span-7">
              <TerminalMock title="color">
                <div className="space-y-1">
                  <p className="text-gsp-bright">$ gsp-color --system</p>
                  <p className="text-muted-foreground">&nbsp;</p>
                  <p className="text-gsp-accent">
                    {"\u25c6"} Color System
                  </p>
                  <p className="text-muted-foreground pl-4">
                    mode:{"       "}OKLCH perceptual
                  </p>
                  <p className="text-muted-foreground pl-4">
                    primary:{"    "}oklch(0.70 0.18 250){"    "}
                    <span
                      className="inline-block size-3 rounded-sm align-middle"
                      style={{ backgroundColor: "#3B82F6" }}
                      aria-hidden="true"
                    />
                  </p>
                  <p className="text-muted-foreground pl-4">
                    accent:{"     "}oklch(0.75 0.16 77){"     "}
                    <span
                      className="inline-block size-3 rounded-sm align-middle"
                      style={{ backgroundColor: "#F59E0B" }}
                      aria-hidden="true"
                    />
                  </p>
                  <p className="text-muted-foreground pl-4">
                    surface:{"    "}oklch(0.18 0.01 260){"    "}
                    <span
                      className="inline-block size-3 rounded-sm align-middle"
                      style={{ backgroundColor: "#1E293B" }}
                      aria-hidden="true"
                    />
                  </p>
                  <p className="text-muted-foreground">&nbsp;</p>
                  <p className="text-gsp-accent">
                    {"\u25c6"} Contrast
                  </p>
                  <p className="text-muted-foreground pl-4">
                    primary / surface{"    "}
                    <span className="text-foreground">12.4:1</span>{"  "}
                    <span className="text-gsp-accent">AAA</span>
                  </p>
                  <p className="text-muted-foreground pl-4">
                    accent / surface{"     "}
                    <span className="text-foreground">9.8:1</span>{"   "}
                    <span className="text-gsp-accent">AAA</span>
                  </p>
                  <p className="text-muted-foreground">&nbsp;</p>
                  <p className="text-gsp-accent">
                    {"\u25c6"} Semantic Scale
                  </p>
                  <p className="text-muted-foreground pl-4">
                    success:{"  "}oklch(0.72 0.19 145)
                  </p>
                  <p className="text-muted-foreground pl-4">
                    warning:{"  "}oklch(0.80 0.16 85)
                  </p>
                  <p className="text-muted-foreground pl-4">
                    error:{"    "}oklch(0.65 0.22 25)
                  </p>
                </div>
              </TerminalMock>
            </div>
          </div>

          {/* Skill strip */}
          <div className="flex flex-wrap items-center justify-center gap-x-gsp-6 gap-y-gsp-2 mt-gsp-12 font-mono text-body-sm text-muted-foreground">
            {[
              "color",
              "typography",
              "visuals",
              "icons",
              "logo",
              "accessibility",
              "style",
            ].map((skill) => (
              <span key={skill} className="whitespace-nowrap">
                <span className="text-primary" aria-hidden="true">
                  {"\u25c6"}
                </span>{" "}
                {skill}
              </span>
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
