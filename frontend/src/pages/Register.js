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
// } from "@mui/material";
// import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
// import axios from "axios";

// const API_URL = process.env.REACT_APP_API_URL;

// export default function Register() {
//   const [form, setForm] = useState({ name: "", email: "", password: "", emergencyContacts: "" });
//   const [message, setMessage] = useState("");
//   const [show, setShow] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const isMobile = useMediaQuery("(max-width:600px)");

//   useEffect(() => {
//     setShow(true);
//   }, []);

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     setLoading(true);

//     if (!navigator.geolocation) {
//       setMessage("Location permission is required.");
//       setLoading(false);
//       return;
//     }

//     navigator.geolocation.getCurrentPosition(
//       async (pos) => {
//         try {
//           const contactsArr = form.emergencyContacts
//             .split(",")
//             .map((c) => ({ email: c.trim() }))
//             .filter((c) => c.email);

//           const location = {
//             type: "Point",
//             coordinates: [pos.coords.longitude, pos.coords.latitude],
//           };

//           const res = await axios.post(`${API_URL}/api/users/register`, {
//             name: form.name,
//             email: form.email,
//             password: form.password,
//             emergencyContacts: contactsArr,
//             location,
//           });

//           setMessage(res.data.message || "Registered successfully!");
//           setForm({ name: "", email: "", password: "", emergencyContacts: "" });
//         } catch (err) {
//           setMessage(err.response?.data?.message || "Registration failed.");
//         } finally {
//           setLoading(false);
//         }
//       },
//       () => {
//         setMessage("Location access denied.");
//         setLoading(false);
//       }
//     );
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
//             maxHeight: "90vh",
//             overflowY: "auto",
//           }}
//         >
//           <CardContent>
//             <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
//               <Avatar
//                 sx={{ bgcolor: "secondary.main", width: 62, height: 62, boxShadow: "0 4px 32px #fc6363" }}
//               >
//                 <PersonAddAltIcon fontSize="large" />
//               </Avatar>
//               <Typography variant="h4" color="secondary" sx={{ fontWeight: 700, mb: 2 }}>
//                 Create Account
//               </Typography>
//               <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
//                 <TextField label="Name" name="name" value={form.name} onChange={handleChange} fullWidth margin="normal" required />
//                 <TextField label="Email" name="email" value={form.email} onChange={handleChange} fullWidth margin="normal" required />
//                 <TextField label="Password" name="password" value={form.password} onChange={handleChange} fullWidth margin="normal" required />
//                 <TextField label="Emergency Contacts (comma separated)" name="emergencyContacts" value={form.emergencyContacts} onChange={handleChange} fullWidth margin="normal" />
//                 <Button
//                   type="submit"
//                   variant="contained"
//                   color="secondary"
//                   fullWidth
//                   disabled={loading}
//                   sx={{
//                     mt: 3,
//                     py: 1.5,
//                     fontWeight: "bold",
//                     fontSize: "1.1rem",
//                     background: "linear-gradient(90deg, #6a82fb 0%, #fc6363 100%)",
//                     borderRadius: 20,
//                   }}
//                 >
//                   {loading ? "Registering..." : "Register"}
//                 </Button>
//               </Box>
//               {message && (
//                 <Fade in>
//                   <Alert
//                     severity={message.toLowerCase().includes("success") ? "success" : "error"}
//                     sx={{ width: "100%" }}
//                   >
//                     {message}
//                   </Alert>
//                 </Fade>
//               )}
//               <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
//                 Already have an account? <a href="/login">Login</a>
//               </Typography>
//             </Box>
//           </CardContent>
//         </Card>
//       </Fade>
//     </Box>
//   );
// }


import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

// ── tiny inline styles (no MUI, pure CSS-in-JS for full control) ──────────────
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

  .vig-features {
    display: flex; flex-direction: column; gap: 14px; width: 100%;
  }
  .vig-feature {
    display: flex; align-items: center; gap: 14px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 14px; padding: 14px 18px;
    text-align: left;
    backdrop-filter: blur(8px);
  }
  .vig-feature-icon {
    width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 17px;
  }
  .vig-feature-text { font-size: 0.83rem; color: rgba(255,255,255,0.6); line-height: 1.4; }
  .vig-feature-title { font-size: 0.9rem; font-weight: 600; color: rgba(255,255,255,0.88); margin-bottom: 2px; }

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
  .vig-google-btn svg { flex-shrink: 0; }

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
  .vig-input.error { border-color: rgba(255,80,80,0.6); }

  /* location row */
  .vig-loc-row {
    display: flex; align-items: center; gap: 10px;
    padding: 11px 14px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    transition: all 0.2s;
  }
  .vig-loc-row.active { border-color: rgba(34,197,94,0.4); background: rgba(34,197,94,0.05); }
  .vig-loc-row.error  { border-color: rgba(255,80,80,0.4); }
  .vig-loc-dot {
    width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;
    background: rgba(255,255,255,0.2);
    transition: background 0.3s;
  }
  .vig-loc-dot.active { background: #22c55e; box-shadow: 0 0 8px #22c55e; animation: blink 1.5s infinite; }
  .vig-loc-dot.error  { background: #ef4444; }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.4} }
  .vig-loc-text { font-size: 0.82rem; color: rgba(255,255,255,0.45); flex: 1; }
  .vig-loc-btn {
    padding: 5px 12px;
    border-radius: 8px;
    font-size: 0.75rem; font-weight: 600;
    border: none; cursor: pointer;
    background: rgba(220,38,100,0.2);
    color: #dc2664;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.18s;
  }
  .vig-loc-btn:hover { background: rgba(220,38,100,0.35); }
  .vig-loc-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  /* helper hint */
  .vig-hint { font-size: 0.72rem; color: rgba(255,255,255,0.28); margin-top: 2px; }

  /* password toggle */
  .vig-eye {
    position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer; color: rgba(255,255,255,0.3);
    display: flex; align-items: center; padding: 0;
    transition: color 0.15s;
  }
  .vig-eye:hover { color: rgba(255,255,255,0.6); }

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

  /* strenght bar */
  .vig-strength { display: flex; gap: 4px; margin-top: 6px; }
  .vig-strength-bar {
    flex: 1; height: 3px; border-radius: 2px;
    background: rgba(255,255,255,0.08);
    transition: background 0.3s;
  }

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

function getStrength(pw) {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

const STRENGTH_COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e"];
const STRENGTH_LABELS = ["Weak", "Fair", "Good", "Strong"];

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", emergencyContacts: "" });
  const [showPw, setShowPw] = useState(false);
  const [locState, setLocState] = useState("idle"); // idle | loading | done | error
  const [locCoords, setLocCoords] = useState(null);
  const [message, setMessage] = useState(null); // { text, type }
  const [loading, setLoading] = useState(false);

  const strength = getStrength(form.password);
  const strengthColor = form.password ? STRENGTH_COLORS[strength - 1] || STRENGTH_COLORS[0] : null;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const fetchLocation = () => {
    if (!navigator.geolocation) {
      setLocState("error");
      return;
    }
    setLocState("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocState("done");
      },
      () => setLocState("error"),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  useEffect(() => { fetchLocation(); }, []);

  const handleGoogleSignIn = () => {
    // Redirect to your backend Google OAuth endpoint
    window.location.href = `${API_URL}/auth/google`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (locState !== "done" || !locCoords) {
      setMessage({ text: "Please allow location access to continue.", type: "error" });
      return;
    }

    setLoading(true);
    try {
      const contactsArr = form.emergencyContacts
        .split(",")
        .map((c) => ({ email: c.trim() }))
        .filter((c) => c.email);

      const res = await axios.post(`${API_URL}/api/users/register`, {
        name: form.name,
        email: form.email,
        password: form.password,
        emergencyContacts: contactsArr,
        location: {
          type: "Point",
          coordinates: [locCoords.lng, locCoords.lat],
        },
      });

      setMessage({ text: res.data.message || "Account created! Redirecting…", type: "success" });
      setForm({ name: "", email: "", password: "", emergencyContacts: "" });
      setTimeout(() => { window.location.href = "/login"; }, 1800);
    } catch (err) {
      setMessage({ text: err.response?.data?.message || "Registration failed. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const locLabel = {
    idle:    "Requesting your location…",
    loading: "Detecting location…",
    done:    `Location acquired (${locCoords?.lat?.toFixed(4)}, ${locCoords?.lng?.toFixed(4)})`,
    error:   "Location access denied — required for safety features",
  }[locState];

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
                Your personal safety companion — connecting you to nearby helpers in seconds.
              </p>
            </div>
            <div className="vig-features">
              {[
                { icon: "📍", bg: "rgba(220,38,100,0.2)",  title: "Real-Time Location", desc: "Share your live location with trusted contacts instantly." },
                { icon: "🆘", bg: "rgba(168,0,255,0.2)",   title: "SOS in One Tap",    desc: "Alert nearest helpers with a single button press." },
                { icon: "🔔", bg: "rgba(255,160,50,0.15)", title: "Instant Alerts",    desc: "Push & email notifications reach help within seconds." },
              ].map((f) => (
                <div className="vig-feature" key={f.title}>
                  <div className="vig-feature-icon" style={{ background: f.bg }}>{f.icon}</div>
                  <div>
                    <div className="vig-feature-title">{f.title}</div>
                    <div className="vig-feature-text">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL (form) ──────────────────── */}
        <div className="vig-right">
          <div className="vig-form-header">
            <div className="vig-form-title">Create your account</div>
            <div className="vig-form-sub">
              Already registered? <a href="/login">Sign in</a>
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
            <span className="vig-divider-text">or register with email</span>
            <div className="vig-divider-line" />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="vig-fields">

              {/* Name */}
              <div className="vig-field">
                <label className="vig-label">Full Name</label>
                <div className="vig-input-wrap">
                  <span className="vig-input-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                  </span>
                  <input className="vig-input" name="name" value={form.name}
                    onChange={handleChange} placeholder="Jane Doe" required autoComplete="name" />
                </div>
              </div>

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
                <label className="vig-label">Password</label>
                <div className="vig-input-wrap">
                  <span className="vig-input-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                    </svg>
                  </span>
                  <input className="vig-input" name="password" type={showPw ? "text" : "password"}
                    value={form.password} onChange={handleChange}
                    placeholder="Min. 8 characters" required style={{ paddingRight: 44 }} />
                  <button type="button" className="vig-eye" onClick={() => setShowPw(p => !p)}>
                    <EyeIcon open={showPw} />
                  </button>
                </div>
                {form.password && (
                  <>
                    <div className="vig-strength">
                      {[1,2,3,4].map(n => (
                        <div key={n} className="vig-strength-bar"
                          style={{ background: n <= strength ? strengthColor : undefined }} />
                      ))}
                    </div>
                    <div className="vig-hint" style={{ color: strengthColor }}>
                      {STRENGTH_LABELS[strength - 1] || "Too short"}
                    </div>
                  </>
                )}
              </div>

              {/* Emergency contacts */}
              <div className="vig-field">
                <label className="vig-label">Emergency Contacts <span style={{ color: "rgba(255,255,255,0.25)", fontWeight: 400 }}>(optional)</span></label>
                <div className="vig-input-wrap">
                  <span className="vig-input-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
                    </svg>
                  </span>
                  <input className="vig-input" name="emergencyContacts" value={form.emergencyContacts}
                    onChange={handleChange} placeholder="mom@email.com, friend@email.com" />
                </div>
                <div className="vig-hint">Separate multiple emails with commas</div>
              </div>

              {/* Location */}
              <div className="vig-field">
                <label className="vig-label">Location Access <span style={{ color: "#dc2664" }}>*</span></label>
                <div className={`vig-loc-row ${locState === "done" ? "active" : locState === "error" ? "error" : ""}`}>
                  <div className={`vig-loc-dot ${locState === "done" ? "active" : locState === "error" ? "error" : ""}`} />
                  <span className="vig-loc-text">{locLabel}</span>
                  {(locState === "error" || locState === "idle") && (
                    <button type="button" className="vig-loc-btn"
                      disabled={locState === "loading"} onClick={fetchLocation}>
                      {locState === "loading" ? "…" : "Retry"}
                    </button>
                  )}
                </div>
                <div className="vig-hint">Required to connect you with nearby helpers</div>
              </div>

              {/* Alert */}
              {message && (
                <div className={`vig-alert ${message.type}`}>
                  <span>{message.type === "success" ? "✓" : "✕"}</span>
                  <span>{message.text}</span>
                </div>
              )}

              {/* Submit */}
              <button className="vig-submit" type="submit" disabled={loading || locState !== "done"}>
                <div className="vig-submit-shimmer" />
                <div className="vig-submit-inner">
                  {loading ? <><div className="vig-spinner" /> Creating account…</> : "Create Account →"}
                </div>
              </button>

            </div>
          </form>

          <p style={{ marginTop: 20, fontSize: "0.72rem", color: "rgba(255,255,255,0.2)", lineHeight: 1.6 }}>
            By creating an account you agree to our{" "}
            <a href="/terms" style={{ color: "rgba(220,38,100,0.7)", textDecoration: "none" }}>Terms of Service</a>{" "}
            and{" "}
            <a href="/privacy" style={{ color: "rgba(220,38,100,0.7)", textDecoration: "none" }}>Privacy Policy</a>.
          </p>
        </div>

      </div>
    </>
  );
}