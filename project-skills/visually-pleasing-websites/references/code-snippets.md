# Code Snippets Reference

Curated snapshot from the upstream `Design_Skill`, focused on reusable structure rather than framework-specific code.

## Purpose

Use this file when you need a practical starting shape for:

- section scaffolds
- headline and copy grouping
- media-and-copy splits
- card composition
- CTA clusters

Then adapt the structure to this repo's actual implementation surface:

- `scripts/build.js`
- `styles/site.css`
- `scripts/site.js`
- `scripts/writing.js`

## Structural Patterns

### Section shell

Every major section should establish:

- a small overline or context label
- one strong headline
- one supporting block of copy
- a content area with a clear internal rhythm

Do not stack unrelated elements without grouping them first.

### Copy grouping

Treat text as deliberate clusters:

- label
- title
- supporting paragraph
- supporting proof or CTA

This is especially important for homepage sections and writing spotlights in this portfolio.

### Media and content split

For two-column layouts:

- keep one side dominant
- give the secondary side a clear role such as proof, meta, or CTA
- collapse cleanly to one column on small screens

Avoid fake symmetry when the content is not actually balanced.

### Card pattern

A strong card usually contains:

- status or category marker
- title
- concise explanation
- proof chips or metadata
- clear action

Keep card internals aligned and predictable even when the card sizes vary.

## Portfolio-Specific Guidance

Use these patterns to support:

- editorial tension
- readable hierarchy
- strong spacing rhythm
- deliberate CTA placement

Avoid:

- generic startup dashboard cards
- center-everything defaults
- over-decorated wrappers that do not improve hierarchy
