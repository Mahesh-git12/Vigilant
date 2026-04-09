  // import React, { useState, useEffect } from 'react';
  // import axios from 'axios';
  // import {
  //   Box,
  //   TextField,
  //   Button,
  //   Alert,
  //   Typography,
  //   Paper,
  //   Avatar,
  //   Checkbox,
  //   Stack,
  //   Fade,
  // } from '@mui/material';
  // import WarningAmberIcon from '@mui/icons-material/WarningAmber';

  // const API_URL = process.env.REACT_APP_API_URL;

  // export default function ReportIncident() {
  //   const [form, setForm] = useState({ location: '', description: '' });
  //   const [message, setMessage] = useState('');
  //   const [loading, setLoading] = useState(false);
  //   const [contacts, setContacts] = useState([]);
  //   const [selected, setSelected] = useState([]);
  //   const [show, setShow] = useState(false);

  //   useEffect(() => {
  //     const fetchContacts = async () => {
  //       const token = localStorage.getItem('token');
  //       if (!token) return;
  //       try {
  //         const res = await axios.get(
  //           `${API_URL}/api/users/emergency-contacts`,
  //           { headers: { Authorization: `Bearer ${token}` } }
  //         );
  //         setContacts(res.data.emergencyContacts || []);
  //       } catch {
  //         setContacts([]);
  //       }
  //     };
  //     setShow(true);
  //     fetchContacts();
  //   }, []);

  //   const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  //   const handleCheckbox = email => {
  //     setSelected(prev =>
  //       prev.includes(email) ? prev.filter(e => e !== email) : [...prev, email]
  //     );
  //   };

  //   const handleSubmit = async e => {
  //     e.preventDefault();
  //     setLoading(true);
  //     setMessage('');
  //     let latitude, longitude;
  //     if (navigator.geolocation) {
  //       navigator.geolocation.getCurrentPosition(
  //         async pos => {
  //           latitude = pos.coords.latitude;
  //           longitude = pos.coords.longitude;
  //           await sendReport({ ...form, latitude, longitude });
  //         },
  //         async () => {
  //           await sendReport(form);
  //         }
  //       );
  //     } else {
  //       await sendReport(form);
  //     }
  //   };

  //   const sendReport = async (data) => {
  //     try {
  //       const token = localStorage.getItem('token');
  //       await axios.post(
  //         `${API_URL}/api/incidents/report`,
  //         {
  //           ...data,
  //           contacts: contacts.filter(c => selected.includes(c.email))
  //         },
  //         { headers: { Authorization: `Bearer ${token}` } }
  //       );
  //       setMessage('Incident reported and contacts notified!');
  //       setForm({ location: '', description: '' });
  //       setSelected([]);
  //     } catch (err) {
  //       setMessage(err.response?.data?.message || 'Failed to report incident.');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   // UPDATED container to stretch full viewport width and height, with responsive padding and centered Paper
  //   return (
  //     <Box
  //       sx={{
  //         width: '100vw',
  //         minHeight: '100vh',
  //         background: 'linear-gradient(120deg,#e0c3fc 0%,#8ec5fc 100%)',
  //         display: 'flex',
  //         justifyContent: 'center',
  //         alignItems: 'center',
  //         py: { xs: 3, md: 10 },
  //         px: { xs: 1, sm: 3, md: 6 },
  //         boxSizing: 'border-box',
  //       }}
  //     >
  //       <Fade in={show}>
  //         <Paper
  //           sx={{
  //             width: '100%',
  //             maxWidth: 600,
  //             p: 4,
  //             borderRadius: 4,
  //           }}
  //         >
  //           <Box display="flex" alignItems="center" gap={2} mb={3}>
  //             <Avatar sx={{ bgcolor: 'error.main', width: 48, height: 48 }}>
  //               <WarningAmberIcon />
  //             </Avatar>
  //             <Typography variant="h5" fontWeight={700}>Report an Incident</Typography>
  //           </Box>
  //           {message && (
  //             <Fade in>
  //               <Alert severity={message.includes('notified') ? "success" : "error"} sx={{ mb: 2 }}>
  //                 {message}
  //               </Alert>
  //             </Fade>
  //           )}
  //           <form onSubmit={handleSubmit} autoComplete="off">
  //             <TextField
  //               label="Location"
  //               name="location"
  //               value={form.location}
  //               onChange={handleChange}
  //               fullWidth
  //               required
  //               sx={{ mb: 2 }}
  //             />
  //             <TextField
  //               label="Description"
  //               name="description"
  //               value={form.description}
  //               onChange={handleChange}
  //               fullWidth
  //               required
  //               multiline
  //               minRows={3}
  //               sx={{ mb: 2 }}
  //             />
  //             <Typography sx={{ mb: 1, mt: 2 }} fontWeight="bold">Select Contacts to Notify:</Typography>
  //             <Stack spacing={1} mb={2}>
  //               {contacts.length === 0 &&
  //                 <Fade in>
  //                   <Typography color="text.secondary">
  //                     No emergency contacts saved.
  //                   </Typography>
  //                 </Fade>
  //               }
  //               {contacts.map(contact => (
  //                 <Fade in key={contact.email}>
  //                   <Box display="flex" alignItems="center">
  //                     <Checkbox
  //                       checked={selected.includes(contact.email)}
  //                       onChange={() => handleCheckbox(contact.email)}
  //                       disabled={loading}
  //                       color="info"
  //                     />
  //                     <Avatar sx={{ bgcolor: 'secondary.main', width: 30, height: 30, mr: 1, fontSize: 16 }}>
  //                       {contact.email ? contact.email.charAt(0).toUpperCase() : "?"}
  //                     </Avatar>
  //                     <Typography variant="body1">{contact.email}</Typography>
  //                     {contact.phone && (
  //                       <Typography ml={1} variant="caption" color="text.secondary">
  //                         | {contact.phone}
  //                       </Typography>
  //                     )}
  //                   </Box>
  //                 </Fade>
  //               ))}
  //             </Stack>
  //             <Button
  //               type="submit"
  //               variant="contained"
  //               color="error"
  //               disabled={loading || selected.length === 0}
  //               fullWidth
  //               sx={{ py: 1.2, fontWeight: 'bold', fontSize: 18 }}
  //             >
  //               {loading ? 'Reporting...' : 'Report Incident'}
  //             </Button>
  //           </form>
  //         </Paper>
  //       </Fade>
  //     </Box>
  //   );
  // }


import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const css = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
:root{
  --a:#00C2B3;--ad:rgba(0,194,179,0.11);--ag:rgba(0,194,179,0.22);--ab:#00DDD0;
  --r:#FF4444;--rd:rgba(255,68,68,0.11);--g:#00C27A;--w:#FF8C00;--wd:rgba(255,140,0,0.11);
  --bg:#090C0F;--s1:#0E1318;--s2:#131A21;--s3:#182028;
  --b:rgba(255,255,255,0.07);--ba:rgba(0,194,179,0.3);
  --tp:#E8EDF2;--ts:rgba(232,237,242,0.52);--tm:rgba(232,237,242,0.25);
  --rr:10px;--r2:14px;--r3:18px;
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

.ri-root{min-height:100vh;width:100%;background:var(--bg);color:var(--tp);font-family:'Outfit',sans-serif;display:flex;align-items:flex-start;justify-content:center;padding:40px 20px 80px;position:relative;}
.ri-gbg{position:fixed;inset:0;z-index:0;pointer-events:none;background-image:linear-gradient(rgba(0,194,179,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,194,179,.03) 1px,transparent 1px);background-size:44px 44px;mask-image:radial-gradient(ellipse 100% 60% at 50% 0%,black 20%,transparent 100%);}

.ri-wrap{position:relative;z-index:1;width:100%;max-width:700px;display:flex;flex-direction:column;gap:20px;}

/* header */
.ri-hd{display:flex;align-items:center;gap:14px;margin-bottom:4px;}
.ri-hd-ic{width:44px;height:44px;border-radius:12px;background:var(--rd);border:1px solid rgba(255,68,68,0.25);display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.ri-hd-ey{font-family:'JetBrains Mono',monospace;font-size:.66rem;font-weight:600;color:var(--r);text-transform:uppercase;letter-spacing:.1em;margin-bottom:3px;}
.ri-hd-title{font-size:1.5rem;font-weight:800;letter-spacing:-.025em;color:var(--tp);}

/* card */
.ri-card{background:var(--s1);border:1px solid var(--b);border-radius:var(--r3);overflow:hidden;}
.ri-card-hd{padding:18px 22px;border-bottom:1px solid var(--b);display:flex;align-items:center;gap:10px;}
.ri-card-hd-dot{width:7px;height:7px;border-radius:50%;background:var(--r);box-shadow:0 0 8px var(--r);}
.ri-card-title{font-size:.82rem;font-weight:700;text-transform:uppercase;letter-spacing:.09em;color:var(--tm);}
.ri-card-body{padding:22px;}

/* fields */
.ri-fields{display:flex;flex-direction:column;gap:16px;}
.ri-field{display:flex;flex-direction:column;gap:6px;}
.ri-label{font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--ts);}
.ri-input-wrap{position:relative;}
.ri-input-icon{position:absolute;left:13px;top:50%;transform:translateY(-50%);color:var(--tm);pointer-events:none;display:flex;align-items:center;}
.ri-input{width:100%;padding:11px 13px 11px 40px;background:var(--bg);border:1px solid var(--b);border-radius:var(--rr);color:var(--tp);font-family:'Outfit',sans-serif;font-size:.88rem;outline:none;transition:all .18s;}
.ri-input::placeholder{color:var(--tm);}
.ri-input:focus{border-color:var(--a);background:rgba(0,194,179,.04);box-shadow:0 0 0 3px var(--ad);}
.ri-input.ri-err:focus{border-color:var(--r);}
.ri-textarea{width:100%;padding:12px 14px;background:var(--bg);border:1px solid var(--b);border-radius:var(--rr);color:var(--tp);font-family:'Outfit',sans-serif;font-size:.88rem;outline:none;transition:all .18s;resize:vertical;min-height:100px;line-height:1.6;}
.ri-textarea::placeholder{color:var(--tm);}
.ri-textarea:focus{border-color:var(--a);background:rgba(0,194,179,.04);box-shadow:0 0 0 3px var(--ad);}
.ri-hint{font-size:.7rem;color:var(--tm);}

/* location row */
.ri-loc{display:flex;align-items:center;gap:10px;padding:10px 14px;background:var(--bg);border:1px solid var(--b);border-radius:var(--rr);transition:all .2s;}
.ri-loc.ok{border-color:rgba(0,194,122,.35);background:rgba(0,194,122,.04);}
.ri-loc.err{border-color:rgba(255,68,68,.3);}
.ri-loc-dot{width:7px;height:7px;border-radius:50%;background:var(--tm);flex-shrink:0;transition:all .3s;}
.ri-loc-dot.ok{background:var(--g);box-shadow:0 0 7px var(--g);animation:ldot 1.8s infinite;}
.ri-loc-dot.err{background:var(--r);}
@keyframes ldot{0%,100%{opacity:1}50%{opacity:.35}}
.ri-loc-text{flex:1;font-size:.78rem;color:var(--tm);}
.ri-loc-btn{padding:4px 11px;border-radius:6px;font-size:.7rem;font-weight:700;border:1px solid rgba(0,194,179,.3);background:var(--ad);color:var(--a);font-family:'Outfit',sans-serif;cursor:pointer;transition:all .15s;text-transform:uppercase;letter-spacing:.04em;}
.ri-loc-btn:hover{background:rgba(0,194,179,.22);}

/* contacts */
.ri-contacts{display:flex;flex-direction:column;gap:7px;}
.ri-contact{display:flex;align-items:center;gap:11px;padding:10px 13px;background:var(--s2);border:1px solid var(--b);border-radius:var(--rr);cursor:pointer;transition:all .16s;user-select:none;}
.ri-contact:hover{border-color:rgba(0,194,179,.2);background:var(--s3);}
.ri-contact.sel{border-color:rgba(0,194,179,.35);background:var(--ad);}
.ri-ck{width:16px;height:16px;border-radius:4px;border:1.5px solid var(--b);background:var(--bg);flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:all .15s;}
.ri-contact.sel .ri-ck{background:var(--a);border-color:var(--a);}
.ri-cav{width:30px;height:30px;border-radius:8px;background:var(--s3);border:1px solid var(--b);display:flex;align-items:center;justify-content:center;font-size:.78rem;font-weight:700;color:var(--a);flex-shrink:0;}
.ri-contact.sel .ri-cav{background:var(--ad);}
.ri-cname{font-size:.82rem;font-weight:600;color:var(--tp);flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.ri-cphone{font-size:.72rem;color:var(--tm);flex-shrink:0;}
.ri-no-contacts{font-size:.82rem;color:var(--tm);padding:14px;text-align:center;background:var(--s2);border:1px dashed var(--b);border-radius:var(--rr);}
.ri-no-contacts a{color:var(--a);text-decoration:none;font-weight:600;}
.ri-no-contacts a:hover{text-decoration:underline;}

/* alert */
.ri-alert{padding:12px 15px;border-radius:var(--rr);font-size:.8rem;display:flex;align-items:flex-start;gap:9px;animation:riIn .25s ease;}
@keyframes riIn{from{opacity:0;transform:translateY(-5px)}to{opacity:1;transform:none}}
.ri-alert.s{background:rgba(0,194,122,.09);border:1px solid rgba(0,194,122,.25);color:#4ade9a}
.ri-alert.e{background:rgba(255,68,68,.09);border:1px solid rgba(255,68,68,.25);color:#f87171}

/* submit */
.ri-submit{width:100%;padding:13px;background:var(--r);border:none;border-radius:var(--rr);color:#fff;font-family:'Outfit',sans-serif;font-size:.92rem;font-weight:800;cursor:pointer;transition:all .2s;display:flex;align-items:center;justify-content:center;gap:8px;letter-spacing:.01em;}
.ri-submit:hover:not(:disabled){background:#e03030;transform:translateY(-1px);box-shadow:0 6px 24px rgba(255,68,68,.4);}
.ri-submit:disabled{opacity:.4;cursor:not-allowed;transform:none;}

/* spinner */
.ri-spin{width:16px;height:16px;border-radius:50%;border:2px solid rgba(255,255,255,.25);border-top-color:#fff;animation:sp .65s linear infinite;display:inline-block;}
@keyframes sp{to{transform:rotate(360deg)}}

/* skel */
.ri-skel{background:linear-gradient(90deg,var(--s2) 25%,var(--s3) 50%,var(--s2) 75%);background-size:200% 100%;animation:sk 1.4s infinite;border-radius:6px;}
@keyframes sk{0%{background-position:200% 0}100%{background-position:-200% 0}}

@media(max-width:520px){.ri-root{padding:24px 14px 60px;}.ri-card-body{padding:16px;}}
`;

export default function ReportIncident() {
  const [form, setForm] = useState({ location: '', description: '' });
  const [contacts, setContacts] = useState([]);
  const [selected, setSelected] = useState([]);
  const [locState, setLocState] = useState('idle'); // idle|loading|done|err
  const [locCoords, setLocCoords] = useState(null);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState(null); // {text, type}

  // fetch contacts
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { setLoadingContacts(false); return; }
    axios.get(`${API_URL}/api/users/emergency-contacts`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => {
        setContacts(r.data.emergencyContacts || []);
        setSelected((r.data.emergencyContacts || []).map(c => c.email));
      })
      .catch(() => {})
      .finally(() => setLoadingContacts(false));
  }, []);

  // auto-detect location
  useEffect(() => { grabLocation(); }, []);

  const grabLocation = () => {
    if (!navigator.geolocation) { setLocState('err'); return; }
    setLocState('loading');
    navigator.geolocation.getCurrentPosition(
      pos => { setLocCoords(pos.coords); setLocState('done'); },
      () => setLocState('err'),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const toggleContact = email =>
    setSelected(p => p.includes(email) ? p.filter(e => e !== email) : [...p, email]);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!selected.length) { setMsg({ text: 'Select at least one contact to notify.', type: 'e' }); return; }
    setSubmitting(true);
    setMsg(null);
    try {
      const token = localStorage.getItem('token');
      const chosenContacts = contacts.filter(c => selected.includes(c.email));
      await axios.post(`${API_URL}/api/incidents/report`, {
        location: form.location || (locCoords ? `Lat: ${locCoords.latitude}, Lon: ${locCoords.longitude}` : 'Unknown'),
        description: form.description,
        latitude: locCoords?.latitude,
        longitude: locCoords?.longitude,
        contacts: chosenContacts,
      }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setMsg({ text: 'Incident reported and selected contacts have been notified.', type: 's' });
      setForm({ location: '', description: '' });
      setSelected(contacts.map(c => c.email));
    } catch (err) {
      setMsg({ text: err.response?.data?.message || 'Failed to report incident. Try again.', type: 'e' });
    } finally {
      setSubmitting(false);
    }
  };

  const locLabel = {
    idle: 'Requesting location…',
    loading: 'Detecting your GPS…',
    done: locCoords ? `📍 ${locCoords.latitude?.toFixed(5)}, ${locCoords.longitude?.toFixed(5)}` : 'Location acquired',
    err: 'Location unavailable — will report without GPS',
  }[locState];

  return (
    <>
      <style>{css}</style>
      <div className="ri-root">
        <div className="ri-gbg" />
        <div className="ri-wrap">

          {/* Header */}
          <div className="ri-hd">
            <div className="ri-hd-ic">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--r)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <div>
              <div className="ri-hd-ey">Safety Report</div>
              <div className="ri-hd-title">Report an Incident</div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>

            {/* Incident Details */}
            <div className="ri-card" style={{ marginBottom: 16 }}>
              <div className="ri-card-hd">
                <div className="ri-card-hd-dot" />
                <span className="ri-card-title">Incident Details</span>
              </div>
              <div className="ri-card-body">
                <div className="ri-fields">

                  {/* Location text */}
                  <div className="ri-field">
                    <label className="ri-label">Location Description</label>
                    <div className="ri-input-wrap">
                      <span className="ri-input-icon">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                        </svg>
                      </span>
                      <input className="ri-input" name="location" value={form.location}
                        onChange={e => setForm({ ...form, location: e.target.value })}
                        placeholder="e.g. Near VIT Gate 1, Vellore" />
                    </div>
                    <div className="ri-hint">Describe the location in words (GPS will be attached automatically)</div>
                  </div>

                  {/* GPS row */}
                  <div className="ri-field">
                    <label className="ri-label">GPS Coordinates</label>
                    <div className={`ri-loc ${locState === 'done' ? 'ok' : locState === 'err' ? 'err' : ''}`}>
                      <div className={`ri-loc-dot ${locState === 'done' ? 'ok' : locState === 'err' ? 'err' : ''}`} />
                      <span className="ri-loc-text">{locLabel}</span>
                      {(locState === 'err' || locState === 'idle') && (
                        <button type="button" className="ri-loc-btn" onClick={grabLocation}>Retry</button>
                      )}
                      {locState === 'loading' && (
                        <div className="ri-spin" style={{ borderTopColor: 'var(--a)', borderColor: 'var(--b)', width: 14, height: 14 }} />
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="ri-field">
                    <label className="ri-label">Incident Description <span style={{ color: 'var(--r)' }}>*</span></label>
                    <textarea className="ri-textarea" name="description" value={form.description}
                      onChange={e => setForm({ ...form, description: e.target.value })}
                      placeholder="Describe what happened, who was involved, and any other relevant details…"
                      required />
                  </div>
                </div>
              </div>
            </div>

            {/* Contacts */}
            <div className="ri-card" style={{ marginBottom: 16 }}>
              <div className="ri-card-hd">
                <div className="ri-card-hd-dot" style={{ background: 'var(--a)', boxShadow: '0 0 8px var(--a)' }} />
                <span className="ri-card-title">Notify Emergency Contacts</span>
                {contacts.length > 0 && (
                  <span style={{ marginLeft: 'auto', fontSize: '.72rem', color: 'var(--tm)', fontFamily: "'JetBrains Mono',monospace" }}>
                    {selected.length}/{contacts.length} selected
                  </span>
                )}
              </div>
              <div className="ri-card-body">
                {loadingContacts ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[1, 2].map(i => <div key={i} className="ri-skel" style={{ height: 48 }} />)}
                  </div>
                ) : contacts.length === 0 ? (
                  <div className="ri-no-contacts">
                    No emergency contacts saved. <a href="/emergency-contacts">Add contacts →</a>
                  </div>
                ) : (
                  <div className="ri-contacts">
                    {contacts.map(c => {
                      const sel = selected.includes(c.email);
                      return (
                        <div key={c.email} className={`ri-contact${sel ? ' sel' : ''}`} onClick={() => toggleContact(c.email)}>
                          <div className="ri-ck">
                            {sel && <svg width="8" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3 5.5L8 1" stroke="#020d0c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                          </div>
                          <div className="ri-cav">{c.email[0].toUpperCase()}</div>
                          <span className="ri-cname">{c.email}</span>
                          {c.phone && <span className="ri-cphone">{c.phone}</span>}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Alert */}
            {msg && (
              <div className={`ri-alert ${msg.type}`} style={{ marginBottom: 14 }}>
                <span>{msg.type === 's' ? '✓' : '!'}</span>
                <span>{msg.text}</span>
              </div>
            )}

            {/* Submit */}
            <button className="ri-submit" type="submit" disabled={submitting || contacts.length === 0 || selected.length === 0}>
              {submitting ? (
                <><div className="ri-spin" /> Submitting Report…</>
              ) : (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                  Submit Incident Report
                </>
              )}
            </button>

          </form>
        </div>
      </div>
    </>
  );
} 