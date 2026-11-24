# Facilitator handoff

**Audience:** 50–100 developers  
**Room cover:** 1 facilitator + 3–5 helpers  
**Public source of truth:** https://dhruv-maker-og.github.io/wearedevelopers-bengaluru-workshop/

## 10-minute preflight

1. **Minute 0–2 — Links:** Open the portal, join URL, Windows app URL, official app docs, organization, both primary repos, and both alternates. Confirm every route returns the expected public resource.
2. **Minute 2–4 — Identity:** In a clean browser profile, check the join flow and verify the warning for personal GitHub.com accounts versus EMU identities.
3. **Minute 4–6 — Entitlement:** On the demo Windows machine, open the user icon → Copilot settings. Confirm the exact line: `GitHub Copilot Enterprise is active for your account`.
4. **Minute 6–8 — Add repo:** Confirm the visible flow: `+` beside Sessions → Add GitHub repository → search/add. Confirm the fallback: Clone repository. Select This computer, New worktree, Interactive, and use repo instructions.
5. **Minute 8–9 — Lab routes:** Scan the join, portal, Alt1, and Alt2 QR codes from a phone. Confirm each primary and alternate README opens.
6. **Minute 9–10 — Room:** Put the portal URL on the projector, place helpers across the room, and keep the blocked/help matrix open for triage.

## Room roles

**Facilitator**

- Own the projector, timing, join-token state, and room-wide announcements.
- State once that the lab organization and repositories are public.
- Remind the room not to add confidential content.
- Use only repository READMEs as the lab instruction source; do not invent prompts or objectives.

**3–5 helpers**

- Split the room into equal zones; one helper owns the line from identity through entitlement.
- Resolve issues in the portal’s symptom order: EMU, entitlement, repository search, alternate route, workspace selection.
- If a join token is rejected, compare against the live portal before escalating; old screenshots may be stale.
- Never move an attendee to a different lab route before checking the listed primary and alternate.

## Escalation order

1. Match the symptom in the portal’s blocked/help matrix.
2. Keep the failing screen visible and compare against the exact copy on the portal.
3. Switch from an EMU to the attendee’s personal GitHub.com account if needed.
4. Check the entitlement state before trying repository access.
5. Use Clone repository when search/add cannot find the repo.
6. Move to the matching alternate route only after the primary route fails.
7. Escalate account, token, or repeated organization-access failures to the facilitator.

## Safety and closing

- The organization and labs are public. Do not allow confidential content in code, prompts, issues, files, or discussions.
- Workshop workspaces may be deleted. Tell participants to copy any work they need before leaving.
- After the workshop, save the final deployed commit SHA and remove the event join token when the event window has closed if policy requires it.
