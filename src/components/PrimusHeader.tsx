"use client";

import { useState, useEffect, useRef } from "react";

export default function PrimusHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [projectsDropdownOpen, setProjectsDropdownOpen] = useState(false);

  const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setProjectsDropdownOpen(false);
        setEnquiryOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setProjectsDropdownOpen(false);
        setEnquiryOpen(false);
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const closeAllMenus = () => {
    setProjectsDropdownOpen(false);
    setEnquiryOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <header ref={headerRef} className={`primus-navbar-wrapper ${scrolled ? "scrolled" : ""}`}>
      {/* Top emergency / toll-free strip */}
      <div className="primus-topstrip">
        <div className="topstrip-inner">
          <div className="strip-item">
            <span className="strip-badge">SENIOR LIVING</span>
            <span className="strip-text">Homes Reimagined for Elder Wellness & Independent Living</span>
          </div>
          <div className="strip-actions">
            <a href="tel:1800121411111" className="strip-link" aria-label="Call Toll-Free 1800 121 4111">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              Toll-Free: <strong>1800 121 4111</strong>
            </a>
            <span className="strip-divider" aria-hidden="true">·</span>
            <a 
              href="https://api.whatsapp.com/send?phone=+919845037078&text=Hi%20Primus%20Life,%20I%20would%20like%20to%20know%20more%20about%20Olympia%20Bangalore" 
              target="_blank" 
              rel="noreferrer" 
              className="strip-link strip-whatsapp"
              aria-label="WhatsApp with Primus Senior Living"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
              </svg>
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <nav className="primus-nav" aria-label="Main Navigation">
        <div className="nav-container">
          {/* Logo brand */}
          <a href="https://www.primuslife.in/" className="primus-brand" aria-label="Primus Senior Living Homepage">
            <div className="primus-lotus-emblem" aria-hidden="true">
              <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="emblem-svg">
                <circle cx="20" cy="20" r="19" stroke="#821a52" strokeWidth="1.5" fill="#fdfaf7" />
                <path d="M20 7 C20 15, 12 18, 12 24 C12 28, 15 31, 20 31 C25 31, 28 28, 28 24 C28 18, 20 15, 20 7 Z" fill="#821a52" />
                <path d="M20 12 C18 17, 8 20, 8 24 C8 27, 11 29, 15 29 C18 29, 20 26, 20 21 Z" fill="#c5a880" opacity="0.9" />
                <path d="M20 12 C22 17, 32 20, 32 24 C32 27, 29 29, 25 29 C22 29, 20 26, 20 21 Z" fill="#c5a880" opacity="0.9" />
                <circle cx="20" cy="20" r="3" fill="#ffffff" />
              </svg>
            </div>
            <div className="brand-text-block">
              <span className="brand-title">PRIMUS</span>
              <span className="brand-subtitle">SENIOR LIVING</span>
            </div>
            <div className="project-badge">
              <span className="badge-bullet" aria-hidden="true" />
              <span>OLYMPIA · BANGALORE</span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <div className="nav-links-desktop">
            <a href="https://www.primuslife.in/" className="nav-link">Home</a>
            <a href="https://www.primuslife.in/about/" className="nav-link">About Us</a>
            
            {/* Communities Dropdown */}
            <div 
              className="nav-item-dropdown"
              onMouseEnter={() => setProjectsDropdownOpen(true)}
              onMouseLeave={() => setProjectsDropdownOpen(false)}
            >
              <button 
                type="button" 
                className="nav-link dropdown-trigger"
                onClick={() => setProjectsDropdownOpen((prev) => !prev)}
                aria-expanded={projectsDropdownOpen}
                aria-haspopup="true"
              >
                <span>Our Communities</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`chevron ${projectsDropdownOpen ? "open" : ""}`} aria-hidden="true">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </button>

              {projectsDropdownOpen && (
                <div className="dropdown-panel" role="menu">
                  <div className="dropdown-city">
                    <span className="city-title">Bangalore</span>
                    <a href="#experience-3d" className="dropdown-link highlight" role="menuitem" onClick={() => setProjectsDropdownOpen(false)}>
                      <strong>Primus Olympia</strong>
                      <small>Kanakapura Road · Active Senior Living</small>
                    </a>
                    <a href="https://www.primuslife.in/bangalore/sangama/" className="dropdown-link" role="menuitem" onClick={() => setProjectsDropdownOpen(false)}>Primus Sangama</a>
                    <a href="https://www.primuslife.in/bangalore/reflection/" className="dropdown-link" role="menuitem" onClick={() => setProjectsDropdownOpen(false)}>Primus Reflection</a>
                    <a href="https://www.primuslife.in/bangalore/ohana/" className="dropdown-link" role="menuitem" onClick={() => setProjectsDropdownOpen(false)}>Primus Ohana</a>
                  </div>
                  <div className="dropdown-city">
                    <span className="city-title">Other Cities</span>
                    <a href="https://www.primuslife.in/chennai/zion/" className="dropdown-link" role="menuitem" onClick={() => setProjectsDropdownOpen(false)}>Chennai · Primus Zion</a>
                    <a href="https://www.primuslife.in/mumbai/dosti/" className="dropdown-link" role="menuitem" onClick={() => setProjectsDropdownOpen(false)}>Mumbai · Primus Dosti</a>
                    <a href="https://www.primuslife.in/hyderabad/suvasa/" className="dropdown-link" role="menuitem" onClick={() => setProjectsDropdownOpen(false)}>Hyderabad · Primus Suvasa</a>
                    <a href="https://www.primuslife.in/kolkata/ganges/" className="dropdown-link" role="menuitem" onClick={() => setProjectsDropdownOpen(false)}>Kolkata · Primus Ganges</a>
                  </div>
                </div>
              )}
            </div>

            <a href="https://www.primuslife.in/the-primus-lifestyle/" className="nav-link">The Primus Lifestyle</a>
            <a href="https://www.primuslife.in/homes-reimagined/" className="nav-link">Homes Reimagined</a>
            <a href="#experience-3d" className="nav-link nav-link-3d" onClick={() => closeAllMenus()}>
              <span className="pulse-dot" aria-hidden="true" />
              <span>3D Tour</span>
            </a>

            {/* Quick Enquiry CTA Dropdown */}
            <div className="enquiry-box">
              <button 
                type="button" 
                className="btn-enquiry"
                onClick={() => setEnquiryOpen((prev) => !prev)}
                aria-expanded={enquiryOpen}
                aria-haspopup="true"
              >
                <span>ENQUIRY</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`chevron ${enquiryOpen ? "open" : ""}`} aria-hidden="true">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </button>

              {enquiryOpen && (
                <div className="enquiry-dropdown-panel" role="menu">
                  <a href="tel:1800121411111" className="enquiry-item" role="menuitem" onClick={() => setEnquiryOpen(false)}>
                    <span className="icon-badge">📞</span>
                    <div>
                      <strong>Toll-Free Call</strong>
                      <small>1800 121 4111 (Mon-Sun 9AM–7PM)</small>
                    </div>
                  </a>
                  <a 
                    href="https://api.whatsapp.com/send?phone=+919845037078&text=Hi%20Primus%20Life,%20I%20would%20like%20to%20know%20more%20about%20Olympia%20Bangalore" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="enquiry-item" 
                    role="menuitem"
                    onClick={() => setEnquiryOpen(false)}
                  >
                    <span className="icon-badge">💬</span>
                    <div>
                      <strong>WhatsApp Chat</strong>
                      <small>Instant response from Senior Advisor</small>
                    </div>
                  </a>
                  <a href="mailto:enquiry@primuslife.in" className="enquiry-item" role="menuitem" onClick={() => setEnquiryOpen(false)}>
                    <span className="icon-badge">✉️</span>
                    <div>
                      <strong>Email Enquiry</strong>
                      <small>enquiry@primuslife.in</small>
                    </div>
                  </a>
                  <a href="#booking" className="enquiry-item featured" onClick={() => setEnquiryOpen(false)} role="menuitem">
                    <span className="icon-badge">🗓️</span>
                    <div>
                      <strong>Book Free Site Visit</strong>
                      <small>Includes Complimentary Chauffeur</small>
                    </div>
                  </a>
                </div>
              )}
            </div>

            <a href="#booking" className="btn-book-nav" onClick={() => closeAllMenus()}>
              Book Site Visit
            </a>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            className="mobile-hamburger"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
          >
            <span className={`bar ${mobileMenuOpen ? "open" : ""}`} />
            <span className={`bar ${mobileMenuOpen ? "open" : ""}`} />
            <span className={`bar ${mobileMenuOpen ? "open" : ""}`} />
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="mobile-drawer" role="dialog" aria-modal="true" aria-label="Mobile Navigation">
            <div className="mobile-drawer-inner">
              <div className="mobile-badge-strip">
                <span>PRIMUS OLYMPIA · BANGALORE</span>
              </div>
              <a href="https://www.primuslife.in/" className="mobile-link" onClick={() => closeAllMenus()}>Home</a>
              <a href="https://www.primuslife.in/about/" className="mobile-link" onClick={() => closeAllMenus()}>About Us</a>
              <a href="#experience-3d" className="mobile-link highlight-3d" onClick={() => closeAllMenus()}>
                ✨ Explore Campus in 3D
              </a>
              <a href="https://www.primuslife.in/the-primus-lifestyle/" className="mobile-link" onClick={() => closeAllMenus()}>The Primus Lifestyle</a>
              <a href="https://www.primuslife.in/homes-reimagined/" className="mobile-link" onClick={() => closeAllMenus()}>Homes Reimagined</a>
              <a href="#residences-showcase" className="mobile-link" onClick={() => closeAllMenus()}>1 & 2 BHK Residences</a>
              <a href="#booking" className="mobile-link cta" onClick={() => closeAllMenus()}>
                Book Free Site Visit →
              </a>

              <div className="mobile-contact-card">
                <span className="contact-card-title">Senior Concierge Helpdesk</span>
                <a href="tel:1800121411111" className="mobile-call-btn">
                  📞 Call Toll-Free: 1800 121 4111
                </a>
                <a 
                  href="https://api.whatsapp.com/send?phone=+919845037078&text=Hi%20Primus" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="mobile-wa-btn"
                >
                  💬 Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
