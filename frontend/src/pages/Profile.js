// import React, { useEffect, useState, useRef } from 'react';
// import {
//   Card, CardContent, Typography, TextField, Button, Box, Avatar, Alert, useMediaQuery, IconButton,
// } from '@mui/material';
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// import PhotoCamera from '@mui/icons-material/PhotoCamera';
// import axios from 'axios';

// const API_URL = process.env.REACT_APP_API_URL;

// export default function Profile() {
//   const [profile, setProfile] = useState({ name: '', email: '', avatarUrl: '' });
//   const [message, setMessage] = useState('');
//   const [editing, setEditing] = useState(false);
//   const [uploading, setUploading] = useState(false);
//   const isMobile = useMediaQuery('(max-width:600px)');
//   const fileInputRef = useRef(null);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       const token = localStorage.getItem('token');
//       try {
//         const res = await axios.get(
//           `${API_URL}/api/users/profile`,
//           { headers: { Authorization: `Bearer ${token}` } },
//         );
//         setProfile({
//           name: res.data.name,
//           email: res.data.email,
//           avatarUrl: res.data.avatarUrl || '',
//         });
//       } catch (err) {
//         setMessage('Failed to load profile');
//       }
//     };
//     fetchProfile();
//   }, []);

//   const handleChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage('');
//     const token = localStorage.getItem('token');
//     try {
//       const res = await axios.put(
//         `${API_URL}/api/users/profile`,
//         profile,
//         { headers: { Authorization: `Bearer ${token}` } },
//       );
//       setMessage(res.data.message || 'Profile updated!');
//       setEditing(false);
//     } catch (err) {
//       setMessage('Failed to update profile');
//     }
//   };

//   const handleAvatarClick = () => {
//     if (!editing) return;
//     fileInputRef.current?.click();
//   };

//   const handleAvatarUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     setUploading(true);
//     const formData = new FormData();
//     formData.append('avatar', file);
//     const token = localStorage.getItem('token');
//     try {
//       const res = await axios.post(
//         `${API_URL}/api/users/profile/avatar`,
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'multipart/form-data',
//           },
//         }
//       );
//       setProfile((prev) => ({ ...prev, avatarUrl: res.data.avatarUrl }));
//       setMessage('Profile photo updated!');
//     } catch (err) {
//       setMessage('Failed to upload profile photo');
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <Box
//       sx={{
//         width: '100vw',
//         minHeight: '100vh',
//         background: 'linear-gradient(120deg,#e0c3fc 0%,#8ecffc 100%)',
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         p: isMobile ? 2 : 4,
//         boxSizing: 'border-box',
//       }}
//     >
//       <Card
//         sx={{
//           width: '100%',
//           maxWidth: 440,
//           p: isMobile ? 2 : 3,
//           borderRadius: 4,
//           boxShadow: '0 8px 24px rgba(106,130,251,0.25)',
//           position: 'relative',
//         }}
//       >
//         <CardContent>
//           <Box
//             sx={{
//               display: 'flex',
//               flexDirection: 'column',
//               alignItems: 'center',
//               gap: isMobile ? 1.5 : 3,
//               position: 'relative',
//             }}
//           >
//             <Box sx={{ position: 'relative' }}>
//               <Avatar
//                 src={profile.avatarUrl ? `${API_URL}${profile.avatarUrl}` : ''}
//                 alt={profile.name || 'Profile'}
//                 sx={{
//                   bgcolor: 'primary.main',
//                   width: isMobile ? 72 : 90,
//                   height: isMobile ? 72 : 90,
//                   boxShadow: '0 6px 32px #6a82fb44',
//                   fontSize: isMobile ? 40 : 56,
//                   cursor: editing ? 'pointer' : 'default',
//                 }}
//                 onClick={handleAvatarClick}
//               >
//                 {!profile.avatarUrl && profile.name
//                   ? profile.name.charAt(0).toUpperCase()
//                   : <AccountCircleIcon sx={{ fontSize: isMobile ? 48 : 72 }} />}
//               </Avatar>
//               {editing && (
//                 <IconButton
//                   onClick={handleAvatarClick}
//                   sx={{
//                     position: 'absolute',
//                     bottom: 0,
//                     right: 0,
//                     bgcolor: 'background.paper',
//                     border: '1.5px solid',
//                     borderColor: 'primary.main',
//                     '&:hover': { bgcolor: 'primary.light' },
//                   }}
//                   disabled={uploading}
//                   aria-label="upload profile photo"
//                 >
//                   <PhotoCamera color="primary" />
//                 </IconButton>
//               )}
//               <input
//                 type="file"
//                 accept="image/*"
//                 ref={fileInputRef}
//                 style={{ display: 'none' }}
//                 onChange={handleAvatarUpload}
//               />
//             </Box>
//             <Typography
//               variant={isMobile ? 'h6' : 'h5'}
//               color="primary"
//               sx={{
//                 fontWeight: 700,
//                 letterSpacing: '0.06em',
//                 textShadow: '0 2px 10px #6a82fb44',
//               }}
//               gutterBottom
//             >
//               User Profile
//             </Typography>

//             {editing ? (
//               <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
//                 <TextField
//                   name="name"
//                   label="Name"
//                   value={profile.name}
//                   onChange={handleChange}
//                   fullWidth
//                   margin="normal"
//                   required
//                   size={isMobile ? 'small' : 'medium'}
//                 />
//                 <TextField
//                   name="email"
//                   label="Email"
//                   value={profile.email}
//                   onChange={handleChange}
//                   fullWidth
//                   margin="normal"
//                   required
//                   size={isMobile ? 'small' : 'medium'}
//                 />
//                 <Button
//                   type="submit"
//                   variant="contained"
//                   color="primary"
//                   fullWidth
//                   sx={{
//                     mt: 2,
//                     borderRadius: 20,
//                     py: isMobile ? 1 : 1.2,
//                     fontSize: isMobile ? '0.85rem' : '1rem',
//                   }}
//                 >
//                   Save
//                 </Button>
//               </Box>
//             ) : (
//               <Box sx={{ width: '100%' }}>
//                 <Typography sx={{ fontSize: isMobile ? '0.95rem' : '1.1rem', mb: 1 }}>
//                   <strong>Name:</strong> {profile.name}
//                 </Typography>
//                 <Typography sx={{ fontSize: isMobile ? '0.95rem' : '1.1rem' }}>
//                   <strong>Email:</strong> {profile.email}
//                 </Typography>
//                 <Button
//                   onClick={() => setEditing(true)}
//                   variant="outlined"
//                   color="primary"
//                   fullWidth
//                   sx={{
//                     mt: 3,
//                     borderRadius: 20,
//                     py: isMobile ? 1 : 1.2,
//                     fontSize: isMobile ? '0.85rem' : '1rem',
//                   }}
//                 >
//                   Edit Profile
//                 </Button>
//               </Box>
//             )}
//             {message && (
//               <Alert
//                 severity="info"
//                 sx={{
//                   mt: 3,
//                   width: '100%',
//                   borderRadius: 2,
//                   bgcolor: 'rgba(255,255,255,0.7)',
//                   color: 'primary.main',
//                   fontSize: isMobile ? '0.85rem' : '1rem',
//                 }}
//               >
//                 {message}
//               </Alert>
//             )}
//           </Box>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// }


import React, { useEffect, useState, useRef } from 'react';
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
.pf-root{min-height:100vh;width:100%;background:var(--bg);color:var(--tp);font-family:'Outfit',sans-serif;position:relative;}
.pf-gbg{position:fixed;inset:0;z-index:0;pointer-events:none;background-image:linear-gradient(rgba(0,194,179,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,194,179,.03) 1px,transparent 1px);background-size:44px 44px;mask-image:radial-gradient(ellipse 100% 60% at 50% 0%,black 20%,transparent 100%);}
.pf-w{position:relative;z-index:1;max-width:780px;margin:0 auto;padding:40px 28px 80px;}
@keyframes ntd{0%,100%{opacity:1}50%{opacity:.3}}
@keyframes topLine{0%,100%{opacity:.5}50%{opacity:1}}
@keyframes fadeUp{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}
@keyframes sp{to{transform:rotate(360deg)}}

/* Hero */
.pf-hero{background:var(--s1);border:1px solid var(--b);border-radius:var(--r3);padding:28px;margin-bottom:20px;position:relative;overflow:hidden;display:flex;align-items:flex-start;gap:22px;}
.pf-hero::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,var(--a),transparent);animation:topLine 4s ease-in-out infinite;}
.pf-hero-glow{position:absolute;width:300px;height:300px;border-radius:50%;background:radial-gradient(circle,rgba(0,194,179,.06) 0%,transparent 65%);top:-80px;right:-60px;pointer-events:none;}

/* Avatar */
.pf-av-col{display:flex;flex-direction:column;align-items:center;gap:5px;flex-shrink:0;}
.pf-av-wrap{position:relative;}
.pf-av{width:88px;height:88px;border-radius:20px;background:var(--ad);border:2px solid var(--ba);display:flex;align-items:center;justify-content:center;font-size:2rem;font-weight:700;color:var(--a);font-family:'JetBrains Mono',monospace;overflow:hidden;}
.pf-av img{width:100%;height:100%;object-fit:cover;display:block;}
.pf-av-edit{position:absolute;bottom:-6px;right:-6px;width:28px;height:28px;border-radius:8px;background:var(--a);border:2px solid var(--bg);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:background .18s;}
.pf-av-edit:hover{background:var(--ab);}
.pf-av-input{display:none;}
.pf-av-hint{font-size:.58rem;color:var(--tm);font-family:'JetBrains Mono',monospace;letter-spacing:.04em;}
.pf-photo-pending{display:inline-flex;align-items:center;gap:4px;padding:2px 8px;background:var(--wd);border:1px solid rgba(255,140,0,.2);border-radius:5px;font-size:.6rem;color:var(--w);font-family:'JetBrains Mono',monospace;}

/* Hero info */
.pf-hero-info{flex:1;min-width:0;}
.pf-eyebrow{font-family:'JetBrains Mono',monospace;font-size:.62rem;font-weight:600;color:var(--a);letter-spacing:.12em;text-transform:uppercase;margin-bottom:4px;}
.pf-name{font-size:1.7rem;font-weight:800;letter-spacing:-.025em;line-height:1.1;margin-bottom:5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.pf-email-row{display:flex;align-items:center;gap:7px;color:var(--ts);font-size:.82rem;margin-bottom:6px;}
.pf-sub-info{font-size:.73rem;color:var(--tm);margin-bottom:10px;display:flex;flex-direction:column;gap:2px;}
.pf-badges{display:flex;gap:8px;flex-wrap:wrap;}
.pf-badge{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:100px;font-family:'JetBrains Mono',monospace;font-size:.62rem;letter-spacing:.07em;text-transform:uppercase;}

/* Sections */
.pf-section{background:var(--s1);border:1px solid var(--b);border-radius:var(--r3);overflow:hidden;margin-bottom:14px;}
.pf-section-hd{display:flex;align-items:center;gap:12px;padding:17px 20px;border-bottom:1px solid var(--b);}
.pf-section-icon{width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.pf-section-title{font-size:.86rem;font-weight:700;}
.pf-section-body{padding:18px 20px;}

/* Fields */
.pf-fields{display:flex;flex-direction:column;gap:14px;}
.pf-row{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
@media(max-width:520px){.pf-row{grid-template-columns:1fr;}}
.pf-field{display:flex;flex-direction:column;gap:5px;}
.pf-label{font-size:.67rem;font-weight:700;text-transform:uppercase;letter-spacing:.09em;color:var(--tm);}
.pf-input-wrap{position:relative;}
.pf-input-icon{position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--tm);pointer-events:none;display:flex;align-items:center;}
.pf-input{width:100%;padding:11px 12px 11px 38px;background:var(--bg);border:1px solid var(--b);border-radius:var(--rr);color:var(--tp);font-family:'Outfit',sans-serif;font-size:.88rem;outline:none;transition:all .18s;}
.pf-input::placeholder{color:var(--tm);}
.pf-input:focus{border-color:var(--a);background:rgba(0,194,179,.04);box-shadow:0 0 0 3px var(--ad);}
.pf-input:disabled{opacity:.4;cursor:not-allowed;background:var(--s2);}

/* Password strength */
.pf-strength{display:flex;gap:3px;margin-top:5px;}
.pf-bar{flex:1;height:2px;border-radius:2px;background:var(--b);transition:background .3s;}
.pf-pw-hint{font-size:.67rem;color:var(--tm);margin-top:3px;}

/* Stats */
.pf-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;}
@media(max-width:400px){.pf-stats{grid-template-columns:repeat(2,1fr);}}
.pf-stat{padding:14px 15px;background:var(--s2);border:1px solid var(--b);border-radius:var(--r2);}
.pf-stat-n{font-family:'JetBrains Mono',monospace;font-size:1.4rem;font-weight:700;line-height:1;margin-bottom:2px;}
.pf-stat-l{font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--tm);}

/* Buttons */
.pf-save-row{display:flex;flex-direction:column;gap:10px;margin-bottom:14px;}
.pf-save{width:100%;padding:13px;background:var(--a);border:none;border-radius:var(--rr);color:#020d0c;font-family:'Outfit',sans-serif;font-size:.9rem;font-weight:800;cursor:pointer;transition:all .2s;display:flex;align-items:center;justify-content:center;gap:8px;}
.pf-save:hover:not(:disabled){background:var(--ab);transform:translateY(-1px);box-shadow:0 5px 20px var(--ag);}
.pf-save:disabled{opacity:.35;cursor:not-allowed;}
.pf-alert{padding:11px 14px;border-radius:var(--rr);font-size:.82rem;display:flex;align-items:center;gap:9px;animation:fadeUp .25s ease;}
.pf-alert.ok{background:rgba(0,194,122,.09);border:1px solid rgba(0,194,122,.25);color:#4ade9a;}
.pf-alert.err{background:rgba(255,68,68,.09);border:1px solid rgba(255,68,68,.25);color:#f87171;}

/* Danger */
.pf-danger-body{padding:16px 20px;display:flex;align-items:center;justify-content:space-between;gap:16px;}
@media(max-width:480px){.pf-danger-body{flex-direction:column;align-items:flex-start;}}
.pf-danger-text{font-size:.8rem;color:var(--ts);line-height:1.5;}
.pf-danger-btn{padding:9px 18px;background:transparent;border:1px solid rgba(255,68,68,.3);border-radius:var(--rr);color:#f87171;font-family:'Outfit',sans-serif;font-size:.8rem;font-weight:700;cursor:pointer;white-space:nowrap;transition:all .18s;flex-shrink:0;}
.pf-danger-btn:hover{background:var(--rd);border-color:rgba(255,68,68,.5);}

/* Spinners */
.pf-spin{width:16px;height:16px;border-radius:50%;border:2px solid rgba(0,0,0,.18);border-top-color:rgba(0,0,0,.7);animation:sp .65s linear infinite;display:inline-block;}
.pf-center-spin{display:flex;align-items:center;justify-content:center;padding:80px;}
.pf-big-spin{width:28px;height:28px;border:3px solid var(--b);border-top-color:var(--a);border-radius:50%;animation:sp .65s linear infinite;}
`;

const BAR_COLORS = ['', 'var(--r)', 'var(--w)', 'var(--a)', 'var(--g)'];

function pwStrength(p) {
  if (!p) return 0;
  let s = 0;
  if (p.length >= 8) s++;
  if (/[A-Z]/.test(p)) s++;
  if (/\d/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return s;
}

// Build full URL for avatars stored as relative paths like /uploads/avatars/xyz.jpg
function buildAvatarUrl(raw) {
  if (!raw) return null;
  if (raw.startsWith('http') || raw.startsWith('data:') || raw.startsWith('blob:')) return raw;
  return `${(API_URL || '').replace(/\/$/, '')}${raw}`;
}

export default function Profile() {
  const [user, setUser]           = useState(null);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [alert, setAlert]         = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [contacts, setContacts]   = useState([]);

  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile]       = useState(null);
  const fileRef = useRef();

  const [name, setName]           = useState('');
  const [phone, setPhone]         = useState('');
  const [address, setAddress]     = useState('');
  const [newPw, setNewPw]         = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPw, setShowPw]       = useState(false);

  const token = localStorage.getItem('token');

  const showAlert = (msg, type = 'ok') => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 5000);
  };

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    Promise.all([
      axios.get(`${API_URL}/api/users/profile`,            { headers: { Authorization: `Bearer ${token}` } }),
      axios.get(`${API_URL}/api/incidents/my-incidents`,   { headers: { Authorization: `Bearer ${token}` } }),
      axios.get(`${API_URL}/api/users/emergency-contacts`, { headers: { Authorization: `Bearer ${token}` } }),
    ])
      .then(([uR, iR, cR]) => {
        const u = uR.data;
        setUser(u);
        setName(u.name    || '');
        setPhone(u.phone  || '');
        setAddress(u.address || '');
        // The backend stores the field as avatarUrl
        setPhotoPreview(buildAvatarUrl(u.avatarUrl || null));
        setIncidents(iR.data.incidents        || []);
        setContacts(cR.data.emergencyContacts || []);
      })
      .catch(() => showAlert('Failed to load profile.', 'err'))
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handlePhoto = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { showAlert('Image too large (max 5 MB).', 'err'); return; }
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = ev => setPhotoPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!name.trim()) return showAlert('Name cannot be empty.', 'err');
    if (newPw && newPw !== confirmPw) return showAlert('Passwords do not match.', 'err');
    if (newPw && newPw.length < 6)    return showAlert('Password must be at least 6 characters.', 'err');
    setSaving(true);
    try {
      // Always FormData — multer on the backend handles it whether or not a file is present
      const form = new FormData();
      form.append('name',    name.trim());
      form.append('phone',   phone.trim());
      form.append('address', address.trim());
      if (newPw.trim())  form.append('password', newPw.trim());
      if (photoFile)     form.append('profilePhoto', photoFile); // matches upload.single('profilePhoto')

      const res = await axios.put(`${API_URL}/api/users/profile`, form, {
        headers: { Authorization: `Bearer ${token}` },
        // ⚠️ Do NOT set Content-Type — axios auto-sets multipart/form-data with correct boundary
      });

      const updated = res.data;
      setUser(updated);
      setName(updated.name    || '');
      setPhone(updated.phone  || '');
      setAddress(updated.address || '');
      // Backend returns both avatarUrl and profilePhoto alias
      setPhotoPreview(buildAvatarUrl(updated.profilePhoto || updated.avatarUrl || null));
      setPhotoFile(null);
      setNewPw('');
      setConfirmPw('');
      showAlert('Profile updated successfully!', 'ok');
    } catch (e) {
      showAlert(e.response?.data?.message || 'Update failed. Please try again.', 'err');
    } finally {
      setSaving(false);
    }
  };

  const pwScore  = pwStrength(newPw);
  const initials = (user?.name || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  if (loading) return (
    <>
      <style>{css}</style>
      <div className="pf-root"><div className="pf-center-spin"><div className="pf-big-spin" /></div></div>
    </>
  );

  return (
    <>
      <style>{css}</style>
      <div className="pf-root">
        <div className="pf-gbg" />
        <div className="pf-w">

          {/* Hero */}
          <div className="pf-hero">
            <div className="pf-hero-glow" />
            <div className="pf-av-col">
              <div className="pf-av-wrap">
                <div className="pf-av">
                  {photoPreview ? <img src={photoPreview} alt={name || 'avatar'} /> : initials}
                </div>
                <div className="pf-av-edit" onClick={() => fileRef.current?.click()} title="Change photo">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#020d0c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </div>
                <input type="file" accept="image/png,image/jpeg,image/webp" className="pf-av-input" ref={fileRef} onChange={handlePhoto} />
              </div>
              <div className="pf-av-hint">click ✏ to change</div>
              {photoFile && <div className="pf-photo-pending">⚠ save to apply</div>}
            </div>

            <div className="pf-hero-info">
              <div className="pf-eyebrow">My Account</div>
              <div className="pf-name">{user?.name || 'User'}</div>
              <div className="pf-email-row">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/>
                </svg>
                {user?.email}
              </div>
              {(user?.phone || user?.address) && (
                <div className="pf-sub-info">
                  {user.phone   && <span>📞 {user.phone}</span>}
                  {user.address && <span>📍 {user.address}</span>}
                </div>
              )}
              <div className="pf-badges">
                <span className="pf-badge" style={{ background:'rgba(0,194,179,.1)',border:'1px solid rgba(0,194,179,.2)',color:'var(--a)' }}>
                  <span style={{ width:5,height:5,borderRadius:'50%',background:'var(--a)',animation:'ntd 2s infinite',display:'inline-block' }}/>Active
                </span>
                {contacts.length > 0 && (
                  <span className="pf-badge" style={{ background:'rgba(0,194,122,.1)',border:'1px solid rgba(0,194,122,.2)',color:'var(--g)' }}>✓ SOS Ready</span>
                )}
                {user?.avatarUrl && (
                  <span className="pf-badge" style={{ background:'rgba(168,0,255,.08)',border:'1px solid rgba(168,0,255,.2)',color:'#c084fc' }}>📸 Photo set</span>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="pf-section">
            <div className="pf-section-hd">
              <div className="pf-section-icon" style={{ background:'var(--ad)' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--a)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
                </svg>
              </div>
              <div className="pf-section-title">Activity Overview</div>
            </div>
            <div style={{ padding:'16px 20px' }}>
              <div className="pf-stats">
                {[
                  { n: incidents.length,                               l: 'Total Incidents', c: 'var(--w)' },
                  { n: incidents.filter(i=>i.type==='sos').length,     l: 'SOS Alerts',      c: '#f87171' },
                  { n: contacts.length,                                l: 'Contacts',        c: 'var(--a)' },
                ].map(s => (
                  <div className="pf-stat" key={s.l}>
                    <div className="pf-stat-n" style={{ color:s.c }}>{s.n}</div>
                    <div className="pf-stat-l">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Personal Info */}
          <div className="pf-section">
            <div className="pf-section-hd">
              <div className="pf-section-icon" style={{ background:'var(--ad)' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--a)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <div className="pf-section-title">Personal Information</div>
            </div>
            <div className="pf-section-body">
              <div className="pf-fields">
                <div className="pf-row">
                  <div className="pf-field">
                    <div className="pf-label">Full Name *</div>
                    <div className="pf-input-wrap">
                      <span className="pf-input-icon">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                        </svg>
                      </span>
                      <input className="pf-input" value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" />
                    </div>
                  </div>
                  <div className="pf-field">
                    <div className="pf-label">Email (read-only)</div>
                    <div className="pf-input-wrap">
                      <span className="pf-input-icon">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/>
                        </svg>
                      </span>
                      <input className="pf-input" value={user?.email||''} disabled />
                    </div>
                  </div>
                </div>
                <div className="pf-row">
                  <div className="pf-field">
                    <div className="pf-label">Phone</div>
                    <div className="pf-input-wrap">
                      <span className="pf-input-icon">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.86 19.86 0 01-8.63-3.07A19.5 19.5 0 013.09 5.18 2 2 0 015.07 3h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L9.09 10.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 17.92z"/>
                        </svg>
                      </span>
                      <input className="pf-input" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Phone number" />
                    </div>
                  </div>
                  <div className="pf-field">
                    <div className="pf-label">Address</div>
                    <div className="pf-input-wrap">
                      <span className="pf-input-icon">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                        </svg>
                      </span>
                      <input className="pf-input" value={address} onChange={e=>setAddress(e.target.value)} placeholder="Your address" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div className="pf-section">
            <div className="pf-section-hd">
              <div className="pf-section-icon" style={{ background:'var(--wd)' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--w)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
              </div>
              <div className="pf-section-title">
                Change Password&nbsp;
                <span style={{ fontSize:'.68rem',color:'var(--tm)',fontWeight:400 }}>(leave blank to keep current)</span>
              </div>
            </div>
            <div className="pf-section-body">
              <div className="pf-row">
                <div className="pf-field">
                  <div className="pf-label">New Password</div>
                  <div className="pf-input-wrap">
                    <span className="pf-input-icon">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                      </svg>
                    </span>
                    <input className="pf-input" type={showPw?'text':'password'} value={newPw} onChange={e=>setNewPw(e.target.value)} placeholder="Min. 6 characters" style={{ paddingRight:36 }} />
                    <button type="button" style={{ position:'absolute',right:10,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'var(--tm)',display:'flex',padding:0 }} onClick={()=>setShowPw(v=>!v)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        {showPw
                          ? <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
                          : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>}
                      </svg>
                    </button>
                  </div>
                  {newPw && (
                    <div className="pf-strength">
                      {[1,2,3,4].map(i=>(
                        <div key={i} className="pf-bar" style={{ background: i<=pwScore ? BAR_COLORS[pwScore] : 'var(--b)' }} />
                      ))}
                    </div>
                  )}
                </div>
                <div className="pf-field">
                  <div className="pf-label">Confirm Password</div>
                  <div className="pf-input-wrap">
                    <span className="pf-input-icon">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                      </svg>
                    </span>
                    <input className="pf-input" type="password" value={confirmPw} onChange={e=>setConfirmPw(e.target.value)} placeholder="Re-enter password"
                      style={{ borderColor: confirmPw&&confirmPw!==newPw ? 'rgba(255,68,68,.5)':'' }} />
                  </div>
                  {confirmPw && confirmPw!==newPw && (
                    <div style={{ fontSize:'.67rem',color:'#f87171',marginTop:3 }}>Passwords don't match</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Save All button + alert */}
          <div className="pf-save-row">
            <button className="pf-save" onClick={handleSave} disabled={saving}>
              {saving
                ? <><div className="pf-spin"/>Saving…</>
                : <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
                    </svg>
                    Save All Changes
                  </>
              }
            </button>
            {alert && (
              <div className={`pf-alert ${alert.type}`}>
                {alert.type==='ok'?'✓':'✕'} {alert.msg}
              </div>
            )}
          </div>

          {/* Danger Zone */}
          <div className="pf-section" style={{ borderColor:'rgba(255,68,68,.15)' }}>
            <div className="pf-section-hd" style={{ borderBottomColor:'rgba(255,68,68,.12)' }}>
              <div className="pf-section-icon" style={{ background:'var(--rd)' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--r)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </div>
              <div className="pf-section-title" style={{ color:'#f87171' }}>Danger Zone</div>
            </div>
            <div className="pf-danger-body">
              <div>
                <div style={{ fontSize:'.84rem',fontWeight:700,marginBottom:3,color:'var(--tp)' }}>Delete Account</div>
                <div className="pf-danger-text">Permanently delete your account and all associated data. This cannot be undone.</div>
              </div>
              <button className="pf-danger-btn">Delete Account</button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}