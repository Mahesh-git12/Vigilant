// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import {
//   Typography, Box, Card, CardContent, Button, CircularProgress,
//   Alert, Avatar, Stack
// } from '@mui/material';
// import LocationOnIcon from '@mui/icons-material/LocationOn';
// import PersonIcon from '@mui/icons-material/Person';
// import EmailIcon from '@mui/icons-material/Email';
// import AccessTimeIcon from '@mui/icons-material/AccessTime';
// import MapView from '../components/MapView';

// const API_URL = process.env.REACT_APP_API_URL;

// export default function Notifications() {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   // New: Track recipient's live location
//   const [myCoords, setMyCoords] = useState({ latitude: null, longitude: null });

//   // Get user geolocation once on mount
//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition((pos) => {
//         setMyCoords({
//           latitude: pos.coords.latitude,
//           longitude: pos.coords.longitude,
//         });
//       });
//     } 
//   }, []);

//   useEffect(() => {
//     async function fetchNotifications() {
//       try {
//         const token = localStorage.getItem('token');
//         if (!token) {
//           setError('User not logged in');
//           setLoading(false);
//           return;
//         }
//         const res = await axios.get(`${API_URL}/api/users/notifications`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setNotifications(res.data.notifications || []);
//       } catch (err) {
//         setError('Failed to load notifications');
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchNotifications();
//   }, []);

//   if (loading) {
//     return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
//   }
//   if (error) {
//     return <Alert severity="error" sx={{ mt: 4, mx: 'auto', maxWidth: 600 }}>{error}</Alert>;
//   }
//   if (!notifications.length) {
//     return <Typography variant="h6" sx={{ mt: 4, mx: 'auto', maxWidth: 600 }}>No notifications available.</Typography>;
//   }

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         width: "100vw",
//         background: "linear-gradient(135deg, #6a82fb 0%, #fc5c7d 100%)",
//         py: 4
//       }}
//     >
//       <Box sx={{ mx: "auto", maxWidth: 650, p: 1 }}>
//         <Typography
//           variant="h4"
//           gutterBottom
//           color="#fff"
//           sx={{ textAlign: "center", fontWeight: 700, textShadow: "0 1px 8px #3338" }}
//         >
//           Notifications
//         </Typography>
//         <Stack spacing={3}>
//           {notifications.map((n, i) => {
//             // Get sender info (from notification)
//             const senderLat = typeof n.location.latitude === "number" ? n.location.latitude : 0;
//             const senderLng = typeof n.location.longitude === "number" ? n.location.longitude : 0;
//             const recipientLat = myCoords.latitude ?? senderLat; // if geolocation not available, fallback to sender
//             const recipientLng = myCoords.longitude ?? senderLng;

//             // Build single-item helper array for sender
//             const mapHelpers = [{
//               _id: n.fromUserId || "sender",
//               name: n.fromUserName || "Sender",
//               email: n.fromUserEmail,
//               location: { coordinates: [senderLng, senderLat] }
//             }];

//             return (
//               <Card
//                 key={i}
//                 variant="outlined"
//                 sx={{
//                   bgcolor: n.read === false ? "#fcf8e8" : "#fff",
//                   borderLeft: n.read === false ? '5px solid #ff9800' : '5px solid transparent',
//                   boxShadow: "0 2px 8px #bbb5"
//                 }}
//               >
//                 <CardContent>
//                   <Stack direction="row" alignItems="center" spacing={2}>
//                     <Avatar>
//                       <PersonIcon />
//                     </Avatar>
//                     <Box>
//                       <Typography variant="subtitle1" fontWeight="bold">
//                         {n.title || 'Notification'}
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary">
//                         <EmailIcon fontSize="inherit" sx={{ verticalAlign: "middle", mr: 0.5 }} />
//                         {n.fromUserName} ({n.fromUserEmail})
//                       </Typography>
//                     </Box>
//                   </Stack>
//                   <Typography variant="body1" sx={{ mt: 1 }}>
//                     {n.message}
//                   </Typography>
//                   {n.location &&
//                     typeof n.location.latitude === "number" &&
//                     typeof n.location.longitude === "number" && (
//                       <Box sx={{ my: 2 }}>
//                         <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
//                           <LocationOnIcon color="primary" fontSize="small" />
//                           <Typography component="span" variant="body2">
//                             {n.location.latitude}, {n.location.longitude}
//                           </Typography>
//                           <Button
//                             variant="text"
//                             size="small"
//                             href={`https://www.google.com/maps/dir/?api=1&destination=${n.location.latitude},${n.location.longitude}`}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             startIcon={<LocationOnIcon />}
//                             sx={{ ml: 2 }}
//                           >
//                             View on Map
//                           </Button>
//                         </Stack>
//                         {/* Embedded map preview: both sender & recipient shown, separated by a line */}
//                         <MapView
//                           userLocation={[recipientLat, recipientLng]}
//                           helpers={mapHelpers}
//                         />
//                       </Box>
//                     )}
//                   <Stack direction="row" alignItems="center" spacing={1} mt={2}>
//                     <AccessTimeIcon fontSize="small" color="disabled" />
//                     <Typography variant="caption" color="text.secondary">
//                       {n.date && !isNaN(new Date(n.date).getTime())
//                         ? new Date(n.date).toLocaleString()
//                         : 'N/A'}
//                     </Typography>
//                   </Stack>
//                 </CardContent>
//               </Card>
//             );
//           })}
//         </Stack>
//       </Box>
//     </Box>
//   );
// }


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MapView from '../components/MapView';

const API_URL = process.env.REACT_APP_API_URL;

const css = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap');
:root {
  --a:#00C2B3; --ad:rgba(0,194,179,0.11); --ag:rgba(0,194,179,0.22); --ab:#00DDD0;
  --r:#FF4444; --rd:rgba(255,68,68,0.11); --g:#00C27A; --gd:rgba(0,194,122,0.11);
  --w:#FF8C00; --wd:rgba(255,140,0,0.11);
  --bg:#090C0F; --s1:#0E1318; --s2:#131A21; --s3:#182028;
  --b:rgba(255,255,255,0.07); --ba:rgba(0,194,179,0.3);
  --tp:#E8EDF2; --ts:rgba(232,237,242,0.52); --tm:rgba(232,237,242,0.25);
  --rr:10px; --r2:14px; --r3:18px;
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

.nt-root { min-height:100vh;width:100%;background:var(--bg);color:var(--tp);font-family:'Outfit',sans-serif;position:relative; }
.nt-gbg {
  position:fixed;inset:0;z-index:0;pointer-events:none;
  background-image:linear-gradient(rgba(0,194,179,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,194,179,.03) 1px,transparent 1px);
  background-size:44px 44px;
  mask-image:radial-gradient(ellipse 100% 60% at 50% 0%,black 20%,transparent 100%);
}
.nt-w { position:relative;z-index:1;max-width:720px;margin:0 auto;padding:40px 28px 80px; }

/* Header */
.nt-header { display:flex;align-items:center;gap:16px;margin-bottom:32px;padding-bottom:22px;border-bottom:1px solid var(--b); }
.nt-icon { width:48px;height:48px;border-radius:12px;background:var(--ad);border:1.5px solid var(--ba);display:flex;align-items:center;justify-content:center;flex-shrink:0; }
.nt-eyebrow { font-family:'JetBrains Mono',monospace;font-size:.62rem;font-weight:600;color:var(--a);letter-spacing:.12em;text-transform:uppercase;margin-bottom:3px; }
.nt-title { font-size:1.6rem;font-weight:800;letter-spacing:-.025em;line-height:1.1; }
.nt-count { margin-left:auto;display:inline-flex;align-items:center;gap:6px;padding:5px 13px;background:var(--ad);border:1px solid var(--ba);border-radius:100px;font-family:'JetBrains Mono',monospace;font-size:.68rem;color:var(--a);letter-spacing:.06em;white-space:nowrap; }
.nt-count-dot { width:5px;height:5px;border-radius:50%;background:var(--a);animation:ntd 2s infinite; }
@keyframes ntd{0%,100%{opacity:1}50%{opacity:.3}}

/* List */
.nt-list { display:flex;flex-direction:column;gap:12px; }

/* Notification Card */
.nt-card {
  background:var(--s1); border:1px solid var(--b);
  border-radius:var(--r3); overflow:hidden;
  transition:border-color .2s; animation:fadeUp .25s ease;
}
@keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
.nt-card:hover{border-color:rgba(255,255,255,.1);}
.nt-card.unread { border-left:3px solid var(--w); }
.nt-card-body { padding:18px 20px; }

/* Top row */
.nt-top { display:flex;align-items:flex-start;gap:12px;margin-bottom:12px; }
.nt-av { width:40px;height:40px;border-radius:10px;background:var(--s2);border:1px solid var(--b);display:flex;align-items:center;justify-content:center;font-size:1rem;font-weight:700;color:var(--a);flex-shrink:0;font-family:'JetBrains Mono',monospace; }
.nt-meta { flex:1;min-width:0; }
.nt-sender { font-size:.86rem;font-weight:700;margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis; }
.nt-email { font-size:.7rem;color:var(--tm);white-space:nowrap;overflow:hidden;text-overflow:ellipsis; }
.nt-right { display:flex;flex-direction:column;align-items:flex-end;gap:6px;flex-shrink:0; }
.nt-unread-badge { display:inline-flex;align-items:center;gap:5px;padding:3px 9px;background:var(--wd);border:1px solid rgba(255,140,0,.2);border-radius:100px;font-size:.58rem;font-weight:700;color:var(--w);text-transform:uppercase;letter-spacing:.06em; }
.nt-time { font-family:'JetBrains Mono',monospace;font-size:.6rem;color:var(--tm); }

/* Title */
.nt-ntitle { font-size:.9rem;font-weight:700;margin-bottom:5px; }
.nt-msg { font-size:.8rem;color:var(--ts);line-height:1.55;margin-bottom:14px; }

/* Coords */
.nt-coords { display:flex;align-items:center;gap:8px;padding:8px 12px;background:var(--s2);border:1px solid var(--b);border-radius:var(--rr);margin-bottom:12px; }
.nt-coord-label { font-family:'JetBrains Mono',monospace;font-size:.64rem;color:var(--a); }
.nt-coord-val { font-family:'JetBrains Mono',monospace;font-size:.68rem;color:var(--ts); }
.nt-coord-link { margin-left:auto;display:inline-flex;align-items:center;gap:5px;padding:4px 10px;background:var(--ad);border:1px solid var(--ba);border-radius:6px;color:var(--a);font-size:.68rem;font-weight:600;text-decoration:none;transition:all .15s; }
.nt-coord-link:hover{background:rgba(0,194,179,.18);}

/* Map */
.nt-map { border-radius:var(--rr);overflow:hidden;border:1px solid var(--b);margin-bottom:14px; }
.nt-map-toggle { width:100%;padding:9px;background:transparent;border:1px solid var(--b);border-radius:var(--rr);color:var(--ts);font-family:'Outfit',sans-serif;font-size:.76rem;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:7px;transition:all .18s;margin-bottom:12px; }
.nt-map-toggle:hover{border-color:var(--ba);color:var(--a);background:var(--ad);}

/* Empty / Loading */
.nt-empty{text-align:center;padding:72px 24px;}
.nt-empty-icon{font-size:2.5rem;opacity:.2;margin-bottom:12px;}
.nt-empty-text{font-size:.88rem;color:var(--tm);}
.nt-spinner{display:flex;align-items:center;justify-content:center;padding:80px;}
.nt-spin{width:28px;height:28px;border-radius:50%;border:3px solid var(--b);border-top-color:var(--a);animation:sp .65s linear infinite;}
@keyframes sp{to{transform:rotate(360deg)}}
.nt-err{padding:24px;background:var(--rd);border:1px solid rgba(255,68,68,.25);border-radius:var(--r2);color:#f87171;font-size:.84rem;text-align:center;}
`;

function initials(name = '') {
  return (name.trim().split(' ').map(w => w[0]).join('') || '?').toUpperCase().slice(0, 2);
}

function timeAgo(s) {
  const d = (Date.now() - new Date(s)) / 1000;
  if (d < 60) return 'just now';
  if (d < 3600) return `${Math.floor(d / 60)}m ago`;
  if (d < 86400) return `${Math.floor(d / 3600)}h ago`;
  return new Date(s).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

function NotifCard({ n, myCoords }) {
  const [showMap, setShowMap] = useState(false);
  const hasLoc = n.location && typeof n.location.latitude === 'number' && typeof n.location.longitude === 'number';

  const senderLat = hasLoc ? n.location.latitude : 0;
  const senderLng = hasLoc ? n.location.longitude : 0;
  const recipientLat = myCoords?.latitude ?? senderLat;
  const recipientLng = myCoords?.longitude ?? senderLng;

  const mapHelpers = [{
    _id: n.fromUserId || 'sender',
    name: n.fromUserName || 'Sender',
    email: n.fromUserEmail,
    location: { coordinates: [senderLng, senderLat] },
  }];

  return (
    <div className={`nt-card${n.read === false ? ' unread' : ''}`}>
      <div className="nt-card-body">
        <div className="nt-top">
          <div className="nt-av">{initials(n.fromUserName || 'U')}</div>
          <div className="nt-meta">
            <div className="nt-sender">{n.fromUserName || 'Unknown'}</div>
            <div className="nt-email">{n.fromUserEmail || '—'}</div>
          </div>
          <div className="nt-right">
            {n.read === false && (
              <div className="nt-unread-badge">
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--w)', display: 'inline-block' }} />
                New
              </div>
            )}
            <div className="nt-time">
              {n.date && !isNaN(new Date(n.date)) ? timeAgo(n.date) : '—'}
            </div>
          </div>
        </div>

        {n.title && <div className="nt-ntitle">{n.title}</div>}
        <div className="nt-msg">{n.message}</div>

        {hasLoc && (
          <>
            <div className="nt-coords">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--a)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              <span className="nt-coord-label">LAT</span>
              <span className="nt-coord-val">{n.location.latitude.toFixed(5)}</span>
              <span className="nt-coord-label" style={{ marginLeft: 8 }}>LNG</span>
              <span className="nt-coord-val">{n.location.longitude.toFixed(5)}</span>
              <a className="nt-coord-link"
                href={`https://www.google.com/maps/dir/?api=1&destination=${n.location.latitude},${n.location.longitude}`}
                target="_blank" rel="noopener noreferrer">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                Navigate
              </a>
            </div>

            <button className="nt-map-toggle" onClick={() => setShowMap(v => !v)}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
                <line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>
              </svg>
              {showMap ? 'Hide Map' : 'Show Map Preview'}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                style={{ transform: showMap ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>

            {showMap && (
              <div className="nt-map">
                <MapView
                  userLocation={[recipientLat, recipientLng]}
                  helpers={mapHelpers}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [myCoords, setMyCoords] = useState(null);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(p => setMyCoords({ latitude: p.coords.latitude, longitude: p.coords.longitude }));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { setError('Not logged in.'); setLoading(false); return; }
    axios.get(`${API_URL}/api/users/notifications`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => setNotifications(r.data.notifications || []))
      .catch(() => setError('Failed to load notifications.'))
      .finally(() => setLoading(false));
  }, []);

  const unread = notifications.filter(n => n.read === false).length;

  return (
    <>
      <style>{css}</style>
      <div className="nt-root">
        <div className="nt-gbg" />
        <div className="nt-w">

          {/* Header */}
          <div className="nt-header">
            <div className="nt-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--a)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
              </svg>
            </div>
            <div>
              <div className="nt-eyebrow">Inbox</div>
              <div className="nt-title">Notifications</div>
            </div>
            {!loading && notifications.length > 0 && (
              <div className="nt-count">
                <div className="nt-count-dot" />
                {unread > 0 ? `${unread} new` : `${notifications.length} total`}
              </div>
            )}
          </div>

          {/* Content */}
          {loading ? (
            <div className="nt-spinner"><div className="nt-spin" /></div>
          ) : error ? (
            <div className="nt-err">{error}</div>
          ) : notifications.length === 0 ? (
            <div className="nt-empty">
              <div className="nt-empty-icon">🔔</div>
              <div className="nt-empty-text">No notifications yet. You'll see SOS alerts and helper requests here.</div>
            </div>
          ) : (
            <div className="nt-list">
              {notifications.map((n, i) => (
                <NotifCard key={i} n={n} myCoords={myCoords} />
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  );
} 