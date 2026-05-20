# Design Quality Gate

Use this checklist before shipping a meaningful UI change.

## Brand and Direction

- The page reads as a writer who builds, not an AI consultant template.
- The Grid is treated as a first-class identity signal.
- Newsreader, IBM Plex Sans, and IBM Plex Mono remain the type system.
- Brick red is the only accent color.

## Layout and Rhythm

- Sections use whitespace and hairlines instead of card-heavy grids.
- Homepage order remains lead essay, products, The Grid, selected work, workshop notes, contact.
- Long-form pages keep comfortable reading width.
- Project metadata rails stack above content on mobile.

## Content

- No LENS acronym, hero stats strip, emoji category icons, or generic slogan blocks.
- Claims use concrete details and plain language.
- Selected work entries read as paragraphs, not product tiles.
- Case-study pages preserve the actual project detail.

## Motion and Interaction

- Hover states are restrained and readable.
- Keyboard focus states are visible.
- `prefers-reduced-motion` disables entrance motion.
- Dark mode persists and remains readable.

## Performance and Delivery

- Images and PDFs used by case studies are self-hosted or intentionally external.
- Heavy document viewers are not loaded on the main page.
- Build output is generated from source, not hand-edited in `dist/`.

## Regression Check

- No cyan/teal startup palette returns.
- No broken generated routes.
- Old `Projects/*.html` links redirect to canonical `/work/` routes.
