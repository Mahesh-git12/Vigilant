// import React, { useEffect, useState } from 'react';
// import {
//   Card, CardContent, Typography, Box, Avatar, Grid, Alert,
//   CardHeader, CardActions, Button, IconButton, Dialog, DialogTitle,
//   DialogContent, TextField, Chip
// } from '@mui/material';
// import ReportIcon from '@mui/icons-material/Report';
// import WarningAmberIcon from '@mui/icons-material/WarningAmber';
// import DeleteIcon from '@mui/icons-material/Delete';
// import MapIcon from '@mui/icons-material/Map';
// import axios from 'axios';

// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import L from 'leaflet';

// const API_URL = process.env.REACT_APP_API_URL;

// const sosIcon = new L.Icon({
//   iconUrl:
//     'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
//   iconSize: [27, 41],
//   iconAnchor: [13, 41],
// });
// const incidentIcon = new L.Icon({
//   iconUrl:
//     'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
//   iconSize: [27, 41],
//   iconAnchor: [13, 41],
// });

// export default function MyIncidents() {
//   const [incidents, setIncidents] = useState([]);
//   const [message, setMessage] = useState('');
//   const [selectedId, setSelectedId] = useState(null);
//   const [delId, setDelId] = useState(null);
//   const [search, setSearch] = useState('');

//   useEffect(() => {
//     const fetchIncidents = async () => {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         setMessage('You must be logged in to view your incidents.');
//         return;
//       }
//       try {
//         const res = await axios.get(`${API_URL}/api/incidents/my-incidents`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         setIncidents(res.data.incidents || []);
//       } catch (err) {
//         setMessage(err.response?.data?.message || 'Failed to fetch incidents.');
//       }
//     };
//     fetchIncidents();
//   }, []);

//   const filteredIncidents = incidents.filter(incident =>
//     (!search ||
//       incident.location.toLowerCase().includes(search.toLowerCase()) ||
//       incident.description.toLowerCase().includes(search.toLowerCase()))
//   );

//   const mapCenter = (() => {
//     const points = filteredIncidents
//       .filter(i => i.latitude && i.longitude)
//       .map(i => [i.latitude, i.longitude]);
//     if (!points.length) return [20.5, 78.9];
//     const lat = points.reduce((s, c) => s + c[0], 0) / points.length;
//     const lng = points.reduce((s, c) => s + c[1], 0) / points.length;
//     return [lat, lng];
//   })();

//   const handleDelete = async id => {
//     setDelId(null);
//     try {
//       const token = localStorage.getItem('token');
//       await axios.delete(`${API_URL}/api/incidents/${id}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setIncidents(old => old.filter(i => i._id !== id));
//     } catch {
//       setMessage("Failed to delete incident.");
//     }
//   };

//   return (
//     <Box
//       sx={{
//         width: '100vw',
//         minHeight: '100vh',
//         py: { xs: 5, md: 8 },
//         px: { xs: 2, md: 6 },
//         boxSizing: 'border-box',
//         background: 'linear-gradient(120deg,#e0c3fc 0%,#8ec5fc 100%)',
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//       }}
//     >
//       <Typography variant="h4" fontWeight={800} color="primary" align="center" mb={4}>
//         My Incidents
//       </Typography>

//       {message && (
//         <Alert severity="error" sx={{ maxWidth: 800, width: '100%', mb: 2 }}>
//           {message}
//         </Alert>
//       )}

//       <Box sx={{ width: '100%', maxWidth: 800, mb: 3 }}>
//         <TextField
//           label="Search (location/desc)"
//           value={search}
//           onChange={e => setSearch(e.target.value)}
//           fullWidth
//           size="small"
//         />
//       </Box>

//       <Box
//         sx={{
//           width: '100%',
//           maxWidth: 800,
//           height: { xs: 250, md: 350 },
//           borderRadius: 3,
//           overflow: 'hidden',
//           mb: 4,
//           boxShadow: 3,
//           bgcolor: '#fff',
//         }}
//       >
//         <MapContainer center={mapCenter} zoom={filteredIncidents.length ? 5 : 4} style={{ width: '100%', height: '100%' }}>
//           <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//           {filteredIncidents
//             .filter(i => i.latitude && i.longitude)
//             .map(incident => (
//               <Marker
//                 key={incident._id}
//                 position={[incident.latitude, incident.longitude]}
//                 icon={incident.type === 'sos' ? sosIcon : incidentIcon}
//                 eventHandlers={{ click: () => setSelectedId(incident._id) }}
//               >
//                 <Popup>
//                   <Typography fontWeight="bold">{incident.type === 'sos' ? 'SOS' : 'Incident'}</Typography>
//                   <Typography variant="body2" color="text.secondary" gutterBottom>{incident.description}</Typography>
//                   <Typography variant="caption">{incident.location}</Typography>
//                   <Box mt={1}>
//                     <Button size="small" startIcon={<MapIcon />} href={`/track/${incident._id}`}>Track</Button>
//                   </Box>
//                 </Popup>
//               </Marker>
//             ))}
//         </MapContainer>
//       </Box>

//       <Grid 
//   container 
//   spacing={2} 
//   sx={{ width: '100%', maxWidth: 1200, mx: 'auto' }}
//   columns={{ xs: 4, sm: 8, md: 12 }} // explicit column counts per breakpoint
// >
//   {filteredIncidents.map((inc) => (
//     <Grid 
//       item 
//       key={inc._id} 
//       xs={4}        // 1 block per row on xs (mobile)
//       sm={4}        // 2 blocks per row on sm
//       md={4}        // 3 blocks per row on md+
//       sx={{ display: 'flex' }}
//     >
//       <Card 
//         elevation={3}
//         sx={{
//           width: '100%',
//           borderLeft: inc.type === 'sos' ? '6px solid #fc5d7d' : '6px solid #6a82fb',
//           background: inc.type === 'sos' ? 'linear-gradient(110deg,#fff8fa 60%,#ffe1ee 100%)' : 'linear-gradient(110deg,#f3f6ff 60%,#dee4ff 100%)',
//           boxShadow: '0 2px 12px #ccc',
//           display: 'flex',
//           flexDirection: 'column',
//           // no fixed heights
//         }}
//       >
//         <CardHeader
//           avatar={
//             <Avatar sx={{ bgcolor: inc.type === 'sos' ? 'error.main' : 'info.main' }}>
//               {inc.type === 'sos' ? <WarningAmberIcon /> : <ReportIcon />}
//             </Avatar>
//           }
//           title={<Typography noWrap fontWeight="700">{inc.location}</Typography>}
//           subheader={<Typography variant="caption">{new Date(inc.date).toLocaleString()}</Typography>}
//           sx={{ pb: 0.5 }}
//         />
//         <CardContent sx={{ flexGrow: 1, overflow: 'visible' }}>
//           <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
//             {inc.description}
//           </Typography>
//           {inc.latitude && inc.longitude && (
//             <Typography variant="caption" color="text.secondary">
//               Lat: {inc.latitude}, Lon: {inc.longitude}
//             </Typography>
//           )}
//           <Box mt={1}>
//             <Chip 
//               size="small"
//               label={inc.type.toUpperCase()}
//               color={inc.type === 'sos' ? 'error' : 'info'}
//               sx={{ fontWeight: 700 }}
//             />
//           </Box>
//         </CardContent>
//         <CardActions sx={{ justifyContent: 'flex-end', pt: 0, pb: 1, px: 2 }}>
//           <Button size="small" startIcon={<MapIcon />} href={`/track/${inc._id}`}>Track</Button>
//           <IconButton color="error" onClick={() => setDelId(inc._id)}><DeleteIcon /></IconButton>
//         </CardActions>
//       </Card>
//     </Grid>
//   ))}
// </Grid>


//       <Dialog open={!!delId} onClose={() => setDelId(null)}>
//         <DialogTitle>Delete Incident?</DialogTitle>
//         <DialogContent>
//           <Typography>Are you sure you want to delete this incident?</Typography>
//           <Box mt={2} textAlign="right">
//             <Button onClick={() => setDelId(null)}>Cancel</Button>
//             <Button color="error" variant="contained" sx={{ ml: 2 }} onClick={() => handleDelete(delId)}>
//               Delete
//             </Button>
//           </Box>
//         </DialogContent>
//       </Dialog>
//     </Box>
//   );
// }



import React, { useEffect, useState } from 'react';
import axios from 'axios';
import IncidentsMap from './IncidentsMap';

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

.mi-root { min-height:100vh; width:100%; background:var(--bg); color:var(--tp); font-family:'Outfit',sans-serif; position:relative; }
.mi-gbg {
  position:fixed; inset:0; z-index:0; pointer-events:none;
  background-image:linear-gradient(rgba(0,194,179,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,194,179,.03) 1px,transparent 1px);
  background-size:44px 44px;
  mask-image:radial-gradient(ellipse 100% 60% at 50% 0%,black 20%,transparent 100%);
}
.mi-w { position:relative;z-index:1; max-width:1240px;margin:0 auto; padding:40px 28px 80px; }

/* Header */
.mi-header { display:flex;align-items:center;gap:16px; margin-bottom:28px;padding-bottom:22px;border-bottom:1px solid var(--b); }
.mi-icon { width:48px;height:48px;border-radius:12px;background:var(--wd);border:1.5px solid rgba(255,140,0,0.3);display:flex;align-items:center;justify-content:center;flex-shrink:0; }
.mi-eyebrow { font-family:'JetBrains Mono',monospace;font-size:.62rem;font-weight:600;color:var(--w);letter-spacing:.12em;text-transform:uppercase;margin-bottom:3px; }
.mi-title { font-size:1.6rem;font-weight:800;letter-spacing:-.025em;line-height:1.1; }
.mi-count { margin-left:auto;display:inline-flex;align-items:center;gap:6px;padding:5px 13px;background:var(--s2);border:1px solid var(--b);border-radius:100px;font-family:'JetBrains Mono',monospace;font-size:.68rem;color:var(--ts);letter-spacing:.06em;white-space:nowrap; }

/* Search bar */
.mi-search-wrap { position:relative;margin-bottom:22px; }
.mi-search-icon { position:absolute;left:14px;top:50%;transform:translateY(-50%);color:var(--tm);pointer-events:none;display:flex;align-items:center; }
.mi-search { width:100%;padding:11px 14px 11px 42px;background:var(--s1);border:1px solid var(--b);border-radius:var(--rr);color:var(--tp);font-family:'Outfit',sans-serif;font-size:.88rem;outline:none;transition:all .18s; }
.mi-search::placeholder{color:var(--tm)}
.mi-search:focus{border-color:var(--a);background:rgba(0,194,179,.04);box-shadow:0 0 0 3px var(--ad);}

/* Stats row */
.mi-stats { display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:22px; }
@media(max-width:500px){.mi-stats{grid-template-columns:1fr 1fr;}}
.mi-stat { background:var(--s1);border:1px solid var(--b);border-radius:var(--r2);padding:15px 17px; }
.mi-stat-n { font-family:'JetBrains Mono',monospace;font-size:1.5rem;font-weight:700;line-height:1;margin-bottom:2px; }
.mi-stat-l { font-size:.67rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--tm); }

/* Grid */
.mi-grid { display:grid;grid-template-columns:repeat(3,1fr);gap:14px; }
@media(max-width:900px){.mi-grid{grid-template-columns:repeat(2,1fr);}}
@media(max-width:560px){.mi-grid{grid-template-columns:1fr;}}

/* Card */
.mi-card {
  background:var(--s1); border:1px solid var(--b);
  border-radius:var(--r3); overflow:hidden;
  display:flex; flex-direction:column;
  transition:border-color .2s,background .2s;
  animation:fadeUp .25s ease;
}
@keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
.mi-card:hover{border-color:rgba(255,255,255,.1);background:var(--s2);}
.mi-card-top { height:4px; flex-shrink:0; }
.mi-card-body { padding:16px; flex:1; }
.mi-card-head { display:flex;align-items:flex-start;gap:10px;margin-bottom:10px; }
.mi-card-badge { width:34px;height:34px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0; }
.mi-card-loc { font-size:.82rem;font-weight:700;line-height:1.3;flex:1;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical; }
.mi-card-desc { font-size:.74rem;color:var(--ts);line-height:1.5;margin-bottom:10px;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical; }
.mi-card-meta { display:flex;align-items:center;gap:8px;flex-wrap:wrap; }
.mi-chip { display:inline-flex;align-items:center;padding:2px 8px;border-radius:100px;font-size:.58rem;font-weight:700;text-transform:uppercase;letter-spacing:.05em; }
.mi-time { font-family:'JetBrains Mono',monospace;font-size:.6rem;color:var(--tm);margin-left:auto; }
.mi-card-foot { padding:10px 14px;border-top:1px solid var(--b);display:flex;gap:8px; }
.mi-track-btn { flex:1;padding:7px;background:transparent;border:1px solid var(--b);border-radius:8px;color:var(--ts);font-family:'Outfit',sans-serif;font-size:.74rem;font-weight:600;cursor:pointer;text-decoration:none;display:flex;align-items:center;justify-content:center;gap:6px;transition:all .16s; }
.mi-track-btn:hover{border-color:var(--ba);color:var(--a);background:var(--ad);}
.mi-del-btn { width:32px;height:32px;background:transparent;border:1px solid var(--b);border-radius:8px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--tm);transition:all .18s;flex-shrink:0; }
.mi-del-btn:hover{background:var(--rd);border-color:rgba(255,68,68,.3);color:var(--r);}

/* Empty */
.mi-empty{text-align:center;padding:64px 24px;grid-column:1/-1;}
.mi-empty-icon{font-size:2.5rem;opacity:.2;margin-bottom:12px;}
.mi-empty-text{font-size:.88rem;color:var(--tm);}

/* Modal */
.mi-modal-bg{position:fixed;inset:0;z-index:2000;background:rgba(0,0,0,.7);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:20px;animation:fadeIn .2s ease;}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
.mi-modal{background:var(--s1);border:1px solid var(--b);border-radius:var(--r3);padding:28px;max-width:400px;width:100%;animation:scaleIn .2s ease;}
@keyframes scaleIn{from{transform:scale(.96);opacity:0}to{transform:scale(1);opacity:1}}
.mi-modal-title{font-size:1.1rem;font-weight:800;margin-bottom:8px;}
.mi-modal-sub{font-size:.8rem;color:var(--ts);line-height:1.5;margin-bottom:20px;}
.mi-modal-row{display:flex;gap:10px;justify-content:flex-end;}
.mi-modal-cancel{padding:9px 18px;background:transparent;border:1px solid var(--b);border-radius:var(--rr);color:var(--ts);font-family:'Outfit',sans-serif;font-size:.82rem;font-weight:600;cursor:pointer;transition:all .18s;}
.mi-modal-cancel:hover{border-color:var(--ba);color:var(--tp);}
.mi-modal-del{padding:9px 18px;background:var(--r);border:none;border-radius:var(--rr);color:#fff;font-family:'Outfit',sans-serif;font-size:.82rem;font-weight:700;cursor:pointer;transition:all .18s;}
.mi-modal-del:hover{background:#e03030;}

/* Alert snack */
.mi-snack{position:fixed;bottom:26px;left:50%;transform:translateX(-50%);z-index:9999;display:flex;align-items:center;gap:9px;padding:11px 20px;border-radius:var(--rr);font-size:.82rem;font-weight:500;box-shadow:0 8px 30px rgba(0,0,0,.5);animation:snk .25s ease;min-width:220px;}
@keyframes snk{from{opacity:0;transform:translate(-50%,10px)}to{opacity:1;transform:translate(-50%,0)}}
.mi-snack.e{background:#1f0a0a;border:1px solid rgba(255,68,68,.28);color:#f87171;}

/* Skeleton */
.mi-skel{background:linear-gradient(90deg,var(--s2) 25%,var(--s3) 50%,var(--s2) 75%);background-size:200% 100%;animation:sk 1.4s infinite;border-radius:6px;}
@keyframes sk{0%{background-position:200% 0}100%{background-position:-200% 0}}
`;

function timeAgo(s) {
  const d = (Date.now() - new Date(s)) / 1000;
  if (d < 60) return 'just now';
  if (d < 3600) return `${Math.floor(d / 60)}m ago`;
  if (d < 86400) return `${Math.floor(d / 3600)}h ago`;
  return new Date(s).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export default function MyIncidents() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [delId, setDelId] = useState(null);
  const [snack, setSnack] = useState(null);

  const toast = (msg, type = 'e') => { setSnack({ msg, type }); setTimeout(() => setSnack(null), 3500); };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { setLoading(false); return; }
    axios.get(`${API_URL}/api/incidents/my-incidents`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => setIncidents(r.data.incidents || []))
      .catch(() => toast('Failed to load incidents.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = incidents.filter(i =>
    !search || i.location?.toLowerCase().includes(search.toLowerCase()) || i.description?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async id => {
    setDelId(null);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/incidents/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setIncidents(p => p.filter(i => i._id !== id));
    } catch { toast('Delete failed. Try again.'); }
  };

  const sos = filtered.filter(i => i.type === 'sos').length;
  const reg = filtered.filter(i => i.type !== 'sos').length;

  return (
    <>
      <style>{css}</style>
      <div className="mi-root">
        <div className="mi-gbg" />
        <div className="mi-w">

          {/* Header */}
          <div className="mi-header">
            <div className="mi-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--w)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <div>
              <div className="mi-eyebrow">Safety Log</div>
              <div className="mi-title">My Incidents</div>
            </div>
            <div className="mi-count">
              {loading ? '…' : `${incidents.length} total`}
            </div>
          </div>

          {/* Map */}
          {!loading && filtered.length > 0 && <IncidentsMap incidents={filtered} />}

          {/* Stats */}
          {!loading && incidents.length > 0 && (
            <div className="mi-stats">
              {[
                { n: incidents.length, l: 'Total', col: 'var(--a)' },
                { n: sos, l: 'SOS Alerts', col: '#f87171' },
                { n: reg, l: 'Reports', col: 'var(--w)' },
              ].map(s => (
                <div className="mi-stat" key={s.l}>
                  <div className="mi-stat-n" style={{ color: s.col }}>{s.n}</div>
                  <div className="mi-stat-l">{s.l}</div>
                </div>
              ))}
            </div>
          )}

          {/* Search */}
          <div className="mi-search-wrap">
            <span className="mi-search-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </span>
            <input className="mi-search" placeholder="Search by location or description…"
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          {/* Grid */}
          <div className="mi-grid">
            {loading ? (
              [1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="mi-card">
                  <div className="mi-skel" style={{ height: 4 }} />
                  <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div className="mi-skel" style={{ height: 20, width: '70%' }} />
                    <div className="mi-skel" style={{ height: 14, width: '90%' }} />
                    <div className="mi-skel" style={{ height: 14, width: '50%' }} />
                  </div>
                </div>
              ))
            ) : filtered.length === 0 ? (
              <div className="mi-empty">
                <div className="mi-empty-icon">🛡️</div>
                <div className="mi-empty-text">{search ? 'No incidents match your search.' : 'No incidents logged yet. Stay safe.'}</div>
              </div>
            ) : filtered.map(inc => {
              const isSOS = inc.type === 'sos';
              return (
                <div className="mi-card" key={inc._id}>
                  <div className="mi-card-top" style={{ background: isSOS ? 'var(--r)' : 'var(--a)' }} />
                  <div className="mi-card-body">
                    <div className="mi-card-head">
                      <div className="mi-card-badge" style={{ background: isSOS ? 'var(--rd)' : 'var(--ad)' }}>
                        {isSOS ? '🆘' : '⚠️'}
                      </div>
                      <div className="mi-card-loc">{inc.location || 'Unknown location'}</div>
                    </div>
                    <div className="mi-card-desc">{inc.description || '—'}</div>
                    <div className="mi-card-meta">
                      <span className="mi-chip" style={{
                        background: isSOS ? 'var(--rd)' : 'var(--ad)',
                        color: isSOS ? '#f87171' : 'var(--a)',
                        border: `1px solid ${isSOS ? 'rgba(255,68,68,.2)' : 'rgba(0,194,179,.2)'}`,
                      }}>
                        {(inc.type || 'incident').toUpperCase()}
                      </span>
                      <span className="mi-time">{timeAgo(inc.date)}</span>
                    </div>
                  </div>
                  <div className="mi-card-foot">
                    <a href={`/track/${inc._id}`} className="mi-track-btn">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>
                      </svg>
                      Track
                    </a>
                    <button className="mi-del-btn" onClick={() => setDelId(inc._id)}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Delete Modal */}
        {delId && (
          <div className="mi-modal-bg" onClick={() => setDelId(null)}>
            <div className="mi-modal" onClick={e => e.stopPropagation()}>
              <div className="mi-modal-title">Delete Incident?</div>
              <div className="mi-modal-sub">This action is permanent. This incident will be removed from your history.</div>
              <div className="mi-modal-row">
                <button className="mi-modal-cancel" onClick={() => setDelId(null)}>Cancel</button>
                <button className="mi-modal-del" onClick={() => handleDelete(delId)}>Delete</button>
              </div>
            </div>
          </div>
        )}

        {snack && (
          <div className={`mi-snack ${snack.type}`}>
            <span>✕</span>{snack.msg}
          </div>
        )}
      </div>
    </>
  );
}