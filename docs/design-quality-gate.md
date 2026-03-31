# Design Quality Gate

Use this checklist before shipping a meaningful UI change.

## Brand and Visual Direction

- Typography still feels distinctive and on-brand.
- The page still reflects the portfolio's editorial, anti-generic tone.
- Color and surface usage still fit the obsidian/cyan system in `DESIGN.md`.

## Layout and Rhythm

- Section spacing follows a deliberate rhythm instead of collapsing into even blocks.
- Headlines, body copy, and proof elements are grouped clearly.
- The layout works on small screens without awkward overlap or broken hierarchy.

## Motion and Interaction

- Interactive elements provide visible hover or focus feedback.
- `prefers-reduced-motion` is respected.
- Motion supports hierarchy instead of distracting from it.

## Performance and Delivery

- Images and fonts are handled in a performance-safe way.
- No unnecessary heavy assets or third-party scripts were introduced.
- The page still loads as a clean, static-first experience.

## Accessibility and Semantics

- Semantic structure remains intact.
- Keyboard access still works across navigation, links, and buttons.
- Long-form content remains readable and comfortably sized.

## Regression Check

- The change does not make the site look like a generic AI portfolio.
- The implementation still fits the build-driven architecture of this repo.
