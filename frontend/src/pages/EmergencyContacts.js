// import React, { useEffect, useState } from 'react';
// import {
//   Card, CardContent, Typography, TextField, Button, Box, Avatar, Alert, Grid, Paper,
//   IconButton, Chip, Stack, Fade
// } from '@mui/material';
// import ContactsIcon from '@mui/icons-material/Contacts';
// import DeleteIcon from '@mui/icons-material/Delete';
// import PersonIcon from '@mui/icons-material/Person';
// import axios from 'axios';

// const API_URL = process.env.REACT_APP_API_URL;

// function stringToInitials(email = "") {
//   const [name] = email.split("@");
//   return (name ? name.charAt(0).toUpperCase() : "?");
// }

// export default function EmergencyContacts() {
//   const [contacts, setContacts] = useState([]);
//   const [newEmail, setNewEmail] = useState('');
//   const [newPhone, setNewPhone] = useState('');
//   const [message, setMessage] = useState('');
//   const [unsaved, setUnsaved] = useState(false);
//   const [error, setError] = useState('');
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
//         setUnsaved(false);
//       } catch {
//         setMessage('Failed to fetch contacts.');
//       }
//     };
//     setShow(true);
//     fetchContacts();
//   }, []);

//   const validateEmail = email =>
//     /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

//   const validatePhone = phone =>
//     !phone || /^\d{7,15}$/.test(phone);

//   const handleAdd = () => {
//     setError('');
//     if (!validateEmail(newEmail)) return setError('Enter a valid email address.');
//     if (newPhone && !validatePhone(newPhone)) return setError('Phone must be 7-15 digits.');
//     if (contacts.some(c => c.email === newEmail)) return setError('Email already exists.');
//     setContacts([...contacts, { email: newEmail, phone: newPhone }]);
//     setNewEmail(''); setNewPhone('');
//     setUnsaved(true);
//     setMessage('Contact added. Don\'t forget to save!');
//   };

//   const handleRemove = (idx) => {
//     setContacts(contacts.filter((_, i) => i !== idx));
//     setUnsaved(true);
//     setMessage('Contact removed. Don\'t forget to save!');
//   };

//   const handleSave = async () => {
//     setError(''); setMessage('');
//     const token = localStorage.getItem('token');
//     try {
//       await axios.put(
//         `${API_URL}/api/users/emergency-contacts`,
//         { emergencyContacts: contacts },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setMessage('Contacts saved!');
//       setUnsaved(false);
//     } catch {
//       setError('Failed to save contacts.');
//     }
//   };

//   return (
//     <Box sx={{
//       width: '100vw',
//         minHeight: '100vh',
//         background: 'linear-gradient(120deg,#e0c3fc 0%,#8ec5fc 100%)',  // Full-page gradient
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         py: { xs: 3, md: 10 },  // vertical padding, responsive
//         px: { xs: 1, sm: 3, md: 6 },  // horizontal padding, responsive
//         boxSizing: 'border-box',
//     }}>
//       <Fade in={show} timeout={900}>
//         <Paper elevation={4} sx={{ maxWidth: 600, width: '100%', p: 3, borderRadius: 4 }}>
//           <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
//             <Avatar sx={{ bgcolor: 'info.main', width: 72, height: 72, mb: 2 }}><ContactsIcon fontSize="large" /></Avatar>
//             <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: '.03em', mb: 2 }}>
//               Emergency Contacts
//             </Typography>
//             <Grid container spacing={1}>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   label="Email"
//                   value={newEmail}
//                   onChange={e => setNewEmail(e.target.value)}
//                   fullWidth
//                   size="small"
//                   error={!!error && !validateEmail(newEmail)}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={5}>
//                 <TextField
//                   label="Phone (optional)"
//                   value={newPhone}
//                   onChange={e => setNewPhone(e.target.value)}
//                   fullWidth
//                   size="small"
//                   error={!!error && newPhone && !validatePhone(newPhone)}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={1}>
//                 <Button
//                   onClick={handleAdd}
//                   variant="contained"
//                   color="info"
//                   sx={{ borderRadius: 10, height: '100%', minWidth: 44 }}
//                 >
//                   Add
//                 </Button>
//               </Grid>
//             </Grid>
//             {error && <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>}
//             <Box sx={{ width: '100%' }}>
//               <Stack spacing={2} sx={{ width: '100%' }}>
//                 {contacts.length === 0 && (
//                   <Typography color="text.secondary" align="center">No emergency contacts added yet.</Typography>
//                 )}
//                 {contacts.map((contact, idx) => (
//                   <Fade in key={contact.email}>
//                     <Card variant="outlined" sx={{ display: 'flex', alignItems: 'center', px: 2 }}>
//                       <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
//                         {contact.email ? stringToInitials(contact.email) : <PersonIcon />}
//                       </Avatar>
//                       <Box flex={1}>
//                         <Typography fontWeight="bold">{contact.email}</Typography>
//                         {contact.phone && (
//                           <Chip
//                             label={contact.phone}
//                             size="small"
//                             sx={{ mt: .5 }}
//                             icon={<PersonIcon fontSize="small" />}
//                           />
//                         )}
//                       </Box>
//                       <IconButton color="error" onClick={() => handleRemove(idx)}>
//                         <DeleteIcon />
//                       </IconButton>
//                     </Card>
//                   </Fade>
//                 ))}
//               </Stack>
//             </Box>
//             <Button
//               onClick={handleSave}
//               variant="contained"
//               color="info"
//               fullWidth
//               sx={{ mt: 2, py: 1.5, borderRadius: 10, fontWeight: 'bold', fontSize: '1rem' }}
//               disabled={!unsaved}
//             >Save All</Button>
//             {unsaved && (
//               <Typography color="warning.main" sx={{ mt: 1, fontSize: 14 }}>
//                 You have unsaved changes.
//               </Typography>
//             )}
//             {message && (
//               <Fade in>
//                 <Alert severity={message.includes('saved') ? 'success' : 'info'} sx={{ mt: 2, width: '100%' }}>
//                   {message}
//                 </Alert>
//               </Fade>
//             )}
//           </Box>
//         </Paper>
//       </Fade>
//     </Box>
//   );
// }


import React, { useEffect, useState } from 'react';
import axios from 'axios';

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

.ec-root {
  min-height:100vh; width:100%;
  background:var(--bg); color:var(--tp);
  font-family:'Outfit',sans-serif;
  position:relative;
}
.ec-gbg {
  position:fixed; inset:0; z-index:0; pointer-events:none;
  background-image:
    linear-gradient(rgba(0,194,179,.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,194,179,.03) 1px, transparent 1px);
  background-size:44px 44px;
  mask-image:radial-gradient(ellipse 100% 60% at 50% 0%, black 20%, transparent 100%);
}
.ec-w {
  position:relative; z-index:1;
  max-width:760px; margin:0 auto;
  padding:40px 28px 80px;
}

/* Header */
.ec-header {
  display:flex; align-items:center; gap:16px;
  margin-bottom:36px; padding-bottom:24px;
  border-bottom:1px solid var(--b);
}
.ec-icon {
  width:48px; height:48px; border-radius:12px;
  background:var(--ad); border:1.5px solid var(--ba);
  display:flex; align-items:center; justify-content:center;
  flex-shrink:0;
}
.ec-eyebrow {
  font-family:'JetBrains Mono',monospace;
  font-size:.62rem; font-weight:600;
  color:var(--a); letter-spacing:.12em;
  text-transform:uppercase; margin-bottom:3px;
}
.ec-title {
  font-size:1.6rem; font-weight:800;
  letter-spacing:-.025em; line-height:1.1;
}
.ec-count {
  margin-left:auto;
  display:inline-flex; align-items:center; gap:6px;
  padding:5px 13px;
  background:var(--ad); border:1px solid var(--ba);
  border-radius:100px;
  font-family:'JetBrains Mono',monospace;
  font-size:.68rem; color:var(--a);
  letter-spacing:.06em; text-transform:uppercase;
  white-space:nowrap;
}

/* Add card */
.ec-add-card {
  background:var(--s1); border:1px solid var(--b);
  border-radius:var(--r3); padding:24px;
  margin-bottom:24px; position:relative; overflow:hidden;
}
.ec-add-card::before {
  content:''; position:absolute; top:0; left:0; right:0; height:2px;
  background:linear-gradient(90deg, transparent, var(--a), transparent);
  animation:topLine 4s ease-in-out infinite;
}
@keyframes topLine { 0%,100%{opacity:.5} 50%{opacity:1} }
.ec-add-label {
  font-size:.7rem; font-weight:700; text-transform:uppercase;
  letter-spacing:.1em; color:var(--tm); margin-bottom:12px;
}
.ec-row {
  display:grid; grid-template-columns:1fr 1fr auto;
  gap:10px; align-items:end;
}
@media(max-width:560px){
  .ec-row { grid-template-columns:1fr; }
}
.ec-field { display:flex; flex-direction:column; gap:5px; }
.ec-flabel {
  font-size:.67rem; font-weight:600;
  color:var(--ts); letter-spacing:.04em; text-transform:uppercase;
}
.ec-input-wrap { position:relative; }
.ec-input-icon {
  position:absolute; left:12px; top:50%; transform:translateY(-50%);
  color:var(--tm); pointer-events:none; display:flex; align-items:center;
}
.ec-input {
  width:100%; padding:11px 12px 11px 38px;
  background:var(--bg); border:1px solid var(--b);
  border-radius:var(--rr); color:var(--tp);
  font-family:'Outfit',sans-serif; font-size:.88rem;
  outline:none; transition:all .18s;
}
.ec-input::placeholder{color:var(--tm)}
.ec-input:focus {
  border-color:var(--a); background:rgba(0,194,179,.04);
  box-shadow:0 0 0 3px var(--ad);
}
.ec-add-btn {
  padding:11px 18px; background:var(--a);
  border:none; border-radius:var(--rr);
  color:#020d0c; font-family:'Outfit',sans-serif;
  font-size:.84rem; font-weight:800;
  cursor:pointer; white-space:nowrap; transition:all .2s;
  display:flex; align-items:center; gap:6px;
}
.ec-add-btn:hover { background:var(--ab); transform:translateY(-1px); box-shadow:0 5px 18px var(--ag); }

/* Alert */
.ec-alert {
  padding:11px 14px; border-radius:var(--rr);
  font-size:.8rem; display:flex; align-items:center; gap:9px;
  margin-top:12px; animation:fadeUp .25s ease;
}
@keyframes fadeUp { from{opacity:0;transform:translateY(-4px)} to{opacity:1;transform:none} }
.ec-alert.err { background:rgba(255,68,68,.09); border:1px solid rgba(255,68,68,.25); color:#f87171; }
.ec-alert.ok  { background:rgba(0,194,122,.09); border:1px solid rgba(0,194,122,.25); color:#4ade9a; }
.ec-alert.warn{ background:rgba(255,140,0,.09); border:1px solid rgba(255,140,0,.25); color:#fbbf24; }

/* Contact list */
.ec-section-hd {
  display:flex; align-items:center; justify-content:space-between;
  margin-bottom:12px;
}
.ec-section-title { font-size:.8rem; font-weight:700; text-transform:uppercase; letter-spacing:.09em; color:var(--tm); }

.ec-list { display:flex; flex-direction:column; gap:8px; }
.ec-contact {
  display:flex; align-items:center; gap:14px;
  padding:14px 16px;
  background:var(--s1); border:1px solid var(--b);
  border-radius:var(--r2); transition:all .18s;
  animation:fadeUp .22s ease;
}
.ec-contact:hover { border-color:rgba(255,255,255,.1); background:var(--s2); }
.ec-av {
  width:40px; height:40px; border-radius:10px;
  background:var(--ad); border:1.5px solid var(--ba);
  display:flex; align-items:center; justify-content:center;
  font-size:.95rem; font-weight:700; color:var(--a);
  flex-shrink:0; font-family:'JetBrains Mono',monospace;
}
.ec-info { flex:1; min-width:0; }
.ec-email { font-size:.88rem; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.ec-phone {
  display:inline-flex; align-items:center; gap:5px;
  margin-top:3px; padding:2px 8px;
  background:var(--s3); border:1px solid var(--b); border-radius:6px;
  font-family:'JetBrains Mono',monospace; font-size:.64rem; color:var(--ts);
}
.ec-del {
  width:34px; height:34px; border-radius:8px;
  background:transparent; border:1px solid var(--b);
  display:flex; align-items:center; justify-content:center;
  cursor:pointer; color:var(--tm); transition:all .18s; flex-shrink:0;
}
.ec-del:hover { background:var(--rd); border-color:rgba(255,68,68,.3); color:var(--r); }

/* Empty */
.ec-empty { text-align:center; padding:48px 20px; }
.ec-empty-icon { font-size:2.2rem; opacity:.25; margin-bottom:10px; }
.ec-empty-text { font-size:.82rem; color:var(--tm); }

/* Save */
.ec-footer { margin-top:24px; display:flex; gap:12px; align-items:center; }
.ec-save-btn {
  flex:1; padding:13px;
  background:var(--a); border:none; border-radius:var(--rr);
  color:#020d0c; font-family:'Outfit',sans-serif;
  font-size:.9rem; font-weight:800; cursor:pointer;
  transition:all .2s; display:flex; align-items:center; justify-content:center; gap:8px;
}
.ec-save-btn:hover:not(:disabled) { background:var(--ab); transform:translateY(-1px); box-shadow:0 6px 22px var(--ag); }
.ec-save-btn:disabled { opacity:.35; cursor:not-allowed; }
.ec-unsaved {
  display:flex; align-items:center; gap:6px;
  font-size:.72rem; color:var(--w);
  font-family:'JetBrains Mono',monospace; letter-spacing:.04em;
  white-space:nowrap;
}
.ec-unsaved::before { content:''; width:6px; height:6px; border-radius:50%; background:var(--w); animation:pulse 1.6s infinite; flex-shrink:0; }
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}

/* Spinner */
.ec-spin { width:16px; height:16px; border-radius:50%; border:2px solid rgba(0,0,0,.18); border-top-color:rgba(0,0,0,.7); animation:sp .65s linear infinite; }
@keyframes sp{to{transform:rotate(360deg)}}
`;

function initials(email = '') {
  const name = email.split('@')[0];
  return (name?.[0] || '?').toUpperCase();
}

export default function EmergencyContacts() {
  const [contacts, setContacts] = useState([]);
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [alert, setAlert] = useState(null);
  const [unsaved, setUnsaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const showAlert = (msg, type = 'ok') => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 4000);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    axios.get(`${API_URL}/api/users/emergency-contacts`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => { setContacts(r.data.emergencyContacts || []); setUnsaved(false); })
      .catch(() => showAlert('Failed to load contacts.', 'err'));
  }, []);

  const validateEmail = e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  const validatePhone = p => !p || /^\d{7,15}$/.test(p);

  const handleAdd = () => {
    if (!validateEmail(newEmail)) return showAlert('Enter a valid email address.', 'err');
    if (!validatePhone(newPhone)) return showAlert('Phone must be 7–15 digits.', 'err');
    if (contacts.some(c => c.email === newEmail)) return showAlert('Email already in list.', 'err');
    setContacts(p => [...p, { email: newEmail, phone: newPhone }]);
    setNewEmail(''); setNewPhone(''); setUnsaved(true);
    showAlert('Contact added — save to confirm.', 'warn');
  };

  const handleRemove = idx => {
    setContacts(p => p.filter((_, i) => i !== idx));
    setUnsaved(true);
    showAlert('Contact removed — save to confirm.', 'warn');
  };

  const handleSave = async () => {
    setSaving(true);
    const token = localStorage.getItem('token');
    try {
      await axios.put(`${API_URL}/api/users/emergency-contacts`,
        { emergencyContacts: contacts },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUnsaved(false);
      showAlert('Contacts saved successfully!', 'ok');
    } catch {
      showAlert('Failed to save. Try again.', 'err');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <style>{css}</style>
      <div className="ec-root">
        <div className="ec-gbg" />
        <div className="ec-w">

          {/* Header */}
          <div className="ec-header">
            <div className="ec-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--a)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
              </svg>
            </div>
            <div>
              <div className="ec-eyebrow">Safety Setup</div>
              <div className="ec-title">Emergency Contacts</div>
            </div>
            <div className="ec-count">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/></svg>
              {contacts.length} contact{contacts.length !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Add Card */}
          <div className="ec-add-card">
            <div className="ec-add-label">Add New Contact</div>
            <div className="ec-row">
              <div className="ec-field">
                <div className="ec-flabel">Email Address</div>
                <div className="ec-input-wrap">
                  <span className="ec-input-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/>
                    </svg>
                  </span>
                  <input className="ec-input" placeholder="contact@email.com" value={newEmail}
                    onChange={e => setNewEmail(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAdd()} />
                </div>
              </div>
              <div className="ec-field">
                <div className="ec-flabel">Phone (optional)</div>
                <div className="ec-input-wrap">
                  <span className="ec-input-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2A19.86 19.86 0 013.09 5.18 2 2 0 015.07 3h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L9.09 10.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 17.92z"/>
                    </svg>
                  </span>
                  <input className="ec-input" placeholder="9876543210" value={newPhone}
                    onChange={e => setNewPhone(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAdd()} />
                </div>
              </div>
              <button className="ec-add-btn" onClick={handleAdd}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Add
              </button>
            </div>
            {alert && (
              <div className={`ec-alert ${alert.type}`}>
                {alert.type === 'ok' ? '✓' : alert.type === 'err' ? '✕' : '⚠'}
                {alert.msg}
              </div>
            )}
          </div>

          {/* Contact List */}
          <div className="ec-section-hd">
            <div className="ec-section-title">
              {contacts.length > 0 ? `Saved Contacts — ${contacts.length} total` : 'No contacts yet'}
            </div>
          </div>

          <div className="ec-list">
            {contacts.length === 0 ? (
              <div className="ec-empty">
                <div className="ec-empty-icon">🛡️</div>
                <div className="ec-empty-text">Add at least one contact to activate SOS alerts.</div>
              </div>
            ) : contacts.map((c, i) => (
              <div className="ec-contact" key={c.email + i}>
                <div className="ec-av">{initials(c.email)}</div>
                <div className="ec-info">
                  <div className="ec-email">{c.email}</div>
                  {c.phone && (
                    <div className="ec-phone">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.86 19.86 0 01-8.63-3.07A19.5 19.5 0 013.09 5.18 2 2 0 015.07 3h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L9.09 10.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 17.92z"/>
                      </svg>
                      {c.phone}
                    </div>
                  )}
                </div>
                <button className="ec-del" onClick={() => handleRemove(i)} aria-label="Remove contact">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="ec-footer">
            <button className="ec-save-btn" onClick={handleSave} disabled={!unsaved || saving}>
              {saving ? <><div className="ec-spin" /> Saving…</> : <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
                </svg>
                Save All Contacts
              </>}
            </button>
            {unsaved && <div className="ec-unsaved">Unsaved changes</div>}
          </div>

        </div>
      </div>
    </>
  );
}