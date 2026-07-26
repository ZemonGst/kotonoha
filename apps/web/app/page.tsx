'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import './landing.css'
import { Logo } from '~/components/ui/Logo'

// ── Icons (inline SVGs to avoid lucide tree-shake issues on a static page) ──
function IconGrip() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="12" r="1"/><circle cx="9" cy="5" r="1"/><circle cx="9" cy="19" r="1"/>
      <circle cx="15" cy="12" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="19" r="1"/>
    </svg>
  )
}
function IconBranch() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/>
      <path d="M18 9a9 9 0 01-9 9"/>
    </svg>
  )
}
function IconBar() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  )
}
function IconSend() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  )
}
function IconDownload() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  )
}
function IconQr() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/>
      <path d="M14 14h3v3h-3zM17 17h3v3h-3z"/>
    </svg>
  )
}
function IconArrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="12 5 19 12 12 19"/>
    </svg>
  )
}
function IconChevronDown() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  )
}
function IconCheck() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  )
}
function IconStar() {
  return <span style={{ color: '#f59e0b', fontSize: 18 }}>★</span>
}

// ── Feature card data ────────────────────────────────────────────────────────
const features = [
  {
    icon: <IconGrip />,
    title: 'Drag & Drop Builder',
    desc: 'Build any form visually with our fluid drag-and-drop canvas. No code, no friction, just flow.',
  },
  {
    icon: <IconBranch />,
    title: 'Conditional Logic',
    desc: 'Dynamically show or hide fields based on user answers. Create smart, branching forms.',
  },
  {
    icon: <IconBar />,
    title: 'Real-Time Analytics',
    desc: 'Track response trends, top-performing forms, and key metrics from a beautiful dashboard.',
  },
  {
    icon: <IconSend />,
    title: 'Instant Publishing',
    desc: 'One click to go live. Set an optional expiry date and share your form with the world.',
  },
  {
    icon: <IconDownload />,
    title: 'CSV Export',
    desc: 'Export all your responses to a spreadsheet-ready CSV file with a single click.',
  },
  {
    icon: <IconQr />,
    title: 'QR Code Sharing',
    desc: 'Every published form automatically gets a scannable QR code for offline sharing.',
  },
]

// ── Field types list ─────────────────────────────────────────────────────────
const fieldTypes = [
  { label: 'Short Text', icon: 'T' },
  { label: 'Long Text', icon: '¶' },
  { label: 'Number', icon: '#' },
  { label: 'Email', icon: '@' },
  { label: 'Phone', icon: '✆' },
  { label: 'Select', icon: '⌄' },
  { label: 'Radio', icon: '◉' },
  { label: 'Checkbox', icon: '☑' },
  { label: 'Yes / No', icon: '⇄' },
  { label: 'Date', icon: '📅' },
  { label: 'Time', icon: '⏰' },
  { label: 'Rating', icon: '★' },
  { label: 'Password', icon: '🔒' },
  { label: 'Date & Time', icon: '📆' },
]

// ── Steps ────────────────────────────────────────────────────────────────────
const steps = [
  {
    number: '1',
    title: 'Create Your Form',
    desc: 'Name your form, then drag and drop fields onto the canvas. Add logic, styling, and custom labels.',
  },
  {
    number: '2',
    title: 'Publish & Share',
    desc: 'Hit Publish to go live instantly. Copy the shareable link or scan the auto-generated QR code.',
  },
  {
    number: '3',
    title: 'Collect Responses',
    desc: 'Watch responses roll in on your analytics dashboard. Export as CSV anytime.',
  },
]

// ── Main Landing Page Component ──────────────────────────────────────────────
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)

  // Navbar scroll effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Scroll reveal with IntersectionObserver
  useEffect(() => {
    const els = document.querySelectorAll('.lp-reveal')
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <div className="lp-root">
      {/* Background layers */}
      <div className="lp-stars" aria-hidden="true" />
      <div className="lp-noise" aria-hidden="true" />
      <div className="lp-glow-top-right" aria-hidden="true" />
      <div className="lp-glow-bottom-left" aria-hidden="true" />

      {/* ── Navbar ───────────────────────────────────────── */}
      <nav className={`lp-nav${scrolled ? ' scrolled' : ''}`}>
        <Link href="/" className="lp-nav-logo">
          <Logo iconSize={34} textSize={19} />
        </Link>
        <div className="lp-nav-links">
          <Link href="/login" className="lp-btn-ghost">Sign In</Link>
          <Link href="/sign-up" className="lp-btn-red">
            Get Started Free <IconArrow />
          </Link>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="lp-hero">
        <div className="lp-hero-badge">
          <span className="lp-section-label-dot" />
          Form builder, reimagined
        </div>

        <h1 className="lp-hero-title">
          Build Beautiful Forms,<br />
          <span className="lp-hero-title-accent">Collect Powerful Responses</span>
        </h1>

        <p className="lp-hero-sub">
          The form builder that feels like magic. Drag, drop, publish, and watch responses pour in — no code required.
        </p>

        <div className="lp-hero-ctas">
          <Link href="/sign-up" className="lp-btn-red lp-btn-red-lg">
            Create Your First Form <IconArrow />
          </Link>
          <a href="#how-it-works" className="lp-btn-outline-lg">
            See How It Works
          </a>
        </div>

        {/* Animated Form Builder Preview */}
        <div className="lp-hero-demo">
          <div className="lp-demo-card">
            {/* Mock topbar */}
            <div className="lp-demo-topbar">
              <div className="lp-demo-dot" style={{ background: '#ff5f57' }} />
              <div className="lp-demo-dot" style={{ background: '#febc2e' }} />
              <div className="lp-demo-dot" style={{ background: '#28c840' }} />
              <span className="lp-demo-topbar-title">Customer Feedback Survey</span>
              <div className="lp-demo-topbar-right">
                <span className="lp-demo-topbar-btn" style={{ background: 'rgba(217,48,37,0.1)', color: '#D93025', border: '1px solid rgba(217,48,37,0.2)' }}>Preview</span>
                <span className="lp-demo-topbar-btn" style={{ background: '#D93025', color: '#fff' }}>Publish</span>
              </div>
            </div>

            {/* Builder body */}
            <div className="lp-demo-body">
              {/* Sidebar field types */}
              <div className="lp-demo-sidebar">
                <div className="lp-demo-sidebar-label">Field Types</div>
                {['Short Text', 'Long Text', 'Email', 'Rating', 'Select', 'Checkbox'].map((label, i) => (
                  <div key={i} className="lp-demo-field-chip">
                    <div className="lp-demo-field-icon" style={{ color: '#8B8FA8' }}>
                      {['T', '¶', '@', '★', '⌄', '☑'][i]}
                    </div>
                    {label}
                  </div>
                ))}
              </div>

              {/* Canvas */}
              <div className="lp-demo-canvas">
                {/* Field 1 — Short Text */}
                <div className="lp-canvas-field lp-selected">
                  <div className="lp-canvas-field-label">
                    Full Name <span className="lp-canvas-field-required">*</span>
                  </div>
                  <div className="lp-canvas-field-input" style={{ display: 'flex', alignItems: 'center', color: '#4A4D65', fontSize: 13 }}>
                    Enter your full name...
                  </div>
                </div>

                {/* Field 2 — Email */}
                <div className="lp-canvas-field">
                  <div className="lp-canvas-field-label">
                    Email Address <span className="lp-canvas-field-required">*</span>
                  </div>
                  <div className="lp-canvas-field-input" style={{ display: 'flex', alignItems: 'center', color: '#4A4D65', fontSize: 13 }}>
                    Enter your email...
                  </div>
                </div>

                {/* Field 3 — Select */}
                <div className="lp-canvas-field">
                  <div className="lp-canvas-field-label">How did you hear about us?</div>
                  <div className="lp-canvas-field-input" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#4A4D65', fontSize: 13 }}>
                    <span>Select an option...</span>
                    <IconChevronDown />
                  </div>
                </div>

                {/* Field 4 — Rating */}
                <div className="lp-canvas-field">
                  <div className="lp-canvas-field-label">How would you rate us?</div>
                  <div className="lp-stars-row">
                    {[1,2,3,4,5].map((s) => (
                      <span key={s} className="lp-star">★</span>
                    ))}
                  </div>
                </div>

                {/* Submit button */}
                <button className="lp-canvas-submit">Submit Form</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────── */}
      <section className="lp-section" id="features">
        <div className="lp-reveal">
          <div className="lp-section-label">
            <span className="lp-section-label-dot" />
            Features
          </div>
          <h2 className="lp-section-title">Everything you need,<br />nothing you don't</h2>
          <p className="lp-section-sub">
            Kotonoha combines a powerful form builder with smart analytics and effortless sharing tools — all in one beautifully designed platform.
          </p>
        </div>

        <div className="lp-features-grid">
          {features.map((f, i) => (
            <div key={i} className={`lp-feature-card lp-reveal lp-reveal-delay-${(i % 3) + 1}`}>
              <div className="lp-feature-icon-box" style={{ color: '#D93025' }}>
                {f.icon}
              </div>
              <div>
                <div className="lp-feature-title">{f.title}</div>
                <p className="lp-feature-desc">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="lp-divider" />

      {/* ── Interactive Demo Section ──────────────────────── */}
      <section className="lp-section" id="demo">
        <div className="lp-demo-section-grid">
          {/* Left: copy + field types */}
          <div className="lp-reveal">
            <div className="lp-section-label">
              <span className="lp-section-label-dot" />
              14 Field Types
            </div>
            <h2 className="lp-section-title">Every field type<br />you'll ever need</h2>
            <p className="lp-section-sub" style={{ marginBottom: 0 }}>
              From simple text inputs to star ratings and conditional branches — Kotonoha has every field type to build the perfect form.
            </p>
            <div className="lp-field-type-list">
              {fieldTypes.map((ft, i) => (
                <div key={i} className="lp-field-type-chip">
                  <div className="lp-field-type-chip-icon" style={{ color: '#D93025' }}>
                    <span style={{ fontSize: 13 }}>{ft.icon}</span>
                  </div>
                  <span>{ft.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: mini form mockup */}
          <div className="lp-reveal lp-reveal-delay-2">
            <div className="lp-demo-card" style={{ animation: 'none' }}>
              <div className="lp-demo-topbar">
                <div className="lp-demo-dot" style={{ background: '#ff5f57' }} />
                <div className="lp-demo-dot" style={{ background: '#febc2e' }} />
                <div className="lp-demo-dot" style={{ background: '#28c840' }} />
                <span className="lp-demo-topbar-title">Event Registration</span>
                <div className="lp-demo-topbar-right">
                  <span className="lp-demo-topbar-btn" style={{ background: 'rgba(217,48,37,0.1)', color: '#D93025', border: '1px solid rgba(217,48,37,0.2)' }}>
                    <span style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#D93025', display: 'inline-block' }} />
                      Live
                    </span>
                  </span>
                </div>
              </div>
              <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Simulated filled-in form */}
                {[
                  { label: 'Full Name', value: 'Soumyaditya Sinha', type: 'text' },
                  { label: 'Email Address', value: 'soumyaditya@gmail.com', type: 'email' },
                  { label: 'Event Date Preference', value: '2025-08-15', type: 'date' },
                ].map((field, i) => (
                  <div key={i}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#8B8FA8', marginBottom: 6 }}>{field.label}</div>
                    <div style={{
                      height: 36,
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 7,
                      padding: '0 12px',
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: 13,
                      color: '#FFFFFF',
                    }}>
                      {field.value}
                    </div>
                  </div>
                ))}
                {/* Checkbox row */}
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#8B8FA8', marginBottom: 8 }}>Preferences</div>
                  {['Morning Session', 'Networking Lunch', 'Workshop'].map((opt, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <div style={{
                        width: 16, height: 16, borderRadius: 4,
                        background: i < 2 ? '#D93025' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${i < 2 ? '#D93025' : 'rgba(255,255,255,0.1)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {i < 2 && <IconCheck />}
                      </div>
                      <span style={{ fontSize: 13, color: i < 2 ? '#FFFFFF' : '#8B8FA8' }}>{opt}</span>
                    </div>
                  ))}
                </div>
                {/* Submit */}
                <div style={{
                  padding: '10px 20px',
                  background: '#D93025',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#fff',
                  alignSelf: 'flex-start',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  boxShadow: '0 4px 16px rgba(217,48,37,0.3)',
                }}>
                  <IconCheck /> Submitted
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="lp-divider" />

      {/* ── How It Works ─────────────────────────────────── */}
      <section className="lp-section" id="how-it-works">
        <div className="lp-reveal" style={{ textAlign: 'center' }}>
          <div className="lp-section-label" style={{ justifyContent: 'center' }}>
            <span className="lp-section-label-dot" />
            How It Works
          </div>
          <h2 className="lp-section-title">From idea to live form<br />in three steps</h2>
          <p className="lp-section-sub" style={{ margin: '0 auto' }}>
            Kotonoha is designed to get out of your way. Build, share, and collect — it really is that simple.
          </p>
        </div>

        <div className="lp-steps-grid">
          {steps.map((step, i) => (
            <div key={i} className={`lp-step lp-reveal lp-reveal-delay-${i + 1}`}>
              <div className="lp-step-number">{step.number}</div>
              <h3 className="lp-step-title">{step.title}</h3>
              <p className="lp-step-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stats Bar ────────────────────────────────────── */}
      <div className="lp-stats-bar">
        <div className="lp-stats-inner">
          <div className="lp-stat lp-reveal">
            <div className="lp-stat-number">14<span>+</span></div>
            <div className="lp-stat-label">Field Types Available</div>
          </div>
          <div className="lp-stat lp-reveal lp-reveal-delay-2">
            <div className="lp-stat-number"><span>1</span>-Click</div>
            <div className="lp-stat-label">Publishing to the Web</div>
          </div>
          <div className="lp-stat lp-reveal lp-reveal-delay-3">
            <div className="lp-stat-number"><span>∞</span></div>
            <div className="lp-stat-label">Responses, No Limits</div>
          </div>
        </div>
      </div>

      {/* ── CTA Banner ───────────────────────────────────── */}
      <div className="lp-cta-banner">
        <div className="lp-cta-inner lp-reveal">
          <div className="lp-cta-glow" aria-hidden="true" />
          <h2 className="lp-cta-title">
            Ready to build something<br />
            <span style={{ color: '#D93025' }}>beautiful?</span>
          </h2>
          <p className="lp-cta-sub">
            Start building for free. No credit card required. No limits.
          </p>
          <div className="lp-cta-actions">
            <Link href="/sign-up" className="lp-btn-red lp-btn-red-lg">
              Create Your First Form <IconArrow />
            </Link>
            <Link href="/login" className="lp-btn-outline-lg">
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div className="lp-footer-brand">
            <Logo iconSize={32} textSize={17} />
            <p className="lp-footer-tagline">
              Build beautiful forms, collect powerful responses — all in one place.
            </p>
          </div>

          <div className="lp-footer-links">
            <a href="#features" className="lp-footer-link">Features</a>
            <a href="#how-it-works" className="lp-footer-link">How It Works</a>
            <Link href="/login" className="lp-footer-link">Sign In</Link>
            <Link href="/sign-up" className="lp-footer-link">Sign Up</Link>
          </div>

          <div className="lp-footer-copy">
            © {new Date().getFullYear()} Kotonoha. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
