```markdown
# Design System Strategy: Editorial Engineering

This design system translates the raw technical power of an automation architect into a high-end editorial experience. It moves beyond the standard portfolio "grid" to embrace a layout that feels curated, intentional, and architecturally sound.

## 1. Overview & Creative North Star
**Creative North Star: "The Digital Architect"**
The system is built on the intersection of Brutalist confidence and high-tech precision. It shatters the typical "template" look by utilizing extreme typographic scales, intentional asymmetry, and a deep, atmospheric color palette. 

**The Editorial Shift:**
Rather than boxing content into rigid rows, this system uses "breathing space" and "overlapping depths." We treat the screen like a premium gallery wall—elements are placed with calculated tension, allowing high-contrast typography to act as a structural anchor for the technical data surrounding it.

---

## 2. Colors: Tonal Depth & Atmospheric Accents
The palette is rooted in a deep obsidian base, using cyan accents not just as highlights, but as "light sources" within a dark environment.

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to define sections. Sectioning is achieved through background shifts. For example, a hero section in `surface` (#13131a) transitions into an "About" section using `surface_container_low` (#1b1b22). This creates a seamless, premium flow that feels integrated, not fragmented.

### Surface Hierarchy & Nesting
Treat the UI as a series of layered obsidian sheets.
*   **Base:** `surface_dim` (#13131a)
*   **Layer 1 (Cards/Sections):** `surface_container` (#1f1f26)
*   **Layer 2 (Nested Elements):** `surface_container_high` (#2a2931)

### The "Glass & Gradient" Rule
For floating elements (like navigation bars or hovering project cards), use **Glassmorphism**. Use a semi-transparent version of `surface_container` with a `backdrop-blur` of 12px–20px. This allows the cyan accents (`primary`) to "glow" through the glass, adding depth.

### Signature Textures
Main CTAs must use a linear gradient: `primary` (#45dee7) to `primary_container` (#00c2cb) at a 135° angle. This provides a subtle "metallic" sheen that flat hex codes lack.

---

## 3. Typography: The Power of Scale
The system uses a high-contrast pairing: **Syne** for bold, architectural headlines and **DM Sans** for technical, readable body copy.

*   **Display (Syne):** Used for names and major section headers. Letter spacing should be set to `-0.04em` to create a "dense" professional feel.
*   **Body (DM Sans):** Set with generous line-height (1.6) to ensure technical descriptions remain approachable and elegant.
*   **Labels (DM Sans Bold):** Used for "Available for Work" or "Tech Stack" tags, always in uppercase with `+0.1em` tracking.

| Token | Family | Size | Weight |
| :--- | :--- | :--- | :--- |
| `display-lg` | Syne | 3.5rem | 800 |
| `headline-md` | Syne | 1.75rem | 700 |
| `body-lg` | DM Sans | 1rem | 400 |
| `label-md` | DM Sans | 0.75rem | 700 |

---

## 4. Elevation & Depth: Tonal Layering
Traditional shadows and borders are replaced with "Ambient Light" principles.

*   **The Layering Principle:** Depth is achieved by stacking. A `surface_container_highest` card sits on a `surface_container_low` background. The difference in hex value provides the "lift."
*   **Ambient Shadows:** If a card requires a floating state, use a shadow with a 40px blur at 6% opacity, using a tinted color derived from `on_surface` (#e4e1ec) rather than pure black. This mimics how light reflects off dark surfaces.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility, use `outline_variant` at 15% opacity. **Never use 100% opaque borders.**
*   **Interactive Glow:** On hover, cards should transition from their base color to a subtle gradient stroke or an inner glow using a 10% opacity `primary` color.

---

## 5. Components: Precision Primitives

### Buttons
*   **Primary:** Gradient fill (`primary` to `primary_container`), `on_primary` text. Border-radius: `md` (0.375rem).
*   **Tertiary (Ghost):** No fill, no border. `primary` text. Use a `0.5rem` underline that only appears on hover.

### Cards (Project/Service)
*   **Styling:** Background `surface_container_low`. 
*   **Restriction:** **Forbid divider lines.** Separate the header from the body using a `spacing-6` (1.5rem) vertical gap.
*   **Innovation:** Use "Corner Accents." A 2px × 12px `primary` colored vertical line in the top-left corner of a card to denote "Active" status.

### Chips (Tech Stack)
*   Background: `surface_container_high`. 
*   Text: `secondary` (#bfc6da).
*   Shape: `full` (pill-shaped) to contrast the sharp edges of the typography.

### Input Fields
*   Background: `surface_container_lowest`.
*   Active State: A 1px "Ghost Border" at 40% opacity `primary`.

---

## 6. Do's and Don'ts

### Do:
*   **Do** use asymmetrical margins (e.g., more padding on the left than the right) to create an editorial, magazine-style layout.
*   **Do** use `display-lg` typography to "break" the grid—let letters slightly overlap background elements or containers.
*   **Do** prioritize vertical rhythm using the `spacing-20` (5rem) token between major sections to allow the design to breathe.

### Don't:
*   **Don't** use 1px solid white or grey borders. They "cheapen" the dark-mode aesthetic.
*   **Don't** use standard drop shadows. If it doesn't look like ambient light, don't use it.
*   **Don't** center-align long blocks of body text. Keep technical descriptions left-aligned to maintain the "Architect" persona.
*   **Don't** use pure black (#000000). Use `surface_container_lowest` (#0e0e15) to maintain tonal richness.

---

## 7. Spacing Scale
Layouts should be built on an 8px base, but favor large gaps to emphasize the "High-End" feel.

*   **Section Gaps:** `spacing-24` (6rem) or `spacing-20` (5rem).
*   **Component Padding:** `spacing-6` (1.5rem).
*   **Text Grouping:** `spacing-3` (0.75rem).

*This system is designed to evolve. When in doubt, lean into "less is more," allowing the heavy Syne typography and the deep teal accents to do the heavy lifting.*```