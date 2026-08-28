# Deployment guide

The same visitor experience can be released to Vercel and OpenAI Sites. Each platform has its own server entry point, but both use the same validation rules from `shared/brief.ts` and the same server-only Google Apps Script persistence contract from `shared/enquiryPersistence.ts`.

Current production links:

- Vercel website: https://dream-drifters.vercel.app/
- GitHub source: https://github.com/NikilKrish/dream-drifters
- OpenAI Sites preview: https://dream-drifters-codex-preview.yenkay.chatgpt.site/

## Vercel

### Project settings

- Framework: Vite
- Install command: `npm install` or Vercel default
- Build command: `npm run build:vercel`
- Output folder: `dist`
- Node.js: 22
- Server function: `api/enquiry.ts`

These settings are already recorded in `vercel.json` and `package.json`.

The public GitHub repository is connected to the Vercel project `dream-drifters`. Changes pushed to `main` produce a production release at `dream-drifters.vercel.app`; other branches can be used for preview deployments.

### Environment variables

Set these in Vercel Project Settings, never in the repository:

- `GOOGLE_APPS_SCRIPT_URL`
- `GOOGLE_APPS_SCRIPT_SECRET`
- `VITE_WHATSAPP_NUMBER`

`GOOGLE_APPS_SCRIPT_URL` and `GOOGLE_APPS_SCRIPT_SECRET` are server-only values used by `api/enquiry.ts`. Do not expose them to the browser, do not prefix them with `VITE_`, and do not place them in client bundles or screenshots.

`VITE_WHATSAPP_NUMBER` remains client-side only for the explicit visitor continuation link. It is not an owner notification path.

## Canonical enquiry record

The launch source of truth is one owner-controlled Google Sheet. Every valid enquiry must be stored there before the browser sees a success state.

- The first tab must be named `Enquiries`.
- The exact row 1 headers are defined in [ops/google-apps-script/README.md](../ops/google-apps-script/README.md) and [docs/superpowers/specs/enquiry-backend.md](superpowers/specs/enquiry-backend.md).
- Freeze row 1.
- Set the `Mobile` and `Email` columns to plain text.
- Add data validation on `Status` for `New`, `Contacted`, `In progress`, `Closed`, and `Spam`.
- Protect the header row and all submitted/system columns.
- Leave only `Status`, `Contacted at`, and `Follow-up notes` editable by the owner or explicitly authorized staff; protect those workflow columns from every other account.
- Keep sharing restricted to the owner and explicitly authorized staff. Do not use `Anyone with the link`.

## One-time owner setup

1. Create a Google Sheet owned by the owner’s Google account.
2. Rename the first tab `Enquiries`.
3. Add the exact approved schema headers in row 1.
4. Freeze the header row and set text format for `Mobile` and `Email`.
5. Add the `Status` validation list and default new rows to `New`.
6. Protect the header and submitted/system columns so only workflow columns remain editable.
7. Keep Sheet sharing owner-only unless a named staff member needs access.
8. Create a Google Apps Script project from the versioned files in `ops/google-apps-script/`.
9. In Apps Script, open `Project Settings` and add these Script Properties exactly:

   ```text
   SPREADSHEET_ID=<owner spreadsheet id>
   SHEET_NAME=Enquiries
   OWNER_EMAIL=info@dreamdrifters.in
   SHEET_URL=<restricted live sheet URL>
   WEBHOOK_SECRET=<long random value shared only with server env>
   ```

10. Run the script once in the Apps Script editor to authorize Google Sheets and Mail access as the owner.
11. Deploy the web app with these exact choices:
    - Type: `Web app`
    - Execute as: `Me` (the owner account)
    - Who has access: `Anyone`
12. Copy the deployed `/exec` URL and set the same values in both deployment targets:
    - Vercel: `GOOGLE_APPS_SCRIPT_URL`, `GOOGLE_APPS_SCRIPT_SECRET`
    - OpenAI Sites server environment: `GOOGLE_APPS_SCRIPT_URL`, `GOOGLE_APPS_SCRIPT_SECRET`
13. Install the retry trigger by running `installRetryTrigger()` once, or create a time-driven trigger for `retryFailedNotifications()` every 15 minutes.
14. Record the exact restricted Sheet URL in the owner’s internal handoff notes.

Never enter or store Gmail credentials in this repository, in local `.env` files that get shared, or in chat notes. The owner must authorize Apps Script and Mail access directly from the Google account that owns the Sheet.

## OpenAI Sites

The existing Sites project is linked through `.openai/hosting.json`.

- Build command: `npm run build:sites`
- Server entry: `worker/index.ts`
- Static and server output: generated under `dist/`

The Cloudflare worker mirrors the Vercel endpoint's method enforcement, body limit, validation, bot checks and Google persistence behavior. It uses the same `GOOGLE_APPS_SCRIPT_URL` and `GOOGLE_APPS_SCRIPT_SECRET` contract as Vercel.

## Runtime behavior and operations

- `POST /api/enquiry` returns success only after a row is stored in the Google Sheet.
- `notified: false` means the row was stored but the owner email is pending. The visitor still sees success.
- `Notification status=Pending` means the row was saved and the notification attempt has not finished yet.
- `Notification status=Sent` means the owner email was delivered for that row.
- `Notification status=Failed` means the row is still safe in the Sheet and the retry trigger or manual resend path needs attention.
- `Notification attempts` increments on each failed send and stops retrying after 8 attempts, leaving the row visibly failed for manual review.
- Duplicate submissions with the same `Submission ID` must not create a second row or a second email.
- Retention is indefinite. The owner is responsible for deciding when to export, archive, or permanently delete records; the application does not apply an automatic retention schedule.

Use the workflow statuses consistently:

- `New`: received and not yet reviewed or contacted.
- `Contacted`: the owner has made the first contact; record the time in `Contacted at`.
- `In progress`: active follow-up, quotation, or trip planning is underway.
- `Closed`: the enquiry has been completed or no further follow-up is needed.
- `Spam`: invalid, abusive, or unsolicited content that should not enter the sales workflow.

## Backup, recovery and monitoring

- Export an offline backup of the Sheet periodically because it is the canonical launch record.
- A browser save error can be ambiguous: the server may time out while Apps Script still completes the write. Before retrying, search the Sheet by `Submission ID`, submission time, and the visitor's contact details. Retry the same accepted request with the same `Submission ID` so the Apps Script idempotency check can return the existing row; do not add a replacement row manually or invent a new ID unless the Sheet check confirms that no record exists.
- If `Notification status=Failed`, confirm the retry trigger exists, review recent Apps Script executions, and manually resend only from the saved Sheet row.
- Retrying the Apps Script request with the same `Submission ID` is idempotent: it returns the existing stored result without adding another row or sending another email. Do not invent a replacement ID while recovering the same accepted submission.
- When archiving old enquiries, export first, move archived rows to a separate owner-controlled archive file or tab, and keep the live tracker limited to active work.
- If the Apps Script deployment or secret changes, rotate both `GOOGLE_APPS_SCRIPT_URL` and `GOOGLE_APPS_SCRIPT_SECRET` together across Vercel and Sites before another release.

## Release checklist

1. Run `npm test`.
2. Run `npm run build:vercel`.
3. Run `npm run build:sites` separately; both builds use `dist`, so do not run them at the same time.
4. Run `npm run test:e2e` across the configured phone, tablet and desktop browsers.
5. Confirm Hero, Services and Assurance each show video or a working manual play control.
6. Confirm the six packages, itineraries and enquiry handoffs work with keyboard, touch and mouse.
7. Submit one package enquiry and verify one Sheet row, owner email, `Status=New`, and `Notification status=Sent`.
8. Submit one service enquiry and verify package-specific columns stay blank.
9. Submit one custom enquiry and verify package/service-specific columns stay blank.
10. Edit `Status`, `Contacted at`, and `Follow-up notes` as the owner and confirm submitted columns remain unchanged.
11. Re-send a request with the same `Submission ID` and confirm there is no duplicate row.
12. Force an email failure in a controlled environment and confirm the row remains, `Failed` is visible, and the retry trigger recovers it or leaves it for manual review.
13. Confirm the email’s `Open enquiry tracker` link works for the authorized owner and is denied to an unauthorized account.
14. Confirm the browser response never exposes the Sheet URL, the shared secret, Google provider errors, or any PII beyond the visitor’s own local brief.
15. Confirm no price, testimonial or unsupported claim is accidentally published.
16. Check the final root address and `/api/enquiry` from the production domain.

## Rollback

Use the hosting platform's previous successful deployment. Do not delete source history or rewrite `main`.

Safe rollback for the enquiry backend means:

- revert the web deployment to the previous known-good build;
- if needed, redeploy the prior Apps Script version instead of editing live code ad hoc;
- keep the Google Sheet intact because it remains the canonical history;
- do not delete failed or duplicate-looking rows until idempotency and trigger logs have been reviewed;
- record the rollback reason, deployment address and any secret rotation in `memory.md`.
