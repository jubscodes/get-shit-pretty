# Information Architecture

> Phase: design | Project: gsp-cli | Generated: 2026-03-08

---

## Screen Hierarchy

The 5 screens form a lifecycle, not a navigation tree. Users move through them temporally, not spatially.

```
Install (once)          Session entry (each session)        Phase work (repeated)
     |                        |                                   |
Screen 1                 Screen 4                            Screen 5
Onboarding Splash        Start Greeting                      Phase Transitions
     |                   /          \                        (end of each phase)
     |              Screen 3      Screen 2                        |
     |              Progress      Help Reference              [loops back
     |              Dashboard     (on demand)                  to Screen 4
     |                                                         or Screen 3]
     v
  Screen 4
  (first session)
```

## Flow Between Screens

| From | To | Trigger |
|------|----|---------|
| Screen 1 (Onboarding) | Screen 4 (Start) | User runs `/gsp:start` after install |
| Screen 4 (Start) | Phase command | User selects a flow (brand/project) |
| Phase command | Screen 5 (Transition) | Phase completes |
| Screen 5 (Transition) | Next phase command | User selects "Continue to {next}" |
| Screen 5 (Transition) | Screen 3 (Progress) | User selects "View progress" |
| Screen 5 (Transition) | Session end | User selects "Done for now" |
| Any point | Screen 2 (Help) | User runs `/gsp:help` |
| Any point | Screen 3 (Progress) | User runs `/gsp:progress` |

## Information Density by Screen

| Screen | Density | Lines (approx) | Scan Time Target |
|--------|---------|-----------------|------------------|
| 1 Onboarding | Low | 15-20 | 3 seconds |
| 2 Help | High | 50-60 | 10 seconds (scan headings) |
| 3 Progress | Medium | 25-40 | 5 seconds |
| 4 Start | Low | 10-20 | 3 seconds |
| 5 Transitions | Low | 12-18 | 2 seconds |

## Content Grouping

Each screen groups content into 2-3 blocks separated by spacing or dividers:

1. **Header block** — Brand Mark + context (present on all screens)
2. **Content block** — The screen's primary information
3. **Action block** — Next steps, routing, or commands (present on Screens 1, 4, 5)

---

## Related

- [Personas](./personas.md)
- [Component Plan](./component-plan.md)
