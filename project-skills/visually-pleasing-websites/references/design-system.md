# Design System Reference

Curated snapshot from the upstream `Design_Skill`, trimmed for this portfolio.

## Purpose

Use this file to shape:

- typography hierarchy
- token systems
- spacing rhythm
- semantic color mapping

Then reconcile every choice with `DESIGN.md`, which locks this portfolio's final brand direction.

## Typography

### Type scale

Use a consistent ratio from body text upward.

- `1.2` for compact, denser interfaces
- `1.25` for balanced systems
- `1.333` for editorial hierarchy
- `1.5` for dramatic, hero-led pages

Use:

- tight line-height for display text: `1.1` to `1.2`
- relaxed line-height for body copy: `1.5` to `1.7`
- readable paragraph width: around `65ch`

### Font pairing guidance

Use a distinctive display font with a calmer body font. Avoid generic combinations that flatten the site into a default startup look.

For this repo, `DESIGN.md` already fixes:

- `Syne` for display
- `DM Sans` for body

So this file should guide scale and hierarchy more than font replacement.

### Typography craft rules

- headings should use tighter tracking than body text
- long-form text should not stretch too wide
- headings should avoid awkward wraps where possible
- tabular figures should be used for numeric data when alignment matters

## Color System

### Token approach

Define raw palette values, then map them into semantic tokens:

- background
- surface
- raised surface
- text
- secondary text
- muted text
- accent
- accent hover
- border

This keeps the palette flexible and the component layer stable.

### Dark theme principle

Do not invert blindly. Remap values intentionally so:

- text stays readable
- elevated surfaces remain distinct
- accents are slightly softened

For this portfolio, the obsidian-and-cyan palette already exists in `DESIGN.md`, so use this file to keep the token architecture disciplined.

## Spacing System

Use a stable spacing scale built on `4px` or `8px`.

Typical rhythm:

- small UI gaps: `8px` to `16px`
- card padding: `24px` to `32px`
- section spacing: `64px` to `96px`

Use spacing consistently instead of inventing one-off values.

## Radius and Shadows

Radius should match the spatial rhythm:

- smaller controls: `4px` to `8px`
- cards: `12px` to `16px`
- large feature surfaces: `20px` to `24px`

Shadows should communicate depth, not noise. In this portfolio, ambient depth and layered surfaces matter more than default UI-library drop shadows.

## How to Apply This in the Portfolio

- For homepage and section hierarchy:
  use this file for type scale, spacing, and semantic token discipline.
- For article pages:
  use this file to protect readability and long-form rhythm.
- For component refreshes:
  use this file to keep spacing and hierarchy coherent before styling details are added.
