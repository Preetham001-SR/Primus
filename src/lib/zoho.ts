/**
 * Zoho CRM REST API v6 Integration for Olympia Site Visit Leads.
 * Supports automated OAuth token refresh, fail-safe formatting, and custom field mapping.
 */

export interface ZohoLeadInput {
  fullName: string;
  phone: string;
  email?: string | null;
  buyerType: string;
  configuration: string;
  budgetRange: string;
  purchaseTimeline: string;
  preferredDate: string; // YYYY-MM-DD
  preferredTimeWindow: string;
  visitorCount: string;
  pickupPreference: "REQUESTED" | "NOT_REQUESTED";
  pickupArea?: string | null;
  notes?: string | null;
  consentToContact: boolean;
  leadScore: number;
  leadTemperature: "HOT" | "WARM" | "NURTURE";
  visitStatus?: string;
  leadId?: string;
}

let cachedAccessToken: string | null = null;
let tokenExpiresAt = 0;

/**
 * Exchanges the long-lived refresh token for a short-lived access token.
 */
async function getZohoAccessToken(): Promise<string | null> {
  const refreshToken = process.env.ZOHO_REFRESH_TOKEN;
  const clientId = process.env.ZOHO_CLIENT_ID;
  const clientSecret = process.env.ZOHO_CLIENT_SECRET;
  const accountsDomain = process.env.ZOHO_ACCOUNTS_DOMAIN || "https://accounts.zoho.in";

  if (!refreshToken || !clientId || !clientSecret) {
    return null;
  }

  // Reuse cached token if still valid (with 60-second safety buffer)
  if (cachedAccessToken && Date.now() < tokenExpiresAt - 60000) {
    return cachedAccessToken;
  }

  try {
    const params = new URLSearchParams({
      grant_type: "refresh_token",
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken
    });

    const res = await fetch(`${accountsDomain}/oauth/v2/token?${params.toString()}`, {
      method: "POST",
      cache: "no-store"
    });

    if (!res.ok) {
      console.error("Zoho CRM OAuth token refresh HTTP error:", res.status, await res.text());
      return null;
    }

    const data = (await res.json()) as { access_token?: string; expires_in?: number; error?: string };

    if (!data.access_token) {
      console.error("Zoho CRM OAuth returned no access token:", data);
      return null;
    }

    cachedAccessToken = data.access_token;
    tokenExpiresAt = Date.now() + (data.expires_in || 3600) * 1000;
    return cachedAccessToken;
  } catch (err) {
    console.error("Zoho CRM token refresh network error:", err);
    return null;
  }
}

/**
 * Creates a Lead record in Zoho CRM Leads module.
 * Non-blocking: returns detailed result object without throwing to safeguard visitor checkout.
 */
export async function syncLeadToZohoCRM(lead: ZohoLeadInput) {
  // If Zoho credentials are not configured, exit gracefully
  if (!process.env.ZOHO_REFRESH_TOKEN || !process.env.ZOHO_CLIENT_ID) {
    return { skipped: true, reason: "Zoho CRM credentials not set in environment." };
  }

  const accessToken = await getZohoAccessToken();
  if (!accessToken) {
    return { success: false, error: "Unable to obtain Zoho CRM access token" };
  }

  const apiDomain = process.env.ZOHO_API_DOMAIN || "https://www.zohoapis.in";

  // Parse Name: Zoho CRM strictly requires Last_Name
  const nameParts = lead.fullName.trim().split(/\s+/);
  const lastName = nameParts.length > 1 ? nameParts.pop()! : nameParts[0] || "Valued Visitor";
  const firstName = nameParts.join(" ") || "";

  // Structured summary for Description ensures sales team has 100% visibility even before custom CRM fields are set
  const description = [
    `OLYMPIA SENIOR LIVING — SITE VISIT REQUEST`,
    `Reference ID: ${lead.leadId || "N/A"}`,
    `--------------------------------------------------`,
    `Preferred Date: ${lead.preferredDate}`,
    `Time Slot: ${lead.preferredTimeWindow}`,
    `Visitor Count: ${lead.visitorCount}`,
    `Cab Pickup: ${lead.pickupPreference === "REQUESTED" ? `Yes (From: ${lead.pickupArea || "Unspecified"})` : "No (Self commute)"}`,
    `Buyer Type: ${lead.buyerType}`,
    `Configuration: ${lead.configuration}`,
    `Budget Range: ${lead.budgetRange}`,
    `Timeline: ${lead.purchaseTimeline}`,
    `Lead Score: ${lead.leadScore}/100 (${lead.leadTemperature})`,
    lead.notes ? `Special Requests / Health Notes: ${lead.notes}` : null
  ]
    .filter(Boolean)
    .join("\n");

  const zohoRecord: Record<string, unknown> = {
    First_Name: firstName,
    Last_Name: lastName,
    Mobile: lead.phone,
    Phone: lead.phone,
    Email: lead.email || undefined,
    Lead_Source: "Olympia Web Portal",
    Lead_Status: "Pending Confirmation",
    Description: description,
    // Custom fields (configured in Zoho CRM Leads Module)
    Lead_Score: lead.leadScore,
    Lead_Temperature: lead.leadTemperature,
    Preferred_Visit_Date: lead.preferredDate,
    Preferred_Time_Slot: lead.preferredTimeWindow,
    Buyer_Type: lead.buyerType,
    Preferred_Configuration: lead.configuration,
    Budget_Range: lead.budgetRange,
    Purchase_Timeline: lead.purchaseTimeline,
    Number_of_Visitors: lead.visitorCount,
    Cab_Pickup: lead.pickupPreference,
    Pickup_Location: lead.pickupArea || undefined
  };

  try {
    const response = await fetch(`${apiDomain}/crm/v6/Leads`, {
      method: "POST",
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        data: [zohoRecord],
        trigger: ["approval", "workflow", "blueprint"]
      }),
      cache: "no-store"
    });

    const result = await response.json();
    if (!response.ok) {
      console.error("Zoho CRM API create lead error:", response.status, result);
      return { success: false, status: response.status, error: result };
    }

    console.log("Successfully pushed lead to Zoho CRM:", lead.leadId);
    return { success: true, result };
  } catch (error) {
    console.error("Zoho CRM API request network failure:", error);
    return { success: false, error };
  }
}
