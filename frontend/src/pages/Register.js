import React, { useState, useEffect } from "react";
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

function getStrength(pw) {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

const S_COLORS = ["#FF4444", "#FF8C00", "#FFD700", "#00C27A"];
const S_LABELS = ["Weak", "Fair", "Good", "Strong"];

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", emergencyContacts: "" });
  const [showPw, setShowPw] = useState(false);
  const [locState, setLocState] = useState("idle");
  const [locCoords, setLocCoords] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const strength = getStrength(form.password);
  const sColor = form.password ? (S_COLORS[strength - 1] || S_COLORS[0]) : null;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const fetchLocation = () => {
    if (!navigator.geolocation) { setLocState("error"); return; }
    setLocState("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => { setLocCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setLocState("done"); },
      () => setLocState("error"),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  useEffect(() => { fetchLocation(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    if (locState !== "done" || !locCoords) {
      setMessage({ text: "Location access is required to register.", type: "error" });
      return;
    }
    setLoading(true);
    try {
      const contactsArr = form.emergencyContacts
        .split(",").map(c => ({ email: c.trim() })).filter(c => c.email);
      const res = await axios.post(`${API_URL}/api/users/register`, {
        name: form.name,
        email: form.email,
        password: form.password,
        emergencyContacts: contactsArr,
        location: { type: "Point", coordinates: [locCoords.lng, locCoords.lat] },
      });
      setMessage({ text: res.data.message || "Account created! Redirecting…", type: "success" });
      setForm({ name: "", email: "", password: "", emergencyContacts: "" });
      setTimeout(() => { window.location.href = "/login"; }, 1800);
    } catch (err) {
      setMessage({ text: err.response?.data?.message || "Registration failed. Try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const locLabel = {
    idle:    "Requesting location access…",
    loading: "Detecting your location…",
    done:    `GPS acquired — (${locCoords?.lat?.toFixed(4)}, ${locCoords?.lng?.toFixed(4)})`,
    error:   "Location denied — required for safety features",
  }[locState];

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
              <span className="v-headline-eyebrow">Secure Registration</span>
              <h1 className="v-headline-title">
                Your safety profile<br/><em>starts here</em>
              </h1>
              <p className="v-headline-sub">
                Create your account and join the network. Your location and emergency contacts are stored securely — never shared without your explicit SOS.
              </p>
            </div>
            <div className="v-features">
              {[
                { title: "Location-Aware Matching",   desc: "We only store your coordinates to find the 5 nearest helpers when you need them." },
                { title: "Emergency Contact Network", desc: "Add trusted contacts who get notified automatically during an SOS event." },
                { title: "Zero-Trace Idle Mode",      desc: "Your location is only actively broadcast during an alert — never in the background." },
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

            {/* Extra security note on left panel */}
            <div style={{
              padding: "14px 18px",
              background: "rgba(0,194,179,0.05)",
              border: "1px solid rgba(0,194,179,0.15)",
              borderRadius: "var(--radius)",
              display: "flex", gap: "12px", alignItems: "flex-start"
            }}>
              <svg style={{ flexShrink: 0, marginTop: 2 }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#00C2B3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
              </svg>
              <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>
                All data is encrypted in transit and at rest. Your privacy is our baseline, not a feature.
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="v-right">
          <div className="v-form-header">
            <div className="v-form-title">Create your account</div>
            <div className="v-form-sub">
              Already registered? <a href="/login">Sign in here</a>
            </div>
          </div>

          <button className="v-google-btn" type="button"
            onClick={() => { window.location.href = `${API_URL}/auth/google`; }}>
            <GoogleIcon />
            Continue with Google
          </button>

          <div className="v-divider">
            <div className="v-divider-line" />
            <span className="v-divider-text">or register with email</span>
            <div className="v-divider-line" />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="v-fields">

              {/* Name */}
              <div className="v-field">
                <label className="v-label">Full Name</label>
                <div className="v-input-wrap">
                  <span className="v-input-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                  </span>
                  <input className="v-input" name="name" value={form.name} onChange={handleChange}
                    placeholder="e.g. Priya Sharma" required autoComplete="name" />
                </div>
              </div>

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
                <label className="v-label">Password</label>
                <div className="v-input-wrap">
                  <span className="v-input-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                    </svg>
                  </span>
                  <input className="v-input" name="password" type={showPw ? "text" : "password"}
                    value={form.password} onChange={handleChange}
                    placeholder="Min. 8 characters" required style={{ paddingRight: 42 }} />
                  <button type="button" className="v-eye" onClick={() => setShowPw(p => !p)}>
                    <EyeIcon open={showPw} />
                  </button>
                </div>
                {form.password && (
                  <>
                    <div className="v-strength">
                      {[1,2,3,4].map(n => (
                        <div key={n} className="v-strength-bar"
                          style={{ background: n <= strength ? sColor : undefined }} />
                      ))}
                    </div>
                    <div className="v-hint" style={{ color: sColor }}>{S_LABELS[strength - 1] || "Too short"}</div>
                  </>
                )}
              </div>

              {/* Emergency contacts */}
              <div className="v-field">
                <label className="v-label">
                  Emergency Contacts
                  <span style={{ color: "var(--text-muted)", fontWeight: 400, marginLeft: 6, textTransform: "none", letterSpacing: 0 }}>
                    (optional)
                  </span>
                </label>
                <div className="v-input-wrap">
                  <span className="v-input-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
                    </svg>
                  </span>
                  <input className="v-input" name="emergencyContacts" value={form.emergencyContacts}
                    onChange={handleChange} placeholder="mom@email.com, friend@email.com" />
                </div>
                <div className="v-hint">Separate multiple emails with commas</div>
              </div>

              {/* Location */}
              <div className="v-field">
                <label className="v-label">
                  Location Access
                  <span style={{ color: "var(--accent)", marginLeft: 4 }}>*</span>
                </label>
                <div className={`v-loc ${locState === "done" ? "active" : locState === "error" ? "err" : ""}`}>
                  <div className={`v-loc-pulse ${locState === "done" ? "active" : locState === "error" ? "err" : ""}`} />
                  <span className="v-loc-text"
                    style={{ color: locState === "done" ? "rgba(0,194,122,0.8)" : locState === "error" ? "rgba(255,68,68,0.7)" : undefined }}>
                    {locLabel}
                  </span>
                  {(locState === "error" || locState === "idle") && (
                    <button type="button" className="v-loc-btn" disabled={locState === "loading"} onClick={fetchLocation}>
                      {locState === "loading" ? "…" : "Retry"}
                    </button>
                  )}
                </div>
                <div className="v-hint">GPS coordinates are required to match you with nearby helpers</div>
              </div>

              {message && (
                <div className={`v-alert ${message.type}`}>
                  <span>{message.type === "success" ? "✓" : "!"}</span>
                  <span>{message.text}</span>
                </div>
              )}

              <button className="v-submit" type="submit" disabled={loading || locState !== "done"}>
                <div className="v-submit-inner">
                  {loading
                    ? <><div className="v-spinner" /> Creating account…</>
                    : <>Create Account <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></>
                  }
                </div>
              </button>
            </div>
          </form>

          <p style={{ marginTop: 18, fontSize: "0.7rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
            By creating an account you agree to our{" "}
            <a href="/terms" style={{ color: "var(--accent)", textDecoration: "none" }}>Terms of Service</a>{" "}
            and <a href="/privacy" style={{ color: "var(--accent)", textDecoration: "none" }}>Privacy Policy</a>.
          </p>
        </div>
      </div>
    </>
  );
}