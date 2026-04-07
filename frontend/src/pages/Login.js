// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   TextField,
//   Button,
//   Avatar,
//   Alert,
//   Fade,
//   useMediaQuery,
//   Link,
// } from "@mui/material";
// import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
// import axios from "axios";

// const API_URL = process.env.REACT_APP_API_URL;

// export default function Login() {
//   const [form, setForm] = useState({ email: "", password: "" });
//   const [message, setMessage] = useState("");
//   const [show, setShow] = useState(false);
//   const isMobile = useMediaQuery("(max-width:600px)");

//   useEffect(() => {
//     setShow(true);
//   }, []);

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     try {
//       const res = await axios.post(`${API_URL}/api/users/login`, form);
//       setMessage("Login successful!");
//       localStorage.setItem("token", res.data.token);
//       window.location.href = "/home";
//     } catch {
//       setMessage("Login failed.");
//     }
//   };

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         width: "100vw",
//         background: "linear-gradient(135deg, #fc6363 0%, #6a82fb 100%)",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         p: isMobile ? 2 : 4,
//         boxSizing: "border-box",
//       }}
//     >
//       <Fade in={show} timeout={900}>
//         <Card
//           sx={{
//             width: "100%",
//             maxWidth: 420,
//             mx: "auto",
//             px: isMobile ? 2 : 3,
//             py: isMobile ? 3 : 4,
//             borderRadius: 5,
//             boxShadow: "0 4px 28px #6a82fb66",
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "center",
//           }}
//         >
//           <CardContent>
//             <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
//               <Avatar
//                 sx={{
//                   bgcolor: "secondary.main",
//                   width: 70,
//                   height: 70,
//                   boxShadow: "0 4px 32px #fc6363",
//                 }}
//               >
//                 <LockOutlinedIcon fontSize="large" />
//               </Avatar>
//               <Typography variant="h4" color="secondary" sx={{ fontWeight: 700, mb: 2 }}>
//                 Welcome Back
//               </Typography>
//               <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
//                 <TextField
//                   label="Email"
//                   name="email"
//                   type="email"
//                   value={form.email}
//                   onChange={handleChange}
//                   fullWidth
//                   margin="normal"
//                   required
//                 />
//                 <TextField
//                   label="Password"
//                   name="password"
//                   type="password"
//                   value={form.password}
//                   onChange={handleChange}
//                   fullWidth
//                   margin="normal"
//                   required
//                 />
//                 <Button
//                   type="submit"
//                   variant="contained"
//                   color="secondary"
//                   fullWidth
//                   sx={{
//                     mt: 3,
//                     py: 1.5,
//                     fontWeight: "bold",
//                     fontSize: "1.1rem",
//                     background: "linear-gradient(90deg, #6a82fb 0%, #fc6363 100%)",
//                     borderRadius: 20,
//                   }}
//                 >
//                   Login
//                 </Button>
//               </Box>

//               {/* ? Forgot Password Link */}
//               <Typography variant="body2" sx={{ mt: 2 }}>
//                 <Link href="/forgot-password" underline="hover" color="secondary">
//                   Forgot Password?
//                 </Link>
//               </Typography>

//               {message && (
//                 <Fade in>
//                   <Alert
//                     severity={message.toLowerCase().includes("successful") ? "success" : "error"}
//                     sx={{ width: "100%", mt: 2 }}
//                   >
//                     {message}
//                   </Alert>
//                 </Fade>
//               )}

//               <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
//                 Don't have an account? <a href="/register">Register</a>
//               </Typography>
//             </Box>
//           </CardContent>
//         </Card>
//       </Fade>
//     </Box>
//   );
// }


import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .vig-root {
    min-height: 100vh;
    width: 100vw;
    display: flex;
    font-family: 'DM Sans', sans-serif;
    background: #05060a;
    overflow: hidden;
    position: relative;
  }

  /* ── left panel ─────────────────────────────── */
  .vig-left {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 60px 48px;
    position: relative;
    overflow: hidden;
  }

  .vig-left-bg {
    position: absolute; inset: 0;
    background: linear-gradient(145deg, #0d0015 0%, #130020 40%, #1a0010 70%, #08000d 100%);
    z-index: 0;
  }

  .vig-orb1 {
    position: absolute; width: 380px; height: 380px; border-radius: 50%;
    background: radial-gradient(circle, rgba(220,38,100,0.35) 0%, transparent 70%);
    top: -80px; left: -80px; pointer-events: none; z-index: 1;
    animation: drift1 8s ease-in-out infinite alternate;
  }
  .vig-orb2 {
    position: absolute; width: 300px; height: 300px; border-radius: 50%;
    background: radial-gradient(circle, rgba(168,0,255,0.22) 0%, transparent 70%);
    bottom: 40px; right: -60px; pointer-events: none; z-index: 1;
    animation: drift2 10s ease-in-out infinite alternate;
  }
  .vig-orb3 {
    position: absolute; width: 200px; height: 200px; border-radius: 50%;
    background: radial-gradient(circle, rgba(255,80,120,0.18) 0%, transparent 70%);
    bottom: 160px; left: 40px; pointer-events: none; z-index: 1;
    animation: drift1 12s ease-in-out infinite alternate-reverse;
  }

  @keyframes drift1 {
    from { transform: translate(0,0) scale(1); }
    to   { transform: translate(30px, 20px) scale(1.08); }
  }
  @keyframes drift2 {
    from { transform: translate(0,0) scale(1); }
    to   { transform: translate(-20px, 30px) scale(1.05); }
  }

  .vig-left-content {
    position: relative; z-index: 2;
    display: flex; flex-direction: column; align-items: center; gap: 32px;
    max-width: 400px; text-align: center;
  }

  .vig-shield {
    width: 88px; height: 88px;
    background: linear-gradient(135deg, rgba(220,38,100,0.9), rgba(168,0,255,0.8));
    border-radius: 28px;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 0 40px rgba(220,38,100,0.5), 0 0 80px rgba(220,38,100,0.2);
    animation: shieldPulse 3s ease-in-out infinite;
  }
  @keyframes shieldPulse {
    0%,100% { box-shadow: 0 0 40px rgba(220,38,100,0.5), 0 0 80px rgba(220,38,100,0.2); }
    50%      { box-shadow: 0 0 60px rgba(220,38,100,0.8), 0 0 100px rgba(220,38,100,0.35); }
  }

  .vig-brand {
    font-family: 'Sora', sans-serif;
    font-size: 2.6rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1.1;
    color: #fff;
  }
  .vig-brand span { color: #dc2664; }

  .vig-tagline {
    font-size: 0.95rem;
    color: rgba(255,255,255,0.45);
    line-height: 1.65;
    font-weight: 300;
    max-width: 300px;
  }

  /* Stat cards on left side */
  .vig-stats {
    display: grid; grid-template-columns: 1fr 1fr; gap: 12px; width: 100%;
  }
  .vig-stat {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px; padding: 18px 16px;
    text-align: left;
    backdrop-filter: blur(8px);
  }
  .vig-stat-num {
    font-family: 'Sora', sans-serif;
    font-size: 1.6rem; font-weight: 800;
    color: #fff; line-height: 1;
    margin-bottom: 4px;
  }
  .vig-stat-num span { color: #dc2664; }
  .vig-stat-label { font-size: 0.75rem; color: rgba(255,255,255,0.38); font-weight: 300; }

  .vig-quote {
    background: rgba(220,38,100,0.08);
    border: 1px solid rgba(220,38,100,0.2);
    border-radius: 14px; padding: 16px 20px;
    text-align: left; width: 100%;
  }
  .vig-quote-text {
    font-size: 0.85rem; color: rgba(255,255,255,0.6);
    line-height: 1.6; font-style: italic; margin-bottom: 8px;
  }
  .vig-quote-author {
    font-size: 0.75rem; color: rgba(220,38,100,0.8); font-weight: 600;
  }

  /* ── right panel (form) ─────────────────────── */
  .vig-right {
    width: 480px;
    flex-shrink: 0;
    background: #0b0c12;
    border-left: 1px solid rgba(255,255,255,0.06);
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 48px 44px;
    overflow-y: auto;
    position: relative;
  }

  .vig-right::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, #dc2664, #a800ff, #dc2664);
    background-size: 200%;
    animation: shimmer 3s linear infinite;
  }
  @keyframes shimmer {
    from { background-position: 0% 0%; }
    to   { background-position: 200% 0%; }
  }

  .vig-form-header { margin-bottom: 28px; }
  .vig-form-title {
    font-family: 'Sora', sans-serif;
    font-size: 1.75rem; font-weight: 700;
    color: #fff; letter-spacing: -0.02em; line-height: 1.2;
    margin-bottom: 6px;
  }
  .vig-form-sub { font-size: 0.85rem; color: rgba(255,255,255,0.38); }
  .vig-form-sub a { color: #dc2664; text-decoration: none; font-weight: 500; }
  .vig-form-sub a:hover { text-decoration: underline; }

  /* Google button */
  .vig-google-btn {
    width: 100%;
    display: flex; align-items: center; justify-content: center; gap: 12px;
    padding: 13px 20px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 12px;
    color: rgba(255,255,255,0.85);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem; font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-bottom: 24px;
  }
  .vig-google-btn:hover {
    background: rgba(255,255,255,0.09);
    border-color: rgba(255,255,255,0.22);
    transform: translateY(-1px);
  }

  /* divider */
  .vig-divider {
    display: flex; align-items: center; gap: 12px;
    margin-bottom: 22px;
  }
  .vig-divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.08); }
  .vig-divider-text { font-size: 0.75rem; color: rgba(255,255,255,0.28); }

  /* fields */
  .vig-fields { display: flex; flex-direction: column; gap: 14px; }

  .vig-field { display: flex; flex-direction: column; gap: 6px; }
  .vig-label {
    font-size: 0.78rem; font-weight: 500;
    color: rgba(255,255,255,0.5); letter-spacing: 0.02em;
  }
  .vig-label-row {
    display: flex; align-items: center; justify-content: space-between;
  }
  .vig-forgot {
    font-size: 0.75rem; color: rgba(220,38,100,0.8);
    text-decoration: none; font-weight: 500;
    transition: color 0.15s;
  }
  .vig-forgot:hover { color: #dc2664; text-decoration: underline; }

  .vig-input-wrap { position: relative; }
  .vig-input-icon {
    position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
    color: rgba(255,255,255,0.28); font-size: 16px; pointer-events: none;
    display: flex; align-items: center;
  }
  .vig-input {
    width: 100%;
    padding: 12px 14px 12px 42px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 12px;
    color: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    outline: none;
    transition: all 0.2s ease;
  }
  .vig-input::placeholder { color: rgba(255,255,255,0.2); }
  .vig-input:focus {
    border-color: rgba(220,38,100,0.6);
    background: rgba(220,38,100,0.06);
    box-shadow: 0 0 0 3px rgba(220,38,100,0.1);
  }

  /* password toggle */
  .vig-eye {
    position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer; color: rgba(255,255,255,0.3);
    display: flex; align-items: center; padding: 0;
    transition: color 0.15s;
  }
  .vig-eye:hover { color: rgba(255,255,255,0.6); }

  /* remember me */
  .vig-remember {
    display: flex; align-items: center; gap: 10px; cursor: pointer;
  }
  .vig-checkbox-wrap {
    position: relative; width: 18px; height: 18px; flex-shrink: 0;
  }
  .vig-checkbox {
    appearance: none; -webkit-appearance: none;
    width: 18px; height: 18px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 5px; cursor: pointer;
    transition: all 0.2s;
  }
  .vig-checkbox:checked {
    background: #dc2664;
    border-color: #dc2664;
  }
  .vig-checkbox:checked + .vig-check-icon { opacity: 1; }
  .vig-check-icon {
    position: absolute; top: 50%; left: 50%; transform: translate(-50%, -52%);
    pointer-events: none; opacity: 0; transition: opacity 0.15s;
  }
  .vig-remember-label { font-size: 0.82rem; color: rgba(255,255,255,0.45); }

  /* submit */
  .vig-submit {
    width: 100%;
    padding: 14px;
    margin-top: 6px;
    background: linear-gradient(135deg, #dc2664, #a800ff);
    border: none; border-radius: 12px;
    color: #fff;
    font-family: 'Sora', sans-serif;
    font-size: 0.92rem; font-weight: 700;
    cursor: pointer;
    transition: all 0.22s ease;
    position: relative; overflow: hidden;
    letter-spacing: 0.01em;
  }
  .vig-submit:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(220,38,100,0.45);
  }
  .vig-submit:active:not(:disabled) { transform: translateY(0); }
  .vig-submit:disabled { opacity: 0.55; cursor: not-allowed; }
  .vig-submit-shimmer {
    position: absolute; inset: 0;
    background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%);
    background-size: 200%;
    animation: btnShimmer 2.5s linear infinite;
  }
  @keyframes btnShimmer {
    from { background-position: 150% 0; }
    to   { background-position: -50% 0; }
  }
  .vig-submit-inner { position: relative; z-index: 1; display: flex; align-items: center; justify-content: center; gap: 8px; }

  /* alert */
  .vig-alert {
    padding: 12px 16px;
    border-radius: 12px;
    font-size: 0.82rem;
    display: flex; align-items: flex-start; gap: 10px;
    margin-top: 4px;
    animation: fadeIn 0.3s ease;
  }
  @keyframes fadeIn { from { opacity:0; transform: translateY(-6px); } to { opacity:1; transform:none; } }
  .vig-alert.success { background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.25); color: #4ade80; }
  .vig-alert.error   { background: rgba(239,68,68,0.1);  border: 1px solid rgba(239,68,68,0.25);  color: #f87171; }

  /* spinner */
  .vig-spinner {
    width: 16px; height: 16px; border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* responsive */
  @media (max-width: 820px) {
    .vig-left { display: none; }
    .vig-right { width: 100%; border-left: none; padding: 40px 28px; }
  }
`;

function ShieldIcon() {
  return (
    <svg width="44" height="50" viewBox="0 0 44 50" fill="none">
      <path d="M22 2L4 9.5V22C4 32.8 12 42.8 22 46C32 42.8 40 32.8 40 22V9.5L22 2Z"
        fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
      <path d="M16 24L20 28L28 20" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33.6 29.3 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l5.7-5.7C34.4 5.1 29.5 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.9 0 20.4-7.9 20.4-21 0-1.4-.1-2.7-.4-4z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 19 13 24 13c3.1 0 5.9 1.1 8.1 2.9l5.7-5.7C34.4 5.1 29.5 3 24 3 16.3 3 9.7 7.9 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 45c5.2 0 10-1.9 13.6-5l-6.3-5.2C29.3 36.3 26.8 37 24 37c-5.3 0-9.6-3.4-11.3-8L6 34.2C9.4 40.6 16.2 45 24 45z"/>
      <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.8 2.3-2.4 4.3-4.4 5.7l6.3 5.2C41.8 35.4 44 30 44 24c0-1.4-.1-2.7-.4-4z"/>
    </svg>
  );
}

function EyeIcon({ open }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

  const handleGoogleSignIn = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/users/login`, form);
      setMessage({ text: "Login successful! Redirecting…", type: "success" });
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
      <style>{css}</style>
      <div className="vig-root">

        {/* ── LEFT PANEL ─────────────────────────── */}
        <div className="vig-left">
          <div className="vig-left-bg" />
          <div className="vig-orb1" /><div className="vig-orb2" /><div className="vig-orb3" />
          <div className="vig-left-content">
            <div className="vig-shield"><ShieldIcon /></div>
            <div>
              <div className="vig-brand">Vigi<span>lant</span></div>
              <p className="vig-tagline" style={{ marginTop: 10 }}>
                Your personal safety companion — always watching, always ready.
              </p>
            </div>

            {/* Stats grid */}
            <div className="vig-stats">
              {[
                // { num: "2.4", unit: "K+", label: "Active Helpers" },
                { num: "98", unit: "%",  label: "Response Rate" },
                { num: "< 60", unit: "s",  label: "Avg Alert Time" },
                { num: "24", unit: "/7",  label: "Always On" },
              ].map((s) => (
                <div className="vig-stat" key={s.label}>
                  <div className="vig-stat-num">{s.num}<span>{s.unit}</span></div>
                  <div className="vig-stat-label">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Quote */}
            {/* <div className="vig-quote">
              <div className="vig-quote-text">
                "Vigilant helped me find a nearby helper in under 30 seconds — it felt like having a guardian angel."
              </div>
              <div className="vig-quote-author">— Priya S., Vigilant user</div>
            </div> */}
          </div>
        </div>

        {/* ── RIGHT PANEL (form) ──────────────────── */}
        <div className="vig-right">
          <div className="vig-form-header">
            <div className="vig-form-title">Welcome back</div>
            <div className="vig-form-sub">
              New here? <a href="/register">Create an account</a>
            </div>
          </div>

          {/* Google */}
          <button className="vig-google-btn" type="button" onClick={handleGoogleSignIn}>
            <GoogleIcon />
            Continue with Google
          </button>

          {/* divider */}
          <div className="vig-divider">
            <div className="vig-divider-line" />
            <span className="vig-divider-text">or sign in with email</span>
            <div className="vig-divider-line" />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="vig-fields">

              {/* Email */}
              <div className="vig-field">
                <label className="vig-label">Email Address</label>
                <div className="vig-input-wrap">
                  <span className="vig-input-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </span>
                  <input className="vig-input" name="email" type="email" value={form.email}
                    onChange={handleChange} placeholder="you@example.com" required autoComplete="email" />
                </div>
              </div>

              {/* Password */}
              <div className="vig-field">
                <div className="vig-label-row">
                  <label className="vig-label">Password</label>
                  <a href="/forgot-password" className="vig-forgot">Forgot password?</a>
                </div>
                <div className="vig-input-wrap">
                  <span className="vig-input-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                    </svg>
                  </span>
                  <input className="vig-input" name="password" type={showPw ? "text" : "password"}
                    value={form.password} onChange={handleChange}
                    placeholder="Enter your password" required style={{ paddingRight: 44 }} />
                  <button type="button" className="vig-eye" onClick={() => setShowPw(p => !p)}>
                    <EyeIcon open={showPw} />
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <label className="vig-remember">
                <div className="vig-checkbox-wrap">
                  <input
                    type="checkbox"
                    className="vig-checkbox"
                    checked={remember}
                    onChange={() => setRemember(r => !r)}
                  />
                  <svg className="vig-check-icon" width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="vig-remember-label">Keep me signed in</span>
              </label>

              {/* Alert */}
              {message && (
                <div className={`vig-alert ${message.type}`}>
                  <span>{message.type === "success" ? "✓" : "✕"}</span>
                  <span>{message.text}</span>
                </div>
              )}

              {/* Submit */}
              <button className="vig-submit" type="submit" disabled={loading}>
                <div className="vig-submit-shimmer" />
                <div className="vig-submit-inner">
                  {loading
                    ? <><div className="vig-spinner" /> Signing in…</>
                    : "Sign In →"
                  }
                </div>
              </button>

            </div>
          </form>

          <p style={{ marginTop: 20, fontSize: "0.72rem", color: "rgba(255,255,255,0.2)", lineHeight: 1.6 }}>
            By signing in you agree to our{" "}
            <a href="/terms" style={{ color: "rgba(220,38,100,0.7)", textDecoration: "none" }}>Terms of Service</a>{" "}
            and{" "}
            <a href="/privacy" style={{ color: "rgba(220,38,100,0.7)", textDecoration: "none" }}>Privacy Policy</a>.
          </p>
        </div>

      </div>
    </>
  );
}