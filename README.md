# Olympia Complimentary Site Visit Booking

A production-oriented Next.js + TypeScript starter for the Primus Life Olympia site-visit request journey.

## Included
- Responsive booking form with validation and accessible labels
- Contact details, buyer intent, budget, timeline, preferred visit slot, visitors and pickup request
- Pickup-area required only when pickup/drop is requested
- Consent required before submission
- Server-side Zod validation and normalization
- PostgreSQL persistence through Prisma
- Lead scoring as a prioritisation hint (not an automatic rejection rule)
- Explicit `PENDING_CONFIRMATION` visit state
- Confirmation UI that does **not** promise instant booking or transport confirmation
- Honeypot field and configurable origin check
- Optional webhook to CRM/automation service
- Admin-ready lead fields and status enums

## Important before launch
This is a deployable application starter, but it is not connected to Primus Life's actual CRM, live appointment calendar, transport provider, approved privacy policy or production hosting. Configure and test those integrations before public launch. No booking is confirmed until a staff member or verified availability integration changes the status.

## Requirements
- Node.js 20+
- PostgreSQL
- A deployment environment that supports Next.js

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and set `DATABASE_URL` and `APP_ORIGIN`.
3. Generate Prisma client and create the database schema:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```
4. Run locally:
   ```bash
   npm run dev
   ```
5. Visit `http://localhost:3000`.

## Environment variables
- `DATABASE_URL`: PostgreSQL connection string
- `APP_ORIGIN`: expected public origin, e.g. `https://www.primuslife.in`
- `CRM_WEBHOOK_URL`: optional secure CRM/automation webhook
- `CRM_WEBHOOK_SECRET`: optional shared secret sent as `x-olympia-webhook-secret`
- `NEXT_PUBLIC_PRIVACY_POLICY_URL`: approved privacy-policy URL to display
- `NEXT_PUBLIC_SITE_LABEL`: optional site label

## Booking flow
1. Visitor submits a request.
2. Server validates input and stores the lead with `PENDING_CONFIRMATION`.
3. User sees a message explaining that date/time and transport are not yet confirmed.
4. Sales team reviews the request, checks appointment availability and (if requested) pickup feasibility.
5. Only after confirmation should the CRM/admin process update the visit status to `CONFIRMED` and send confirmation details.

## Operational requirements to finish
- Configure a distributed rate limiter (e.g. Upstash Redis, Cloudflare Turnstile, or equivalent) at the edge/API layer. The in-memory process is intentionally not used as a security control.
- Add CRM webhook allowlisting, retry queue and delivery monitoring.
- Configure database backups, retention/deletion policy, access control, audit logs and monitoring.
- Add a secure admin/CRM workflow for changing visit status; do not expose status mutation publicly.
- Confirm approved consent wording, privacy notice, pickup coverage, transport eligibility, service hours and pricing claims with Primus Life.
- Add email/SMS provider only after the company approves sender identity, templates and consent rules.
- Test accessibility, mobile layout, API abuse protection and load behaviour before launch.

## Lead scoring
The starter uses a simple editable heuristic to prioritise follow-up. It is not a validated predictive model. Staff should confirm intent, budget fit and reachability; never automatically reject a lead based on score alone.

## Suggested production acceptance tests
- Invalid or missing required fields return field errors.
- Invalid phone number is rejected.
- Pickup area is required only when pickup is requested.
- Missing consent is rejected.
- Honeypot submissions are rejected.
- Successful request is saved with `PENDING_CONFIRMATION`.
- CRM webhook failures do not lose the database record.
- Confirmation UI says visit/transport are not yet confirmed.
