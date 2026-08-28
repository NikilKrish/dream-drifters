# Google Workspace enquiry automation

This folder versions the owner-controlled Google Apps Script contract for the enquiry backend launch. It accepts the server-to-script payload, stores one canonical row in the restricted Google Sheet, sends the owner notification email, and retries failed notifications without exposing the sheet URL or webhook secret to the browser.

## Script Properties

Set these Script Properties exactly on the deployed Apps Script project:

```text
SPREADSHEET_ID=<owner spreadsheet id>
SHEET_NAME=Enquiries
OWNER_EMAIL=info@dreamdrifters.in
SHEET_URL=<restricted live sheet URL>
WEBHOOK_SECRET=<long random value shared only with server env>
```

Deploy the web app to execute as the owner and allow the public web app URL to receive POST requests. The request remains protected by `WEBHOOK_SECRET`; no public Sheet sharing is required.

## One-time owner setup

1. Create a Google Sheet owned by the owner's Google account.
2. Rename the first tab `Enquiries`.
3. Add the exact schema headers below in row 1, in this exact order:

```text
Submission ID
Submitted at
Status
Contacted at
Follow-up notes
Interest kind
Package ID
Service ID
Travel window
Duration days
Adults
Children
Budget band
Name
Mobile
Email
Message
Consent recorded
Notification status
Notification attempts
Last notification error
Last updated
```

4. Freeze the header row and set text format for `Mobile` and `Email`.
5. Add data validation to `Status` with `New`, `Contacted`, `In progress`, `Closed`, and `Spam`; default new rows to `New`.
6. Protect the header and submitted/system columns; leave only `Status`, `Contacted at`, and `Follow-up notes` owner-editable.
7. Keep sharing restricted to the owner and explicitly authorized staff. Do not use `Anyone with the link` because the Sheet contains personal data.
8. Create the Apps Script project from the versioned files in this folder.
9. Set the Script Properties, authorize Sheets and Mail permissions, deploy as the owner, and copy the `/exec` URL.
10. Put the `/exec` URL and `WEBHOOK_SECRET` in the Vercel and OpenAI Sites server environment variables.
11. Install the retry trigger by running `installRetryTrigger()` once, or create an owner-controlled time-driven trigger for `retryFailedNotifications()` every 15 minutes.
12. Record the Sheet URL in the owner's internal handoff notes.

## Runtime contract

The script expects a JSON POST body:

```json
{
  "authToken": "<WEBHOOK_SECRET>",
  "submissionId": "enq_20260825_0001",
  "submittedAt": "2026-08-25T09:30:00.000Z",
  "brief": {
    "interestKind": "package",
    "packageId": "maldives",
    "travelWindow": "December 2026",
    "durationDays": 6,
    "adults": 2,
    "children": 1,
    "budgetBand": "200k-400k",
    "name": "Aarav Menon",
    "mobile": "+91 98765 43210",
    "email": "aarav@example.com",
    "notes": "We would like help with flights, a family-friendly resort, and visa guidance if needed.",
    "consent": true,
    "startedAt": 1760000000000
  }
}
```

The script rejects missing bodies, invalid JSON, missing or invalid secrets, missing submission IDs, and payloads larger than 20,000 bytes with a generic JSON error. It never logs request bodies, email addresses, phone numbers, or message text.

On success it returns:

```json
{
  "ok": true,
  "stored": true,
  "notified": true,
  "submissionId": "enq_20260825_0001",
  "sheetUrl": "<restricted live sheet URL>"
}
```

`sheetUrl` is returned only for the trusted server adapter and must never be forwarded to the browser.

## Delivery and retry behavior

- `doPost(e)` acquires `LockService.getScriptLock()` before reading or writing, checks the `Submission ID` column for idempotency, and appends exactly one row when the submission is new.
- The script stores `Status=New`, `Notification status=Pending`, `Notification attempts=0`, and never persists `website` or `startedAt`.
- User-controlled strings are sanitized with `safeCell()` so values beginning with `=`, `+`, `-`, or `@` are written as literal text instead of formulas.
- Owner email content uses the original normalized visitor values, not the formula-safe sheet literals, while the HTML output is still escaped safely.
- The owner notification sends to `OWNER_EMAIL`, uses `Reply-to: brief.email`, includes every submitted form field, and adds a clearly labeled `Open enquiry tracker` link using `SHEET_URL`.
- When email delivery fails, the row remains saved, `Notification status` becomes `Failed`, `Notification attempts` increments, and `Last notification error` stores only a short sanitized operational message.
- `retryFailedNotifications()` uses the same lock, sorts failed rows by `Submitted at` with a deterministic `Submission ID` tie-breaker before applying the 20-row cap, and stops retrying a row after 8 attempts while leaving it visibly `Failed` for manual review.

## Failure and recovery

- `Notification status=Failed` means the Sheet row is safe and the retry trigger or manual resend path should be checked.
- A storage failure is a visitor-visible retryable error and should not be presented as a successful submission.
- The owner should periodically export an offline backup because the chosen Sheet is the canonical launch store and retention is indefinite.

## Manual verification matrix

After deployment, use the sample payload against the Apps Script `/exec` URL and confirm:

```text
valid payload             -> one row, status New, notification Sent
same submissionId again   -> same row count, no duplicate email
bad authToken             -> no row, generic 401-style JSON result
email failure             -> row retained, status Failed, retryable
formula-like text         -> stored as literal text, never a formula
```

Apps Script runtime services are not exercised by Vitest from this repository. Run `npm test` after the repository-side contract fixtures are added in Task 2, and manually verify the deployed Apps Script behavior from its live `/exec` URL.
