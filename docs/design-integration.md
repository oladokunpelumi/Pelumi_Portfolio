# Design Skill Integration

This project mirrors the upstream `Design_Skill` as a local, project-owned snapshot under `project-skills/visually-pleasing-websites/`.

## Rule Stack

Use the design guidance in this order:

1. `project-skills/visually-pleasing-websites/`
   Broad workflow, layout thinking, motion guidance, performance checks, and reusable design quality rules.
2. `DESIGN.md`
   The portfolio's locked aesthetic direction and taste:
   `Syne + DM Sans`, obsidian/cyan palette, editorial asymmetry, and anti-generic presentation.
3. Production implementation files
   - `scripts/build.js`
   - `styles/site.css`
   - `scripts/site.js`
   - `scripts/writing.js`

## Precedence Examples

- Typography:
  the skill offers hierarchy guidance; `DESIGN.md` locks `Syne + DM Sans`.
- Color:
  the skill supports token discipline; `DESIGN.md` locks the obsidian/cyan palette.
- Layout:
  the skill offers patterns; `DESIGN.md` chooses editorial asymmetry over generic templates.
- Performance and accessibility:
  the skill acts as the reusable checklist layer for shipping decisions.

## Runtime Install Note

The repo mirror is the canonical snapshot for this project.

If you want Codex to auto-discover the skill in your local environment, run:

```bash
./scripts/install-design-skill.sh
```

That copies the mirrored skill into `${CODEX_HOME:-$HOME/.codex}/skills/visually-pleasing-websites`.
