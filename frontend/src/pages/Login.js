import React, { useState } from "react";
import axios from "axios";
import { sharedCSS } from "./theme";

const API_URL = process.env.REACT_APP_API_URL;

function ShieldSVG() {
  return (
    <svg width="22" height="24" viewBox="0 0 22 24" fill="none">
      <path d="M11 1L2 4.75V11C2 16.4 6 21.4 11 23C16 21.4 20 16.4 20 11V4.75L11 1Z"
        fill="rgba(0,194,179,0.2)" stroke="rgba(0,194,179,0.7)" strokeWidth="1.5"/>
      <path d="M7.5 11.5L9.5 13.5L14.5 8.5" stroke="#00C2B3" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33.6 29.3 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l5.7-5.7C34.4 5.1 29.5 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.9 0 20.4-7.9 20.4-21 0-1.4-.1-2.7-.4-4z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 19 13 24 13c3.1 0 5.9 1.1 8.1 2.9l5.7-5.7C34.4 5.1 29.5 3 24 3 16.3 3 9.7 7.9 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 45c5.2 0 10-1.9 13.6-5l-6.3-5.2C29.3 36.3 26.8 37 24 37c-5.3 0-9.6-3.4-11.3-8L6 34.2C9.4 40.6 16.2 45 24 45z"/>
      <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.8 2.3-2.4 4.3-4.4 5.7l6.3 5.2C41.8 35.4 44 30 44 24c0-1.4-.1-2.7-.4-4z"/>
    </svg>
  );
}

function EyeIcon({ open }) {
  return open ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/users/login`, form);
      setMessage({ text: "Authenticated. Redirecting to dashboard…", type: "success" });
      localStorage.setItem("token", res.data.token);
      setTimeout(() => { window.location.href = "/home"; }, 1500);
    } catch (err) {
      setMessage({ text: err.response?.data?.message || "Invalid email or password.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{sharedCSS}</style>
      <div className="v-root">
        <div className="v-grid-bg" />

        {/* LEFT */}
        <div className="v-left">
          <div className="v-left-glow" /><div className="v-left-glow2" />
          <div className="v-left-content">
            <div className="v-logo">
              <div className="v-logo-mark"><ShieldSVG /></div>
              <span className="v-logo-name">Vigi<em>lant</em></span>
            </div>

            <div className="v-headline">
              <span className="v-headline-eyebrow">Secure Sign In</span>
              <h1 className="v-headline-title">
                Welcome back.<br/><em>Stay protected.</em>
              </h1>
              <p className="v-headline-sub">
                Sign in to access your safety dashboard, manage your emergency contacts, and stay connected to your helper network.
              </p>
            </div>

            {/* Stats */}
            <div className="v-stats">
              {[
                { num: "98%",   label: "Response Rate" },
                { num: "< 60s", label: "Avg Alert Time" },
                { num: "24/7",  label: "Always Active" },
              ].map(s => (
                <div className="v-stat" key={s.label}>
                  <div className="v-stat-num">{s.num}</div>
                  <div className="v-stat-label">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Feature highlights */}
            <div className="v-features">
              {[
                { title: "Real-time Location Sync",   desc: "Your GPS is refreshed each session to ensure accurate helper matching whenever you need it." },
                { title: "Dashboard Access",          desc: "View your SOS history, manage contacts, and configure your alert preferences." },
                { title: "Persistent Alert Network",  desc: "Your trusted contacts remain active and ready — always watching out for you." },
              ].map(f => (
                <div className="v-feature" key={f.title}>
                  <div className="v-feature-dot" />
                  <div className="v-feature-body">
                    <div className="v-feature-title">{f.title}</div>
                    <div className="v-feature-desc">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="v-right">
          <div className="v-form-header">
            <div className="v-form-title">Sign in to Vigilant</div>
            <div className="v-form-sub">
              No account? <a href="/register">Create one free</a>
            </div>
          </div>

          <button className="v-google-btn" type="button"
            onClick={() => { window.location.href = `${API_URL}/auth/google`; }}>
            <GoogleIcon />
            Continue with Google
          </button>

          <div className="v-divider">
            <div className="v-divider-line" />
            <span className="v-divider-text">or sign in with email</span>
            <div className="v-divider-line" />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="v-fields">

              {/* Email */}
              <div className="v-field">
                <label className="v-label">Email Address</label>
                <div className="v-input-wrap">
                  <span className="v-input-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </span>
                  <input className="v-input" name="email" type="email" value={form.email}
                    onChange={handleChange} placeholder="you@example.com" required autoComplete="email" />
                </div>
              </div>

              {/* Password */}
              <div className="v-field">
                <div className="v-label-row">
                  <label className="v-label">Password</label>
                  <a href="/forgot-password" className="v-forgot">Forgot password?</a>
                </div>
                <div className="v-input-wrap">
                  <span className="v-input-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                    </svg>
                  </span>
                  <input className="v-input" name="password" type={showPw ? "text" : "password"}
                    value={form.password} onChange={handleChange}
                    placeholder="Enter your password" required style={{ paddingRight: 42 }} />
                  <button type="button" className="v-eye" onClick={() => setShowPw(p => !p)}>
                    <EyeIcon open={showPw} />
                  </button>
                </div>
              </div>

              {/* Remember */}
              <label className="v-check-row">
                <div className="v-checkbox-wrap">
                  <input type="checkbox" className="v-checkbox"
                    checked={remember} onChange={() => setRemember(r => !r)} />
                  <svg className="v-check-mark" width="9" height="7" viewBox="0 0 9 7" fill="none">
                    <path d="M1 3.5L3 5.5L8 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="v-check-label">Keep me signed in for 30 days</span>
              </label>

              {message && (
                <div className={`v-alert ${message.type}`}>
                  <span>{message.type === "success" ? "✓" : "!"}</span>
                  <span>{message.text}</span>
                </div>
              )}

              <button className="v-submit" type="submit" disabled={loading}>
                <div className="v-submit-inner">
                  {loading
                    ? <><div className="v-spinner" /> Authenticating…</>
                    : <>Sign In <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></>
                  }
                </div>
              </button>
            </div>
          </form>

          {/* Security note */}
          <div style={{
            marginTop: 20,
            padding: "11px 15px",
            background: "rgba(255,255,255,0.02)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            display: "flex", gap: "10px", alignItems: "center"
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(0,194,179,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", lineHeight: 1.55 }}>
              Your session is protected with JWT authentication. All data is encrypted in transit.
            </span>
          </div>

          <p style={{ marginTop: 14, fontSize: "0.7rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
            By signing in you agree to our{" "}
            <a href="/terms" style={{ color: "var(--accent)", textDecoration: "none" }}>Terms</a>{" "}
            and <a href="/privacy" style={{ color: "var(--accent)", textDecoration: "none" }}>Privacy Policy</a>.
          </p>
        </div>
      </div>
    </>
  );
}