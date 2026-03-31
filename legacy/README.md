# Legacy Reference Files

These files are archived on purpose.

- `reference-site/root/` contains the old hand-written homepage source.
- `reference-site/Projects/` contains the old hand-written project detail pages.
- `reference-site/writing/` contains the old hand-written writing pages.
- `reference-site/scripts/` contains the old browser-side rendering scripts tied to that legacy structure.

They are not part of the current production build.

The live site now ships from:

- `scripts/build.js`
- `styles/site.css`
- `scripts/site.js`
- `scripts/writing.js`
- `data/content.js`
- `writing/drafts/*.md`

To regenerate the production site:

```bash
npm run build
```

Vercel deploys the generated `dist/` output.
