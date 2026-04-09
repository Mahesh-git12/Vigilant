import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { getDistance } from "geolib";
import MapView from "../components/MapView";
import HandsFreeVoiceSOS from "../components/HandsFreeVoiceSOS";

const API_URL = process.env.REACT_APP_API_URL;

// ─── helpers ──────────────────────────────────────────────────────────────────
function calcETA(uLat, uLng, hLat, hLng) {
  const m = getDistance({ latitude: uLat, longitude: uLng }, { latitude: hLat, longitude: hLng });
  const km = (m / 1000).toFixed(2);
  const eta = Math.max(1, Math.round((km / 5) * 60));
  return { km, eta };
}
function fmtLoc(loc) {
  if (!loc) return "Unknown location";
  if (loc.startsWith("http")) {
    const m = loc.match(/query=([\d.-]+),([\d.-]+)/);
    return m ? `${parseFloat(m[1]).toFixed(4)}, ${parseFloat(m[2]).toFixed(4)}` : "Map location";
  }
  const m = loc.match(/([\d.-]+)[,\s]+([\d.-]+)/);
  return m ? `${parseFloat(m[1]).toFixed(4)}, ${parseFloat(m[2]).toFixed(4)}` : loc;
}
function fmtDesc(d) {
  return (d || "").replace(/🚨|⚠️|🔴/g, "").replace(/Vigilant AI has detected a potential threat:/i, "AI:").trim();
}
function timeAgo(s) {
  const d = (Date.now() - new Date(s)) / 1000;
  if (d < 60) return "just now";
  if (d < 3600) return `${Math.floor(d / 60)}m ago`;
  if (d < 86400) return `${Math.floor(d / 3600)}h ago`;
  return new Date(s).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap');
:root{--a:#00C2B3;--ad:rgba(0,194,179,0.11);--ag:rgba(0,194,179,0.22);--ab:#00DDD0;--r:#FF4444;--rd:rgba(255,68,68,0.11);--g:#00C27A;--gd:rgba(0,194,122,0.11);--w:#FF8C00;--wd:rgba(255,140,0,0.11);--bg:#090C0F;--s1:#0E1318;--s2:#131A21;--s3:#182028;--b:rgba(255,255,255,0.07);--ba:rgba(0,194,179,0.3);--tp:#E8EDF2;--ts:rgba(232,237,242,0.52);--tm:rgba(232,237,242,0.25);--rr:10px;--r2:14px;--r3:18px;}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
.hp{min-height:100vh;width:100%;background:var(--bg);color:var(--tp);font-family:'Outfit',sans-serif;position:relative;}
.hp-gbg{position:fixed;inset:0;z-index:0;pointer-events:none;background-image:linear-gradient(rgba(0,194,179,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,194,179,.03) 1px,transparent 1px);background-size:44px 44px;mask-image:radial-gradient(ellipse 100% 60% at 50% 0%,black 20%,transparent 100%);}
.hp-w{position:relative;z-index:1;max-width:1240px;margin:0 auto;padding:28px 28px 64px;}

/* top bar */
.hp-top{display:flex;align-items:center;gap:14px;margin-bottom:26px;padding-bottom:22px;border-bottom:1px solid var(--b);}
.hp-av{width:44px;height:44px;border-radius:11px;background:var(--ad);border:1.5px solid var(--ba);display:flex;align-items:center;justify-content:center;font-size:1.1rem;font-weight:700;color:var(--a);flex-shrink:0;}
.hp-uw{font-size:.67rem;font-weight:600;color:var(--tm);text-transform:uppercase;letter-spacing:.1em;font-family:'JetBrains Mono',monospace;margin-bottom:2px;}
.hp-un{font-size:1.2rem;font-weight:800;letter-spacing:-.02em;line-height:1.1;}
.hp-tr{display:flex;align-items:center;gap:10px;margin-left:auto;}
.hp-badge{display:inline-flex;align-items:center;gap:6px;padding:5px 11px;background:rgba(0,194,179,.07);border:1px solid rgba(0,194,179,.18);border-radius:100px;font-family:'JetBrains Mono',monospace;font-size:.64rem;color:var(--a);letter-spacing:.08em;text-transform:uppercase;white-space:nowrap;}
.hp-dot{width:5px;height:5px;border-radius:50%;background:var(--a);animation:hpd 2s infinite;}
@keyframes hpd{0%,100%{opacity:1}50%{opacity:.3}}
.hp-pb{display:inline-flex;align-items:center;gap:7px;padding:7px 15px;background:transparent;border:1px solid var(--b);border-radius:var(--rr);color:var(--ts);font-family:'Outfit',sans-serif;font-size:.8rem;font-weight:600;cursor:pointer;text-decoration:none;transition:all .18s;}
.hp-pb:hover{border-color:var(--ba);color:var(--a);background:var(--ad);}

/* stats */
.hp-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:22px;}
.hp-sc{background:var(--s1);border:1px solid var(--b);border-radius:var(--r2);padding:17px 19px;transition:border-color .2s,background .2s;cursor:default;}
.hp-sc:hover{border-color:rgba(255,255,255,.1);background:var(--s2);}
.hp-sct{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;}
.hp-scl{font-size:.67rem;font-weight:700;text-transform:uppercase;letter-spacing:.09em;color:var(--tm);}
.hp-sci{width:28px;height:28px;border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:13px;}
.hp-scn{font-family:'JetBrains Mono',monospace;font-size:1.7rem;font-weight:700;line-height:1;margin-bottom:3px;}
.hp-scs{font-size:.71rem;color:var(--tm);}

/* 3-col main */
.hp-main{display:grid;grid-template-columns:1fr 1fr 320px;gap:18px;margin-bottom:18px;align-items:start;}

/* SOS card */
.hp-sos{background:var(--s1);border:1px solid var(--b);border-radius:var(--r3);padding:30px 24px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:18px;position:relative;overflow:hidden;}
.hp-sos::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,var(--r),transparent);animation:sb 3s ease-in-out infinite;}
@keyframes sb{0%,100%{opacity:.4}50%{opacity:1}}
.hp-sos-ey{font-family:'JetBrains Mono',monospace;font-size:.61rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--r);display:flex;align-items:center;gap:8px;}
.hp-sos-ey::before,.hp-sos-ey::after{content:'';display:inline-block;width:14px;height:1px;background:var(--r);}
.hp-sos-btn{width:130px;height:130px;border-radius:50%;background:var(--r);border:none;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;transition:all .22s;box-shadow:0 0 0 0 rgba(255,68,68,.4);animation:sr 2.8s ease-in-out infinite;}
@keyframes sr{0%{box-shadow:0 0 0 0 rgba(255,68,68,.45)}70%{box-shadow:0 0 0 18px rgba(255,68,68,0)}100%{box-shadow:0 0 0 0 rgba(255,68,68,0)}}
.hp-sos-btn:hover{background:#e03030;transform:scale(1.07);animation:none;box-shadow:0 10px 36px rgba(255,68,68,.55);}
.hp-sos-btn:active{transform:scale(.97);}
.hp-sos-lbl{font-family:'JetBrains Mono',monospace;font-size:1.4rem;font-weight:700;color:#fff;letter-spacing:.06em;}
.hp-sos-sub{font-size:.59rem;font-weight:500;color:rgba(255,255,255,.6);text-transform:uppercase;letter-spacing:.05em;}
.hp-sos-desc{font-size:.75rem;color:var(--tm);line-height:1.55;max-width:210px;}
.hp-sos-row{display:flex;align-items:center;gap:8px;padding:7px 13px;background:var(--s2);border:1px solid var(--b);border-radius:var(--rr);font-size:.74rem;color:var(--ts);}
.hp-sos-row strong{color:var(--a);}

/* FindHelper card */
.hp-fh{background:var(--s1);border:1px solid var(--b);border-radius:var(--r3);padding:24px;display:flex;flex-direction:column;gap:14px;position:relative;overflow:hidden;}
.hp-fh::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,var(--a),transparent);animation:sb 3s ease-in-out infinite;}
.hp-fhh{display:flex;align-items:flex-start;gap:11px;}
.hp-fhi{width:38px;height:38px;border-radius:10px;background:var(--ad);border:1px solid var(--ba);display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.hp-fht{font-size:.92rem;font-weight:700;color:var(--tp);margin-bottom:2px;}
.hp-fhs{font-size:.7rem;color:var(--tm);}
.hp-live{display:flex;align-items:center;gap:6px;padding:4px 10px;background:rgba(0,194,179,.06);border:1px solid rgba(0,194,179,.15);border-radius:100px;font-size:.64rem;color:var(--a);font-family:'JetBrains Mono',monospace;width:fit-content;margin-left:auto;}
.hp-live span{width:5px;height:5px;border-radius:50%;background:var(--g);box-shadow:0 0 5px var(--g);animation:hpd 1.8s infinite;}
.hp-scan-btn{width:100%;padding:11px;background:var(--a);border:none;border-radius:var(--rr);color:#020d0c;font-family:'Outfit',sans-serif;font-size:.86rem;font-weight:800;cursor:pointer;transition:all .2s;display:flex;align-items:center;justify-content:center;gap:8px;}
.hp-scan-btn:hover:not(:disabled){background:var(--ab);transform:translateY(-1px);box-shadow:0 5px 20px var(--ag);}
.hp-scan-btn:disabled{opacity:.4;cursor:not-allowed;}
.hp-fh-map{border-radius:var(--rr);overflow:hidden;border:1px solid var(--b);position:relative;}
.hp-fh-ml{position:absolute;bottom:8px;left:50%;transform:translateX(-50%);background:rgba(9,12,15,.82);backdrop-filter:blur(8px);border:1px solid var(--b);border-radius:100px;padding:3px 12px;font-size:.63rem;color:var(--ts);white-space:nowrap;}
.hp-fh-sel-lbl{font-size:.66rem;font-weight:700;text-transform:uppercase;letter-spacing:.09em;color:var(--tm);}
.hp-scroll{overflow-y:auto;max-height:200px;display:flex;flex-direction:column;gap:6px;}
.hp-scroll::-webkit-scrollbar{width:3px;}
.hp-scroll::-webkit-scrollbar-thumb{background:var(--b);border-radius:2px;}
.hp-hr{display:flex;align-items:center;gap:9px;padding:8px 11px;border-radius:var(--rr);background:var(--s2);border:1px solid var(--b);cursor:pointer;transition:all .16s;user-select:none;}
.hp-hr:hover{border-color:var(--ba);background:var(--s3);}
.hp-hr.sel{border-color:rgba(0,194,179,.35);background:var(--ad);}
.hp-hav{width:30px;height:30px;border-radius:7px;background:var(--s3);border:1px solid var(--b);display:flex;align-items:center;justify-content:center;font-size:.75rem;font-weight:700;flex-shrink:0;transition:background .16s;color:var(--tp);}
.hp-hr.sel .hp-hav{background:var(--a);color:#020d0c;}
.hp-hname{font-size:.8rem;font-weight:600;flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.hp-hdist{display:flex;flex-direction:column;align-items:flex-end;}
.hp-hkm{font-family:'JetBrains Mono',monospace;font-size:.68rem;font-weight:600;color:var(--a);}
.hp-heta{font-size:.62rem;color:var(--tm);}
.hp-ck{width:15px;height:15px;border-radius:4px;border:1.5px solid var(--b);background:var(--bg);flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:all .15s;}
.hp-hr.sel .hp-ck{background:var(--a);border-color:var(--a);}
.hp-fhfoot{display:flex;gap:8px;}
.hp-cancel{flex:1;padding:9px;background:transparent;border:1px solid var(--b);border-radius:var(--rr);color:var(--ts);font-family:'Outfit',sans-serif;font-size:.78rem;font-weight:600;cursor:pointer;transition:all .18s;}
.hp-cancel:hover{border-color:var(--ba);color:var(--tp);}
.hp-send{flex:2;padding:10px;background:var(--r);border:none;border-radius:var(--rr);color:#fff;font-family:'Outfit',sans-serif;font-size:.82rem;font-weight:800;cursor:pointer;transition:all .2s;display:flex;align-items:center;justify-content:center;gap:6px;}
.hp-send:hover:not(:disabled){background:#e03030;transform:translateY(-1px);box-shadow:0 5px 20px rgba(255,68,68,.4);}
.hp-send:disabled{opacity:.4;cursor:not-allowed;}

/* sidebar */
.hp-side{display:flex;flex-direction:column;gap:14px;}
.hp-card{background:var(--s1);border:1px solid var(--b);border-radius:var(--r2);}
.hp-chd{padding:15px 17px 0;display:flex;align-items:center;justify-content:space-between;}
.hp-ctitle{font-size:.86rem;font-weight:700;}
.hp-clink{font-size:.74rem;color:var(--a);text-decoration:none;display:flex;align-items:center;gap:4px;font-weight:600;transition:opacity .15s;}
.hp-clink:hover{opacity:.7;}
.hp-cbody{padding:12px 16px 16px;}
.hp-acts{display:flex;flex-direction:column;gap:5px;}
.hp-act{display:flex;align-items:center;gap:10px;padding:9px 11px;background:var(--s2);border:1px solid var(--b);border-radius:var(--rr);color:var(--ts);text-decoration:none;font-size:.78rem;font-weight:500;transition:all .16s;}
.hp-act:hover{border-color:var(--ba);color:var(--tp);background:var(--s3);transform:translateX(2px);}
.hp-aic{width:24px;height:24px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0;}
.hp-arr{margin-left:auto;color:var(--tm);transition:transform .16s,color .16s;}
.hp-act:hover .hp-arr{transform:translateX(3px);color:var(--a);}

/* activity */
.hp-actsec{background:var(--s1);border:1px solid var(--b);border-radius:var(--r3);overflow:hidden;margin-bottom:16px;}
.hp-ahd{display:flex;align-items:center;justify-content:space-between;padding:17px 22px;border-bottom:1px solid var(--b);}
.hp-ahdtitle{font-size:.88rem;font-weight:700;}
.hp-irow{display:flex;align-items:flex-start;gap:12px;padding:13px 22px;border-bottom:1px solid var(--b);transition:background .15s;}
.hp-irow:last-child{border-bottom:none;}
.hp-irow:hover{background:var(--s2);}
.hp-ibadge{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px;font-size:13px;}
.hp-ibody{flex:1;min-width:0;}
.hp-iloc{font-size:.77rem;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:2px;}
.hp-idesc{font-size:.72rem;color:var(--ts);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:5px;}
.hp-imeta{display:flex;align-items:center;gap:7px;flex-wrap:wrap;}
.hp-itime{font-family:'JetBrains Mono',monospace;font-size:.62rem;color:var(--tm);}
.hp-chip{display:inline-flex;align-items:center;padding:2px 7px;border-radius:100px;font-size:.59rem;font-weight:700;text-transform:uppercase;letter-spacing:.04em;}

/* misc */
.hp-empty{text-align:center;padding:34px 24px;}
.hp-ei{font-size:2rem;opacity:.28;margin-bottom:8px;}
.hp-et{font-size:.8rem;color:var(--tm);}
.hp-tip{background:var(--s1);border:1px solid var(--b);border-left:3px solid var(--a);border-radius:var(--r2);padding:16px 18px;display:flex;gap:13px;}
.hp-tic{width:28px;height:28px;border-radius:7px;background:var(--ad);border:1px solid rgba(0,194,179,.18);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:13px;}
.hp-tit{font-size:.8rem;font-weight:700;margin-bottom:5px;}
.hp-til{font-size:.73rem;color:var(--ts);display:flex;gap:5px;line-height:1.4;margin-bottom:2px;}
.hp-til::before{content:'›';color:var(--a);font-weight:700;flex-shrink:0;}
.hp-spin{width:18px;height:18px;border-radius:50%;border:2.5px solid rgba(0,0,0,.18);border-top-color:rgba(0,0,0,.7);animation:sp .65s linear infinite;display:inline-block;}
.hp-spinw{border:2.5px solid rgba(255,255,255,.2);border-top-color:#fff;}
.hp-spina{border:2.5px solid var(--b);border-top-color:var(--a);}
@keyframes sp{to{transform:rotate(360deg)}}
.hp-skel{background:linear-gradient(90deg,var(--s2) 25%,var(--s3) 50%,var(--s2) 75%);background-size:200% 100%;animation:sk 1.4s infinite;border-radius:6px;}
@keyframes sk{0%{background-position:200% 0}100%{background-position:-200% 0}}
.hp-snack{position:fixed;bottom:26px;left:50%;transform:translateX(-50%);z-index:9999;display:flex;align-items:center;gap:9px;padding:11px 20px;border-radius:var(--rr);font-size:.82rem;font-weight:500;box-shadow:0 8px 30px rgba(0,0,0,.5);animation:snk .25s ease;min-width:240px;max-width:420px;}
@keyframes snk{from{opacity:0;transform:translate(-50%,10px)}to{opacity:1;transform:translate(-50%,0)}}
.hp-snack.s{background:#0d2a1e;border:1px solid rgba(0,194,122,.28);color:#4ade9a}
.hp-snack.w{background:#211600;border:1px solid rgba(255,140,0,.28);color:#fbbf24}
.hp-snack.e{background:#1f0a0a;border:1px solid rgba(255,68,68,.28);color:#f87171}
@media(max-width:1080px){.hp-main{grid-template-columns:1fr 1fr}.hp-side{grid-column:1/-1;display:grid;grid-template-columns:1fr}.hp-stats{grid-template-columns:repeat(2,1fr)}}
@media(max-width:680px){.hp-main{grid-template-columns:1fr}.hp-stats{grid-template-columns:repeat(2,1fr)}.hp-w{padding:20px 16px 60px}.hp-tr .hp-badge{display:none}}
`;

const Arr = () => (
  <svg className="hp-arr" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

// ─── FindHelper inline panel ──────────────────────────────────────────────────
function FindHelperPanel({ token, profile, onAlert }) {
  const [phase, setPhase] = useState("idle"); // idle|locating|found|alerting
  const [helpers, setHelpers] = useState([]);
  const [selected, setSelected] = useState([]);
  const [coords, setCoords] = useState(null);
  const [updatedAt, setUpdatedAt] = useState(null);
  const watchRef = useRef(null);

  useEffect(() => {
    if (phase === "found") {
      if (!navigator.geolocation) return;
      watchRef.current = navigator.geolocation.watchPosition(
        p => { setCoords({ latitude: p.coords.latitude, longitude: p.coords.longitude }); setUpdatedAt(new Date()); },
        () => {},
        { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
      );
    } else {
      if (watchRef.current != null) { navigator.geolocation.clearWatch(watchRef.current); watchRef.current = null; }
    }
    return () => { if (watchRef.current != null) { navigator.geolocation.clearWatch(watchRef.current); watchRef.current = null; } };
  }, [phase]);

  const scan = () => {
    if (!navigator.geolocation) return;
    setPhase("locating");
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        setCoords({ latitude, longitude });
        setUpdatedAt(new Date());
        axios.get(`${API_URL}/api/users/nearest?latitude=${latitude}&longitude=${longitude}&limit=5`, { headers: { Authorization: `Bearer ${token}` } })
          .then(r => { setHelpers(r.data); setSelected(r.data.slice(0, 1).map(u => u._id)); setPhase("found"); })
          .catch(() => setPhase("idle"));
      },
      () => setPhase("idle"),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const toggle = id => setSelected(p => p.includes(id) ? p.filter(v => v !== id) : [...p, id]);

  const sendAlerts = () => {
    if (!selected.length) return;
    setPhase("alerting");
    Promise.all(selected.map(hid =>
      axios.post(`${API_URL}/api/users/notify`,
        { userId: hid, message: `SOS alert from ${profile?.name || "User"}`, latitude: coords?.latitude, longitude: coords?.longitude },
        { headers: { Authorization: `Bearer ${token}` } }
      )
    ))
      .then(() => { onAlert && onAlert(selected.length); setPhase("idle"); setHelpers([]); setSelected([]); })
      .catch(() => setPhase("found"));
  };

  const getD = h => {
    if (!coords || !h.location?.coordinates) return null;
    const [lng, lat] = h.location.coordinates;
    return calcETA(coords.latitude, coords.longitude, lat, lng);
  };

  const fmtUp = () => {
    if (!updatedAt) return "";
    const s = Math.round((Date.now() - updatedAt) / 1000);
    if (s < 5) return "live"; if (s < 60) return `${s}s`; return `${Math.round(s / 60)}m`;
  };

  const leaf = coords ? [coords.latitude, coords.longitude] : null;

  return (
    <div className="hp-fh">
      <div className="hp-fhh">
        <div className="hp-fhi">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--a)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><path d="M11 8v6M8 11h6"/>
          </svg>
        </div>
        <div>
          <div className="hp-fht">Find Nearby Helper</div>
          <div className="hp-fhs">Locate & alert nearest users</div>
        </div>
        {phase === "found" && (
          <div className="hp-live" style={{ marginLeft: "auto" }}>
            <span />{fmtUp()}
          </div>
        )}
      </div>

      {phase === "idle" && (
        <>
          <p style={{ fontSize: ".74rem", color: "var(--tm)", lineHeight: 1.55 }}>
            Scan for registered Vigilant users near your current GPS position and send them an alert.
          </p>
          <button className="hp-scan-btn" onClick={scan}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
            </svg>
            Scan for Nearby Helpers
          </button>
        </>
      )}

      {(phase === "locating") && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: "14px 0" }}>
          <div className="hp-spin hp-spina" style={{ width: 26, height: 26 }} />
          <p style={{ fontSize: ".75rem", color: "var(--tm)" }}>Detecting location &amp; finding helpers…</p>
        </div>
      )}

      {phase === "found" && (
        <>
          {leaf && helpers.length > 0 && (
            <div className="hp-fh-map">
              <MapView userLocation={leaf} helpers={helpers} />
              <div className="hp-fh-ml">📍 Live tracking active</div>
            </div>
          )}
          <div className="hp-fh-sel-lbl">{helpers.length} helper{helpers.length !== 1 ? "s" : ""} found — tap to select</div>
          <div className="hp-scroll">
            {helpers.map(u => {
              const d = getD(u);
              const sel = selected.includes(u._id);
              return (
                <div key={u._id} className={`hp-hr${sel ? " sel" : ""}`} onClick={() => toggle(u._id)}>
                  <div className="hp-ck">
                    {sel && <svg width="8" height="6" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3 5.5L8 1" stroke="#020d0c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                  </div>
                  <div className="hp-hav">{(u.name?.[0] || "U").toUpperCase()}</div>
                  <span className="hp-hname">{u.name || "User"}</span>
                  {d && <div className="hp-hdist"><span className="hp-hkm">{d.km} km</span><span className="hp-heta">~{d.eta} min</span></div>}
                </div>
              );
            })}
          </div>
          <div className="hp-fhfoot">
            <button className="hp-cancel" onClick={() => { setPhase("idle"); setHelpers([]); }}>Cancel</button>
            <button className="hp-send" disabled={!selected.length} onClick={sendAlerts}>
              Send Alert to {selected.length || "—"} Helper{selected.length !== 1 ? "s" : ""}
            </button>
          </div>
        </>
      )}

      {phase === "alerting" && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: "14px 0" }}>
          <div className="hp-spin hp-spinw" style={{ width: 26, height: 26, borderTopColor: "var(--r)", borderColor: "rgba(255,68,68,.2)" }} />
          <p style={{ fontSize: ".75rem", color: "var(--tm)" }}>Sending alerts to {selected.length} helper{selected.length !== 1 ? "s" : ""}…</p>
        </div>
      )}
    </div>
  );
}

// ─── main ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [user, setUser] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [selected, setSelected] = useState([]);
  const [contactsLoaded, setContactsLoaded] = useState(false);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snack, setSnack] = useState(null);
  const token = localStorage.getItem("token");

  const toast = (msg, type = "s") => { setSnack({ msg, type }); setTimeout(() => setSnack(null), 4000); };

  useEffect(() => {
    (async () => {
      try {
        const [uR, cR, iR] = await Promise.all([
          axios.get(`${API_URL}/api/users/profile`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_URL}/api/users/emergency-contacts`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_URL}/api/incidents/my-incidents`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setUser(uR.data);
        setContacts(cR.data.emergencyContacts || []);
        setSelected((cR.data.emergencyContacts || []).map(c => c.email));
        setContactsLoaded(true);
        setIncidents(iR.data.incidents || []);
      } catch { toast("Failed to load dashboard.", "e"); }
      finally { setLoading(false); }
    })();
  }, [token]);

  const sendSOS = async (location, coords) => {
    try {
      const chosen = contacts.filter(c => selected.includes(c.email));
      if (!chosen.length) { toast("No contacts selected.", "w"); return; }
      await axios.post(`${API_URL}/api/incidents/sos`,
        { location, description: "SOS Emergency", contacts: chosen, latitude: coords?.latitude, longitude: coords?.longitude },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast("SOS dispatched — contacts have been alerted.", "s");
    } catch { toast("Failed to send SOS. Try again.", "e"); }
  };

  const handleSOS = () => {
    if (!contactsLoaded) { toast("Loading contacts…", "w"); return; }
    if (!selected.length) { toast("No emergency contacts available.", "w"); return; }
    navigator.geolocation?.getCurrentPosition(
      p => sendSOS(`Lat:${p.coords.latitude},Lon:${p.coords.longitude}`, p.coords),
      () => sendSOS("Unknown", {}),
      { timeout: 8000 }
    );
  };

  const recent = incidents.slice(0, 6);

  return (
    <>
      <style>{css}</style>
      <div className="hp">
        <div className="hp-gbg" />
        <div className="hp-w">

          {/* top */}
          <div className="hp-top">
            <div className="hp-av" style={{ overflow: 'hidden' }}>
  {user?.avatarUrl
    ? <img src={`${API_URL}${user.avatarUrl}`} alt={user?.name}
           style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:11 }} />
    : user?.name?.[0]?.toUpperCase() || 'U'
  }
</div>
            <div>
              <div className="hp-uw">Dashboard</div>
              <div className="hp-un">
                {loading ? <span className="hp-skel" style={{ display: "inline-block", width: 120, height: 20 }} /> : user?.name || "User"}
              </div>
            </div>
            <div className="hp-tr">
              <div className="hp-badge"><span className="hp-dot" />Active</div>
              <a href="/profile" className="hp-pb">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
                Profile
              </a>
            </div>
          </div>

          {/* stats */}
          <div className="hp-stats">
            {[
              { lbl: "Contacts",      num: loading ? "—" : contacts.length, sub: "Emergency contacts",  col: "var(--a)",  ic: "👥", bg: "var(--ad)" },
              { lbl: "Incidents",     num: loading ? "—" : incidents.length, sub: "Total logged",        col: "var(--r)",  ic: "⚠️", bg: "var(--rd)" },
              { lbl: "Response Rate", num: "98%",                            sub: "Platform average",    col: "var(--g)",  ic: "✅", bg: "var(--gd)" },
              { lbl: "Alert Time",    num: "< 60s",                          sub: "Avg dispatch",        col: "var(--a)",  ic: "⚡", bg: "rgba(255,200,0,.09)" },
            ].map(s => (
              <div className="hp-sc" key={s.lbl}>
                <div className="hp-sct">
                  <span className="hp-scl">{s.lbl}</span>
                  <div className="hp-sci" style={{ background: s.bg }}>{s.ic}</div>
                </div>
                <div className="hp-scn" style={{ color: s.col }}>{s.num}</div>
                <div className="hp-scs">{s.sub}</div>
              </div>
            ))}
          </div>

          {/* 3-col */}
          <div className="hp-main">

            {/* SOS */}
            <div className="hp-sos">
              <div className="hp-sos-ey">Emergency SOS</div>
              <button className="hp-sos-btn" onClick={handleSOS} aria-label="Send SOS">
                <span className="hp-sos-lbl">SOS</span>
                <span className="hp-sos-sub">Tap to alert</span>
              </button>
              <p className="hp-sos-desc">Instantly sends your GPS location to all emergency contacts.</p>
              <div className="hp-sos-row">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
                </svg>
                <span><strong>{contacts.length}</strong> contact{contacts.length !== 1 ? "s" : ""} ready</span>
              </div>
            </div>

            {/* FindHelper */}
            <FindHelperPanel token={token} profile={user} onAlert={n => toast(`Alert sent to ${n} helper${n > 1 ? "s" : ""}!`, "s")} />

            {/* Sidebar */}
            <div className="hp-side">
              <div className="hp-card">
                <div className="hp-chd"><span className="hp-ctitle">Quick Actions</span></div>
                <div className="hp-cbody">
                  <div className="hp-acts">
                    {[
                      { href: "/report",             ic: "📋", bg: "var(--wd)",  lbl: "Report Incident" },
                      { href: "/emergency-contacts", ic: "👥", bg: "var(--ad)",  lbl: "Manage Contacts" },
                      { href: "/notifications",      ic: "🔔", bg: "var(--ad)",  lbl: "Notifications" },
                      { href: "/safety-check",       ic: "🤖", bg: "rgba(168,0,255,.1)", lbl: "Safety AI" },
                      { href: "/my-incidents",       ic: "📂", bg: "var(--wd)",  lbl: "My Incidents" },
                      { href: "/resources",          ic: "📖", bg: "var(--gd)",  lbl: "Safety Resources" },
                    ].map(a => (
                      <a key={a.lbl} href={a.href} className="hp-act">
                        <div className="hp-aic" style={{ background: a.bg }}>{a.ic}</div>
                        {a.lbl}<Arr />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* recent activity */}
          <div className="hp-actsec">
            <div className="hp-ahd">
              <span className="hp-ahdtitle">Recent Activity</span>
              <a href="/my-incidents" className="hp-clink">
                View all
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </a>
            </div>
            {loading ? (
              <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: 10 }}>
                {[1, 2, 3].map(i => <div key={i} className="hp-skel" style={{ height: 50 }} />)}
              </div>
            ) : recent.length === 0 ? (
              <div className="hp-empty"><div className="hp-ei">🛡️</div><div className="hp-et">No incidents yet. Stay safe.</div></div>
            ) : (
              recent.map(inc => {
                const isSOS = inc.type === "sos";
                return (
                  <div key={inc._id} className="hp-irow">
                    <div className="hp-ibadge" style={{ background: isSOS ? "var(--rd)" : "var(--ad)" }}>
                      {isSOS ? "🆘" : "⚠️"}
                    </div>
                    <div className="hp-ibody">
                      <div className="hp-iloc"><span style={{ fontSize: ".64rem", color: "var(--tm)", marginRight: 4 }}>📍</span>{fmtLoc(inc.location)}</div>
                      <div className="hp-idesc">{fmtDesc(inc.description) || "—"}</div>
                      <div className="hp-imeta">
                        <span className="hp-itime">{timeAgo(inc.date)}</span>
                        <span className="hp-chip" style={{ background: isSOS ? "var(--rd)" : "var(--ad)", color: isSOS ? "#f87171" : "var(--a)", border: `1px solid ${isSOS ? "rgba(255,68,68,.2)" : "rgba(0,194,179,.2)"}` }}>
                          {(inc.type || "incident").toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {!loading && contacts.length === 0 && (
            <div className="hp-tip">
              <div className="hp-tic">💡</div>
              <div>
                <div className="hp-tit">Complete your safety setup</div>
                {["Add at least one emergency contact to activate SOS.", "Enable location permissions for accurate helper matching.", "Run a test SOS to verify your contacts get notified."].map(t => (
                  <div key={t} className="hp-til">{t}</div>
                ))}
              </div>
            </div>
          )}
        </div>

        <HandsFreeVoiceSOS onSOS={handleSOS} />

        {snack && (
          <div className={`hp-snack ${snack.type}`}>
            <span>{snack.type === "s" ? "✓" : snack.type === "w" ? "⚠" : "✕"}</span>
            {snack.msg}
          </div>
        )}
      </div>
    </>
  );
}