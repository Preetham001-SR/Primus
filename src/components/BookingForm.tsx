"use client";

import { FormEvent, useMemo, useState } from "react";

type FieldErrors = Record<string, string[]>;

const initialValues = {
  fullName: "",
  phone: "",
  email: "",
  buyerType: "Parents",
  configuration: "2 BHK",
  budgetRange: "₹1 crore–₹1.25 crore",
  purchaseTimeline: "Within 3 months",
  preferredDate: "",
  preferredTimeWindow: "Morning (10 AM–12 PM)",
  visitorCount: "2",
  pickupPreference: "REQUESTED",
  pickupArea: "",
  notes: "",
  consentToContact: false,
  website: ""
};

const today = new Date();
const minDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

export default function BookingForm() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<{ reference: string | null; status: string } | null>(null);
  const [formError, setFormError] = useState("");

  const privacyUrl = process.env.NEXT_PUBLIC_PRIVACY_POLICY_URL || "https://www.primuslife.in/privacy-policy/";
  const landingPage = typeof window !== "undefined" ? window.location.href : "";

  const update = (name: keyof typeof initialValues, value: string | boolean) => {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: [] }));
  };

  const setFieldError = (name: string) => errors[name]?.[0];

  const phoneLooksValid = useMemo(
    () => /^[6-9]\d{9}$/.test(values.phone.replace(/[\s()+-]/g, "")),
    [values.phone]
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    setErrors({});

    if (values.fullName.trim().length < 2) {
      setErrors({ fullName: ["Please enter your full name (minimum 2 characters)."] });
      document.getElementById("fullName")?.focus();
      return;
    }
    if (!phoneLooksValid) {
      setErrors({ phone: ["Enter a valid 10-digit Indian mobile number (e.g. 9845012345)."] });
      document.getElementById("phone")?.focus();
      return;
    }
    if (!values.preferredDate) {
      setErrors({ preferredDate: ["Choose a preferred visit date."] });
      document.getElementById("preferredDate")?.focus();
      return;
    }
    if (values.pickupPreference === "REQUESTED" && values.pickupArea.trim().length < 2) {
      setErrors({ pickupArea: ["Enter your pickup area or a nearby landmark."] });
      document.getElementById("pickupArea")?.focus();
      return;
    }
    if (!values.consentToContact) {
      setErrors({ consentToContact: ["Please agree to be contacted about this request."] });
      document.getElementById("consentToContact")?.focus();
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/site-visit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...values,
          phone: values.phone.replace(/[\s()+-]/g, ""),
          privacyPolicyUrl: privacyUrl,
          landingPage
        })
      });
      const result = await response.json();

      if (!response.ok) {
        setErrors(result.fieldErrors || {});
        setFormError(result.message || "Please check the form and try again.");
        return;
      }

      setSuccess({ reference: result.reference ?? null, status: result.status });
      setValues(initialValues);
    } catch {
      setFormError("We couldn’t submit your request. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <section className="primus-success-card" role="status" aria-live="polite">
        <div className="success-emblem-badge" aria-hidden="true">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#821a52" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <span className="success-eyebrow">VISIT REQUEST RECEIVED</span>
        <h3 className="success-title">Your Olympia Visit Request Has Been Received</h3>
        <p className="success-body">
          Thank you for choosing <strong>Primus Olympia</strong>. Our senior living care counselor will call you shortly to confirm your scheduled time and coordinate complimentary pickup & drop arrangements.
        </p>
        
        {success.reference && (
          <div className="reference-box">
            <span className="ref-label">Request Reference</span>
            <span className="ref-code">{success.reference}</span>
          </div>
        )}

        <div className="pending-confirmation-banner">
          <div className="pending-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#821a52" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <div>
            <strong>Status: Pending Team Confirmation</strong>
            <p>
              Your visit and complimentary transport are not finalized yet. A member of our hospitality team will contact you to verify details before you travel.
            </p>
          </div>
        </div>

        <div className="success-perks">
          <div className="perk">
            <span className="perk-icon">☕</span>
            <span>Chef-curated lunch or high tea during your tour</span>
          </div>
          <div className="perk">
            <span className="perk-icon">🚗</span>
            <span>Chauffeur pickup confirmation via WhatsApp/SMS</span>
          </div>
        </div>

        <button 
          className="btn-primus btn-secondary-primus" 
          onClick={() => setSuccess(null)} 
          type="button"
        >
          Submit Another Request
        </button>
      </section>
    );
  }

  return (
    <form className="primus-booking-form" onSubmit={handleSubmit} noValidate>
      {/* Form Header */}
      <div className="form-brand-header">
        <div className="form-header-badge">
          <span className="gold-sparkle">✦</span>
          <span>COMPLIMENTARY SITE VISIT</span>
        </div>
        <h3 className="form-main-heading">Book Your Guided Olympia Experience</h3>
        <p className="form-sub-heading">
          Explore our senior living residences, experience the hospitality, and enjoy a private consultation.
        </p>
      </div>

      {formError && (
        <div className="form-alert-banner" role="alert">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{formError}</span>
        </div>
      )}

      {/* Step 1: Personal Details */}
      <div className="form-section-block">
        <div className="form-step-tag">
          <span className="step-num">01</span>
          <div>
            <h4>Contact Information</h4>
            <p>We’ll reach out to coordinate your visit time and chauffeur</p>
          </div>
        </div>

        <div className="input-grid">
          <div className="field-group">
            <label htmlFor="fullName">Full Name <span className="req">*</span></label>
            <div className="input-wrap">
              <input
                id="fullName"
                name="fullName"
                autoComplete="name"
                placeholder="e.g. Ramesh Kulkarni"
                value={values.fullName}
                onChange={(e) => update("fullName", e.target.value)}
                required
                maxLength={100}
                aria-invalid={!!setFieldError("fullName")}
              />
            </div>
            {setFieldError("fullName") && (
              <span className="field-error-text" role="alert">{setFieldError("fullName")}</span>
            )}
          </div>

          <div className="field-group">
            <label htmlFor="phone">Mobile Number <span className="req">*</span></label>
            <div className="input-wrap phone-wrap">
              <span className="country-prefix">+91</span>
              <input
                id="phone"
                name="phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                placeholder="10-digit mobile number"
                value={values.phone}
                onChange={(e) => update("phone", e.target.value)}
                required
                aria-invalid={!!setFieldError("phone")}
              />
            </div>
            {setFieldError("phone") && (
              <span className="field-error-text" role="alert">{setFieldError("phone")}</span>
            )}
          </div>

          <div className="field-group field-span-2">
            <label htmlFor="email">
              Email Address <span className="opt-tag">(Optional)</span>
            </label>
            <div className="input-wrap">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                value={values.email}
                onChange={(e) => update("email", e.target.value)}
                maxLength={254}
                aria-invalid={!!setFieldError("email")}
              />
            </div>
            {setFieldError("email") && (
              <span className="field-error-text" role="alert">{setFieldError("email")}</span>
            )}
          </div>
        </div>
      </div>

      {/* Step 2: Personalize Your Visit */}
      <div className="form-section-block">
        <div className="form-step-tag">
          <span className="step-num">02</span>
          <div>
            <h4>Personalise Your Visit</h4>
            <p>Help our senior care advisor prepare relevant floor plans and care details</p>
          </div>
        </div>

        {/* Radio Cards: Who is the home for? */}
        <fieldset className="fieldset-container">
          <legend className="fieldset-legend">Who is the home for?</legend>
          <div className="selection-cards-grid">
            {["Myself", "Parents", "Myself and spouse", "Other family member"].map((item) => (
              <label 
                key={item} 
                className={`selection-card ${values.buyerType === item ? "active" : ""}`}
              >
                <input
                  type="radio"
                  name="buyerType"
                  value={item}
                  checked={values.buyerType === item}
                  onChange={() => update("buyerType", item)}
                  className="visually-hidden"
                />
                <span className="card-radio-circle" aria-hidden="true" />
                <span className="card-text">{item}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="input-grid">
          <div className="field-group">
            <label htmlFor="configuration">Preferred Configuration</label>
            <div className="select-wrap">
              <select
                id="configuration"
                value={values.configuration}
                onChange={(e) => update("configuration", e.target.value)}
              >
                <option value="1 BHK">1 BHK (Elder-Friendly Suite)</option>
                <option value="2 BHK">2 BHK (Spacious Master Residence)</option>
                <option value="Need guidance">Need guidance during tour</option>
              </select>
            </div>
          </div>

          <div className="field-group">
            <label htmlFor="budgetRange">Approximate Budget</label>
            <div className="select-wrap">
              <select
                id="budgetRange"
                value={values.budgetRange}
                onChange={(e) => update("budgetRange", e.target.value)}
              >
                <option value="Below ₹1 crore">Below ₹1 crore</option>
                <option value="₹1 crore–₹1.25 crore">₹1 crore – ₹1.25 crore</option>
                <option value="Above ₹1.25 crore">Above ₹1.25 crore</option>
                <option value="Need pricing details">Share pricing details with me</option>
              </select>
            </div>
          </div>

          <div className="field-group field-span-2">
            <label htmlFor="purchaseTimeline">Expected Purchase Timeline</label>
            <div className="select-wrap">
              <select
                id="purchaseTimeline"
                value={values.purchaseTimeline}
                onChange={(e) => update("purchaseTimeline", e.target.value)}
              >
                <option value="Within 30 days">Within 30 days (Immediate)</option>
                <option value="Within 3 months">Within 3 months</option>
                <option value="Within 6 months">Within 6 months</option>
                <option value="Just exploring">Just exploring for the future</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Step 3: Schedule Date, Time & Transport */}
      <div className="form-section-block">
        <div className="form-step-tag">
          <span className="step-num">03</span>
          <div>
            <h4>Visit Logistics & Travel</h4>
            <p>Select your date and let us know if you require complimentary pickup</p>
          </div>
        </div>

        <div className="input-grid">
          <div className="field-group">
            <label htmlFor="preferredDate">Preferred Visit Date <span className="req">*</span></label>
            <div className="input-wrap">
              <input
                id="preferredDate"
                type="date"
                min={minDate}
                value={values.preferredDate}
                onChange={(e) => update("preferredDate", e.target.value)}
                required
                aria-invalid={!!setFieldError("preferredDate")}
              />
            </div>
            {setFieldError("preferredDate") && (
              <span className="field-error-text" role="alert">{setFieldError("preferredDate")}</span>
            )}
          </div>

          <div className="field-group">
            <label htmlFor="preferredTimeWindow">Preferred Time Window <span className="req">*</span></label>
            <div className="select-wrap">
              <select
                id="preferredTimeWindow"
                value={values.preferredTimeWindow}
                onChange={(e) => update("preferredTimeWindow", e.target.value)}
              >
                <option value="Morning (10 AM–12 PM)">Morning (10:00 AM – 12:00 PM)</option>
                <option value="Afternoon (12 PM–3 PM)">Afternoon (12:00 PM – 3:00 PM)</option>
                <option value="Evening (3 PM–5 PM)">Evening (3:00 PM – 5:00 PM)</option>
              </select>
            </div>
            <span className="field-micro-hint">Preferred windows; team confirms exact slots.</span>
          </div>

          <div className="field-group">
            <label htmlFor="visitorCount">Number of Visitors</label>
            <div className="select-wrap">
              <select
                id="visitorCount"
                value={values.visitorCount}
                onChange={(e) => update("visitorCount", e.target.value)}
              >
                <option value="1">1 Visitor</option>
                <option value="2">2 Visitors (e.g. Parents or Couple)</option>
                <option value="3">3 Visitors (Family)</option>
                <option value="4+">4 or More Visitors</option>
              </select>
            </div>
          </div>

          <div className="field-group">
            <label htmlFor="pickupPreference">Complimentary Pickup & Drop</label>
            <div className="select-wrap">
              <select
                id="pickupPreference"
                value={values.pickupPreference}
                onChange={(e) => update("pickupPreference", e.target.value)}
              >
                <option value="REQUESTED">Yes, please check chauffeur availability</option>
                <option value="NOT_REQUESTED">No, I will travel by personal vehicle</option>
              </select>
            </div>
          </div>

          {values.pickupPreference === "REQUESTED" && (
            <div className="field-group field-span-2 pickup-highlight-field">
              <div className="pickup-banner-info">
                <span className="car-icon">🚗</span>
                <div>
                  <strong>Complimentary Doorstep Pickup Request</strong>
                  <p>Our chauffeur-driven sanitized vehicle will pick you up and drop you back safely.</p>
                </div>
              </div>
              <label htmlFor="pickupArea">
                Pickup Area or Nearby Landmark <span className="req">*</span>
              </label>
              <div className="input-wrap">
                <input
                  id="pickupArea"
                  value={values.pickupArea}
                  onChange={(e) => update("pickupArea", e.target.value)}
                  placeholder="e.g. Indiranagar, Jayanagar, Whitefield, JP Nagar"
                  required
                  maxLength={160}
                  aria-invalid={!!setFieldError("pickupArea")}
                />
              </div>
              <span className="field-micro-hint">
                Provide an approximate area or landmark. Specific pickup address will be coordinated privately.
              </span>
              {setFieldError("pickupArea") && (
                <span className="field-error-text" role="alert">{setFieldError("pickupArea")}</span>
              )}
            </div>
          )}

          <div className="field-group field-span-2">
            <label htmlFor="notes">
              Special Requests or Questions <span className="opt-tag">(Optional)</span>
            </label>
            <div className="input-wrap">
              <textarea
                id="notes"
                value={values.notes}
                onChange={(e) => update("notes", e.target.value)}
                rows={3}
                maxLength={1000}
                placeholder="Tell us about mobility needs (e.g. wheelchair assistance), questions on amenities, healthcare, or dietary preferences for tea/lunch."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Consent & Audit Trail */}
      <div className="consent-container">
        <label className="custom-checkbox-label">
          <input
            id="consentToContact"
            type="checkbox"
            checked={values.consentToContact}
            onChange={(e) => update("consentToContact", e.target.checked)}
            required
            aria-invalid={!!setFieldError("consentToContact")}
          />
          <span className="checkbox-custom" aria-hidden="true" />
          <span className="checkbox-label-text">
            I agree that <strong>Primus Life</strong> may contact me via Call, WhatsApp, or Email regarding this enquiry and site visit request. I have read and agree to the{" "}
            <a href={privacyUrl} target="_blank" rel="noreferrer" className="privacy-link">
              Primus Privacy Policy
            </a>. <span className="req">*</span>
          </span>
        </label>
        {setFieldError("consentToContact") && (
          <span className="field-error-text" role="alert">{setFieldError("consentToContact")}</span>
        )}
      </div>

      {/* Honeypot for bot mitigation (hidden from real users) */}
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="website">Leave this field blank</label>
        <input
          id="website"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={(e) => update("website", e.target.value)}
        />
      </div>

      {/* Submit Button */}
      <button 
        type="submit" 
        className="btn-primus btn-submit-visit" 
        disabled={submitting}
      >
        {submitting ? (
          <span className="btn-loading-flex">
            <span className="btn-mini-spinner" />
            Scheduling Your Visit…
          </span>
        ) : (
          <span className="btn-content-flex">
            <span>Request Complimentary Site Visit</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </span>
        )}
      </button>

      <p className="form-disclaimer-note">
        Submitting this request does not automatically guarantee visit scheduling or transport. Our concierge team will review availability and contact you directly to confirm.
      </p>
    </form>
  );
}
