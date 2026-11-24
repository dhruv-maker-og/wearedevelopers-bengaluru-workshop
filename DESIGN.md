# Design system

<!-- impeccable:design-schema 1 -->

## Direction

**Workshop field guide.** The portal behaves like an event credential and operational route sheet: crisp ink, warm paper, safety orange, signal blue, registration marks, ticket notches, and oversized working type. It is explicitly not a generic SaaS dashboard.

## Color

| Token | Value | Role |
| --- | --- | --- |
| Ink | `#111827` | Primary text and structural surface |
| Paper | `#f7f2e8` | Main reading ground |
| Paper deep | `#e7e0d2` | Lab-route field |
| Safety orange | `#ff5a1f` | Join route and active progress |
| Signal yellow | `#ffd447` | Wayfinding and identity warning |
| Signal blue | `#1565e5` | Secondary lab route and focus |
| White | `#fffdf8` | Ticket and working surfaces |

Small text on colored backgrounds remains near-black or white and is tested for WCAG A/AA contrast.

## Type

- Display: local Arial Black/Arial Narrow/Impact stack, compressed, high-information weight.
- Body and UI: local Arial/Helvetica stack for reliable rendering and projector legibility.
- Code and repository references: Courier New only where data, paths, or exact status strings are shown.
- No runtime font requests.

## Composition

The opening pairs an oversized operational thesis with two physical-style QR tickets. The route navigator behaves like a taped index strip. Content follows the participant sequence: preflight, identity gate, app setup, lab choice, help matrix, and public-data boundary.

Rules and repeated notation create structure. Cards are reserved for the two lab routes and the physical QR credential, not used as the page-wide scaffold.

## Motion

The only authored entrance is the two-ticket reveal, using a short exponential ease-out. Checklist progress fills directly. Reduced-motion preferences disable both.

## Interaction

- Every action is a descriptive link or button.
- Checkboxes persist only in local storage; reset is always available.
- Copy controls announce their result in a live region and offer a fallback when Clipboard API access is unavailable.
- Focus uses a 3px blue outline.
- Tables scroll on small screens rather than dropping or compressing critical instructions.

## Responsive and print

Below 760px, the hero becomes an action-first sequence: compact event identity, a deliberate two-line headline, one dominant join action, then the join QR with the portal QR as a small secondary strip. The full hero remains under 1000px at 368px, and the primary QR begins within the first 750px. Route cards and setup steps become a single column while retaining required onboarding detail. At projector width, the first viewport keeps the join action and QR credential together. Print styles remove navigation and interaction noise, keep QR credentials visible, avoid splitting actionable rows, and use an A4 portrait handout.
