# AGENTS.md — Olympia Site Visit Booking

## Commands

```bash
npm install              # Install dependencies
npm run dev              # Start dev server (http://localhost:3000)
npm run build            # Generate Prisma client + Next.js build
npm run start            # Start production server
npm run lint             # Run Next.js lint
npm run db:generate      # Generate Prisma client
npm run db:migrate       # Apply migrations to database
npx prisma migrate dev --name <name>  # Create + apply migration (dev)
npx prisma studio        # Open Prisma Studio
```

## Environment

Copy `.env.example` → `.env` and set:
- `DATABASE_URL` — PostgreSQL connection string
- `APP_ORIGIN` — Public origin for CSRF origin check (e.g. `https://www.primuslife.in`)
- `CRM_WEBHOOK_URL` — Optional CRM webhook endpoint
- `CRM_WEBHOOK_SECRET` — Optional shared secret for webhook
- `NEXT_PUBLIC_PRIVACY_POLICY_URL` — Privacy policy link shown in consent
- `NEXT_PUBLIC_SITE_LABEL` — Optional site label

## Architecture

**Next.js 14 (App Router) + TypeScript + Prisma + PostgreSQL**

- `src/app/` — App Router pages and API routes
- `src/components/` — Client components (`BookingForm.tsx`)
- `src/lib/` — Shared utilities (`prisma.ts`, `validation.ts`)
- `prisma/schema.prisma` — Database schema with enums: `VisitStatus`, `PickupPreference`, `LeadTemperature`

### Key files
- `src/app/page.tsx` — Landing page with hero, value strip, booking form
- `src/app/api/site-visit/route.ts` — POST handler: origin check → Zod validation → honeypot → Prisma create → webhook (best-effort)
- `src/lib/validation.ts` — Zod schema + `scoreLead()` heuristic
- `src/lib/prisma.ts` — Singleton PrismaClient with dev hot-reload guard

## Booking Flow

1. Visitor submits form → `/api/site-visit`
2. Server validates with Zod, rejects honeypot fills
3. Lead saved with `visitStatus: PENDING_CONFIRMATION`
4. Webhook fires (non-blocking; failures logged, DB record persists)
5. UI shows "Pending confirmation" — **no visit/transport guaranteed**

## Validation Rules (from `validation.ts`)

- Phone: 10-digit Indian mobile (`^[6-9]\d{9}$`)
- Email: optional, valid format if provided
- `preferredDate`: today or future
- `pickupArea`: required if `pickupPreference === "REQUESTED"` (min 2 chars)
- `consentToContact`: must be `true`
- Honeypot `website` field: must be empty

## Lead Scoring

Heuristic in `scoreLead()` — **for prioritisation only, never auto-reject**:
- Purchase timeline: 30 days = +25, 3 months = +15
- Preferred date urgency: ≤1 day = +30, ≤7 days = +20
- Budget: ₹1Cr–1.25Cr or above = +20
- Valid phone format = +10
- Capped at 100; temperature: ≥70 HOT, ≥40 WARM, else NURTURE

## Critical Notes

- **No rate limiting implemented** — add edge/API layer limiter (Upstash Redis, Cloudflare Turnstile, etc.) before production
- Webhook is best-effort — use durable queue with retries for production
- `PENDING_CONFIRMATION` is explicit — status changes only via admin/CRM workflow
- Origin check in API is a CSRF guard, not a rate limit substitute
- Consent + privacy policy URL stored per lead for audit

## Testing Checklist (from README)

- Invalid/missing fields → field errors
- Invalid phone → rejected
- Pickup area required only when pickup requested
- Missing consent → rejected
- Honeypot filled → rejected
- Success → saved as `PENDING_CONFIRMATION`
- Webhook failure → DB record intact
- Confirmation UI states visit/transport not confirmed