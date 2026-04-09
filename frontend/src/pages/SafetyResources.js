// import React, { useEffect, useState, useMemo } from 'react';
// import axios from 'axios';
// import {
//   Box,
//   Typography,
//   Card,
//   CardContent,
//   CircularProgress,
//   Tabs,
//   Tab,
//   TextField,
//   Stack,
//   Chip,
//   Pagination,
//   Link,
//   Collapse,
//   IconButton,
// } from '@mui/material';
// import ArticleIcon from '@mui/icons-material/Article';
// import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
// import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import { debounce } from 'lodash';

// const API_URL = process.env.REACT_APP_API_URL || '';

// const TYPES = ['all', 'article', 'video', 'contact'];
// const PAGE_SIZE = 6;

// export default function SafetyResources() {
//   const [resources, setResources] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [tab, setTab] = useState(0);
//   const [expandedIds, setExpandedIds] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [page, setPage] = useState(1);

//   useEffect(() => {
//     setLoading(true);
//     setError('');
//     async function fetchResources() {
//       try {
//         const typeFilter = TYPES[tab] === 'all' ? '' : `/${TYPES[tab]}`;
//         const res = await axios.get(`${API_URL}/api/resources${typeFilter}`);
//         setResources(res.data);
//         setExpandedIds([]);
//         setPage(1);
//       } catch (err) {
//         setError('Failed to load resources');
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchResources();
//   }, [tab]);

//   const toggleExpand = (id) => {
//     setExpandedIds((prev) =>
//       prev.includes(id) ? prev.filter((eid) => eid !== id) : [...prev, id]
//     );
//   };

//   const debouncedSearch = useMemo(
//     () =>
//       debounce((value) => {
//         setSearchTerm(value);
//         setPage(1);
//       }, 300),
//     []
//   );

//   const handleSearchChange = (e) => {
//     debouncedSearch(e.target.value.toLowerCase().trim());
//   };

//   const filteredResources = useMemo(() => {
//     if (!searchTerm) return resources;
//     return resources.filter(
//       (r) =>
//         r.title.toLowerCase().includes(searchTerm) ||
//         r.description.toLowerCase().includes(searchTerm)
//     );
//   }, [resources, searchTerm]);

//   const pageCount = Math.ceil(filteredResources.length / PAGE_SIZE);

//   const paginatedResources = filteredResources.slice(
//     (page - 1) * PAGE_SIZE,
//     page * PAGE_SIZE
//   );

//   return (
//     <Box
//       sx={{
//         minHeight: '100vh',
//         width: '100%',
//         background: 'linear-gradient(120deg, #c7d2fe 40%, #fbc2eb 100%)',
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         pt: 4,
//       }}
//     >
//       <Typography
//         variant="h4"
//         align="center"
//         fontWeight={700}
//         gutterBottom
//         sx={{ mb: 2 }}
//       >
//         Safety Tips & Resources
//       </Typography>

//       <Box sx={{ maxWidth: 700, width: '100%', mb: 3, bgcolor: 'transparent' }}>
//         <Tabs
//           value={tab}
//           onChange={(e, val) => setTab(val)}
//           textColor="primary"
//           indicatorColor="primary"
//           centered
//           sx={{ "& .MuiTabs-flexContainer": { justifyContent: "center" } }}
//         >
//           {TYPES.map((type) => (
//             <Tab
//               key={type}
//               label={type.charAt(0).toUpperCase() + type.slice(1)}
//               sx={{
//                 fontWeight: 700,
//                 fontSize: 16,
//                 textTransform: 'none',
//                 paddingBottom: 1,
//               }}
//             />
//           ))}
//         </Tabs>
//         <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 2 }}>
//           {TYPES.slice(1).map((type, idx) => (
//             <Chip
//               key={type}
//               label={type.charAt(0).toUpperCase() + type.slice(1)}
//               color={tab === idx + 1 ? 'primary' : 'default'}
//               onClick={() => setTab(idx + 1)}
//               sx={{ cursor: 'pointer' }}
//             />
//           ))}
//         </Stack>
//         <Box
//           sx={{
//             display: 'flex',
//             justifyContent: 'center',
//             width: '100%',
//             marginTop: 3,
//           }}
//         >
//           <TextField
//             variant="outlined"
//             placeholder="Search resources..."
//             size="small"
//             onChange={handleSearchChange}
//             sx={{
//               width: '100%',
//               maxWidth: 480,
//               borderRadius: 3,
//               boxShadow: 2,
//             }}
//           />
//         </Box>
//       </Box>

//       {loading && (
//         <Box sx={{ mt: 6, textAlign: 'center' }}>
//           <CircularProgress />
//         </Box>
//       )}

//       {error && (
//         <Typography color="error" align="center" sx={{ mt: 4 }}>
//           {error}
//         </Typography>
//       )}

//       {!loading && !error && paginatedResources.length === 0 && (
//         <Typography align="center" sx={{ mt: 4 }}>
//           No resources found.
//         </Typography>
//       )}

//       {!loading && !error && paginatedResources.length > 0 && (
//         <Box
//           sx={{
//             width: '100%',
//             maxWidth: 700,
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             gap: 4,
//           }}
//         >
//           {paginatedResources.map((res) => {
//             const isExpanded = expandedIds.includes(res._id);

//             if (res.type === 'video') {
//               return (
//                 <Card
//                   key={res._id}
//                   variant="outlined"
//                   sx={{
//                     width: '100%',
//                     maxWidth: 600,
//                     mb: 2,
//                     borderRadius: 2,
//                     boxShadow: 4,
//                     display: 'flex',
//                     flexDirection: 'column',
//                     alignItems: 'center',
//                     p: 3,
//                   }}
//                 >
//                   <Box
//                     sx={{
//                       display: 'flex',
//                       alignItems: 'center',
//                       mb: 1,
//                       width: '100%',
//                     }}
//                   >
//                     <VideoLibraryIcon color="secondary" fontSize="large" />
//                     <Typography variant="h6" sx={{ ml: 1 }}>
//                       {res.title}
//                     </Typography>
//                   </Box>
//                   <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
//                     {res.description}
//                   </Typography>
//                   <Box
//                     sx={{
//                       width: '100%',
//                       borderRadius: 2,
//                       overflow: 'hidden',
//                       height: 0,
//                       paddingBottom: '56.25%',
//                       position: 'relative',
//                     }}
//                   >
//                     <iframe
//                       src={res.content}
//                       title={res.title}
//                       allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                       allowFullScreen
//                       style={{
//                         position: 'absolute',
//                         top: 0,
//                         left: 0,
//                         width: '100%',
//                         height: '100%',
//                         border: 'none',
//                         borderRadius: '10px',
//                         background: '#fff',
//                       }}
//                     />
//                   </Box>
//                 </Card>
//               );
//             }
//             // Articles & contacts use collapsible panels, centered
//             return (
//               <Card
//                 key={res._id}
//                 variant="outlined"
//                 sx={{
//                   width: '100%',
//                   mb: 2,
//                   borderRadius: 3,
//                   boxShadow: 8,
//                   display: 'flex',
//                   flexDirection: 'column',
//                   alignItems: 'center',
//                   p: 3,
//                   position: 'relative',
//                 }}
//               >
//                 <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
//                   {res.type === 'article' && (
//                     <ArticleIcon color="primary" fontSize="large" />
//                   )}
//                   {res.type === 'contact' && (
//                     <ContactPhoneIcon color="success" fontSize="large" />
//                   )}
//                   <Typography variant="h6" sx={{ ml: 1, flexGrow: 1 }}>
//                     {res.title}
//                   </Typography>
//                   <IconButton
//                     aria-label="expand"
//                     onClick={() => toggleExpand(res._id)}
//                     sx={{
//                       transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
//                       transition: 'transform 0.3s',
//                     }}
//                   >
//                     <ExpandMoreIcon />
//                   </IconButton>
//                 </Box>
//                 <Typography
//                   variant="body2"
//                   color="textSecondary"
//                   sx={{ mb: 2, width: '100%', textAlign: 'left' }}
//                 >
//                   {res.description}
//                 </Typography>
//                 <Collapse in={isExpanded} timeout="auto" unmountOnExit>
//                   <Box
//                     sx={{
//                       mt: 2,
//                       width: '95%',
//                       mx: 'auto',
//                       backgroundColor: '#fff',
//                       padding: 2,
//                       borderRadius: 1,
//                       boxShadow: 6,
//                       maxHeight: 240,
//                       overflowY: 'auto',
//                       boxSizing: 'border-box',
//                     }}
//                   >
//                     {res.type === 'article' && (
//                       <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
//                         {res.content}
//                       </Typography>
//                     )}
//                     {res.type === 'contact' && (
//                       <Box sx={{ whiteSpace: 'pre-line' }}>
//                         {res.content.split('\n').map((line, i) => {
//                           const phoneMatch = line.match(
//                             /(\+?\d{3,}[- ]?\d{3,}[- ]?\d{3,})/
//                           );
//                           if (phoneMatch) {
//                             return (
//                               <Typography key={i} variant="body1" sx={{ mb: 0.5 }}>
//                                 {line.split(phoneMatch[0])[0]}
//                                 <Link
//                                   href={`tel:${phoneMatch[0].replace(/[- ]/g, '')}`}
//                                   color="primary"
//                                   underline="hover"
//                                 >
//                                   {phoneMatch[0]}
//                                 </Link>
//                                 {line.split(phoneMatch[0])[1]}
//                               </Typography>
//                             );
//                           }
//                           return (
//                             <Typography key={i} variant="body1" sx={{ mb: 0.5 }}>
//                               {line}
//                             </Typography>
//                           );
//                         })}
//                       </Box>
//                     )}
//                   </Box>
//                 </Collapse>
//               </Card>
//             );
//           })}
//         </Box>
//       )}

//       {!loading && !error && (
//         <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
//           <Pagination
//             count={pageCount}
//             page={page}
//             onChange={(e, val) => setPage(val)}
//             color="primary"
//             shape="rounded"
//           />
//         </Box>
//       )}
//     </Box>
//   );
// }


import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';

const API_URL = process.env.REACT_APP_API_URL || '';
const TYPES = ['all', 'article', 'video', 'contact'];
const PAGE_SIZE = 6;

const css = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap');
:root {
  --a:#00C2B3; --ad:rgba(0,194,179,0.11); --ag:rgba(0,194,179,0.22); --ab:#00DDD0;
  --r:#FF4444; --rd:rgba(255,68,68,0.11); --g:#00C27A; --gd:rgba(0,194,122,0.11);
  --w:#FF8C00; --wd:rgba(255,140,0,0.11); --purple:rgba(168,0,255,0.12);
  --bg:#090C0F; --s1:#0E1318; --s2:#131A21; --s3:#182028;
  --b:rgba(255,255,255,0.07); --ba:rgba(0,194,179,0.3);
  --tp:#E8EDF2; --ts:rgba(232,237,242,0.52); --tm:rgba(232,237,242,0.25);
  --rr:10px; --r2:14px; --r3:18px;
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

.sr-root{min-height:100vh;width:100%;background:var(--bg);color:var(--tp);font-family:'Outfit',sans-serif;position:relative;}
.sr-gbg{position:fixed;inset:0;z-index:0;pointer-events:none;background-image:linear-gradient(rgba(0,194,179,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,194,179,.03) 1px,transparent 1px);background-size:44px 44px;mask-image:radial-gradient(ellipse 100% 60% at 50% 0%,black 20%,transparent 100%);}
.sr-w{position:relative;z-index:1;max-width:900px;margin:0 auto;padding:40px 28px 80px;}

/* Header */
.sr-header{display:flex;align-items:center;gap:16px;margin-bottom:28px;padding-bottom:22px;border-bottom:1px solid var(--b);}
.sr-icon{width:48px;height:48px;border-radius:12px;background:var(--gd);border:1.5px solid rgba(0,194,122,0.3);display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.sr-eyebrow{font-family:'JetBrains Mono',monospace;font-size:.62rem;font-weight:600;color:var(--g);letter-spacing:.12em;text-transform:uppercase;margin-bottom:3px;}
.sr-title{font-size:1.6rem;font-weight:800;letter-spacing:-.025em;line-height:1.1;}

/* Controls */
.sr-controls{display:flex;flex-direction:column;gap:14px;margin-bottom:24px;}
.sr-tabs{display:flex;gap:6px;flex-wrap:wrap;}
.sr-tab{padding:7px 16px;background:transparent;border:1px solid var(--b);border-radius:8px;color:var(--ts);font-family:'Outfit',sans-serif;font-size:.78rem;font-weight:600;cursor:pointer;transition:all .18s;text-transform:capitalize;}
.sr-tab:hover{border-color:rgba(255,255,255,.12);color:var(--tp);}
.sr-tab.active{background:var(--ad);border-color:var(--ba);color:var(--a);}
.sr-search-wrap{position:relative;}
.sr-search-icon{position:absolute;left:14px;top:50%;transform:translateY(-50%);color:var(--tm);pointer-events:none;display:flex;align-items:center;}
.sr-search{width:100%;padding:11px 14px 11px 42px;background:var(--s1);border:1px solid var(--b);border-radius:var(--rr);color:var(--tp);font-family:'Outfit',sans-serif;font-size:.88rem;outline:none;transition:all .18s;}
.sr-search::placeholder{color:var(--tm);}
.sr-search:focus{border-color:var(--a);background:rgba(0,194,179,.04);box-shadow:0 0 0 3px var(--ad);}

/* Grid */
.sr-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;margin-bottom:24px;}
@media(max-width:640px){.sr-grid{grid-template-columns:1fr;}}

/* Cards */
.sr-card{background:var(--s1);border:1px solid var(--b);border-radius:var(--r3);overflow:hidden;transition:border-color .2s,background .2s;animation:fadeUp .22s ease;display:flex;flex-direction:column;}
@keyframes fadeUp{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:none}}
.sr-card:hover{border-color:rgba(255,255,255,.1);background:var(--s2);}
.sr-card-strip{height:3px;flex-shrink:0;}
.sr-card-body{padding:18px;flex:1;display:flex;flex-direction:column;gap:10px;}
.sr-card-head{display:flex;align-items:flex-start;gap:12px;}
.sr-card-icon{width:36px;height:36px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;}
.sr-card-ttl{font-size:.9rem;font-weight:700;line-height:1.3;flex:1;}
.sr-card-desc{font-size:.76rem;color:var(--ts);line-height:1.55;}
.sr-expand-btn{width:100%;padding:8px;background:transparent;border:1px solid var(--b);border-radius:8px;color:var(--ts);font-family:'Outfit',sans-serif;font-size:.74rem;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:7px;transition:all .18s;margin-top:auto;}
.sr-expand-btn:hover{border-color:var(--ba);color:var(--a);background:var(--ad);}
.sr-expand-content{overflow:hidden;transition:max-height .3s ease;}
.sr-expand-inner{padding:14px;background:var(--s2);border:1px solid var(--b);border-radius:var(--rr);margin-top:0;max-height:240px;overflow-y:auto;}
.sr-expand-inner::-webkit-scrollbar{width:3px;}
.sr-expand-inner::-webkit-scrollbar-thumb{background:var(--b);border-radius:2px;}
.sr-text{font-size:.78rem;color:var(--ts);line-height:1.7;white-space:pre-line;}
.sr-phone-line{margin-bottom:4px;font-size:.78rem;color:var(--ts);line-height:1.6;}
.sr-phone-link{color:var(--a);text-decoration:none;font-weight:600;}
.sr-phone-link:hover{text-decoration:underline;}

/* Video card */
.sr-video-card{background:var(--s1);border:1px solid var(--b);border-radius:var(--r3);overflow:hidden;transition:border-color .2s;animation:fadeUp .22s ease;grid-column:1/-1;}
.sr-video-card:hover{border-color:rgba(255,255,255,.1);}
.sr-video-body{padding:18px 18px 0;}
.sr-video-head{display:flex;align-items:flex-start;gap:12px;margin-bottom:8px;}
.sr-video-icon{width:36px;height:36px;border-radius:9px;background:rgba(168,0,255,.1);border:1px solid rgba(168,0,255,.2);display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0;}
.sr-video-frame{position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:var(--rr);margin-top:8px;}
.sr-video-frame iframe{position:absolute;top:0;left:0;width:100%;height:100%;border:none;}

/* Type chips */
.sr-type-chip{display:inline-flex;align-items:center;padding:2px 8px;border-radius:100px;font-size:.58rem;font-weight:700;text-transform:uppercase;letter-spacing:.05em;}

/* Pagination */
.sr-pagination{display:flex;align-items:center;justify-content:center;gap:6px;}
.sr-page-btn{width:36px;height:36px;border-radius:8px;border:1px solid var(--b);background:transparent;color:var(--ts);font-family:'JetBrains Mono',monospace;font-size:.8rem;cursor:pointer;transition:all .18s;display:flex;align-items:center;justify-content:center;}
.sr-page-btn:hover{border-color:var(--ba);color:var(--a);background:var(--ad);}
.sr-page-btn.active{background:var(--a);border-color:var(--a);color:#020d0c;font-weight:700;}
.sr-page-btn:disabled{opacity:.3;cursor:not-allowed;}

/* Loading */
.sr-spinner{display:flex;align-items:center;justify-content:center;padding:80px;}
.sr-spin{width:28px;height:28px;border-radius:50%;border:3px solid var(--b);border-top-color:var(--a);animation:sp .65s linear infinite;}
@keyframes sp{to{transform:rotate(360deg)}}
.sr-empty{text-align:center;padding:60px;grid-column:1/-1;}
.sr-empty-icon{font-size:2.2rem;opacity:.2;margin-bottom:10px;}
.sr-empty-text{font-size:.84rem;color:var(--tm);}
.sr-skel{background:linear-gradient(90deg,var(--s2) 25%,var(--s3) 50%,var(--s2) 75%);background-size:200% 100%;animation:sk 1.4s infinite;border-radius:6px;}
@keyframes sk{0%{background-position:200% 0}100%{background-position:-200% 0}}
`;

const TYPE_META = {
  article: { icon: '📄', strip: '#00C2B3', chipBg: 'rgba(0,194,179,.1)', chipColor: '#00C2B3', iconBg: 'rgba(0,194,179,.1)' },
  video:   { icon: '▶️', strip: 'rgba(168,0,255,0.7)', chipBg: 'rgba(168,0,255,.1)', chipColor: '#c084fc', iconBg: 'rgba(168,0,255,.1)' },
  contact: { icon: '📞', strip: '#00C27A', chipBg: 'rgba(0,194,122,.1)', chipColor: '#4ade9a', iconBg: 'rgba(0,194,122,.1)' },
};

function ContactContent({ content }) {
  return (
    <div>
      {(content || '').split('\n').map((line, i) => {
        const match = line.match(/(\+?\d[\d\s\-]{6,14}\d)/);
        if (match) {
          const parts = line.split(match[0]);
          return (
            <div className="sr-phone-line" key={i}>
              {parts[0]}<a className="sr-phone-link" href={`tel:${match[0].replace(/[\s-]/g, '')}`}>{match[0]}</a>{parts[1]}
            </div>
          );
        }
        return <div className="sr-phone-line" key={i}>{line}</div>;
      })}
    </div>
  );
}

function ResourceCard({ res }) {
  const [open, setOpen] = useState(false);
  const meta = TYPE_META[res.type] || TYPE_META.article;

  if (res.type === 'video') {
    return (
      <div className="sr-video-card">
        <div className="sr-video-body">
          <div className="sr-video-head">
            <div className="sr-video-icon">{meta.icon}</div>
            <div>
              <div style={{ fontSize: '.9rem', fontWeight: 700, lineHeight: 1.3, marginBottom: 3 }}>{res.title}</div>
              <div style={{ fontSize: '.73rem', color: 'var(--ts)' }}>{res.description}</div>
            </div>
            <span className="sr-type-chip" style={{ background: meta.chipBg, color: meta.chipColor, border: `1px solid ${meta.chipColor}33`, marginLeft: 'auto' }}>Video</span>
          </div>
        </div>
        <div style={{ padding: '0 18px 18px' }}>
          <div className="sr-video-frame">
            <iframe src={res.content} title={res.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sr-card">
      <div className="sr-card-strip" style={{ background: meta.strip }} />
      <div className="sr-card-body">
        <div className="sr-card-head">
          <div className="sr-card-icon" style={{ background: meta.iconBg }}>{meta.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 4 }}>
              <div className="sr-card-ttl">{res.title}</div>
              <span className="sr-type-chip" style={{ background: meta.chipBg, color: meta.chipColor, border: `1px solid ${meta.chipColor}33`, flexShrink: 0 }}>
                {res.type}
              </span>
            </div>
          </div>
        </div>
        <div className="sr-card-desc">{res.description}</div>
        <button className="sr-expand-btn" onClick={() => setOpen(v => !v)}>
          {open ? 'Collapse' : 'Read More'}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>
        {open && (
          <div className="sr-expand-inner" style={{ animationName: 'fadeUp', animationDuration: '.2s' }}>
            {res.type === 'contact' ? <ContactContent content={res.content} /> : <div className="sr-text">{res.content}</div>}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SafetyResources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true); setError('');
    const typeFilter = TYPES[tab] === 'all' ? '' : `/${TYPES[tab]}`;
    axios.get(`${API_URL}/api/resources${typeFilter}`)
      .then(r => { setResources(r.data); setPage(1); })
      .catch(() => setError('Failed to load resources.'))
      .finally(() => setLoading(false));
  }, [tab]);

  const debouncedSearch = useMemo(() => debounce(v => { setSearchTerm(v); setPage(1); }, 300), []);
  const handleSearch = e => debouncedSearch(e.target.value.toLowerCase().trim());

  const filtered = useMemo(() => {
    if (!searchTerm) return resources;
    return resources.filter(r =>
      r.title.toLowerCase().includes(searchTerm) || r.description.toLowerCase().includes(searchTerm)
    );
  }, [resources, searchTerm]);

  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <style>{css}</style>
      <div className="sr-root">
        <div className="sr-gbg" />
        <div className="sr-w">

          {/* Header */}
          <div className="sr-header">
            <div className="sr-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--g)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
              </svg>
            </div>
            <div>
              <div className="sr-eyebrow">Knowledge Base</div>
              <div className="sr-title">Safety Resources</div>
            </div>
          </div>

          {/* Controls */}
          <div className="sr-controls">
            <div className="sr-tabs">
              {TYPES.map((t, i) => (
                <button key={t} className={`sr-tab${tab === i ? ' active' : ''}`} onClick={() => setTab(i)}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
            <div className="sr-search-wrap">
              <span className="sr-search-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </span>
              <input className="sr-search" placeholder="Search articles, videos, contacts…" onChange={handleSearch} />
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="sr-grid">
              {[1, 2, 3, 4].map(i => (
                <div key={i} style={{ background: 'var(--s1)', border: '1px solid var(--b)', borderRadius: 'var(--r3)', padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div className="sr-skel" style={{ height: 3 }} />
                  <div className="sr-skel" style={{ height: 36, width: '60%' }} />
                  <div className="sr-skel" style={{ height: 14, width: '90%' }} />
                  <div className="sr-skel" style={{ height: 14, width: '70%' }} />
                </div>
              ))}
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#f87171', fontSize: '.84rem' }}>{error}</div>
          ) : (
            <>
              <div className="sr-grid">
                {paged.length === 0 ? (
                  <div className="sr-empty">
                    <div className="sr-empty-icon">📖</div>
                    <div className="sr-empty-text">No resources found.</div>
                  </div>
                ) : paged.map(res => (
                  <ResourceCard key={res._id} res={res} />
                ))}
              </div>

              {pageCount > 1 && (
                <div className="sr-pagination">
                  <button className="sr-page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                  </button>
                  {Array.from({ length: pageCount }, (_, i) => i + 1).map(p => (
                    <button key={p} className={`sr-page-btn${page === p ? ' active' : ''}`} onClick={() => setPage(p)}>{p}</button>
                  ))}
                  <button className="sr-page-btn" disabled={page === pageCount} onClick={() => setPage(p => p + 1)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                  </button>
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </>
  );
}