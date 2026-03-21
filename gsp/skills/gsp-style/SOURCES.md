# Style Sources — Internal Reference

How to update styles and where the data comes from.

## Primary Sources

### designprompts.dev
- URL: https://www.designprompts.dev/
- Sitemap: https://www.designprompts.dev/sitemap.xml
- 31 styles (as of March 2026)
- Format: full design system prompts with `<role>` + `<design-system>` XML tags
- Site is client-side rendered — cannot scrape directly with WebFetch

### Reverse-engineered repos (for bulk updates)

**NakanoSanku/OhMySkills** — full markdown prompts
- URL: https://github.com/NakanoSanku/OhMySkills
- Path: `design-style/prompts/*.md` (32 files)
- Mapping: `design-style/styles-mapping.json`
- Quality: very detailed (500-800 lines each), includes component styling, layout, animation, responsive

**simonstrumse/frontend-design-library** — structured tokens
- URL: https://github.com/simonstrumse/frontend-design-library
- Tokens: `src/tokens/design-tokens.ts` (33 styles, TypeScript interfaces)
- Prompts: `src/prompts/base-prompt.ts` (prompt generator + style-specific guidelines)
- Note: "reverse-engineered from designprompts.dev and enhanced with learnings from caramell.app and Supabase Platform Kit"

## GSP Originals (not from designprompts.dev)

- **glassmorphism** — GSP original, deep engineering reference
- **liquid-glass** — GSP original (Apple WWDC 2025)

## How to Update

1. Fetch `styles-mapping.json` from OhMySkills for new styles
2. Fetch individual `.md` prompts from `design-style/prompts/`
3. Fetch `design-tokens.ts` from frontend-design-library for token updates
4. For each new/updated style:
   - Create/update `styles/{name}.md` with the full prompt
   - Create/update `styles/{name}.yml` with structured tokens
   - Add to `styles/INDEX.yml`

## Filename Mapping

| designprompts.dev slug | GSP filename | OhMySkills filename |
|------------------------|-------------|---------------------|
| academia | academia | Academia.md |
| art-deco | art-deco | Art-deco.md |
| bauhaus | bauhaus | Bauhaus.md |
| bold-typography | bold-typography | Bold-typography.md |
| botanical | botanical | Botanical.md |
| claymorphism | claymorphism | Claymorphism.md |
| cyberpunk | cyberpunk | Cyberpunk.md |
| enterprise | enterprise | Enterprise.md |
| flat-design | flat-design | Flat-design.md |
| — | fluent | Fluent2.md |
| — | humanist-literary | Humanist-Literary.md |
| industrial | industrial | Industrial.md |
| kinetic | kinetic | Kinetic.md |
| — | liquid-glass | — (GSP original) |
| luxury | luxury | Luxury.md |
| material-design | material | Material.md |
| maximalism | maximalism | Maximalism.md |
| minimal-dark | minimal-dark | Minimal-dark.md |
| modern-dark | modern-dark | Modern-dark.md |
| monochrome | monochrome | Monochrome.md |
| neo-brutalism | neubrutalism | Neo-brutalism.md |
| neumorphism | neumorphism | Neumorphism.md |
| newsprint | newsprint | Newsprint.md |
| organic | organic | Organic.md |
| playful-geometric | playful-geometric | Playful-geometric.md |
| professional | professional | Professional.md |
| retro | retro | Retro.md |
| saas | saas | SaaS.md |
| sketch | sketch | Sketch.md |
| swiss-minimalist | swiss-minimalist | Swiss.md |
| terminal | terminal | Terminal.md |
| vaporwave | vaporwave | Vaporwave.md |
| web3 | web3 | Web3.md |
| — | glassmorphism | — (GSP original) |
