import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { bookingSchema, scoreLead } from "@/lib/validation";

export const runtime = "nodejs";

function jsonError(message: string, status: number, fieldErrors?: Record<string, string[]>) {
  return NextResponse.json({ ok: false, message, fieldErrors }, { status });
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const expectedOrigin = process.env.APP_ORIGIN;

  // Origin check is a useful CSRF guard, but not a substitute for rate limiting.
  if (expectedOrigin && origin) {
    try {
      if (new URL(origin).origin !== new URL(expectedOrigin).origin) {
        return jsonError("Request origin could not be verified.", 403);
      }
    } catch {
      return jsonError("Request origin could not be verified.", 403);
    }
  }

  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return jsonError("Unsupported request format.", 415);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Please check the form and try again.", 400);
  }

  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] ??= [];
      fieldErrors[key].push(issue.message);
    }
    return jsonError("Please correct the highlighted fields.", 422, fieldErrors);
  }

  const input = parsed.data;
  if (input.website) {
    // Return a generic success shape to avoid informing bots about the honeypot.
    return NextResponse.json({
      ok: true,
      message: "Your request has been received.",
      reference: null,
      status: "PENDING_CONFIRMATION"
    });
  }

  const { score, leadTemperature } = scoreLead(input);
  const preferredDate = new Date(`${input.preferredDate}T12:00:00`);

  try {
    const lead = await prisma.siteVisitLead.create({
      data: {
        fullName: input.fullName,
        phone: input.phone,
        email: input.email,
        buyerType: input.buyerType,
        configuration: input.configuration,
        budgetRange: input.budgetRange,
        purchaseTimeline: input.purchaseTimeline,
        preferredDate,
        preferredTimeWindow: input.preferredTimeWindow,
        visitorCount: input.visitorCount,
        pickupPreference: input.pickupPreference,
        pickupArea: input.pickupPreference === "REQUESTED" ? input.pickupArea.trim() : null,
        notes: input.notes || null,
        consentToContact: input.consentToContact,
        consentRecordedAt: new Date(),
        privacyPolicyUrl: input.privacyPolicyUrl || null,
        source: "olympia_site_visit_form",
        landingPage: input.landingPage || null,
        leadScore: score,
        leadTemperature,
        visitStatus: "PENDING_CONFIRMATION"
      },
      select: { id: true, createdAt: true, visitStatus: true, leadTemperature: true }
    });

    // Best-effort webhook. Database record remains saved if CRM webhook is unavailable.
    // In production, use a durable queue with retries and delivery monitoring.
    const webhookUrl = process.env.CRM_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            ...(process.env.CRM_WEBHOOK_SECRET
              ? { "x-olympia-webhook-secret": process.env.CRM_WEBHOOK_SECRET }
              : {})
          },
          body: JSON.stringify({
            event: "site_visit_requested",
            leadId: lead.id,
            createdAt: lead.createdAt.toISOString(),
            visitStatus: lead.visitStatus,
            leadTemperature: lead.leadTemperature,
            leadScore: score,
            ...input,
            phone: input.phone,
            website: undefined
          }),
          cache: "no-store"
        });
        if (!response.ok) {
          console.error("CRM webhook returned non-2xx", response.status, "leadId", lead.id);
        }
      } catch (error) {
        console.error("CRM webhook delivery failed for leadId", lead.id, error);
      }
    }

    return NextResponse.json({
      ok: true,
      message: "Your Olympia visit request has been received.",
      reference: lead.id,
      status: "PENDING_CONFIRMATION",
      leadTemperature: lead.leadTemperature
    }, { status: 201 });
  } catch (error) {
    console.error("Unable to save Olympia site visit request to database", error);

    // In development mode, if local PostgreSQL is offline, provide a simulated confirmation
    // so designers and developers can test the full UI booking flow and states without a DB blocker.
    if (process.env.NODE_ENV !== "production") {
      const demoId = "DEV-" + Math.random().toString(36).substring(2, 8).toUpperCase();
      console.warn("Dev mode: local PostgreSQL offline. Providing fallback confirmation for UI demo:", demoId);
      return NextResponse.json({
        ok: true,
        message: "Your Olympia visit request has been received.",
        reference: demoId,
        status: "PENDING_CONFIRMATION",
        leadTemperature
      }, { status: 201 });
    }

    return jsonError("We couldn't submit your request right now. Please try again shortly or contact the team directly.", 500);
  }
}
