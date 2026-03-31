---
name: visually-pleasing-websites
description: Use this skill when designing, refining, auditing, or restructuring a website, landing page, portfolio, archive, or article-driven UI where visual quality matters. It is especially useful for typography systems, color tokens, layout composition, motion, performance-sensitive frontend polish, and accessibility-minded design decisions. In this portfolio repo, use this skill as the broad web-design workflow and quality gate, then reconcile every decision with DESIGN.md, which remains the project-specific aesthetic authority.
---

# Visually Pleasing Websites

Project-owned mirror of the upstream `Design_Skill`, curated for this portfolio.

Use this skill to improve website quality without defaulting to generic UI patterns. It is the broad method; `DESIGN.md` is the portfolio-specific style doctrine.

## Repo Rule Stack

When working in this project, follow this order:

1. Use this skill to frame the design problem.
2. Use `DESIGN.md` to lock the portfolio's actual aesthetic choices.
3. Implement in the current build-driven site:
   - `scripts/build.js`
   - `styles/site.css`
   - `scripts/site.js`
   - `scripts/writing.js`

## Working Sequence

Before making UI changes:

1. Define the page purpose, audience, tone, and primary content type.
2. Choose a concrete layout direction instead of drifting into generic portfolio patterns.
3. Establish or confirm typography, color, spacing, and motion tokens.
4. Reconcile those choices with `DESIGN.md`.
5. Implement with semantic HTML structure, responsive layout, and visible interaction states.
6. Verify against the local design quality gate in `docs/design-quality-gate.md`.

## What This Skill Owns

- Design-system thinking
- Layout patterns and composition options
- Motion and interaction guidance
- Performance-minded frontend craft
- A reusable quality gate for future changes

## What This Skill Does Not Override

- `DESIGN.md` still decides the portfolio's brand expression:
  - `Syne + DM Sans`
  - obsidian/cyan palette
  - editorial asymmetry
  - anti-generic "Digital Architect" tone

## Reference Files

Read only the file you need:

- `references/design-system.md`
  Use for typography, tokens, spacing, hierarchy, and color architecture.
- `references/layout-patterns.md`
  Use for section composition, grids, editorial splits, hero structures, and responsive layout choices.
- `references/motion-and-interaction.md`
  Use for page reveals, hover states, scroll behavior, focus treatment, and reduced-motion support.
- `references/performance.md`
  Use for Core Web Vitals decisions, font/image loading, CSS containment ideas, and audit checks.
- `references/code-snippets.md`
  Use for reusable structural patterns and component scaffolds.

## In This Portfolio

Typical uses:

- Homepage section redesigns:
  start with `layout-patterns.md`, then constrain with `DESIGN.md`.
- Writing and article readability work:
  start with `design-system.md` and `performance.md`.
- Interaction polish:
  start with `motion-and-interaction.md`.
- Pre-publish visual audits:
  use `performance.md` plus `docs/design-quality-gate.md`.

## Default Quality Bar

Every meaningful UI change should preserve:

- distinctive typography
- coherent spacing rhythm
- strong visual hierarchy
- responsive behavior across small and wide screens
- visible focus states and reduced-motion support
- performance-aware image/font/script loading
- non-generic portfolio presentation
