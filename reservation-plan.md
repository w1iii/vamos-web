# Reservation page + slots + race-safe reserve

## Context
- Order page `src/app/order/page.tsx` — payment removed (uncommitted), submit is stub (`submitBooking` line 56 does nothing).
- Backend = Google Sheets via Apps Script (`google-apps-script/Code.gs`), no DB, no API routes.
- Race condition fix: **Apps Script `LockService`** serializes requests → count-then-append becomes atomic.

## Changes

### 1. `google-apps-script/Code.gs`
- Add constant `const SLOT_LIMITS = { eclipse: 8, prestige: 4 };`
- **Add `doGet(e)`** — action `slots`: count rows per package in `Reservations` sheet, return
  ```json
  { "ok": true, "slots": { "eclipse": {"total":8,"taken":3,"left":5}, "prestige": {} } }
  ```
  Count = all data rows matching package column (skip header).
- **Rewrite `doPost`**:
  ```
  lock = LockService.getScriptLock(); lock.waitLock(10000)
  try:
    count rows for payload.package
    if left <= 0 → return { ok:false, error:"SOLD_OUT" }
    appendRow([timestamp, package, amount, fullName, messenger, contactNumber, "Reserved"])
    → return { ok:true, left: left-1 }
  finally: lock.releaseLock()
  ```
- Drop screenshot/Drive upload (payment gone). Payload fields: `package, amount, fullName, messenger, contactNumber`.

### 2. `src/app/order/page.tsx`
- On mount: `fetch(\`${URL}?action=slots\`)` → `slots` state (`null` = loading/unavailable).
- Tier card badge: `"5 / 8 SLOTS LEFT"`; `SOLD OUT` + disabled + `aria-disabled` when `left === 0` (radio unselectable).
- `submitBooking`:
  - disabled while `pending` (prevents double-click re-entry)
  - POST JSON `{package, amount, fullName, messenger, contactNumber}` with `Content-Type: text/plain` (avoids CORS preflight — matches old code)
  - `ok:false SOLD_OUT` → error banner + refetch slots
  - `ok:true` → success confirmation view, refetch slots
  - network error → error banner with retry

### 3. `src/app/globals.css`
- Styles: `.slot-badge`, `.tier-card.sold-out`, `.form-error`, `.booking-success`.

## Race-condition guarantees
1. LockService: only one `doPost` runs at a time; second user's count runs **after** first append → sees updated count, gets `SOLD_OUT`.
2. Client: button disabled during request (UX only — server lock is the real guard).
3. Slots fetch after every success/failure keeps UI honest.
4. `waitLock(10000)` timeout → returns error instead of hanging.

## Verification
- `npm run lint` + `npx tsc --noEmit` (check `package.json` scripts first).
- Manual: load `/order` — badges show; simulate sold-out by temporary `SLOT_LIMITS = {eclipse:0,...}`; concurrent curl test against deployed Apps Script for atomicity.

## Notes
- Requires re-deploy of Apps Script web app (new version) after `Code.gs` edit.
- Capacity numbers live only in `Code.gs` — page reads them from `doGet`.
