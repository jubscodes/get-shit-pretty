import Link from "next/link";
import { Toaster } from "@/components/ui/sonner";
import { AsciiHero } from "@/components/ascii-hero";
import { InstallCommand } from "@/components/install-command";
import { TerminalMock } from "@/components/terminal-mock";
import { PipelineViz } from "@/components/pipeline-viz";

const GITHUB_URL = "https://github.com/jubscodes/get-shit-pretty";

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
          <AsciiHero />
          <p className="text-body text-muted-foreground leading-loose max-w-lg mx-auto mb-gsp-8">
            A design engineering system for AI coding agents.
            <br />
            Brand identity to production code, from your terminal.
          </p>
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
          <TerminalMock
            className="max-w-2xl mx-auto text-left"
            title="gsp"
          >
            <div className="space-y-1">
              <p className="text-gsp-bright font-bold">
                /gsp {"\u25c7\u25c7"}
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


      {/* ===== SKILLS ===== */}
      <section className="py-gsp-16 md:py-gsp-24">
        <div className="mx-auto max-w-[1200px] px-gsp-4 sm:px-gsp-6 lg:px-gsp-8">
          <div className="text-center mb-gsp-12">
            <p className="text-overline text-primary mb-gsp-4">
              Skill Based
            </p>
            <h2 className="text-h2 text-foreground mb-gsp-6">
              Design knowledge, built into your tools
            </h2>
            <p className="text-body text-muted-foreground max-w-2xl mx-auto">
              Every skill is a specialized AI prompt with real design expertise.
              Add, remove, or create your own. The pipeline invokes them
              automatically — or call any one directly.
            </p>
          </div>

          <div className="border border-border rounded-md overflow-hidden font-mono text-body-sm">
            {[
              { cmd: "/gsp-brand-brief", desc: "Define your brand through guided Q&A", tag: "branding" },
              { cmd: "/gsp-brand-research", desc: "Research market, audience, competitors", tag: "branding" },
              { cmd: "/gsp-brand-strategy", desc: "Positioning, personality, voice, messaging", tag: "branding" },
              { cmd: "/gsp-brand-identity", desc: "Visual identity — logo, color, type", tag: "branding" },
              { cmd: "/gsp-brand-guidelines", desc: "Design system — tokens, STYLE.md, components", tag: "branding" },
              { cmd: "/gsp-project-brief", desc: "Scope what you're building", tag: "project" },
              { cmd: "/gsp-project-design", desc: "Design screens and interaction flows", tag: "project" },
              { cmd: "/gsp-project-critique", desc: "Nielsen's heuristics + WCAG 2.2 AA audit", tag: "project" },
              { cmd: "/gsp-project-build", desc: "Parallel agents build to production code", tag: "project" },
              { cmd: "/gsp-project-review", desc: "QA validation against design intent", tag: "project" },
              { cmd: "/gsp-color", desc: "OKLCH palettes, contrast, semantic mapping, dark mode", tag: "expertise" },
              { cmd: "/gsp-typography", desc: "Fluid type scales, pairing, vertical rhythm", tag: "expertise" },
              { cmd: "/gsp-visuals", desc: "Imagery, 3D, textures, surface treatments", tag: "expertise" },
              { cmd: "/gsp-accessibility", desc: "Contrast checks and token WCAG audits", tag: "expertise" },
              { cmd: "/gsp-style", desc: "Apply a preset — tokens without the full diamond", tag: "expertise" },
            ].map((skill, i) => (
              <div
                key={skill.cmd}
                className={`flex items-center gap-gsp-4 px-6 py-3 transition-colors hover:bg-card ${
                  i > 0 ? "border-t border-border" : ""
                }`}
                style={{
                  transitionDuration: "var(--gsp-motion-normal)",
                  transitionTimingFunction: "var(--gsp-motion-easing)",
                }}
              >
                <span className="text-foreground whitespace-nowrap w-52 shrink-0">
                  {skill.cmd}
                </span>
                <span className="text-muted-foreground truncate flex-1">
                  {skill.desc}
                </span>
                <span className="text-caption text-muted-foreground/50 hidden sm:inline whitespace-nowrap">
                  {skill.tag}
                </span>
              </div>
            ))}
            <div className="border-t border-border px-6 py-3 text-muted-foreground/50 text-center">
              + 19 more skills — /gsp-help to see all
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
          <h2 className="text-h2 text-foreground mb-gsp-4">
            /gsp-start guides you through a Brand to Build
          </h2>
          <p className="text-body text-muted-foreground max-w-xl mx-auto mb-gsp-12">
            A dual-diamond process — from brand research to production code.
            Each phase produces real artifacts, not just plans.
          </p>
          <PipelineViz />
        </div>
      </section>


      {/* ===== FEATURES ===== */}
      <section className="py-gsp-16 md:py-gsp-24">
        <div className="mx-auto max-w-[1200px] px-gsp-4 sm:px-gsp-6 lg:px-gsp-8">
          <div className="text-center mb-gsp-12">
            <p className="text-overline text-primary mb-gsp-4">
              Capabilities
            </p>
            <h2 className="text-h2 text-foreground">
              Designer thinking, developer tooling
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gsp-6">
            {[
              {
                title: "Terminal native",
                description:
                  "Built for Claude Code, OpenCode, Gemini CLI, and Codex. No browser required. Design engineering from your terminal.",
              },
              {
                title: "Open source",
                description:
                  "MIT licensed. Inspect every prompt, every agent, every skill. Zero production dependencies. Fork it, extend it, make it yours.",
              },
              {
                title: "11 specialized agents",
                description:
                  "Brand strategist, creative director, project designer, accessibility auditor — real design roles, not generic assistants.",
              },
              {
                title: "Parallel builds",
                description:
                  "Components and screens build in parallel waves with round-robin model assignment. ~47% faster than sequential.",
              },
              {
                title: "35 style presets",
                description:
                  "Fuzzy-matched design languages. Describe a vibe, get tokens. Each preset includes constraints, interaction patterns, and typography.",
              },
              {
                title: "Figma + GitHub",
                description:
                  "MCP servers bundled. Read designs from Figma, track issues on GitHub — directly from your pipeline.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-card border border-border rounded-md p-6 transition-colors hover:border-primary/40"
                style={{
                  transitionDuration: "var(--gsp-motion-normal)",
                  transitionTimingFunction: "var(--gsp-motion-easing)",
                }}
              >
                <span className="text-primary text-body" aria-hidden="true">
                  {"\u25c6"}
                </span>
                <h3 className="text-h3 text-foreground mt-gsp-3 mb-gsp-2">
                  {feature.title}
                </h3>
                <p className="text-body-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ===== STYLE PRESETS — BENTO BOX ===== */}
      <section className="py-gsp-16 md:py-gsp-24">
        <div className="mx-auto max-w-[1200px] px-gsp-4 sm:px-gsp-6 lg:px-gsp-8">
          <div className="text-center mb-gsp-12">
            <p className="text-overline text-primary mb-gsp-4">
              35 Style Presets
            </p>
            <h2 className="text-h2 text-foreground mb-gsp-6">
              Start with taste, not a blank canvas
            </h2>
            <p className="text-body text-muted-foreground max-w-2xl mx-auto">
              Each preset is a complete design opinion — colors, type, shape,
              constraints, interaction patterns. Pick one as your foundation.
            </p>
          </div>

          {/* Bento grid — 4 cols, 2 rows on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gsp-4 lg:[grid-template-rows:280px_280px]">

            {/* CYBERPUNK — col 1, spans 2 rows */}
            <div className="lg:row-span-2 relative overflow-hidden rounded-md border border-border transition-colors hover:border-primary/40 min-h-[280px]" style={{ transitionDuration: "var(--gsp-motion-normal)" }}>
              <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, #0A0A0F 0%, #0D0D18 40%, #0A0A0F 100%)" }}>
                <div className="absolute top-12 left-8 right-8">
                  <div className="h-2 w-24 mb-3 rounded-sm" style={{ backgroundColor: "rgba(0,255,255,0.4)" }} />
                  <div className="mb-4" style={{ background: "linear-gradient(90deg, #00FFFF, #FF00FF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontSize: "28px", fontFamily: "monospace", fontWeight: 700 }}>
                    NEON INTERFACE
                  </div>
                  <div className="h-2 w-full mb-2 rounded-sm" style={{ backgroundColor: "rgba(0,255,255,0.08)" }} />
                  <div className="h-2 w-4/5 mb-6 rounded-sm" style={{ backgroundColor: "rgba(0,255,255,0.06)" }} />
                  <div className="flex gap-3">
                    <div className="h-8 w-24 rounded-sm border" style={{ borderColor: "rgba(0,255,255,0.5)", boxShadow: "0 0 12px rgba(0,255,255,0.2)" }} />
                    <div className="h-8 w-24 rounded-sm border" style={{ borderColor: "rgba(255,0,255,0.3)" }} />
                  </div>
                </div>
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,255,0.5) 2px, transparent 4px)" }} />
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0A0A0F] via-[#0A0A0F]/80 to-transparent pt-16">
                  <p className="text-caption uppercase tracking-widest mb-1" style={{ color: "rgba(0,255,255,0.6)" }}>cyberpunk</p>
                  <p className="text-body-sm" style={{ color: "rgba(224,224,255,0.5)" }}>Neon grids, CRT glow, chamfered edges</p>
                </div>
              </div>
            </div>

            {/* NOTHING — row 1, col 2 */}
            <div className="relative overflow-hidden rounded-md border border-border transition-colors hover:border-primary/40 min-h-[280px]" style={{ transitionDuration: "var(--gsp-motion-normal)" }}>
              <div className="absolute inset-0" style={{ background: "#000000" }}>
                <div className="p-8">
                  <div className="h-1.5 w-16 mb-4 rounded-full" style={{ backgroundColor: "#333" }} />
                  <div style={{ color: "#E8E8E8", fontFamily: "system-ui", fontSize: "22px", fontWeight: 400 }}>
                    Pure signal.
                  </div>
                  <div className="mt-2 h-1.5 w-3/4 rounded-full" style={{ backgroundColor: "#1A1A1A" }} />
                  <div className="mt-2 h-1.5 w-1/2 rounded-full" style={{ backgroundColor: "#1A1A1A" }} />
                </div>
                <span className="absolute top-8 right-8 size-2.5 rounded-full" style={{ backgroundColor: "#D71921" }} />
                <div className="absolute bottom-0 left-0 right-0 p-6" style={{ borderTop: "1px solid #222" }}>
                  <p className="text-caption uppercase tracking-widest mb-1" style={{ color: "#666" }}>nothing</p>
                  <p className="text-body-sm" style={{ color: "#444" }}>OLED black, zero shadows, red signal</p>
                </div>
              </div>
            </div>

            {/* NEUBRUTALISM — row 1, col 3 */}
            <div className="relative overflow-hidden rounded-md border border-border transition-colors hover:border-primary/40 min-h-[280px]" style={{ transitionDuration: "var(--gsp-motion-normal)" }}>
              <div className="absolute inset-0" style={{ background: "#FFFFFF" }}>
                <div className="p-8">
                  <div className="h-8 w-28 mb-4 flex items-center justify-center" style={{ backgroundColor: "#FF6B6B", border: "3px solid #000", boxShadow: "3px 3px 0px #000" }}>
                    <span style={{ color: "#000", fontWeight: 700, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em" }}>Click me</span>
                  </div>
                  <div style={{ color: "#000", fontFamily: "system-ui", fontSize: "20px", fontWeight: 700, textTransform: "uppercase" }}>
                    Bold &amp; flat.
                  </div>
                </div>
                <div className="absolute top-6 right-6 size-12 rounded-full" style={{ backgroundColor: "#FFD700", border: "3px solid #000", transform: "rotate(-6deg)" }} />
                <div className="absolute bottom-0 left-0 right-0 p-6" style={{ backgroundColor: "#FFF8F0", borderTop: "3px solid #000" }}>
                  <p className="text-caption uppercase tracking-widest mb-1" style={{ color: "#666" }}>neubrutalism</p>
                  <p className="text-body-sm" style={{ color: "#999" }}>Hard shadows, thick borders, bright accents</p>
                </div>
              </div>
            </div>

            {/* BAUHAUS — col 4, spans 2 rows */}
            <div className="lg:row-span-2 relative overflow-hidden rounded-md border border-border transition-colors hover:border-primary/40 min-h-[280px]" style={{ transitionDuration: "var(--gsp-motion-normal)" }}>
              <div className="absolute inset-0" style={{ background: "#FFFFFF" }}>
                <div className="absolute top-8 right-8 size-28 rounded-full" style={{ backgroundColor: "#D02020" }} />
                <div className="absolute top-32 right-24 size-16" style={{ backgroundColor: "#1040C0" }} />
                <div className="absolute top-20 right-[8.5rem] size-10 rounded-full" style={{ backgroundColor: "#F0C020" }} />
                <div className="absolute bottom-24 left-8">
                  <div style={{ color: "#000", fontFamily: "system-ui", fontSize: "32px", fontWeight: 800, textTransform: "uppercase", lineHeight: 1.1 }}>
                    Form<br />follows<br />function.
                  </div>
                </div>
                <div className="absolute bottom-8 left-8 flex gap-2">
                  <div className="h-8 w-20 flex items-center justify-center" style={{ backgroundColor: "#000" }}>
                    <span style={{ color: "#FFF", fontWeight: 800, fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.15em" }}>Build</span>
                  </div>
                  <div className="h-8 w-20 flex items-center justify-center" style={{ border: "4px solid #000" }}>
                    <span style={{ color: "#000", fontWeight: 800, fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.15em" }}>Learn</span>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6" style={{ backgroundColor: "#F0F0F0", borderTop: "4px solid #000" }}>
                  <p className="text-caption uppercase tracking-widest mb-1" style={{ color: "#666" }}>bauhaus</p>
                  <p className="text-body-sm" style={{ color: "#999" }}>Primary colors, hard geometry, constructivist</p>
                </div>
              </div>
            </div>

            {/* LIQUID GLASS — row 2, cols 2-3 */}
            <div className="lg:col-span-2 relative overflow-hidden rounded-md border border-border transition-colors hover:border-primary/40 min-h-[280px]" style={{ transitionDuration: "var(--gsp-motion-normal)" }}>
              <div className="absolute inset-0" style={{ background: "linear-gradient(145deg, #E8E8F0 0%, #D0D0E8 50%, #E0E0F0 100%)" }}>
                <div className="p-8">
                  <div className="h-10 w-32 mb-4 rounded-2xl flex items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.5)", border: "0.5px solid rgba(255,255,255,0.8)", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                    <span style={{ color: "#007AFF", fontWeight: 600, fontSize: "13px" }}>Get started</span>
                  </div>
                  <div style={{ color: "#1C1C1E", fontFamily: "-apple-system, system-ui", fontSize: "24px", fontWeight: 600 }}>
                    Fluid. Alive. Translucent.
                  </div>
                  <div className="mt-2" style={{ color: "#3C3C43", fontSize: "15px" }}>
                    Refractive surfaces that breathe with your content.
                  </div>
                </div>
                <div className="absolute top-8 right-8 size-24 rounded-full" style={{ background: "linear-gradient(135deg, rgba(0,122,255,0.12), rgba(88,86,214,0.08))" }} />
                <div className="absolute bottom-20 right-24 size-16 rounded-full" style={{ background: "linear-gradient(135deg, rgba(255,45,85,0.1), rgba(0,122,255,0.06))" }} />
                <div className="absolute bottom-0 left-0 right-0 p-6" style={{ backgroundColor: "rgba(255,255,255,0.3)", borderTop: "0.5px solid rgba(255,255,255,0.4)" }}>
                  <p className="text-caption uppercase tracking-widest mb-1" style={{ color: "#8E8E93" }}>liquid glass</p>
                  <p className="text-body-sm" style={{ color: "#AEAEB2" }}>Apple 2025 — refractive, translucent, specular</p>
                </div>
              </div>
            </div>

          </div>

          <p className="text-body-sm text-muted-foreground text-center mt-gsp-8">
            35 presets total — from swiss-minimalist to vaporwave.{" "}
            <span className="font-mono text-foreground">/gsp-style &quot;describe a vibe&quot;</span>
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
