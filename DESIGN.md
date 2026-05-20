# Design System Strategy: Editorial Builder

This portfolio now follows the editorial redesign guide in `files 2/pelumi-editorial-redesign-guide.md`.
The site should read as a writer who builds: serious long-form rhythm, restrained product proof, and systems work explained in prose instead of startup-card language.

## Creative North Star

**Writer who builds.** The homepage is not a pitch deck. It is an editorial front page that introduces the person, the products, the fiction series, and the work in that order.

The Grid is a spine of the identity, not a buried writing section. Products and case studies should feel argued for, not announced.

## Typography

- Display, headings, prose: `Newsreader`.
- Navigation, labels, buttons, UI chrome: `IBM Plex Sans`.
- Dates, stack lines, document links, metadata: `IBM Plex Mono`.
- Body prose should sit around `18px` to `20px` with generous line-height.
- Use italic serif headlines as the recurring visual rhythm.
- Do not use negative letter spacing. Let the type breathe.

## Color

Default theme is light, like morning paper.

- `--paper`: `#F5F1E8`
- `--paper-2`: `#FCFAF3`
- `--ink`: `#161613`
- `--ink-soft`: `#4A4640`
- `--line`: `#D8D1C2`
- `--accent`: `#B91C1C`

Dark mode is the night edition.

- `--paper`: `#0F1419`
- `--paper-2`: `#181E26`
- `--ink`: `#F5F1E8`
- `--accent`: `#E45D43`

Brick red is the only accent. Do not reintroduce cyan, teal, purple-blue gradients, or AI-startup glow.

## Layout

- Use hairline dividers and whitespace, not card grids, for editorial sectioning.
- Homepage order: masthead, lead essay, products, The Grid, selected work, workshop notes, contact, footer.
- Selected work entries are paragraph rows separated by hairlines.
- Article and case-study pages use readable columns with a metadata rail.
- Mobile layouts stack cleanly, with project metadata above long case-study content.

## Interaction

- Motion is quiet: small reveal, no parallax, no scale-heavy hover effects.
- Links shift color or underline. Buttons may move by 1px at most.
- Respect `prefers-reduced-motion`.
- Focus states must be visible for every interactive element.

## Content Rules

- Cut stats strips, LENS, emoji category icons, and generic AI-consultant language.
- Use specific nouns, concrete numbers, and plain claims.
- Preserve detailed project substance, but rewrite repeated "Built X that did Y" formulas when they make the site sound templated.
- If a paragraph sounds like SaaS landing-page copy, rewrite it until it sounds like a magazine paragraph.
