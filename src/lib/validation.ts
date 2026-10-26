import { z } from "zod";

const phoneSchema = z.string()
  .transform((value) => value.replace(/[\s()+-]/g, ""))
  .refine((value) => /^[6-9]\d{9}$/.test(value), {
    message: "Enter a valid 10-digit Indian mobile number."
  });

const optionalEmail = z.union([
  z.literal(""),
  z.string().trim().email("Enter a valid email address.").max(254)
]).optional().transform((value) => value || null);

export const bookingSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name.").max(100),
  phone: phoneSchema,
  email: optionalEmail,
  buyerType: z.enum(["Myself", "Parents", "Myself and spouse", "Other family member"]),
  configuration: z.enum(["1 BHK", "2 BHK", "Need guidance"]),
  budgetRange: z.enum([
    "Below ₹1 crore",
    "₹1 crore–₹1.25 crore",
    "Above ₹1.25 crore",
    "Need pricing details"
  ]),
  purchaseTimeline: z.enum([
    "Within 30 days",
    "Within 3 months",
    "Within 6 months",
    "Just exploring"
  ]),
  preferredDate: z.string().min(1, "Choose a preferred visit date."),
  preferredTimeWindow: z.enum([
    "Morning (10 AM–12 PM)",
    "Afternoon (12 PM–3 PM)",
    "Evening (3 PM–5 PM)"
  ]),
  visitorCount: z.enum(["1", "2", "3", "4+"]),
  pickupPreference: z.enum(["REQUESTED", "NOT_REQUESTED"]),
  pickupArea: z.string().trim().max(160).optional().default(""),
  notes: z.string().trim().max(1000).optional().default(""),
  consentToContact: z.literal(true, {
    errorMap: () => ({ message: "Please agree to be contacted about this request." })
  }),
  privacyPolicyUrl: z.string().url().optional().or(z.literal("")),
  landingPage: z.string().max(500).optional().default(""),
  website: z.string().optional().default("") // honeypot: must remain empty
}).superRefine((data, ctx) => {
  const date = new Date(`${data.preferredDate}T12:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (Number.isNaN(date.getTime()) || date < today) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["preferredDate"],
      message: "Choose today or a future date."
    });
  }
  if (data.pickupPreference === "REQUESTED" && data.pickupArea.trim().length < 2) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["pickupArea"],
      message: "Enter your pickup area or a nearby landmark."
    });
  }
  if (data.website && data.website.trim().length > 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["website"],
      message: "Unable to process this request."
    });
  }
});

export type BookingInput = z.infer<typeof bookingSchema>;

export function scoreLead(input: BookingInput) {
  let score = 0;
  if (input.purchaseTimeline === "Within 30 days") score += 25;
  else if (input.purchaseTimeline === "Within 3 months") score += 15;

  if (input.preferredDate) {
    const daysUntilVisit = Math.ceil(
      (new Date(`${input.preferredDate}T12:00:00`).getTime() - Date.now()) / 86400000
    );
    if (daysUntilVisit <= 1) score += 30;
    else if (daysUntilVisit <= 7) score += 20;
  }

  if (input.budgetRange === "₹1 crore–₹1.25 crore" || input.budgetRange === "Above ₹1.25 crore") {
    score += 20;
  }
  if (/^[6-9]\d{9}$/.test(input.phone)) score += 10;
  score = Math.min(score, 100);

  // Heuristic for routing only; sales staff must validate intent and fit.
  const leadTemperature: "HOT" | "WARM" | "NURTURE" = score >= 70 ? "HOT" : score >= 40 ? "WARM" : "NURTURE";
  return { score, leadTemperature };
}
