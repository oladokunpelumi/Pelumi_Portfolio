# Design Skill Integration

The project-owned design skill under `project-skills/visually-pleasing-websites/` remains the workflow guide. `DESIGN.md` is the current portfolio-specific authority.

## Rule Stack

1. `project-skills/visually-pleasing-websites/`
   Use for design process, layout thinking, motion guidance, performance checks, and accessibility-minded review.
2. `DESIGN.md`
   Locks the actual site direction: Newsreader, IBM Plex, paper/ink/brick-red, editorial rhythm, and "writer who builds" positioning.
3. Production implementation files
   - `scripts/build.js`
   - `styles/site.css`
   - `scripts/site.js`
   - `scripts/writing.js`

## Precedence

- Typography: `DESIGN.md` chooses Newsreader + IBM Plex.
- Color: `DESIGN.md` chooses paper/ink/brick-red.
- Layout: `DESIGN.md` chooses editorial rows, hairlines, readable columns, and restrained case-study pages.
- The redesign guide in `files 2/pelumi-editorial-redesign-guide.md` is the source document behind this direction.

## Runtime Note

The repo mirror is the canonical local skill snapshot. Install it into Codex discovery with:

```bash
./scripts/install-design-skill.sh
```
