# Layout Patterns Reference

Curated snapshot from the upstream `Design_Skill`, focused on page and section composition.

## Purpose

Use this file when the main question is:

- how should a page be structured?
- what kind of grid or split should this section use?
- how do we avoid a generic one-column portfolio stack?

Then map the chosen pattern back to `DESIGN.md`, which prefers editorial asymmetry and intentional breathing space.

## Recommended Layout Models

### Centered single-column

Best for:

- long-form writing
- article pages
- explanatory sections

Use it when readability matters more than visual tension.

### Asymmetric two-column

Best for:

- sidebar + content layouts
- project or article pages with meta panels
- split sections with narrative on one side and proof on the other

This is usually the best fit for this portfolio.

### Bento or mixed-size grids

Best for:

- product showcases
- capability clusters
- visual proof sections

Use carefully so the result still feels editorial rather than SaaS-generic.

### Full-bleed sections

Best for:

- homepage transitions
- hero sections
- large visual or atmospheric blocks

Use these to create rhythm and change the emotional pace between sections.

### Multi-column editorial

Best for:

- essays
- pull-quote moments
- magazine-like content treatments

Use sparingly in this repo; it should feel deliberate, not ornamental.

## Responsive Strategy

### Mobile first

Start with:

- one-column flow
- comfortable touch spacing
- simplified overlap behavior

Then add complexity at wider breakpoints.

### Fluid scales

Prefer:

- `clamp()` for display text and section spacing
- auto-fit or auto-fill patterns for repeating card groups

This reduces breakpoint bloat and keeps the site feeling smoother across screen sizes.

### Container awareness

When a section or component has multiple possible widths, treat the component as responsive to its own space, not only the viewport.

## Component-Level Guidance

### Navigation

Should feel anchored, lightweight, and easy to scan. In this repo, the glass nav pill already matches the local design doctrine; use layout changes carefully so it remains compact and controlled.

### Hero

A hero should establish:

- identity
- hierarchy
- immediate orientation

Do not let hero layouts collapse into a centered startup cliché unless the content truly needs it.

### Feature or project cards

Cards should feel aligned and intentional:

- clear content grouping
- stable media aspect ratio
- readable body width
- predictable CTA placement

### Sticky sections

Sticky side panels are useful for:

- project/article metadata
- case-study context
- proof or summary boxes

Use them only when they improve scanning and do not create awkward mobile fallbacks.

## Portfolio-Specific Rule

For this repo, choose layouts that support:

- editorial tension
- stronger left-to-right hierarchy
- asymmetry with logic
- breathing room between major sections

Avoid:

- generic template grids
- over-centered layouts
- cramped stacked sections with no rhythm shift
