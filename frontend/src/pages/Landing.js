import React from "react";
import { sharedCSS } from "./theme";

const landingCSS = `
  ${sharedCSS}

  .v-landing-right {
    width: 500px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 60px 52px;
    position: relative;
    background: var(--surface);
    border-left: 1px solid var(--border);
  }

  .v-landing-right::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, var(--accent), transparent);
    animation: topLine 4s ease-in-out infinite;
  }

  .v-cta-stack {
    display: flex; flex-direction: column; gap: 12px;
    margin-top: 8px;
  }

  .v-cta-primary {
    display: flex; align-items: center; justify-content: center; gap: 10px;
    width: 100%; padding: 16px 24px;
    background: var(--accent);
    border: none; border-radius: var(--radius);
    color: #020d0c;
    font-family: 'Outfit', sans-serif;
    font-size: 0.97rem; font-weight: 800;
    letter-spacing: 0.01em;
    cursor: pointer; text-decoration: none;
    transition: all 0.2s ease;
    box-shadow: 0 4px 20px var(--accent-glow);
  }
  .v-cta-primary:hover {
    background: var(--accent-bright);
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(0,194,179,0.35);
  }

  .v-cta-secondary {
    display: flex; align-items: center; justify-content: center;
    width: 100%; padding: 15px 24px;
    background: transparent;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    color: var(--text-primary);
    font-family: 'Outfit', sans-serif;
    font-size: 0.9rem; font-weight: 600;
    cursor: pointer; text-decoration: none;
    transition: all 0.2s ease;
  }
  .v-cta-secondary:hover {
    border-color: var(--accent);
    color: var(--accent);
    background: var(--accent-dim);
  }

  .v-landing-eyebrow {
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 24px;
  }

  .v-landing-divider {
    height: 1px; background: var(--border);
    margin: 28px 0;
  }

  .v-trust-row {
    display: flex; align-items: center; gap: 0;
    flex-direction: column;
    gap: 10px;
  }
  .v-trust-item {
    display: flex; align-items: center; gap: 10px;
    font-size: 0.78rem; color: var(--text-muted);
    padding: 10px 14px;
    background: rgba(255,255,255,0.02);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    width: 100%;
  }
  .v-trust-icon {
    width: 28px; height: 28px;
    background: var(--accent-dim);
    border-radius: 7px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    font-size: 13px;
  }

  .v-landing-steps {
    display: flex; flex-direction: column; gap: 12px;
    margin-top: 4px;
  }
  .v-step {
    display: flex; align-items: flex-start; gap: 16px;
    padding: 16px 20px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    transition: border-color 0.2s;
  }
  .v-step:hover { border-color: rgba(0,194,179,0.25); }
  .v-step-num {
    width: 28px; height: 28px; border-radius: 8px;
    background: var(--accent-dim);
    border: 1px solid rgba(0,194,179,0.25);
    display: flex; align-items: center; justify-content: center;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.68rem; font-weight: 600; color: var(--accent);
    flex-shrink: 0; margin-top: 1px;
  }
  .v-step-body {}
  .v-step-title { font-size: 0.88rem; font-weight: 600; color: var(--text-primary); }
  .v-step-desc  { font-size: 0.78rem; color: var(--text-secondary); margin-top: 3px; line-height: 1.5; }
`;

function ShieldSVG() {
  return (
    <svg width="22" height="24" viewBox="0 0 22 24" fill="none">
      <path d="M11 1L2 4.75V11C2 16.4 6 21.4 11 23C16 21.4 20 16.4 20 11V4.75L11 1Z"
        fill="rgba(0,194,179,0.2)" stroke="rgba(0,194,179,0.7)" strokeWidth="1.5"/>
      <path d="M7.5 11.5L9.5 13.5L14.5 8.5" stroke="#00C2B3" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function Landing() {
  return (
    <>
      <style>{landingCSS}</style>
      <div className="v-root">
        <div className="v-grid-bg" />

        {/* LEFT */}
        <div className="v-left">
          <div className="v-left-glow" /><div className="v-left-glow2" />
          <div className="v-left-content">
            {/* Logo */}
            <div className="v-logo">
              <div className="v-logo-mark"><ShieldSVG /></div>
              <span className="v-logo-name">Vigi<em>lant</em></span>
            </div>

            {/* Headline */}
            <div className="v-headline">
              <span className="v-headline-eyebrow">Women Safety Platform</span>
              <h1 className="v-headline-title">
                Safety infrastructure<br/>built for <em>real emergencies</em>
              </h1>
              <p className="v-headline-sub">
                Community-powered emergency response. Connect with nearest verified helpers, share your location, and trigger alerts — all in under 10 seconds.
              </p>
            </div>

            {/* Steps */}
            <div className="v-landing-steps">
              {[
                { n: "01", title: "Register & Share Location", desc: "Create your account with live GPS — helps us connect you to the right people." },
                { n: "02", title: "Tap SOS When Needed",       desc: "One button instantly notifies the 5 nearest active helpers around you." },
                { n: "03", title: "Help Arrives Fast",         desc: "Helpers get push + email alerts with your exact coordinates." },
              ].map(s => (
                <div className="v-step" key={s.n}>
                  <div className="v-step-num">{s.n}</div>
                  <div className="v-step-body">
                    <div className="v-step-title">{s.title}</div>
                    <div className="v-step-desc">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="v-stats">
              {[
                { num: "< 10s", label: "Alert Dispatch" },
                { num: "98%",   label: "Response Rate" },
                { num: "24/7",  label: "Always Active" },
              ].map(s => (
                <div className="v-stat" key={s.label}>
                  <div className="v-stat-num">{s.num}</div>
                  <div className="v-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="v-landing-right">
          <div className="v-landing-eyebrow">
            <div className="v-status-badge">
              <span className="v-status-dot" />
              System Operational
            </div>
          </div>

          <div style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: "1.9rem", fontWeight: 800, letterSpacing: "-0.025em", marginBottom: 10, color: "var(--text-primary)", lineHeight: 1.15 }}>
              Start protecting<br/>yourself today
            </h2>
            <p style={{ fontSize: "0.87rem", color: "var(--text-muted)", lineHeight: 1.65 }}>
              Join users who rely on Vigilant for fast, community-driven emergency response.
            </p>
          </div>

          <div className="v-cta-stack">
            <a href="/register" className="v-cta-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
              Create Free Account
            </a>
            <a href="/login" className="v-cta-secondary">
              Sign in to Dashboard
            </a>
          </div>

          <div className="v-landing-divider" />

          <div className="v-trust-row">
            {[
              { icon: "🔒", text: "End-to-end encrypted", sub: "Your data never leaves our secure servers unprotected" },
              { icon: "📍", text: "Live GPS tracking",    sub: "Location shared only during active SOS events" },
              { icon: "⚡", text: "Instant notifications", sub: "Helpers alerted within seconds of your SOS" },
            ].map(t => (
              <div className="v-trust-item" key={t.text}>
                <div className="v-trust-icon">{t.icon}</div>
                <div>
                  <div style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.82rem" }}>{t.text}</div>
                  <div style={{ fontSize: "0.73rem", color: "var(--text-muted)", marginTop: 2, lineHeight: 1.45 }}>{t.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}