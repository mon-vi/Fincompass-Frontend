# Phase 5 Integration

## Endpoints Wired

| Flow | Endpoints |
|---|---|
| Dashboard | `GET /api/v1/dashboard` |
| OCR | `POST /api/v1/ocr/uploads`, `GET /api/v1/ocr/uploads/{id}`, `PATCH /api/v1/ocr/uploads/{id}/confirm`, `PATCH /api/v1/ocr/uploads/{id}/abandon` |
| Email Parser | `GET /api/v1/email-parser/forwarding-address`, `GET /api/v1/email-parser/events`, `GET /api/v1/email-parser/events/{id}`, `PATCH /api/v1/email-parser/events/{id}/apply`, `PATCH /api/v1/email-parser/events/{id}/dismiss` |
| ARIA | `GET /api/v1/aria/conversations`, `POST /api/v1/aria/conversations`, `POST /api/v1/aria/conversations/{id}/messages`, `GET /api/v1/aria/usage` |
| Billing | `GET /api/v1/billing/subscription`, `POST /api/v1/billing/checkout`, `POST /api/v1/billing/portal` |

## OCR Flow

Users upload a PDF, PNG, JPG, or JPEG document from `OcrUploadPage`. The frontend validates file type and 10 MB max size before calling `POST /ocr/uploads` with multipart form data.

After upload, the page polls `GET /ocr/uploads/{id}` while the upload is `uploading` or `processing`. When the backend returns `review_ready`, the user is sent to `OcrReviewPage`.

The review page renders extracted expenses and debts, supports select/deselect, allows amount and description edits, and confirms selected edited items with `PATCH /ocr/uploads/{id}/confirm`. Abandon uses `PATCH /ocr/uploads/{id}/abandon`.

## Email Parser Flow

The Email Parser page shows the backend forwarding address and parsed events. Each event displays matched/unmatched state, sender metadata, and a preview of parsed data.

Apply calls `PATCH /email-parser/events/{id}/apply` and invalidates expenses and debts. Dismiss calls `PATCH /email-parser/events/{id}/dismiss` and refreshes the event list.

## ARIA Flow

ARIA loads conversations from `GET /aria/conversations` and usage from `GET /aria/usage`. If no conversation exists, the frontend creates one with `POST /aria/conversations` before sending the first message.

Messages are sent through `POST /aria/conversations/{id}/messages`. The UI keeps the existing optimistic user message behavior and rolls back if the request fails. Usage disables input when `used >= limit`.

## Billing Flow

Billing loads the current subscription from `GET /billing/subscription`. Upgrade buttons call `POST /billing/checkout` and redirect to the returned URL. Manage subscription calls `POST /billing/portal` and redirects to the returned portal URL.

## Mock Vs Real Providers

Runtime mock adapters were removed from production feature paths. Feature service indexes now export real backend adapters directly, and mock service files were removed.

Tests mock React hooks at the test boundary only; they do not provide application runtime data.

## Known Limitations

Unmatched Email Parser events are shown but not yet linkable to a specific existing debt or expense from the UI.

ARIA conversation creation assumes `POST /aria/conversations` is available because messages require a conversation id.

OCR confirm sends edited backend-supported `fields`; backend validation remains authoritative.
