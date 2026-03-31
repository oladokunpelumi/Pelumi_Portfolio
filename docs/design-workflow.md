# Design Workflow

Every meaningful UI change in this portfolio should follow the same sequence.

## Workflow

1. Define the job of the page or section.
   Clarify purpose, audience, tone, and the main content type before touching layout or styling.
2. Consult the mirrored design skill.
   Use the relevant reference file for layout, typography, motion, or performance direction.
3. Reconcile with `DESIGN.md`.
   Lock the final expression to this portfolio's brand, not the generic skill defaults.
4. Implement in the production build path.
   Apply changes in:
   - `scripts/build.js`
   - `styles/site.css`
   - `scripts/site.js`
   - `scripts/writing.js`
5. Verify against the project quality gate.
   Use `docs/design-quality-gate.md` before considering the change done.

## Which Reference to Use

- Homepage or section redesigns:
  `layout-patterns.md` + `design-system.md`, then constrain with `DESIGN.md`
- Article and archive readability:
  `design-system.md` + `performance.md`
- Interaction polish:
  `motion-and-interaction.md`
- Pre-publish audits:
  `performance.md` + `docs/design-quality-gate.md`

## Publishing Rule

This workflow is process guidance only. It does not change routes, content schemas, or the deployment pipeline by itself.
