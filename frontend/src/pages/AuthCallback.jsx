// pages/AuthCallback.jsx
// Add this route to App.js:  <Route path="/auth/callback" element={<AuthCallback />} />

import React, { useEffect, useState } from "react";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&family=JetBrains+Mono:wght@500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
.acb{min-height:100vh;width:100%;background:#090C0F;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:'Outfit',sans-serif;color:#E8EDF2;gap:20px;padding:24px;}
.acb-box{background:#0E1318;border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:36px 44px;text-align:center;max-width:340px;width:100%;}
.acb-logo{font-size:1.3rem;font-weight:800;letter-spacing:-.02em;margin-bottom:24px;}
.acb-logo em{color:#00C2B3;font-style:normal;}
.acb-spin{width:36px;height:36px;border-radius:50%;border:3px solid rgba(0,194,179,.2);border-top-color:#00C2B3;animation:sp .7s linear infinite;margin:0 auto 18px;}
@keyframes sp{to{transform:rotate(360deg)}}
.acb-title{font-size:1rem;font-weight:700;margin-bottom:6px;}
.acb-sub{font-size:.8rem;color:rgba(232,237,242,.4);line-height:1.55;}
.acb-err{color:#f87171;font-size:.82rem;margin-top:8px;}
.acb-err a{color:#00C2B3;text-decoration:none;}
`;

export default function AuthCallback() {
  const [status, setStatus] = useState("processing"); // processing | done | error
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);

      // Check for explicit error from backend
      const err = params.get("error");
      if (err) {
        setErrorMsg("Google sign-in failed. Please try again.");
        setStatus("error");
        return;
      }

      const token  = params.get("token");
      const name   = params.get("name");
      const email  = params.get("email");
      const avatar = params.get("avatar");
      const isNew  = params.get("newUser") === "true";

      if (!token) {
        setErrorMsg("No authentication token received.");
        setStatus("error");
        return;
      }

      // Store token (same key used everywhere else)
      localStorage.setItem("token", token);
      if (name)   localStorage.setItem("userName",  name);
      if (email)  localStorage.setItem("userEmail", email);
      if (avatar) localStorage.setItem("userAvatar", avatar);

      setStatus("done");

      // New Google users may need to add their location — send them to profile
      // Existing users go straight to /home
      setTimeout(() => {
        window.location.href = isNew ? "/profile?setup=1" : "/home";
      }, 1200);

    } catch (e) {
      setErrorMsg("Something went wrong during sign-in.");
      setStatus("error");
    }
  }, []);

  return (
    <>
      <style>{css}</style>
      <div className="acb">
        <div className="acb-box">
          <div className="acb-logo">Vigi<em>lant</em></div>
          {status === "processing" && (
            <>
              <div className="acb-spin" />
              <div className="acb-title">Signing you in…</div>
              <div className="acb-sub">Verifying your Google account and setting up your session.</div>
            </>
          )}
          {status === "done" && (
            <>
              <div style={{ fontSize: 36, marginBottom: 14 }}>✅</div>
              <div className="acb-title">Authenticated!</div>
              <div className="acb-sub">Redirecting you to your dashboard…</div>
            </>
          )}
          {status === "error" && (
            <>
              <div style={{ fontSize: 36, marginBottom: 14 }}>❌</div>
              <div className="acb-title">Sign-in failed</div>
              <div className="acb-err">
                {errorMsg} <br /><br />
                <a href="/login">← Back to login</a>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}