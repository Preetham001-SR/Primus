import PrimusHeader from "@/components/PrimusHeader";
import Olympia3DExperience from "@/components/Olympia3DExperience";
import PrimusSections from "@/components/PrimusSections";
import BookingForm from "@/components/BookingForm";

export default function HomePage() {
  return (
    <div className="primus-page-wrapper">
      <PrimusHeader />

      <main id="main-content">
        {/* Luxury Hero Section */}
        <section className="primus-hero-section" aria-label="Welcome to Primus Olympia">
          <div className="hero-content-grid">
            <div className="hero-copy-column">
              <div className="hero-badge">
                <span className="badge-spark">✦</span>
                <span>PRIMUS OLYMPIA · KANAKAPURA ROAD, BANGALORE</span>
              </div>

              <h1 className="hero-main-title">
                What good is living long, if you don’t live well?
              </h1>

              <p className="hero-lead-text">
                Welcome to <strong>Primus Olympia</strong> — Bangalore’s premier senior living community where independence meets 24x7 medical security, chef-curated nutrition, and an enriching social calendar of peers.
              </p>

              {/* Complimentary Pickup Benefit Callout */}
              <div className="hero-perk-card">
                <div className="perk-icon-circle" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#821a52" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1 .4-1 1v7c0 .6.4 1 1 1h2"/>
                    <circle cx="7" cy="17" r="2"/>
                    <path d="M9 17h6"/>
                    <circle cx="17" cy="17" r="2"/>
                  </svg>
                </div>
                <div className="perk-text">
                  <strong>Complimentary Doorstep Chauffeur Pickup & Drop</strong>
                  <small>
                    Travel stress-free. Chauffeur service across Bangalore is subject to location, schedule, and team confirmation.
                  </small>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="hero-action-buttons">
                <a href="#booking" className="btn-primus btn-hero-cta">
                  <span>Schedule Free Site Visit</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
                <a href="#experience-3d" className="btn-primus btn-hero-secondary">
                  <span>Explore 3D Campus</span>
                  <span className="gold-arrow">↓</span>
                </a>
              </div>

              <div className="hero-trust-strip">
                <div className="trust-item">
                  <span className="trust-check">✓</span>
                  <span>1 & 2 BHK Residences</span>
                </div>
                <div className="trust-item">
                  <span className="trust-check">✓</span>
                  <span>24x7 Medical & Care Hub</span>
                </div>
                <div className="trust-item">
                  <span className="trust-check">✓</span>
                  <span>RERA Approved</span>
                </div>
              </div>
            </div>

            {/* Hero Image Showcase */}
            <div className="hero-visual-column">
              <div className="hero-image-wrapper">
                <img
                  src="/images/primus_olympia_hero.jpg"
                  alt="Primus Olympia Bangalore Senior Living Resort Residences and Landscaped Gardens"
                  className="hero-image"
                  loading="eager"
                />
                <div className="hero-floating-badge top-left">
                  <span className="pulse-circle" />
                  <span>24x7 On-Campus Healthcare Hub</span>
                </div>
                <div className="hero-floating-badge bottom-right">
                  <span className="gold-star">★</span>
                  <span>5-Star Hospitality & Dining</span>
                </div>
                <div className="hero-caption-card">
                  <strong>Primus Olympia · Bangalore</strong>
                  <span>Active Senior Living Residences on Kanakapura Road</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Value Strip */}
        <section className="primus-metric-strip" aria-label="Key Community Metrics">
          <div className="metric-item">
            <span className="metric-number">24x7</span>
            <span className="metric-label">Doctors & Geriatric Nurses On Campus</span>
          </div>
          <div className="metric-divider" />
          <div className="metric-item">
            <span className="metric-number">100%</span>
            <span className="metric-label">Zero-Threshold Non-Slip Flooring</span>
          </div>
          <div className="metric-divider" />
          <div className="metric-item">
            <span className="metric-number">100+</span>
            <span className="metric-label">Curated Events, Clubs & Activities Every Month</span>
          </div>
          <div className="metric-divider" />
          <div className="metric-item">
            <span className="metric-number">Complimentary</span>
            <span className="metric-label">Chauffeur Driven Site Visit Travel</span>
          </div>
        </section>

        {/* 3D Web Experience Section */}
        <section className="section-3d-wrapper" aria-label="Interactive 3D Virtual Tour">
          <Olympia3DExperience />
        </section>

        {/* Primus Philosophy, Amenities & Pillars */}
        <PrimusSections />

        {/* Booking Form Section */}
        <section className="booking-anchor-section" id="booking" aria-label="Site Visit Booking Form">
          <div className="booking-layout-grid">
            {/* Left Intro Column */}
            <div className="booking-intro-column">
              <span className="pill-eyebrow">YOUR VISIT, YOUR WAY</span>
              <h2 className="booking-section-title">
                Experience Olympia In Person
              </h2>
              <p className="booking-section-lead">
                A site visit is the single best way to feel the warmth, meet our healthcare team, taste our chef’s cuisine, and see how our elder-friendly architecture supports effortless daily living.
              </p>

              <div className="visit-guarantee-card">
                <h4>What you can expect on your visit:</h4>
                <ul className="guarantee-list">
                  <li>
                    <span className="list-icon">🚗</span>
                    <div>
                      <strong>Doorstep Pickup & Return:</strong>
                      <small>Our chauffeur drives you comfortably to and from Olympia.</small>
                    </div>
                  </li>
                  <li>
                    <span className="list-icon">🤝</span>
                    <div>
                      <strong>Private Care Consultation:</strong>
                      <small>Unrushed 1-on-1 walkthrough with a Senior Living Care Counselor.</small>
                    </div>
                  </li>
                  <li>
                    <span className="list-icon">🍽️</span>
                    <div>
                      <strong>Complimentary Trial Meal:</strong>
                      <small>Taste the healthy, flavorful 3-course dining prepared for residents.</small>
                    </div>
                  </li>
                  <li>
                    <span className="list-icon">🛡️</span>
                    <div>
                      <strong>Zero Sales Pressure:</strong>
                      <small>No aggressive sales calls. Take all the time your family needs.</small>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="contact-quick-card">
                <span className="card-label">Prefer to speak to someone right now?</span>
                <p>Call our senior living advisory team directly:</p>
                <a href="tel:1800121411111" className="phone-link">
                  📞 1800 121 4111 (Toll-Free, 9 AM – 7 PM)
                </a>
              </div>
            </div>

            {/* Right Form Column */}
            <div className="booking-form-column">
              <BookingForm />
            </div>
          </div>
        </section>
      </main>

      {/* Primus Corporate Footer */}
      <footer className="primus-footer" aria-label="Primus Life Site Footer">
        <div className="footer-top-grid">
          <div className="footer-brand-col">
            <div className="footer-logo">
              <span className="footer-emblem-text">PRIMUS</span>
              <span className="footer-tagline">SENIOR LIVING</span>
            </div>
            <p className="footer-about">
              Primus Life is pioneer in luxury multigenerational and senior living communities across India. Homes thoughtfully crafted with 5-star hospitality, intelligent architecture, and 24x7 proactive healthcare.
            </p>
            <div className="rera-badge">
              <span>PRM/KA/RERA/1251/310/PR/210319/004024</span>
            </div>
          </div>

          <div className="footer-links-col">
            <h5>Our Communities</h5>
            <ul>
              <li><a href="#experience-3d">Primus Olympia (Bangalore)</a></li>
              <li><a href="https://www.primuslife.in/bangalore/sangama/">Primus Sangama (Bangalore)</a></li>
              <li><a href="https://www.primuslife.in/bangalore/reflection/">Primus Reflection (Bangalore)</a></li>
              <li><a href="https://www.primuslife.in/chennai/zion/">Primus Zion (Chennai)</a></li>
              <li><a href="https://www.primuslife.in/mumbai/dosti/">Primus Dosti (Mumbai)</a></li>
              <li><a href="https://www.primuslife.in/hyderabad/suvasa/">Primus Suvasa (Hyderabad)</a></li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h5>The Primus Lifestyle</h5>
            <ul>
              <li><a href="https://www.primuslife.in/the-primus-lifestyle/">Hospitality & Dining</a></li>
              <li><a href="https://www.primuslife.in/the-primus-lifestyle/">Proactive Healthcare</a></li>
              <li><a href="https://www.primuslife.in/homes-reimagined/">Age-Friendly Architecture</a></li>
              <li><a href="https://www.primuslife.in/about/">About Primus</a></li>
              <li><a href="https://www.primuslife.in/blog/">Senior Living Insights & Blog</a></li>
              <li><a href="https://www.primuslife.in/privacy-policy/">Privacy Policy</a></li>
            </ul>
          </div>

          <div className="footer-contact-col">
            <h5>Get in Touch</h5>
            <p className="contact-line">
              <strong>Olympia Campus:</strong><br />
              Kanakapura Main Road, Near Art of Living International Center, Bangalore 560082
            </p>
            <p className="contact-line">
              <strong>Toll-Free Helpline:</strong><br />
              <a href="tel:1800121411111" className="footer-phone">1800 121 4111</a>
            </p>
            <p className="contact-line">
              <strong>Email:</strong><br />
              <a href="mailto:enquiry@primuslife.in" className="footer-email">enquiry@primuslife.in</a>
            </p>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <div className="footer-legal-text">
            <span>© {new Date().getFullYear()} Primus Lifespaces Pvt. Ltd. All rights reserved.</span>
            <span>Site visit requests and complimentary transport are subject to verification and scheduling confirmation by our team.</span>
          </div>
          <div className="footer-social-icons">
            <a href="https://www.instagram.com/primus_senior_living/" target="_blank" rel="noreferrer" aria-label="Instagram">Instagram</a>
            <span className="dot">·</span>
            <a href="https://www.facebook.com/Primuslife/" target="_blank" rel="noreferrer" aria-label="Facebook">Facebook</a>
            <span className="dot">·</span>
            <a href="https://www.linkedin.com/company/primus-lifespaces-pvt-ltd/" target="_blank" rel="noreferrer" aria-label="LinkedIn">LinkedIn</a>
            <span className="dot">·</span>
            <a href="https://www.youtube.com/channel/UCageO03oYBpuAfQpLePCRuw" target="_blank" rel="noreferrer" aria-label="YouTube">YouTube</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
