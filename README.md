# WeAreDevelopers Bengaluru workshop portal

A public, static field guide for the 25 November 2026 WeAreDevelopers Bengaluru GitHub Copilot workshop. The deployed page is the room’s single source of truth for joining, app setup, lab routes, and recovery.

**Portal:** https://dhruv-maker-og.github.io/wearedevelopers-bengaluru-workshop/

## Local development

Requirements: Node.js 20+.

```bash
npm ci
npm run build
npm run check
```

`npm run build` writes the committed static output to `site/`, including all QR PNGs. `npm run smoke` performs a local asset and content smoke test. `npm run check:ui` runs responsive overflow checks and axe WCAG A/AA checks at mobile, tablet, and projector viewports.

## Event URLs and join-token rotation

Every approved URL lives in [`event.config.js`](event.config.js). Edit only that file, then run:

```bash
npm run build
npm test
```

To rotate the expiring join token:

1. Replace `event.urls.join` in `event.config.js` with the complete new URL.
2. Run `npm run build`; this regenerates the page and `site/assets/qr/join.png`.
3. Run `npm run check`; the QR decoder test proves the PNG embeds the new URL exactly.
4. Commit the config, generated `site/` output, and package lock.
5. Push to `main` or merge the approved PR. The Pages workflow rebuilds, tests, and deploys.

Do not edit `site/` by hand. Do not publish old join URLs, screenshots, or copied QR images.

## Repository map

- `src/index.html`: accessible static source template.
- `src/styles.css`: local visual system, responsive layout, and print treatment.
- `src/app.js`: checklist persistence and copy interactions.
- `event.config.js`: authoritative event URLs and QR configuration.
- `scripts/build.mjs`: deterministic page and QR generation.
- `site/`: committed GitHub Pages payload.
- `test/`: exact URL, generated QR payload, package, and source-policy tests.
- `FACILITATOR.md`: room preflight and staffing handoff.
- `.github/workflows/pages.yml`: test and deploy workflow.

## Deployment

The workflow runs on pushes to `main` and deploys the `site/` directory with GitHub Pages. It installs Chromium for responsive and accessibility checks before deployment. The canonical deployed URL must respond with the final site before event use.
