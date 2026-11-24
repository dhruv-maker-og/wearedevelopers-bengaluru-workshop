# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Developers attending the WeAreDevelopers Bengaluru hands-on workshop, using
Windows laptops in a room of 50-100 people. Facilitators need a fast,
projector-readable source of truth and a recovery path for setup problems.

## Product Purpose

Provide one public workshop portal that gets attendees into the workshop,
verifies GitHub Copilot access, opens the correct lab in the GitHub Copilot app,
and points them to the authoritative lab README.

## Positioning

An event-operations field guide: direct links, scannable QR codes, persisted
setup progress, alternate capacity lanes, and troubleshooting are presented in
the order attendees need them.

## Operating Context

The portal is used during a 15-minute setup window, with attendees viewing on
phones and laptops while facilitators may project it. The GitHub Copilot app and
workshop organization are public, but the workshop itself runs from a private
join token that expires after the event.

## Capabilities and Constraints

- Static HTML, CSS, and JavaScript with no runtime framework or CDN dependency.
- QR assets are generated locally and committed by the build as deployment
  artifacts.
- All destinations come from one event configuration.
- Personal GitHub accounts are required; Enterprise Managed Users cannot use
  this flow.
- Lab instructions live in each lab repository README; the portal must not
  invent prompts or objectives.
- Workshop repositories may be deleted after the event.
- The portal must not contain confidential workshop content.

## Brand Commitments

The approved destination URLs, workshop date, and public workshop organization
are binding. The interface must be bold, editorial, and useful in mobile,
laptop, and projector contexts.

## Evidence on Hand

The requested portal, app, documentation, join, organization, primary lab, and
alternate lab URLs are recorded in `event.config.json`. No attendee names,
testimonials, lab prompts, or performance claims are available and none should
be fabricated.

## Product Principles

1. Make the next safe action unmistakable.
2. Prefer authoritative links over duplicated instructions.
3. Keep degraded and alternate lanes visible before attendees get stuck.
4. Make every operational step usable by keyboard, touch, and print.
5. Treat the event token and workshop content as time-limited.

## Accessibility & Inclusion

The site must provide visible focus, semantic landmarks and controls, strong
contrast, keyboard access, reduced-motion support, readable reflow on small
screens, and a complete print stylesheet.
