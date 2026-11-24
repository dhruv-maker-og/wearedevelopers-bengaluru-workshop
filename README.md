# WeAreDevelopers Bengaluru workshop portal

A public, dependency-light GitHub Pages portal for the 25 November 2026 GitHub Copilot workshop. The attendee surface is static HTML, CSS, and JavaScript; development dependencies are used only to generate and verify QR assets and run checks.

## Public URL

**Portal:** https://dhruv-maker-og.github.io/wearedevelopers-bengaluru-workshop/

## Local use

```sh
npm ci
npm run qr:generate
npm run check
```

Serve `dist/` with any static server for a local preview. The checks build the site, validate the content and accessibility hooks, decode every generated PNG QR, and run an HTTP smoke test.

## Change an event URL

All organizer-controlled destinations are centralized and labeled in `config.js`.

1. Replace the required URL in `config.js`.
2. Run `npm ci` once, then `npm run qr:generate`.
3. Run `npm run check`.
4. Commit the updated `config.js` and generated PNG/SVG assets.
5. Push to `main` and confirm the GitHub Pages workflow succeeds.

The workshop join URL contains an event token and is intentionally public because attendees must scan it. Do not remove, mask, or replace it with a shorter undocumented destination. When organizers issue a new token-bearing URL, regenerate `workshop-join.png` and `workshop-join.svg` with the process above so the visible scan code and direct link cannot drift.

## Attendee route

1. Use a personal GitHub.com account. Enterprise Managed User (EMU) accounts are unsupported by the join flow.
2. Install and sign in to the Copilot app, then verify **GitHub Copilot Enterprise is active for your account** from the user icon > **Copilot settings**.
3. In the app, use **+** next to Sessions > **Add GitHub repository** > browse or search > **Add**. If necessary, choose **Clone repository** for a URL fallback.
4. Start **+ > select repository > This computer > New worktree > Interactive**, then enter the lab prompt or instructions supplied by the chosen repository README.

Do not invent lab objectives or prompts. The portal deliberately directs attendees to each lab repository's README.

## Day-of facilitator preflight

Run this from the venue network and at least one attendee-like personal account 30–60 minutes before doors open:

- Confirm the canonical portal, join link, organization, primary repositories, and both alternates open without enterprise SSO or stale-session surprises.
- Scan the portal, workshop join, and alternate-repository QR assets from a phone. Confirm each lands on the destination documented in `config.js`.
- Check the Copilot app installer and sign-in path on a Windows test machine.
- Confirm the test personal account shows **GitHub Copilot Enterprise is active for your account**.
- Verify a repository can be added by search and, separately, cloned by URL into a new worktree and Interactive session.
- Project the portal at 1920×1080 and open it at a phone-width viewport. The QR panels, navigation, and help matrix must remain readable.
- Confirm the public-content warning is visible and remind participants not to upload confidential, proprietary, personal, or regulated content.
- Keep the exact error-help desk route available. Anyone with EMU access, a missing entitlement, an unfamiliar organization grant, or an access error should stop and escalate.

## Staffing model

For 50–100 attendees, staff the room with **one lead facilitator plus 3–5 helpers**.

- **Lead facilitator:** owns the stage, pacing, approved prompts, and go/no-go decisions.
- **Account helper:** resolves personal account, join-flow, and Copilot Enterprise entitlement questions.
- **App/helper:** handles installation, sign-in, repository add, URL clone, worktree, and Interactive-session setup.
- **Lab helpers:** compare symptoms with repository READMEs and direct blocked participants to an approved alternate.
- **Floater:** watches the room for stalled tables, projector visibility, and people who need privacy while an error is triaged.

Keep one helper free to triage rather than assigning every helper to a fixed table. Before the session, agree which facilitator can approve use of each alternate and post the decision.

## Deployment

`.github/workflows/pages.yml` publishes `dist/` from pushes to `main` and can also be triggered manually. In **Settings > Pages**, the source should be **GitHub Actions**. The environment output reports the final Pages URL.

## Content lifecycle and privacy

This is a public workshop organization. Never put confidential content, secrets, customer data, production credentials, personal data, or regulated material in any workshop repository or prompt. The workshop organization and its content may be deleted after the event.
