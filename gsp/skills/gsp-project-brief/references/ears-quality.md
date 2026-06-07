# EARS Acceptance Criteria — Quality Reference

Every AC must be testable and unambiguous. The hedge words below pass the EARS *form* but fail the EARS *contract* — downstream phases (design, build, review) will invent their own answer to fill the gap, and three phases will invent it three different ways.

For each hedge pattern: the **loose** form (what NOT to write), **why it fails** (what gets invented downstream), and the **tight** form (what TO write).

---

## 1. Visual states — replace soft adjectives with a mechanism

**Loose:**
> AC-1.3 — WHEN the Pro tier renders, THE SYSTEM SHALL visually mark it as the recommended tier (e.g. highlighted border or badge) distinct from Free and Team.

**Why it fails:** `distinct` + `e.g.` lets review pass on any visual differentiation. Design will pick one mechanism, build will implement it, but the spec didn't pin it — so a redesign that swaps border for badge passes the AC even though the contract changed.

**Tight:**
> AC-1.3 — WHEN the Pro tier renders, THE SYSTEM SHALL apply BOTH a 2px solid `--color-primary` border AND a `Recommended` text badge above the tier name. (Dual signal — color alone fails WCAG 1.4.1.)

Pin the mechanism. If the project genuinely wants flexibility, write the AC as a constraint (`SHALL apply at least one non-color signal`) rather than an example.

---

## 2. Timing — replace `within … cycle` with an operational guarantee

**Loose:**
> AC-2.1 — WHEN a visitor toggles billing from monthly to annual, THE SYSTEM SHALL update every tier card's displayed price to the annual equivalent within the same render cycle.

**Why it fails:** "Same render cycle" is unobservable in a test. Build will write a test that passes regardless of timing, then mark the AC Pass.

**Tight:**
> AC-2.1 — WHEN a visitor toggles billing from monthly to annual, THE SYSTEM SHALL update every tier card's displayed price in the next paint, with no intermediate state showing mixed monthly/annual prices across tiers.

The contract is now testable: render → toggle → snapshot prices → assert all three carry the new period.

---

## 3. Numeric / computed values — name the formula and the rounding rule

**Loose:**
> AC-2.2 — WHEN annual billing is selected, THE SYSTEM SHALL display a per-month equivalent price and the savings vs monthly billing on each paid tier.

**Why it fails:** "Savings" is undefined. Research invents `Save up to 20%`, critique invents `(monthly × 12) − annual`, build invents a percentage. Three different answers.

**Tight:**
> AC-2.2 — WHEN annual billing is selected, THE SYSTEM SHALL display: (a) per-month equivalent = `annual_price ÷ 12`, rounded to the nearest whole currency unit; (b) annual savings = `(monthly_price × 12) − annual_price`, formatted as `Save $N/year`.

Any AC that references a computed value needs a `## Numeric Inputs` section in the spec OR the formula inlined in the AC itself.

---

## 4. Breakpoints — reference the spec's declared values

**Loose:**
> AC-5.1 — WHEN viewport width is below the mobile breakpoint, THE SYSTEM SHALL stack the three tier cards vertically in priority order (Pro, Free, Team).

**Why it fails:** "Mobile breakpoint" is undefined in the spec. Design invents `640px`, picks a tablet tier the spec never authorized, build inherits the invention.

**Tight:**
> AC-5.1 — WHEN viewport width is below `breakpoints.mobile` (declared in `## Breakpoints`), THE SYSTEM SHALL stack the three tier cards vertically in DOM order Pro, Free, Team.

Any AC referencing responsive behavior requires a `## Breakpoints` section declaring numeric thresholds. Downstream phases must not introduce breakpoints not in that section.

---

## 5. Behavior + semantics pairs — every UI-rendering AC needs an a11y companion

**Loose:**
> AC-3.1 — WHEN the comparison table renders, THE SYSTEM SHALL list every feature as a row with one column per tier indicating included / excluded / limited.

**Why it fails:** Visual contract is clear. A11y contract is missing — critique will invent `<th scope="col">`, build will invent ARIA. Three phases, three answers.

**Tight (paired):**
> AC-3.1 — WHEN the comparison table renders, THE SYSTEM SHALL list every feature as a row with one column per tier indicating included / excluded / limited.
> AC-3.1a — THE SYSTEM SHALL mark feature names as row headers (`<th scope="row">`), tier names as column headers (`<th scope="col">`), and announce excluded/limited cells via `aria-label` containing the cell's textual meaning (not just an icon).

Pair the behavior AC (what renders) with a semantics AC (what assistive tech reads). When a UI element is interactive, also pair with a keyboard AC (`AC-N.Nk`) and a focus AC (`AC-N.Nf`).

---

## 6. Focus indicators — name the mechanism, size, color, and contrast

**Loose:**
> AC-5.2 — WHEN any interactive control receives keyboard focus, THE SYSTEM SHALL render a visible focus indicator meeting WCAG 2.2 AA contrast against its background.

**Why it fails:** "Visible focus indicator" is squishy enough to pass a 1px dotted browser default. WCAG 2.2 SC 2.4.13 has specific size/contrast thresholds — name them.

**Tight:**
> AC-5.2 — WHEN any interactive control receives keyboard focus, THE SYSTEM SHALL render a `2px solid` outline in `--color-focus-ring` with `2px` offset from the control's bounding box, maintaining `3:1` contrast against both the control's own background AND the adjacent surface.

The "adjacent surface" clause matters when the focused control sits inside a primary-colored container (e.g. the Pro tier border) — without it, the focus ring can collide with the container color.

---

## Quick check — hedge words that fail the contract

Before writing each AC, scan for these and replace with a concrete threshold:

| Hedge | Replace with |
|---|---|
| `distinct`, `differentiated` | Name the mechanism (border + badge, color + icon) |
| `easily`, `intuitively` | Name the interaction (single click, keyboard arrow, etc.) |
| `quickly`, `fast`, `responsive` | Name the operation + max latency or paint guarantee |
| `within … cycle` | Name what's observable (no intermediate state, next paint, etc.) |
| `mobile`, `desktop`, `tablet` (alone) | Reference declared breakpoints in `## Breakpoints` |
| `savings`, `discounted`, `total` | Name the formula + rounding rule (or declare in `## Numeric Inputs`) |
| `clear focus`, `visible focus` | Name outline width, color, offset, contrast threshold |
| `accessible`, `WCAG compliant` | Name the specific SC + the testable threshold |
| `e.g.`, `such as`, `for example` | If you mean it's flexible, write as constraint; otherwise pin one |

If an AC contains a hedge word, it is not done. Tighten before moving to the next AC.
