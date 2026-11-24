# Design system

The portal is an **event control wall**: a single operational guide that should
still be legible when projected across a room of 50-100 developers.

## Visual world

- **Cobalt blue** carries the hero, recovery actions, and operational emphasis.
- **Signal yellow** marks the primary join route, high-value QR stations, and
  safe next moves.
- **Newsprint white** is the reading surface for dense instructions.
- **Near-black** carries hard rules, reverse-type sections, and secondary
  actions.
- **Signal red** is reserved for action shadows, focus rings, and the helper
  alert.

## Type

The page uses system sans-serif stacks so it works offline and has no runtime
font request. Narrow display faces are used only for event headlines, labels,
and controls; the regular body face is optimized for instructions. Headlines
are bold, uppercase, and tightly set, but body copy remains normal case with a
comfortable measure.

## Composition

The first viewport is a thesis rather than a marketing header: the setup promise
occupies the left, and the portal/join QR stations occupy the right. The reading
order then moves through checklist, exact app flow, lab lanes, recovery matrix,
and public-content boundaries.

Hard rules divide operational regions. Components avoid decorative nesting:
the QR stations and lab lanes are functional objects, not general-purpose
cards. Motion is limited to lightweight control feedback and a status toast.

## Responsive behavior

- At laptop/projector widths, the hero and checklist use two operational
  columns while the app flow remains a four-step track.
- Below 820px, the workstreams stack in reading order and help rows become
  labeled mobile records.
- Below 560px, QR stations and lab lanes become single-column objects, display
  type scales down to preserve full words, and all page edges reflow without
  horizontal scrolling.

## Accessibility

Semantic landmarks, headings, lists, a live progress readout, native
checkboxes, visible focus, high contrast, a skip link, status announcements, and
reduced-motion handling are required. QR images have destination-specific alt
text. Every QR also has an adjacent text link or copy control.

## Print

The print stylesheet preserves the event identity, QR codes, setup steps,
repository flow, lab alternates, recovery matrix, and content boundaries while
removing interactive-only chrome.
