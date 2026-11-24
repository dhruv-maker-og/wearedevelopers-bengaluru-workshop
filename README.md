# Build with Copilot — workshop portal

Public, dependency-light setup guide for the 25 November 2026 WeAreDevelopers
Bengaluru workshop. It is optimized for attendee phones and laptops as well as
a facilitator projector.

## Canonical URL

https://dhruv-maker-og.github.io/wearedevelopers-bengaluru-workshop/

## Develop

Requirements: Node.js 20 or newer.

```sh
npm ci
npm run build
npm run test
npm run smoke
```

`npm run check` runs the full local build, URL/QR tests, and static serving
smoke test. The deployable site is emitted to `dist/`.

## Source of truth

Every destination is defined once in `event.config.json`. `scripts/build.mjs`
validates the configured HTTPS URLs, emits the browser configuration, and
generates the four committed-by-artifact QR images. The runtime page has no CDN
or framework dependency.

Edit the config rather than changing a URL in `src/index.html`. Keep the JSON
keys stable because the page, copy buttons, QR generation, and tests consume
them.

## Rotate the workshop token

1. Obtain the new workshop join URL from the organizer.
2. Replace only the `join` value in `event.config.json`.
3. Run `npm run check`. QR decode tests must resolve to the new URL.
4. Commit and push to `main`; the Pages workflow builds and deploys `dist/`.
5. Scan the live join QR with a separate device and verify the expected event.

Do not extend the token elsewhere. The token is an expiring bearer-style event
credential and should not be copied into chat, screenshots, issues, or
participant documentation.

## Event operations

See [`FACILITATOR.md`](FACILITATOR.md) for the 10-minute preflight, staffing plan,
and incident lanes.

## Content boundaries

The workshop organization and labs are public. Never add confidential data,
credentials, attendee information, proprietary source, or workshop-only
prompts to this portal. The labs and organization may be deleted after the
event, so attendees must not use them as durable storage.
