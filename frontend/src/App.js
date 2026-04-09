// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
// import Register from './pages/Register';
// import Login from './pages/Login';
// import ReportIncident from './pages/ReportIncident';
// import MyIncidents from './pages/MyIncidents';
// import EmergencyContacts from './pages/EmergencyContacts';
// import Profile from './pages/Profile';
// import Landing from './pages/Landing';
// import HomePage from './pages/HomePage';
// import Notifications from './pages/Notifications';
// import NotFound from './pages/NotFound';
// import ProtectedRoute from './components/ProtectedRoute';
// import SOSButton from './components/SOSButton';
// import TrackIncident from './pages/TrackIncident';
// import FindHelperButton from './components/FindHelperButton';
// import { AppBar, Toolbar, Button, Box, Avatar, IconButton, Drawer, List, ListItem, ListItemText, Divider, Typography } from '@mui/material';
// import SecurityIcon from '@mui/icons-material/Security';
// import MenuIcon from '@mui/icons-material/Menu';
// import SafetyResources from './pages/SafetyResources';

// // --- NEW IMPORTS FOR ML MODEL ---
// import Dashboard from './pages/Dashboard'; 
// // --------------------------------

// function ResponsiveAppBar({ isLoggedIn, handleLogout }) {
//   const [drawerOpen, setDrawerOpen] = React.useState(false);
//   const navigate = useNavigate();

//   const toggleDrawer = (open) => () => {
//     setDrawerOpen(open);
//   };

//   // UPDATED: Added Safety AI to navigation
//   const navItems = [
//     { label: 'Home', path: '/home' },
//     { label: 'Safety AI', path: '/safety-check' }, // ML Feature
//     { label: 'Notifications', path: '/notifications' },
//     { label: 'Report', path: '/report' },
//     { label: 'My Incidents', path: '/my-incidents' },
//     { label: 'Emergency Contacts', path: '/emergency-contacts' },
//     { label: 'Safety Resources', path: '/resources' },
//     { label: 'Profile', path: '/profile' },
//   ];

//   const list = () => (
//     <Box
//       sx={{ width: 250 }}
//       role="presentation"
//       onClick={toggleDrawer(false)}
//       onKeyDown={toggleDrawer(false)}
//     >
//       <List>
//         {navItems.map((item) => (
//           <ListItem button key={item.label} onClick={() => navigate(item.path)}>
//             <ListItemText primary={item.label} />
//           </ListItem>
//         ))}
//         <Divider />
//         <ListItem button onClick={handleLogout}>
//           <ListItemText primary="Logout" />
//         </ListItem>
//       </List>
//     </Box>
//   );

//   return (
//     <>
//       <AppBar
//         position="static"
//         elevation={0}
//         sx={{
//           width: '100vw',
//           left: 0,
//           background: 'rgba(255,255,255,0.35)',
//           backdropFilter: 'blur(12px)',
//           boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
//           borderBottom: '1px solid rgba(255,255,255,0.18)',
//           overflowX: 'hidden',
//         }}
//       >
//         <Toolbar sx={{ minHeight: 72 }}>
//           <Avatar
//             sx={{
//               bgcolor: 'primary.main',
//               mr: 2,
//               width: 44,
//               height: 44,
//               boxShadow: '0 2px 12px #6a82fb55',
//             }}
//           >
//             <SecurityIcon fontSize="large" />
//           </Avatar>
//           <Typography
//             variant="h6"
//             noWrap
//             component={Link}
//             to={isLoggedIn ? '/home' : '/'}
//             sx={{
//               flexGrow: 1,
//               color: 'primary.main',
//               fontWeight: 700,
//               fontSize: '1.3rem',
//               letterSpacing: '0.08em',
//               textDecoration: 'none',
//             }}
//           >
//             Vigilant
//           </Typography>

//           <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
//             {!isLoggedIn ? (
//               <>
//                 <Button component={Link} to="/register" color="primary">
//                   Register
//                 </Button>
//                 <Button component={Link} to="/login" color="secondary">
//                   Login
//                 </Button>
//               </>
//             ) : (
//               <>
//                 {navItems.map((item) => (
//                   <Button
//                     key={item.label}
//                     component={Link}
//                     to={item.path}
//                     color="primary"
//                     sx={{ fontWeight: 600 }}
//                   >
//                     {item.label}
//                   </Button>
//                 ))}
//                 <Button
//                   color="secondary"
//                   sx={{
//                     fontWeight: 700,
//                     borderRadius: 20,
//                     background: 'linear-gradient(90deg, #fc5c7d 0%, #6a82fb 100%)',
//                     color: '#fff',
//                     px: 3,
//                     boxShadow: '0 2px 16px #fc5c7d33',
//                     '&:hover': {
//                       background: 'linear-gradient(90deg, #6a82fb 0%, #fc5c7d 100%)',
//                     },
//                   }}
//                   onClick={handleLogout}
//                 >
//                   Logout
//                 </Button>
//               </>
//             )}
//           </Box>

//           {isLoggedIn && (
//             <IconButton
//               color="primary"
//               aria-label="open drawer"
//               edge="end"
//               onClick={toggleDrawer(true)}
//               sx={{ display: { md: 'none' } }}
//             >
//               <MenuIcon />
//             </IconButton>
//           )}
//         </Toolbar>
//       </AppBar>
//       <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
//         {list()}
//       </Drawer>
//     </>
//   );
// }

// function App() {
//   const isLoggedIn = !!localStorage.getItem('token');

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     window.location.href = '/login';
//   };

//   const RedirectIfLoggedIn = ({ children }) => (isLoggedIn ? <Navigate to="/home" /> : children);

//   return (
//     <Router>
//       <ResponsiveAppBar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />

//       <Box
//         sx={{
//           width: '100vw',
//           minHeight: '100vh',
//           margin: 0,
//           overflowX: 'hidden',
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//           py: 0,
//           px: 0,
//         }}
//       >
//         {isLoggedIn && (
//           <>
//             <SOSButton sx={{ position: 'fixed', bottom: 32, right: 32, zIndex: 1200 }} />
//             <FindHelperButton sx={{ position: 'fixed', bottom: 100, right: 32, zIndex: 1300 }} />
//           </>
//         )}

//         <Routes>
//           <Route path="/" element={isLoggedIn ? <Navigate to="/home" /> : <Landing />} />
//           <Route path="/register" element={<RedirectIfLoggedIn><Register /></RedirectIfLoggedIn>} />
//           <Route path="/login" element={<RedirectIfLoggedIn><Login /></RedirectIfLoggedIn>} />
//           <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
//           <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
//           <Route path="/report" element={<ProtectedRoute><ReportIncident /></ProtectedRoute>} />
//           <Route path="/my-incidents" element={<ProtectedRoute><MyIncidents /></ProtectedRoute>} />
//           <Route path="/emergency-contacts" element={<ProtectedRoute><EmergencyContacts /></ProtectedRoute>} />
//           <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
//           <Route path="/track/:incidentId" element={<TrackIncident />} />
//           <Route path="/resources" element={<SafetyResources />} />
          
//           {/* --- NEW ML SAFETY ROUTE --- */}
//           <Route path="/safety-check" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
//           {/* --------------------------- */}

//           <Route path="*" element={<NotFound />} />
//         </Routes>
//       </Box>
//     </Router>
//   );
// }

// export default App;


import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import ReportIncident from './pages/ReportIncident';
import MyIncidents from './pages/MyIncidents';
import EmergencyContacts from './pages/EmergencyContacts';
import Profile from './pages/Profile';
import Landing from './pages/Landing';
import HomePage from './pages/HomePage';
import Notifications from './pages/Notifications';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import TrackIncident from './pages/TrackIncident';
// SOSButton and FindHelperButton are now embedded directly inside HomePage — no floating buttons needed
import SafetyResources from './pages/SafetyResources';
import Dashboard from './pages/Dashboard';

// ── Navbar CSS injected once ──────────────────────────────────────────────────
const navCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500&display=swap');

  .vn-bar {
    width: 100%;
    position: sticky; top: 0; z-index: 1300;
    background: rgba(9,12,15,0.85);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(255,255,255,0.07);
    font-family: 'Outfit', sans-serif;
  }
  .vn-inner {
    max-width: 1200px; margin: 0 auto;
    display: flex; align-items: center;
    padding: 0 24px; height: 62px; gap: 12px;
  }

  /* Logo */
  .vn-logo {
    display: flex; align-items: center; gap: 10px;
    text-decoration: none; margin-right: 8px; flex-shrink: 0;
  }
  .vn-logo-mark {
    width: 32px; height: 32px; border-radius: 8px;
    background: rgba(0,194,179,0.12);
    border: 1.5px solid rgba(0,194,179,0.35);
    display: flex; align-items: center; justify-content: center;
  }
  .vn-logo-name {
    font-size: 1.1rem; font-weight: 800;
    letter-spacing: -0.02em; color: #E8EDF2;
  }
  .vn-logo-name em { color: #00C2B3; font-style: normal; }

  /* Desktop nav links */
  .vn-links {
    display: flex; align-items: center; gap: 2px; flex: 1;
  }
  .vn-link {
    padding: 6px 11px; border-radius: 7px;
    font-size: 0.82rem; font-weight: 500;
    color: rgba(232,237,242,0.5);
    text-decoration: none;
    transition: color 0.15s, background 0.15s;
    white-space: nowrap;
  }
  .vn-link:hover { color: #E8EDF2; background: rgba(255,255,255,0.05); }
  .vn-link.active { color: #00C2B3; background: rgba(0,194,179,0.1); }

  /* Right side */
  .vn-right { display: flex; align-items: center; gap: 10px; margin-left: auto; flex-shrink: 0; }

  .vn-logout {
    padding: 7px 16px;
    background: transparent;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 8px;
    color: rgba(232,237,242,0.55);
    font-family: 'Outfit', sans-serif;
    font-size: 0.82rem; font-weight: 600;
    cursor: pointer;
    transition: all 0.18s ease;
  }
  .vn-logout:hover {
    border-color: rgba(255,68,68,0.4);
    color: #f87171;
    background: rgba(255,68,68,0.06);
  }

  .vn-register {
    padding: 7px 16px;
    background: transparent;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 8px;
    color: rgba(232,237,242,0.7);
    font-family: 'Outfit', sans-serif;
    font-size: 0.82rem; font-weight: 600;
    text-decoration: none;
    transition: all 0.18s ease;
  }
  .vn-register:hover {
    border-color: rgba(0,194,179,0.35);
    color: #00C2B3;
    background: rgba(0,194,179,0.07);
  }

  .vn-signin {
    padding: 7px 16px;
    background: #00C2B3;
    border: none; border-radius: 8px;
    color: #020d0c;
    font-family: 'Outfit', sans-serif;
    font-size: 0.82rem; font-weight: 800;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.18s ease;
  }
  .vn-signin:hover {
    background: #00DDD0;
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(0,194,179,0.3);
  }

  /* Hamburger (mobile) */
  .vn-burger {
    display: none;
    background: none; border: none; cursor: pointer;
    color: rgba(232,237,242,0.6); padding: 6px;
    border-radius: 7px; margin-left: auto;
    transition: color 0.15s, background 0.15s;
  }
  .vn-burger:hover { color: #E8EDF2; background: rgba(255,255,255,0.06); }

  /* Drawer */
  .vn-drawer {
    position: fixed; inset: 0; z-index: 2000;
  }
  .vn-drawer-overlay {
    position: absolute; inset: 0;
    background: rgba(0,0,0,0.6);
    backdrop-filter: blur(4px);
  }
  .vn-drawer-panel {
    position: absolute; top: 0; right: 0; bottom: 0;
    width: 260px;
    background: #0E1318;
    border-left: 1px solid rgba(255,255,255,0.08);
    display: flex; flex-direction: column;
    padding: 24px 0;
    animation: drawerIn 0.22s ease;
  }
  @keyframes drawerIn { from { transform: translateX(100%); opacity: 0; } to { transform: none; opacity: 1; } }
  .vn-drawer-header {
    padding: 0 20px 20px;
    border-bottom: 1px solid rgba(255,255,255,0.07);
    display: flex; align-items: center; justify-content: space-between;
  }
  .vn-drawer-close {
    background: none; border: none; cursor: pointer;
    color: rgba(232,237,242,0.4); padding: 4px;
    border-radius: 6px; transition: color 0.15s;
  }
  .vn-drawer-close:hover { color: #E8EDF2; }
  .vn-drawer-links {
    padding: 12px 0; flex: 1; overflow-y: auto;
  }
  .vn-drawer-link {
    display: flex; align-items: center; gap: 12px;
    padding: 11px 20px;
    color: rgba(232,237,242,0.55);
    text-decoration: none; font-size: 0.88rem; font-weight: 500;
    transition: all 0.15s;
  }
  .vn-drawer-link:hover { color: #E8EDF2; background: rgba(255,255,255,0.04); }
  .vn-drawer-link.active { color: #00C2B3; background: rgba(0,194,179,0.07); }
  .vn-drawer-footer {
    padding: 16px 20px 0;
    border-top: 1px solid rgba(255,255,255,0.07);
  }
  .vn-drawer-logout {
    width: 100%; padding: 10px 16px;
    background: rgba(255,68,68,0.08);
    border: 1px solid rgba(255,68,68,0.2);
    border-radius: 8px; cursor: pointer;
    color: #f87171;
    font-family: 'Outfit', sans-serif;
    font-size: 0.85rem; font-weight: 600;
    transition: all 0.18s;
  }
  .vn-drawer-logout:hover { background: rgba(255,68,68,0.15); }

  @media (max-width: 860px) {
    .vn-links { display: none !important; }
    .vn-right .vn-logout { display: none; }
    .vn-burger { display: flex; }
  }
`;

function ShieldSVG() {
  return (
    <svg width="17" height="18" viewBox="0 0 22 24" fill="none">
      <path d="M11 1L2 4.75V11C2 16.4 6 21.4 11 23C16 21.4 20 16.4 20 11V4.75L11 1Z"
        fill="rgba(0,194,179,0.25)" stroke="rgba(0,194,179,0.75)" strokeWidth="1.5"/>
      <path d="M7.5 11.5L9.5 13.5L14.5 8.5" stroke="#00C2B3" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

const NAV_ITEMS = [
  { label: 'Home',               path: '/home' },
  { label: 'Safety AI',          path: '/safety-check' },
  { label: 'Notifications',      path: '/notifications' },
  { label: 'Report',             path: '/report' },
  { label: 'My Incidents',       path: '/my-incidents' },
  { label: 'Contacts',           path: '/emergency-contacts' },
  { label: 'Resources',          path: '/resources' },
  { label: 'Profile',            path: '/profile' },
];

function NavBar({ isLoggedIn, onLogout }) {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <>
      <style>{navCSS}</style>
      <nav className="vn-bar">
        <div className="vn-inner">
          {/* Logo */}
          <Link to={isLoggedIn ? '/home' : '/'} className="vn-logo">
            <div className="vn-logo-mark"><ShieldSVG /></div>
            <span className="vn-logo-name">Vigi<em>lant</em></span>
          </Link>

          {/* Desktop links */}
          {isLoggedIn && (
            <div className="vn-links">
              {NAV_ITEMS.map(item => (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`vn-link${location.pathname === item.path ? ' active' : ''}`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}

          {/* Right actions */}
          <div className="vn-right">
            {isLoggedIn ? (
              <>
                <button className="vn-logout" onClick={onLogout}>Logout</button>
                <button className="vn-burger" onClick={() => setDrawerOpen(true)} aria-label="Menu">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="3" y1="12" x2="21" y2="12"/>
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <line x1="3" y1="18" x2="21" y2="18"/>
                  </svg>
                </button>
              </>
            ) : (
              <>
                <Link to="/register" className="vn-register">Register</Link>
                <Link to="/login" className="vn-signin">Sign In</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {drawerOpen && (
        <div className="vn-drawer">
          <div className="vn-drawer-overlay" onClick={() => setDrawerOpen(false)} />
          <div className="vn-drawer-panel">
            <div className="vn-drawer-header">
              <div className="vn-logo">
                <div className="vn-logo-mark"><ShieldSVG /></div>
                <span className="vn-logo-name">Vigi<em>lant</em></span>
              </div>
              <button className="vn-drawer-close" onClick={() => setDrawerOpen(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div className="vn-drawer-links">
              {NAV_ITEMS.map(item => (
                <a key={item.label} href={item.path}
                  className={`vn-drawer-link${location.pathname === item.path ? ' active' : ''}`}
                  onClick={() => setDrawerOpen(false)}>
                  {item.label}
                </a>
              ))}
            </div>
            <div className="vn-drawer-footer">
              <button className="vn-drawer-logout" onClick={() => { setDrawerOpen(false); onLogout(); }}>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function App() {
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const RedirectIfLoggedIn = ({ children }) =>
    isLoggedIn ? <Navigate to="/home" /> : children;

  return (
    <Router>
      <NavBar isLoggedIn={isLoggedIn} onLogout={handleLogout} />

      <div style={{ width: '100%', minHeight: 'calc(100vh - 62px)', position: 'relative' }}>
        <Routes>
          <Route path="/"                   element={isLoggedIn ? <Navigate to="/home" /> : <Landing />} />
          <Route path="/register"           element={<RedirectIfLoggedIn><Register /></RedirectIfLoggedIn>} />
          <Route path="/login"              element={<RedirectIfLoggedIn><Login /></RedirectIfLoggedIn>} />
          <Route path="/home"               element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/notifications"      element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path="/report"             element={<ProtectedRoute><ReportIncident /></ProtectedRoute>} />
          <Route path="/my-incidents"       element={<ProtectedRoute><MyIncidents /></ProtectedRoute>} />
          <Route path="/emergency-contacts" element={<ProtectedRoute><EmergencyContacts /></ProtectedRoute>} />
          <Route path="/profile"            element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/track/:incidentId"  element={<TrackIncident />} />
          <Route path="/resources"          element={<SafetyResources />} />
          <Route path="/safety-check"       element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="*"                   element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;