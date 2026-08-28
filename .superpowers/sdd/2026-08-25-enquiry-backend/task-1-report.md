# Task 1 Report: Google Workspace automation contract

Date: 2026-08-28

## Scope

Implemented Task 1 in the task-owned `ops/google-apps-script/*` files only. The approved spec at `docs/superpowers/specs/enquiry-backend.md` was reviewed and left unchanged because the implemented sheet column order matches the approved schema exactly.

## Files changed

- `ops/google-apps-script/Code.gs`
- `ops/google-apps-script/appsscript.json`
- `ops/google-apps-script/sample-payload.json`
- `ops/google-apps-script/README.md`

## Implementation summary

### `ops/google-apps-script/Code.gs`

Added a versioned Google Apps Script implementation that:

- Handles `doPost(e)` for the `{ authToken, submissionId, submittedAt, brief }` contract.
- Rejects missing bodies, invalid JSON, missing or invalid secrets, missing `submissionId`, missing `submittedAt`, non-object `brief`, and payloads over 20,000 bytes with generic JSON errors.
- Avoids request logging entirely and does not log request bodies, email addresses, phone numbers, or message text.
- Acquires `LockService.getScriptLock()` around both live writes and retry processing.
- Verifies the first-row headers against the approved 22-column schema before use.
- Checks the `Submission ID` column for idempotency and returns the existing stored result without appending a duplicate row or sending a duplicate email.
- Appends exactly one new row for new submissions with:
  - `Status=New`
  - `Notification status=Pending`
  - `Notification attempts=0`
  - `Last notification error=''`
  - `Last updated=submittedAt`
- Excludes `website` and `startedAt` from persistence.
- Applies the required `safeCell()` formula-injection protection to all user-controlled text written to the sheet.
- Sends owner notification email with:
  - `To: OWNER_EMAIL`
  - `Reply-to: brief.email`
  - subject `You have received a new enquiry — <brief.name>`
  - plain-text and HTML bodies containing every submitted form field plus a clearly labeled `Open enquiry tracker` link using `SHEET_URL`
- Marks the row `Sent` on notification success.
- Keeps the row stored and marks notification `Failed` on email failure, increments `Notification attempts`, and stores only a short sanitized operational error string.
- Adds `retryFailedNotifications()` with:
  - the same script lock
  - submission-order processing
  - a 20-row cap per execution
  - an 8-attempt maximum per row before retries stop automatically
- Adds `installRetryTrigger()` and `removeRetryTriggers()` helpers so the owner can install or reset the 15-minute retry trigger from the project.

### `ops/google-apps-script/appsscript.json`

Added a manifest for Apps Script V8 with the spreadsheet, mail, and trigger-related scopes needed for this contract.

### `ops/google-apps-script/sample-payload.json`

Added a normalized sample payload that matches the required server-to-script POST contract and can be used for manual `/exec` verification after deployment.

### `ops/google-apps-script/README.md`

Added setup and operations notes covering:

- the exact Script Properties values required by the brief
- the exact approved sheet headers and setup order
- header freezing, text formatting, protection, and `Status` validation
- restricted sheet sharing requirements
- deployment and environment-variable handoff steps
- retry-trigger installation
- failure and recovery guidance
- the manual verification matrix from the brief
- the note that Apps Script runtime behavior must be verified manually from the deployed `/exec` URL, while repository-side `npm test` becomes applicable after Task 2 adds the shared contract fixtures

## TDD and testing notes

The brief requires following the testing instructions where applicable. For Task 1, repository-side automated tests are explicitly deferred until Task 2 adds the shared persistence fixtures and adapters. Because this task was restricted to the Apps Script contract files and no local Apps Script runtime is available here, I did not add or run repository unit tests for runtime behavior in this task.

I did perform repository-safe local verification for the versioned contract artifacts:

1. Parsed `ops/google-apps-script/Code.gs` as JavaScript with Node’s `vm.Script` to confirm syntax.
2. Parsed `ops/google-apps-script/appsscript.json` and `ops/google-apps-script/sample-payload.json` as JSON.
3. Ran `git diff --check -- ops/google-apps-script docs/superpowers/specs/enquiry-backend.md` to confirm there were no whitespace or patch-format issues in scope.

Verification results:

- `Code.gs syntax OK`
- `JSON files valid`
- `git diff --check` exited cleanly

## Commit

- `8be75f6` — `feat: add Google Workspace enquiry automation contract`

## Manual verification still required outside this environment

The following checks remain required after the owner deploys the Apps Script project and installs the trigger:

- `valid payload -> one row, status New, notification Sent`
- `same submissionId again -> same row count, no duplicate email`
- `bad authToken -> no row, generic 401-style JSON result`
- `email failure -> row retained, status Failed, retryable`
- `formula-like text -> stored as literal text, never a formula`

This environment did not sign into Google, deploy the web app, call the live `/exec` URL, or exercise `MailApp`, `SpreadsheetApp`, `LockService`, `PropertiesService`, or trigger execution.

## Concerns / follow-ups

- Apps Script web app responses are JSON-shaped and generic, but true HTTP status control is limited in this environment and still needs live `/exec` confirmation during owner deployment.
- The report and commit intentionally leave unrelated working-tree changes untouched, including pre-existing untracked content under `docs/superpowers/` and other files outside this task.
- `README.md` documents trigger installation via `installRetryTrigger()` and also notes the equivalent owner-controlled time-driven trigger setup through the Apps Script UI.

## Fix round 1

Date: 2026-08-28

Addressed the requested review findings in the task-owned Apps Script contract:

- Separated formula-safe sheet persistence from owner email rendering so email content now uses the original normalized visitor values, while HTML output remains escaped and sheet cells remain protected with `safeCell()`.
- Changed `retryFailedNotifications()` to sort failed candidates by `Submitted at` with deterministic `Submission ID` tie-breaker before applying the 20-row cap, so retries are stable even if sheet rows are reordered manually.
- Removed the unused `https://www.googleapis.com/auth/script.external_request` scope from `ops/google-apps-script/appsscript.json`.

Focused repository-safe verification rerun:

1. Command:

```text
node -e "const fs=require('fs'); const vm=require('vm'); new vm.Script(fs.readFileSync('ops/google-apps-script/Code.gs','utf8'), { filename: 'Code.gs' }); console.log('Code.gs syntax OK');"
```

Result:

```text
Code.gs syntax OK
```

2. Command:

```text
node -e "const fs=require('fs'); const manifest=JSON.parse(fs.readFileSync('ops/google-apps-script/appsscript.json','utf8')); JSON.parse(fs.readFileSync('ops/google-apps-script/sample-payload.json','utf8')); if (manifest.oauthScopes.includes('https://www.googleapis.com/auth/script.external_request')) throw new Error('unexpected external_request scope'); console.log('JSON files valid and scopes OK');"
```

Result:

```text
JSON files valid and scopes OK
```

3. Command:

```text
git diff --check -- ops/google-apps-script .superpowers/sdd/2026-08-25-enquiry-backend/task-1-report.md
```

Result:

```text
[no output, exit code 0]
```

Notes:

- No Google sign-in, deployment, live `/exec` invocation, Gmail send, or trigger execution was performed from this environment.
- Repository-side automated tests remain deferred for Task 1 because Apps Script runtime behavior is not exercised locally and the brief points repository contract testing to Task 2 onward.
