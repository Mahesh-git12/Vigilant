// import React from "react";
// import { sharedCSS } from "./theme";

// const landingCSS = `
//   ${sharedCSS}

//   .v-landing-right {
//     width: 500px;
//     flex-shrink: 0;
//     display: flex;
//     flex-direction: column;
//     justify-content: center;
//     padding: 60px 52px;
//     position: relative;
//     background: var(--surface);
//     border-left: 1px solid var(--border);
//   }

//   .v-landing-right::before {
//     content: '';
//     position: absolute; top: 0; left: 0; right: 0; height: 2px;
//     background: linear-gradient(90deg, transparent, var(--accent), transparent);
//     animation: topLine 4s ease-in-out infinite;
//   }

//   .v-cta-stack {
//     display: flex; flex-direction: column; gap: 12px;
//     margin-top: 8px;
//   }

//   .v-cta-primary {
//     display: flex; align-items: center; justify-content: center; gap: 10px;
//     width: 100%; padding: 16px 24px;
//     background: var(--accent);
//     border: none; border-radius: var(--radius);
//     color: #020d0c;
//     font-family: 'Outfit', sans-serif;
//     font-size: 0.97rem; font-weight: 800;
//     letter-spacing: 0.01em;
//     cursor: pointer; text-decoration: none;
//     transition: all 0.2s ease;
//     box-shadow: 0 4px 20px var(--accent-glow);
//   }
//   .v-cta-primary:hover {
//     background: var(--accent-bright);
//     transform: translateY(-2px);
//     box-shadow: 0 8px 30px rgba(0,194,179,0.35);
//   }

//   .v-cta-secondary {
//     display: flex; align-items: center; justify-content: center;
//     width: 100%; padding: 15px 24px;
//     background: transparent;
//     border: 1px solid var(--border);
//     border-radius: var(--radius);
//     color: var(--text-primary);
//     font-family: 'Outfit', sans-serif;
//     font-size: 0.9rem; font-weight: 600;
//     cursor: pointer; text-decoration: none;
//     transition: all 0.2s ease;
//   }
//   .v-cta-secondary:hover {
//     border-color: var(--accent);
//     color: var(--accent);
//     background: var(--accent-dim);
//   }

//   .v-landing-eyebrow {
//     display: flex; align-items: center; gap: 10px;
//     margin-bottom: 24px;
//   }

//   .v-landing-divider {
//     height: 1px; background: var(--border);
//     margin: 28px 0;
//   }

//   .v-trust-row {
//     display: flex; align-items: center; gap: 0;
//     flex-direction: column;
//     gap: 10px;
//   }
//   .v-trust-item {
//     display: flex; align-items: center; gap: 10px;
//     font-size: 0.78rem; color: var(--text-muted);
//     padding: 10px 14px;
//     background: rgba(255,255,255,0.02);
//     border: 1px solid var(--border);
//     border-radius: var(--radius);
//     width: 100%;
//   }
//   .v-trust-icon {
//     width: 28px; height: 28px;
//     background: var(--accent-dim);
//     border-radius: 7px;
//     display: flex; align-items: center; justify-content: center;
//     flex-shrink: 0;
//     font-size: 13px;
//   }

//   .v-landing-steps {
//     display: flex; flex-direction: column; gap: 12px;
//     margin-top: 4px;
//   }
//   .v-step {
//     display: flex; align-items: flex-start; gap: 16px;
//     padding: 16px 20px;
//     background: var(--surface);
//     border: 1px solid var(--border);
//     border-radius: var(--radius);
//     transition: border-color 0.2s;
//   }
//   .v-step:hover { border-color: rgba(0,194,179,0.25); }
//   .v-step-num {
//     width: 28px; height: 28px; border-radius: 8px;
//     background: var(--accent-dim);
//     border: 1px solid rgba(0,194,179,0.25);
//     display: flex; align-items: center; justify-content: center;
//     font-family: 'JetBrains Mono', monospace;
//     font-size: 0.68rem; font-weight: 600; color: var(--accent);
//     flex-shrink: 0; margin-top: 1px;
//   }
//   .v-step-body {}
//   .v-step-title { font-size: 0.88rem; font-weight: 600; color: var(--text-primary); }
//   .v-step-desc  { font-size: 0.78rem; color: var(--text-secondary); margin-top: 3px; line-height: 1.5; }
// `;

// function ShieldSVG() {
//   return (
//     <svg width="22" height="24" viewBox="0 0 22 24" fill="none">
//       <path d="M11 1L2 4.75V11C2 16.4 6 21.4 11 23C16 21.4 20 16.4 20 11V4.75L11 1Z"
//         fill="rgba(0,194,179,0.2)" stroke="rgba(0,194,179,0.7)" strokeWidth="1.5"/>
//       <path d="M7.5 11.5L9.5 13.5L14.5 8.5" stroke="#00C2B3" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
//     </svg>
//   );
// }

// export default function Landing() {
//   return (
//     <>
//       <style>{landingCSS}</style>
//       <div className="v-root">
//         <div className="v-grid-bg" />

//         {/* LEFT */}
//         <div className="v-left">
//           <div className="v-left-glow" /><div className="v-left-glow2" />
//           <div className="v-left-content">
//             {/* Logo */}
//             <div className="v-logo">
//               <div className="v-logo-mark"><ShieldSVG /></div>
//               <span className="v-logo-name">Vigi<em>lant</em></span>
//             </div>

//             {/* Headline */}
//             <div className="v-headline">
//               <span className="v-headline-eyebrow">Women Safety Platform</span>
//               <h1 className="v-headline-title">
//                 Safety infrastructure<br/>built for <em>real emergencies</em>
//               </h1>
//               <p className="v-headline-sub">
//                 Community-powered emergency response. Connect with nearest verified helpers, share your location, and trigger alerts — all in under 10 seconds.
//               </p>
//             </div>

//             {/* Steps */}
//             <div className="v-landing-steps">
//               {[
//                 { n: "01", title: "Register & Share Location", desc: "Create your account with live GPS — helps us connect you to the right people." },
//                 { n: "02", title: "Tap SOS When Needed",       desc: "One button instantly notifies the 5 nearest active helpers around you." },
//                 { n: "03", title: "Help Arrives Fast",         desc: "Helpers get push + email alerts with your exact coordinates." },
//               ].map(s => (
//                 <div className="v-step" key={s.n}>
//                   <div className="v-step-num">{s.n}</div>
//                   <div className="v-step-body">
//                     <div className="v-step-title">{s.title}</div>
//                     <div className="v-step-desc">{s.desc}</div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Stats */}
//             <div className="v-stats">
//               {[
//                 { num: "< 10s", label: "Alert Dispatch" },
//                 { num: "98%",   label: "Response Rate" },
//                 { num: "24/7",  label: "Always Active" },
//               ].map(s => (
//                 <div className="v-stat" key={s.label}>
//                   <div className="v-stat-num">{s.num}</div>
//                   <div className="v-stat-label">{s.label}</div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* RIGHT */}
//         <div className="v-landing-right">
//           <div className="v-landing-eyebrow">
//             <div className="v-status-badge">
//               <span className="v-status-dot" />
//               System Operational
//             </div>
//           </div>

//           <div style={{ marginBottom: 36 }}>
//             <h2 style={{ fontSize: "1.9rem", fontWeight: 800, letterSpacing: "-0.025em", marginBottom: 10, color: "var(--text-primary)", lineHeight: 1.15 }}>
//               Start protecting<br/>yourself today
//             </h2>
//             <p style={{ fontSize: "0.87rem", color: "var(--text-muted)", lineHeight: 1.65 }}>
//               Join users who rely on Vigilant for fast, community-driven emergency response.
//             </p>
//           </div>

//           <div className="v-cta-stack">
//             <a href="/register" className="v-cta-primary">
//               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
//               Create Free Account
//             </a>
//             <a href="/login" className="v-cta-secondary">
//               Sign in to Dashboard
//             </a>
//           </div>

//           <div className="v-landing-divider" />

//           <div className="v-trust-row">
//             {[
//               { icon: "🔒", text: "End-to-end encrypted", sub: "Your data never leaves our secure servers unprotected" },
//               { icon: "📍", text: "Live GPS tracking",    sub: "Location shared only during active SOS events" },
//               { icon: "⚡", text: "Instant notifications", sub: "Helpers alerted within seconds of your SOS" },
//             ].map(t => (
//               <div className="v-trust-item" key={t.text}>
//                 <div className="v-trust-icon">{t.icon}</div>
//                 <div>
//                   <div style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.82rem" }}>{t.text}</div>
//                   <div style={{ fontSize: "0.73rem", color: "var(--text-muted)", marginTop: 2, lineHeight: 1.45 }}>{t.sub}</div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

import React from "react";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap');
:root{--a:#00C2B3;--ad:rgba(0,194,179,0.11);--ag:rgba(0,194,179,0.22);--ab:#00DDD0;--bg:#090C0F;--s1:#0E1318;--s2:#131A21;--b:rgba(255,255,255,0.07);--ba:rgba(0,194,179,0.3);--tp:#E8EDF2;--ts:rgba(232,237,242,0.52);--tm:rgba(232,237,242,0.25);--rr:10px;--r2:14px;}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
.ln{min-height:100vh;width:100%;background:var(--bg);color:var(--tp);font-family:'Outfit',sans-serif;display:flex;flex-direction:column;position:relative;overflow-x:hidden;}
.ln-gbg{position:fixed;inset:0;z-index:0;pointer-events:none;background-image:linear-gradient(rgba(0,194,179,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,194,179,.03) 1px,transparent 1px);background-size:44px 44px;mask-image:radial-gradient(ellipse 100% 60% at 50% 0%,black 20%,transparent 100%);}
.ln-orb1{position:absolute;width:500px;height:500px;border-radius:50%;background:radial-gradient(circle,rgba(0,194,179,.07) 0%,transparent 65%);top:-120px;left:-100px;pointer-events:none;animation:o1 12s ease-in-out infinite alternate;}
.ln-orb2{position:absolute;width:380px;height:380px;border-radius:50%;background:radial-gradient(circle,rgba(0,194,179,.05) 0%,transparent 65%);bottom:60px;right:-80px;pointer-events:none;animation:o2 9s ease-in-out infinite alternate-reverse;}
@keyframes o1{from{transform:translate(0,0)}to{transform:translate(25px,30px)}}
@keyframes o2{from{transform:translate(0,0)}to{transform:translate(-20px,25px)}}
.ln-body{position:relative;z-index:1;flex:1;display:flex;align-items:stretch;max-width:1280px;width:100%;margin:0 auto;padding:0 24px;}
.ln-left{flex:1;display:flex;flex-direction:column;justify-content:center;padding:60px 48px 60px 0;gap:32px;}
.ln-logo{display:flex;align-items:center;gap:12px;}
.ln-lm{width:42px;height:42px;border-radius:11px;background:var(--ad);border:1.5px solid var(--ba);display:flex;align-items:center;justify-content:center;}
.ln-ln{font-size:1.4rem;font-weight:800;letter-spacing:-.02em;color:var(--tp);}
.ln-ln em{color:var(--a);font-style:normal;}
.ln-ey{font-family:'JetBrains Mono',monospace;font-size:.68rem;font-weight:600;color:var(--a);text-transform:uppercase;letter-spacing:.14em;display:flex;align-items:center;gap:8px;}
.ln-ey::before{content:'';display:inline-block;width:18px;height:1.5px;background:var(--a);}
.ln-h1{font-size:clamp(1.9rem,4vw,3rem);font-weight:800;letter-spacing:-.03em;line-height:1.1;}
.ln-h1 em{color:var(--a);font-style:normal;}
.ln-sub{font-size:.95rem;color:var(--ts);line-height:1.65;max-width:440px;}
.ln-steps{display:flex;flex-direction:column;gap:10px;}
.ln-step{display:flex;align-items:flex-start;gap:14px;padding:14px 18px;background:var(--s1);border:1px solid var(--b);border-radius:var(--r2);transition:border-color .2s;}
.ln-step:hover{border-color:rgba(0,194,179,.22);}
.ln-sn{width:26px;height:26px;border-radius:7px;background:var(--ad);border:1px solid rgba(0,194,179,.22);display:flex;align-items:center;justify-content:center;font-family:'JetBrains Mono',monospace;font-size:.65rem;font-weight:600;color:var(--a);flex-shrink:0;margin-top:1px;}
.ln-st{font-size:.87rem;font-weight:600;color:var(--tp);margin-bottom:2px;}
.ln-sd{font-size:.76rem;color:var(--ts);line-height:1.5;}
.ln-stats{display:flex;gap:12px;}
.ln-stat{flex:1;padding:14px 10px;background:var(--s1);border:1px solid var(--b);border-radius:var(--r2);text-align:center;}
.ln-snum{font-family:'JetBrains Mono',monospace;font-size:1.25rem;font-weight:600;color:var(--a);line-height:1;margin-bottom:4px;}
.ln-slbl{font-size:.68rem;color:var(--tm);}
.ln-div{width:1px;background:var(--b);align-self:stretch;margin:40px 0;flex-shrink:0;}
.ln-right{width:440px;flex-shrink:0;display:flex;flex-direction:column;justify-content:center;padding:60px 0 60px 48px;gap:22px;position:relative;}
.ln-right::before{content:'';position:absolute;top:40px;bottom:40px;left:0;width:1px;background:var(--b);}
.ln-badge{display:inline-flex;align-items:center;gap:7px;padding:5px 12px;background:rgba(0,194,179,.07);border:1px solid rgba(0,194,179,.18);border-radius:100px;font-family:'JetBrains Mono',monospace;font-size:.63rem;color:var(--a);letter-spacing:.08em;text-transform:uppercase;}
.ln-bdot{width:5px;height:5px;border-radius:50%;background:var(--a);animation:bd 2s infinite;}
@keyframes bd{0%,100%{opacity:1}50%{opacity:.3}}
.ln-rt{font-size:1.7rem;font-weight:800;letter-spacing:-.025em;line-height:1.18;}
.ln-rs{font-size:.83rem;color:var(--tm);line-height:1.6;margin-top:8px;}
.ln-cta1{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;padding:14px 24px;background:var(--a);border:none;border-radius:var(--rr);color:#020d0c;font-family:'Outfit',sans-serif;font-size:.93rem;font-weight:800;letter-spacing:.01em;cursor:pointer;text-decoration:none;transition:all .2s;box-shadow:0 4px 18px var(--ag);}
.ln-cta1:hover{background:var(--ab);transform:translateY(-2px);box-shadow:0 8px 28px rgba(0,194,179,.35);}
.ln-cta2{display:flex;align-items:center;justify-content:center;width:100%;padding:13px 24px;background:transparent;border:1px solid var(--b);border-radius:var(--rr);color:var(--tp);font-family:'Outfit',sans-serif;font-size:.87rem;font-weight:600;text-decoration:none;transition:all .2s;}
.ln-cta2:hover{border-color:var(--ba);color:var(--a);background:var(--ad);}
.ln-trust{display:flex;flex-direction:column;gap:8px;}
.ln-ti{display:flex;align-items:flex-start;gap:10px;padding:10px 13px;background:rgba(255,255,255,.02);border:1px solid var(--b);border-radius:var(--rr);}
.ln-tic{width:26px;height:26px;background:var(--ad);border-radius:7px;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:12px;}
.ln-tit{font-size:.79rem;font-weight:600;color:var(--tp);margin-bottom:1px;}
.ln-tis{font-size:.7rem;color:var(--tm);line-height:1.45;}
/* footer */
.ln-ft{position:relative;z-index:1;border-top:1px solid var(--b);background:var(--s1);}
.ln-fti{max-width:1280px;margin:0 auto;padding:24px 28px;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;}
.ln-fb{display:flex;align-items:center;gap:9px;}
.ln-fbm{width:26px;height:26px;border-radius:6px;background:var(--ad);border:1px solid rgba(0,194,179,.22);display:flex;align-items:center;justify-content:center;}
.ln-fbn{font-size:.88rem;font-weight:700;color:var(--tp);}
.ln-fbn em{color:var(--a);font-style:normal;}
.ln-fc{text-align:center;}
.ln-fd{font-size:.73rem;color:var(--tm);line-height:1.65;}
.ln-fd strong{color:var(--ts);font-weight:600;}
.ln-fd a{color:var(--a);text-decoration:none;font-weight:500;}
.ln-fd a:hover{text-decoration:underline;}
.ln-fr{text-align:right;}
.ln-fcp{font-size:.7rem;color:var(--tm);}
.ln-ftag{font-size:.64rem;color:rgba(232,237,242,.16);margin-top:2px;font-family:'JetBrains Mono',monospace;}
/* responsive */
@media(max-width:960px){.ln-body{flex-direction:column;padding:0;}.ln-div{display:none;}.ln-left{padding:44px 24px 28px;gap:24px;}.ln-right{width:100%;padding:0 24px 44px;border-top:1px solid var(--b);}.ln-right::before{display:none;}}
@media(max-width:500px){.ln-left{padding:30px 16px 24px;gap:20px;}.ln-right{padding:0 16px 36px;}.ln-stats{gap:7px;}.ln-stat{padding:10px 8px;}.ln-snum{font-size:1rem;}.ln-h1{font-size:1.75rem;}.ln-fti{flex-direction:column;align-items:flex-start;gap:12px;}.ln-fr,.ln-fc{text-align:left;}}
`;

function ShieldSVG({ size = 20 }) {
  return (
    <svg width={size} height={size * 1.09} viewBox="0 0 22 24" fill="none">
      <path d="M11 1L2 4.75V11C2 16.4 6 21.4 11 23C16 21.4 20 16.4 20 11V4.75L11 1Z" fill="rgba(0,194,179,0.2)" stroke="rgba(0,194,179,0.7)" strokeWidth="1.5" />
      <path d="M7.5 11.5L9.5 13.5L14.5 8.5" stroke="#00C2B3" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Landing() {
  return (
    <>
      <style>{css}</style>
      <div className="ln">
        <div className="ln-gbg" />
        <div className="ln-body">
          <div className="ln-orb1" /><div className="ln-orb2" />
          {/* LEFT */}
          <div className="ln-left">
            <div className="ln-logo">
              <div className="ln-lm"><ShieldSVG size={22} /></div>
              <span className="ln-ln">Vigi<em>lant</em></span>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:11}}>
              <span className="ln-ey">Women Safety Platform</span>
              <h1 className="ln-h1">Safety infrastructure<br/>built for <em>real emergencies</em></h1>
              <p className="ln-sub">Community-powered emergency response. Connect with nearest verified helpers, share your location, and trigger alerts — all in under 10 seconds.</p>
            </div>
            <div className="ln-steps">
              {[{n:'01',t:'Register & Share Location',d:'Create your account with live GPS — helps us connect you to the right people instantly.'},{n:'02',t:'Tap SOS When Needed',d:'One button instantly notifies the 5 nearest active helpers and your emergency contacts.'},{n:'03',t:'Help Arrives Fast',d:'Helpers receive push + email alerts with your exact GPS coordinates within seconds.'}].map(s=>(
                <div className="ln-step" key={s.n}>
                  <div className="ln-sn">{s.n}</div>
                  <div><div className="ln-st">{s.t}</div><div className="ln-sd">{s.d}</div></div>
                </div>
              ))}
            </div>
            <div className="ln-stats">
              {[{n:'< 10s',l:'Alert Dispatch'},{n:'98%',l:'Response Rate'},{n:'24/7',l:'Always Active'}].map(s=>(
                <div className="ln-stat" key={s.l}><div className="ln-snum">{s.n}</div><div className="ln-slbl">{s.l}</div></div>
              ))}
            </div>
          </div>
          <div className="ln-div" />
          {/* RIGHT */}
          <div className="ln-right">
            <div className="ln-badge"><span className="ln-bdot"/>System Operational</div>
            <div>
              <div className="ln-rt">Start protecting<br/>yourself today</div>
              <p className="ln-rs">Join users who rely on Vigilant for fast, community-driven emergency response.</p>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              <a href="/register" className="ln-cta1">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
                Create Free Account
              </a>
              <a href="/login" className="ln-cta2">Sign in to Dashboard</a>
            </div>
            <div style={{height:1,background:'var(--b)'}}/>
            <div className="ln-trust">
              {[{ic:'🔒',t:'End-to-end encrypted',s:'Your data never leaves our secure servers unprotected'},{ic:'📍',t:'Live GPS tracking',s:'Location shared only during active SOS events'},{ic:'⚡',t:'Instant notifications',s:'Helpers alerted within seconds of your SOS trigger'}].map(t=>(
                <div className="ln-ti" key={t.t}>
                  <div className="ln-tic">{t.ic}</div>
                  <div><div className="ln-tit">{t.t}</div><div className="ln-tis">{t.s}</div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* FOOTER */}
        <footer className="ln-ft">
          <div className="ln-fti">
            <div className="ln-fb">
              <div className="ln-fbm"><ShieldSVG size={13}/></div>
              <span className="ln-fbn">Vigi<em>lant</em></span>
            </div>
            <div className="ln-fc">
              <div className="ln-fd">
                Designed &amp; developed by <strong>Mahesh K P</strong><br/>
                <a href="mailto:maheshkokkanti12@gmail.com">maheshkokkanti12@gmail.com</a>
              </div>
            </div>
            <div className="ln-fr">
              <div className="ln-fcp">© {new Date().getFullYear()} Vigilant. All rights reserved.</div>
              <div className="ln-ftag">Built for safety. Made with care.</div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}