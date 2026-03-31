# Performance Reference

Curated snapshot from the upstream `Design_Skill`, focused on frontend performance decisions that matter for this portfolio.

## Purpose

Use this file when checking:

- load speed
- Core Web Vitals risk
- image and font loading
- CSS/JS cost
- animation safety

## Targets

Aim for:

- `LCP < 2.5s`
- `INP < 200ms`
- `CLS < 0.1`

For this repo, the most relevant drivers are:

- hero and card imagery
- font loading
- CSS weight
- interaction scripts

## Image Guidance

Prefer:

- WebP or SVG where appropriate
- `loading="lazy"` below the fold
- `decoding="async"`
- explicit `width` and `height` where the markup supports it

Only the actual LCP image should get high-priority treatment.

## Font Guidance

Good defaults:

- preload critical fonts when self-hosted
- use `font-display: swap`
- reduce family and weight sprawl

If using external font providers, keep requests disciplined and measure the tradeoff.

## CSS Guidance

Watch for:

- dead selectors
- unused component styles
- layout rules left behind from removed sections

When pages become longer, consider:

- `content-visibility: auto`
- stronger separation between critical and non-critical styling

## JavaScript Guidance

Avoid layout thrashing:

- batch reads before writes
- prefer `transform`/`opacity` animation
- keep resize and scroll handlers light

For this site, the key JS surfaces are:

- nav behavior in `scripts/site.js`
- archive interaction in `scripts/writing.js`

## Audit Checklist

Before shipping a notable UI change:

- images are appropriately lazy-loaded
- no large redundant assets are deployed
- reduced-motion is respected
- no new render-blocking third-party scripts were introduced
- no obvious CSS or JS dead weight was added
- Lighthouse-style checks still pass at a healthy level

## Portfolio-Specific Rule

Treat performance as part of the design quality bar.

A page that looks strong but loads clumsily or shifts on entry does not meet this project’s standard.
