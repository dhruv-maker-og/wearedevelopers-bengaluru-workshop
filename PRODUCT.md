# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary users are 50-100 developers attending the WeAreDevelopers Bengaluru workshop in person on 25 November 2026. They need a single fast source of truth for joining the event, preparing GitHub Copilot, choosing a lab, and recovering from common blockers.

Secondary users are one facilitator and 3-5 room helpers who need a reliable preflight and escalation guide.

## Product Purpose

The portal makes workshop setup and lab selection understandable in one scan, on a phone or projected screen, without requiring participants to navigate scattered instructions.

Success means every participant can reach the join link, verify their entitlement, add a repository to the GitHub Copilot app, choose a primary or alternate lab route, and find help without confidential content entering public workshop resources.

## Positioning

This is an operations-first workshop control panel: one public, static page that combines exact URLs, generated QR codes, a timed preparation checklist, safe lab routes, and facilitator-ready recovery guidance.

## Operating Context

- Workshop date: 25 November 2026 IST.
- Attendees use personal GitHub.com accounts and GitHub Copilot Enterprise access supplied for the workshop; Enterprise Managed Users (EMU) are not supported by this flow.
- The workshop relies on the public GitHub Copilot app for Windows, public GitHub organizations and repositories, and a static GitHub Pages deployment.
- The join token expires and must be rotated by updating the centralized event configuration.
- Content must remain readable on mobile devices, projected displays, and printed facilitator notes.

## Capabilities and Constraints

- Static HTML, CSS, and JavaScript only; no runtime framework or CDN.
- Build-time QR assets are committed for the portal, join URL, and both alternate lab routes.
- URLs are centralized in one event configuration.
- Progress is stored locally in the browser and is not transmitted.
- The page includes keyboard-visible focus, reduced-motion support, accessible color contrast, and copy controls.
- The portal links to lab READMEs and must not invent lab prompts or objectives.
- The site is deployed publicly through GitHub Pages.
- The workshop repositories and organizations are public. Participants must not add confidential content.
- Workshop workspaces may be deleted after the event; participants must preserve any work they need elsewhere.

## Brand Commitments

The portal uses the workshop's supplied name, GitHub resources, exact URLs, and operational facts. The tone is direct, welcoming, high-clarity, and practical rather than generic SaaS marketing.

## Evidence on Hand

The approved workshop plan in the implementation request provides the authoritative event name, date, URLs, setup sequence, lab routes, caveats, staffing assumptions, and deployment target.

No lab README content is reproduced. The portal links to the external READMEs as the source of truth.

## Product Principles

1. One scan resolves the next action.
2. Operational clarity outranks decorative complexity.
3. Exact links and states are more valuable than generalized instructions.
4. Public, disposable workshop resources are explicitly labeled as such.
5. Every critical action has a visible fallback and a human help route.

## Accessibility & Inclusion

The experience must support keyboard-only navigation, visible focus, reduced motion, narrow mobile screens, projector-scale typography, print output, semantic structure, and high-contrast readable content.
