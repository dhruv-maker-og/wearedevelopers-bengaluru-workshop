# Facilitator handoff

## 10-minute preflight

Run this before doors open, using the same public URL attendees will use.

1. Open the canonical portal on a clean phone and laptop.
2. Scan the portal and join QR codes. Confirm the join page names the correct
   25 November Bengaluru event.
3. Open the Windows app link and verify the download page is reachable.
4. Sign in as a disposable personal GitHub account. Confirm:
   `GitHub Copilot Enterprise is active for your account`.
5. Clone one primary lab and one assigned alternate in a fresh app session.
   Use **Sessions → Add GitHub repository → Clone repository** as the fallback
   check.
6. Select **This computer → New worktree → Interactive** and confirm the
   repository README opens.
7. Check the checklist, reload, and confirm progress persists on that device.
8. Project the portal at room resolution. Verify QR quiet zones, headings, and
   the blocked/help matrix remain legible.
9. Open the page with a keyboard: follow the skip link, tab order, focus ring,
   copy controls, and checklist controls.
10. Check print preview and save one facilitator copy before enabling the room
    Wi-Fi share.

## Staffing for 50-100 attendees

Use **3-5 helpers** plus one lead:

- **Lead (1):** owns the projector, event clock, join/access decisions, and
  announcements.
- **Identity/Copilot helpers (1-2):** personal-account sign-in, EMU failures,
  entitlement verification, and app updates.
- **Repository helpers (1-2):** app flow, clone errors, worktree mode, README
  navigation, and alternate-lane assignment.
- **Runner (optional):** handles seats with poor connectivity, Windows policy
  restrictions, or users who cannot install software.

Do not let helpers invent lane changes independently. The lead assigns an
alternate only when a primary lane has a capacity or access failure.

## Fast triage

| Symptom | Helper action |
| --- | --- |
| Personal account cannot join | Reopen join QR; reauthenticate the same personal identity. |
| EMU or managed identity | Stop; attendee must use a personal GitHub account. |
| No Enterprise-active status | Verify app and join identity match, then sign out/in once. |
| Add-repository control missing | Sessions → Add GitHub repository → Clone repository. |
| Clone or rate/capacity failure | Stop retries; lead assigns the matching alternate lane. |
| App asks for session setup | This computer → New worktree → Interactive. |
| Lab task unclear | Open that repository’s README; do not copy prompts from another lab. |

## Incident rules

- Never collect credentials, auth codes, secrets, or screen recordings.
- Never paste confidential source or data into a workshop prompt or repository.
- Treat all workshop repositories as disposable. Remind attendees they may be
  deleted after the event.
- If the token is rotated, update `event.config.json`, run all checks, deploy,
  and rescan the live QR before announcing the new URL.
