"use client";

import { useState } from "react";

interface Pillar {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  icon: string;
  points: string[];
  quote: string;
}

const PILLARS: Pillar[] = [
  {
    id: "hospitality",
    number: "01",
    title: "5-Star Hospitality & Curated Dining",
    subtitle: "A life free from daily household chores and grocery runs",
    icon: "🍽️",
    points: [
      "Nutritionist-designed wholesome 3-course meals tailored for diabetic, hypertensive, and cardiac health",
      "Daily complete housekeeping, linen change, and sanitisation",
      "Personal concierge for medicine delivery, postal errands, and ticketing",
      "Special dietary stations: organic tea bar, fresh juices, and festive menus"
    ],
    quote: "“The dining experience here feels like a luxury resort, but tailored to our specific health needs.”"
  },
  {
    id: "healthcare",
    number: "02",
    title: "24x7 Proactive Healthcare & Emergency Care",
    subtitle: "Round-the-clock medical security with zero compromise",
    icon: "🩺",
    points: [
      "On-campus 24x7 doctor on call and licensed geriatric nurses",
      "Emergency pull-cords in bedrooms & bathrooms linked directly to the nursing station",
      "Dedicated on-site emergency vehicle & tied-up tertiary ICU hospital network",
      "Routine preventive health checkups, vitals monitoring, and physiotherapy sessions"
    ],
    quote: "“Knowing emergency help is reachable in under 3 minutes brings my children abroad complete peace of mind.”"
  },
  {
    id: "architecture",
    number: "03",
    title: "Intelligent Senior-Friendly Architecture",
    subtitle: "Ergonomically designed for safety, mobility, and dignity",
    icon: "🏡",
    points: [
      "100% zero-threshold flooring — zero steps or tripping hazards anywhere",
      "Broad, wheelchair-accessible doorways (min. 900mm) and continuous non-skid hallways",
      "Arthritis-friendly lever handles, anti-scald faucets, and soft-touch electrical switches",
      "Night-sensor floor lighting from bedside to bathroom for safe nocturnal movement"
    ],
    quote: "“Every single corner has been thought through — from the gentle slopes to the grip rails.”"
  },
  {
    id: "engagement",
    number: "04",
    title: "Active Engagement & Lifelong Learning",
    subtitle: "A vibrant social calendar that celebrates every single day",
    icon: "🎭",
    points: [
      "Over 100+ curated monthly activities: music evenings, book clubs, pottery, bridge tournaments",
      "Gentle morning yoga, pranayama, and aqua-aerobics in temperature-controlled pools",
      "Festive celebrations, family days, and intergenerational hobby workshops",
      "State-of-the-art community theater, reflexology parks, and cultural amphitheater"
    ],
    quote: "“I’ve made more close friends here in the past year than I did in the last twenty years.”"
  }
];

const FAQS = [
  {
    q: "Is the complimentary pickup and drop really free?",
    a: "Yes! For prospective residents and their families in Bangalore, Primus provides a complimentary sanitized, chauffeur-driven cab for your site visit. Availability is subject to your pickup area and scheduling, which our hospitality counselor confirms prior to your journey."
  },
  {
    q: "Can I bring my family members along for the site visit?",
    a: "Absolutely! We encourage children and spouses to accompany parents. A senior living home is a collective family decision, and experiencing the warm atmosphere, food, and facilities together helps everyone feel confident."
  },
  {
    q: "What happens during the 90-minute Olympia site visit?",
    a: "Your visit includes a personal welcome at the Clubhouse, an escorted golf-cart tour of the landscaped campus, a walkthrough of fully furnished 1 & 2 BHK model apartments, an inspection of the 24x7 healthcare hub, and complimentary tea/lunch prepared by our executive chef."
  },
  {
    q: "Is Primus Olympia wheelchair accessible?",
    a: "Yes, 100%. From the arrival porch and elevators to the residences, walking trails, and dining areas, there are zero steps or thresholds. Ramps and elevators are designed to international accessibility standards."
  },
  {
    q: "How does the pricing and ownership model work?",
    a: "Olympia offers both freehold ownership residences and long-term lease models with transparent monthly service charges covering 3 meals a day, housekeeping, 24x7 medical support, and clubhouse amenities. Our advisor will provide a comprehensive breakdown during your visit."
  }
];

export default function PrimusSections() {
  const [activePillar, setActivePillar] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeGalleryTab, setActiveGalleryTab] = useState<"exterior" | "lounge" | "residence">("exterior");

  return (
    <div className="primus-sections-wrapper">
      {/* 1. The Iconic Brand Philosophy Banner */}
      <section className="philosophy-strip" aria-label="Brand Philosophy">
        <div className="philosophy-container">
          <div className="philosophy-quote-mark" aria-hidden="true">“</div>
          <h2 className="philosophy-heading">
            What good is living long, if you don’t live well?
          </h2>
          <p className="philosophy-sub">
            At Primus Life, we believe ageing is a privilege, not a limitation. Olympia is crafted to give you complete freedom from chores, immediate access to healthcare, and an enriching community of peers.
          </p>
          <div className="philosophy-signature">
            <span className="sig-line" />
            <span className="sig-text">EXPERIENCE AGEING RIGHT · PRIMUS LIFE</span>
            <span className="sig-line" />
          </div>
        </div>
      </section>

      {/* 2. Visual Photo Showcase: Real Architectural Assets */}
      <section className="campus-gallery-section" id="residences-showcase" aria-label="Campus & Residences Showcase">
        <div className="section-head-center">
          <span className="pill-eyebrow">RESIDENCES & AMENITIES</span>
          <h2 className="section-title">Designed for Joy, Safety & Independence</h2>
          <p className="section-desc">
            Explore our model apartments, resort-style dining halls, and lush tropical courtyards in Bangalore.
          </p>
          
          {/* Gallery Switcher */}
          <div className="gallery-tabs" role="tablist">
            <button
              type="button"
              className={`gallery-tab-btn ${activeGalleryTab === "exterior" ? "active" : ""}`}
              onClick={() => setActiveGalleryTab("exterior")}
              role="tab"
              aria-selected={activeGalleryTab === "exterior"}
            >
              🌿 Campus & Gardens
            </button>
            <button
              type="button"
              className={`gallery-tab-btn ${activeGalleryTab === "lounge" ? "active" : ""}`}
              onClick={() => setActiveGalleryTab("lounge")}
              role="tab"
              aria-selected={activeGalleryTab === "lounge"}
            >
              🍷 Clubhouse & Dining
            </button>
            <button
              type="button"
              className={`gallery-tab-btn ${activeGalleryTab === "residence" ? "active" : ""}`}
              onClick={() => setActiveGalleryTab("residence")}
              role="tab"
              aria-selected={activeGalleryTab === "residence"}
            >
              🛌 Model Senior Apartments
            </button>
          </div>
        </div>

        {/* Gallery Visual Card */}
        <div className="gallery-display-card">
          {activeGalleryTab === "exterior" && (
            <div className="gallery-card-inner">
              <div className="image-frame">
                <img
                  src="/images/primus_olympia_hero.jpg"
                  alt="Primus Olympia Bangalore Exterior and Landscaped Gardens"
                  className="gallery-image"
                  loading="eager"
                />
                <div className="image-overlay-badge">
                  <span>Primus Olympia · Bangalore</span>
                </div>
              </div>
              <div className="gallery-card-details">
                <span className="detail-tag">EXTERIOR ARCHITECTURE</span>
                <h3>Resort-Style Tropical Campus</h3>
                <p>
                  Built with warm sandstone and surrounded by mature foliage, Olympia features continuous walking loops, reflexology trails, and outdoor gazebos where residents meet every evening.
                </p>
                <div className="spec-badges">
                  <span>🌳 70% Open Landscaped Greens</span>
                  <span>🚶‍♂️ Zero-Obstacle Walking Tracks</span>
                  <span>🏥 24x7 Medical Center On-Site</span>
                </div>
                <a href="#booking" className="btn-gallery-action">
                  Schedule a Visit to Walk This Trail →
                </a>
              </div>
            </div>
          )}

          {activeGalleryTab === "lounge" && (
            <div className="gallery-card-inner">
              <div className="image-frame">
                <img
                  src="/images/primus_olympia_lounge.jpg"
                  alt="Primus Olympia Luxury Dining Lounge and Clubhouse"
                  className="gallery-image"
                  loading="lazy"
                />
                <div className="image-overlay-badge">
                  <span>Grand Dining Lounge</span>
                </div>
              </div>
              <div className="gallery-card-details">
                <span className="detail-tag">HOSPITALITY & DINING</span>
                <h3>Chef-Curated Fine Dining & Social Hub</h3>
                <p>
                  No cooking, no kitchen stress. Enjoy nutritionally balanced breakfast, lunch, high tea, and dinner served in a grand vaulted-ceiling hall with table service and dietary personalisation.
                </p>
                <div className="spec-badges">
                  <span>🥗 Geriatric-Curated Nutrition</span>
                  <span>☕ Organic Tea & Coffee Bar</span>
                  <span>🎱 Indoor Games & Library</span>
                </div>
                <a href="#booking" className="btn-gallery-action">
                  Book a Visit & Enjoy a Trial Meal →
                </a>
              </div>
            </div>
          )}

          {activeGalleryTab === "residence" && (
            <div className="gallery-card-inner">
              <div className="image-frame">
                <img
                  src="/images/primus_olympia_apartment.jpg"
                  alt="Primus Olympia 1 and 2 BHK Elder Friendly Residence"
                  className="gallery-image"
                  loading="lazy"
                />
                <div className="image-overlay-badge">
                  <span>1 & 2 BHK Model Home</span>
                </div>
              </div>
              <div className="gallery-card-details">
                <span className="detail-tag">ELDER-CENTRIC RESIDENCES</span>
                <h3>Homes Designed for Lifetime Ease</h3>
                <p>
                  Generous natural light, slip-resistant timber flooring, anti-scald faucets, wide doors, and emergency pull-cords right next to your bed and shower for instant assistance.
                </p>
                <div className="spec-badges">
                  <span>🚪 900mm Wheelchair Doors</span>
                  <span>🚨 24x7 Smart Emergency Alert</span>
                  <span>🌿 Private Garden Balconies</span>
                </div>
                <a href="#booking" className="btn-gallery-action">
                  Experience the Model Flat in Person →
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 3. The Four Pillars of Primus Life */}
      <section className="pillars-section" aria-label="The Four Pillars of Primus">
        <div className="section-head-center">
          <span className="pill-eyebrow">OUR COMMITMENT</span>
          <h2 className="section-title">The Four Pillars of Ageing Right</h2>
          <p className="section-desc">
            A comprehensive senior living ecosystem bringing together hospitality, architecture, and emergency healthcare.
          </p>
        </div>

        <div className="pillars-container">
          {/* Pillar Navigation Pills */}
          <div className="pillar-nav-pills" role="tablist">
            {PILLARS.map((p, idx) => (
              <button
                key={p.id}
                type="button"
                className={`pillar-nav-pill ${activePillar === idx ? "active" : ""}`}
                onClick={() => setActivePillar(idx)}
                role="tab"
                aria-selected={activePillar === idx}
              >
                <span className="pill-num">{p.number}</span>
                <span className="pill-name">{p.title.split("&")[0]}</span>
              </button>
            ))}
          </div>

          {/* Active Pillar Card */}
          <div className="pillar-detail-card" role="tabpanel">
            <div className="pillar-content-grid">
              <div>
                <span className="pillar-badge">
                  PILLAR {PILLARS[activePillar].number}
                </span>
                <h3 className="pillar-headline">{PILLARS[activePillar].title}</h3>
                <p className="pillar-subheadline">{PILLARS[activePillar].subtitle}</p>

                <ul className="pillar-checklist">
                  {PILLARS[activePillar].points.map((pt, i) => (
                    <li key={i}>
                      <span className="check-gold">✓</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>

                <blockquote className="pillar-quote">
                  <p>{PILLARS[activePillar].quote}</p>
                </blockquote>
              </div>

              <div className="pillar-feature-side">
                <div className="pillar-highlight-box">
                  <h4>Why It Matters to You & Your Family</h4>
                  <p>
                    Unlike standard retirement homes that only offer real estate, Primus provides a fully managed hospitality and healthcare team committed to proactive wellbeing every hour of the day.
                  </p>
                  <div className="stat-grid">
                    <div className="stat-card">
                      <span className="stat-num">&lt;3 Min</span>
                      <span className="stat-label">Emergency response time on campus</span>
                    </div>
                    <div className="stat-card">
                      <span className="stat-num">100%</span>
                      <span className="stat-label">Zero-threshold elder-friendly design</span>
                    </div>
                  </div>
                  <a href="#booking" className="btn-pillar-cta">
                    Experience This During Your Visit →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. The 3-Step Guided Visit Process */}
      <section className="visit-process-section" aria-label="Visit Process">
        <div className="section-head-center">
          <span className="pill-eyebrow">YOUR JOURNEY</span>
          <h2 className="section-title">How Your Complimentary Visit Works</h2>
          <p className="section-desc">
            We make your visit effortless, comfortable, and unhurried.
          </p>
        </div>

        <div className="process-cards-grid">
          <div className="process-card">
            <span className="card-number">01</span>
            <div className="process-icon-wrap">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#821a52" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <h4>Request Your Preferred Time</h4>
            <p>
              Choose your ideal date and time window. Share any special requests such as wheelchair assistance or mobility support.
            </p>
            <span className="process-tag">Step 1</span>
          </div>

          <div className="process-card highlighted">
            <span className="card-number">02</span>
            <div className="process-icon-wrap">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#821a52" strokeWidth="2">
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1 .4-1 1v7c0 .6.4 1 1 1h2"/>
                <circle cx="7" cy="17" r="2"/>
                <path d="M9 17h6"/>
                <circle cx="17" cy="17" r="2"/>
              </svg>
            </div>
            <h4>Complimentary Chauffeur Pickup</h4>
            <p>
              Avoid Bangalore traffic hassle. Our sanitized, AC vehicle picks you and your family up from your doorstep and drops you back.
            </p>
            <span className="process-tag gold">Subject to Confirmation</span>
          </div>

          <div className="process-card">
            <span className="card-number">03</span>
            <div className="process-icon-wrap">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#821a52" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <h4>90-Min Tour & Chef Lunch</h4>
            <p>
              Meet our senior care advisors, explore furnished model residences, test the panic call system, and enjoy a delicious meal.
            </p>
            <span className="process-tag">No Purchase Pressure</span>
          </div>
        </div>
      </section>

      {/* 5. Resident & Family Stories */}
      <section className="testimonials-section" aria-label="Resident Testimonials">
        <div className="section-head-center">
          <span className="pill-eyebrow">VOICES OF PRIMUS</span>
          <h2 className="section-title">Loved by Seniors. Trusted by Children.</h2>
          <p className="section-desc">
            Hear from families who found the perfect balance of independence, active community, and medical security.
          </p>
        </div>

        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="stars">★★★★★</div>
            <p className="testimonial-text">
              “Moving my parents to Primus Olympia was the best decision we ever made. Living in the US, I used to worry constantly about emergency care and daily groceries. Now my parents have a full social calendar and doctors on call 24x7.”
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">AK</div>
              <div>
                <strong>Anand & Priya Krishnan</strong>
                <small>Children of Olympia Residents, California</small>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="stars">★★★★★</div>
            <p className="testimonial-text">
              “I thought I would miss my old independent house, but the freedom here is unmatched. No maid problems, no cooking worries, and I spend my mornings in the reflexology garden with friends who share my passions.”
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">SM</div>
              <div>
                <strong>Col. Suresh Menon (Retd.)</strong>
                <small>Resident, Primus Life</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Frequently Asked Questions */}
      <section className="faq-section" aria-label="Frequently Asked Questions">
        <div className="section-head-center">
          <span className="pill-eyebrow">CLEAR ANSWERS</span>
          <h2 className="section-title">Everything You Need to Know Before Visiting</h2>
          <p className="section-desc">
            Transparent answers to the questions families ask most often.
          </p>
        </div>

        <div className="faq-container">
          {FAQS.map((faq, idx) => (
            <div key={idx} className={`faq-item ${openFaq === idx ? "open" : ""}`}>
              <button
                type="button"
                className="faq-question"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                aria-expanded={openFaq === idx}
              >
                <span>{faq.q}</span>
                <span className="faq-toggle-icon">{openFaq === idx ? "−" : "+"}</span>
              </button>
              {openFaq === idx && (
                <div className="faq-answer">
                  <p>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Floating Concierge Dock (Call & WhatsApp) */}
      <div className="floating-concierge-dock" aria-label="Quick contact actions">
        <a
          href="https://api.whatsapp.com/send?phone=+919845037078&text=Hi%20Primus%20Life,%20I%20am%20interested%20in%20a%20site%20visit%20to%20Olympia%20Bangalore"
          target="_blank"
          rel="noreferrer"
          className="concierge-btn whatsapp-btn"
          aria-label="Chat with Primus on WhatsApp"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
          </svg>
          <span className="btn-label">WhatsApp</span>
        </a>

        <a
          href="tel:1800121411111"
          className="concierge-btn call-btn"
          aria-label="Call Toll-Free 1800 121 4111"
        >
          <span className="pulse-ring" />
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
          <span className="btn-label">1800 121 4111</span>
        </a>
      </div>
    </div>
  );
}
