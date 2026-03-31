# Motion and Interaction Reference

Curated snapshot from the upstream `Design_Skill`, focused on purposeful motion and feedback.

## Purpose

Use this file when refining:

- page-load reveal behavior
- hover states
- scroll-triggered motion
- focus states
- reduced-motion fallbacks

## Motion Rules

Animate with purpose. Motion should clarify interaction and hierarchy, not decorate a weak layout.

Preferred animated properties:

- `transform`
- `opacity`
- selective `filter`

Avoid layout-heavy animation on:

- `width`
- `height`
- `top`
- `left`
- `margin`
- `padding`

## Timing Guidance

Useful scale:

- instant: `100ms`
- fast: `200ms`
- normal: `300ms`
- slow: `500ms`

Useful easing:

- `ease-out` for entrances
- `ease-in-out` for state changes

## Page-Load Motion

Good defaults:

- reveal in reading order
- stagger meaningful groups
- keep hero and headline timing slightly slower than button or chip reveals

In this portfolio, reveal behavior should feel controlled and architectural, not playful or bouncy.

## Scroll-Triggered Motion

Use `IntersectionObserver` or similarly light logic for:

- section reveals
- card entrances
- one-time visibility changes

Do not hide critical content behind JS-only behavior. The page should still be readable if the animation layer fails.

## Hover and Interaction

Every interactive element should provide visible feedback:

- links: color shift or underline treatment
- buttons: lift, opacity, or gradient response
- cards: depth or accent response

The current portfolio design direction favors restrained hover feedback over exaggerated movement.

## Accessibility

### Reduced motion

Always support `prefers-reduced-motion`. For this repo, the safe default is:

- remove reveal transforms
- remove long transition durations
- keep the content immediately visible

### Focus treatment

Focus states must remain:

- visible
- keyboard-friendly
- visually integrated with the palette

### Skip links

For larger future refactors, consider a skip link if page complexity increases further.

## Portfolio-Specific Rule

In this project, motion should reinforce:

- hierarchy
- atmosphere
- deliberate pacing

Avoid:

- novelty animation
- cursor gimmicks by default
- transitions that make the site feel toy-like
