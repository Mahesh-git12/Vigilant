import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
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
import SOSButton from './components/SOSButton';
import TrackIncident from './pages/TrackIncident';
import FindHelperButton from './components/FindHelperButton';
import { AppBar, Toolbar, Button, Box, Avatar, IconButton, Drawer, List, ListItem, ListItemText, Divider, Typography } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import MenuIcon from '@mui/icons-material/Menu';
import SafetyResources from './pages/SafetyResources';
<<<<<<< HEAD

// --- NEW IMPORTS FOR ML MODEL ---
import Dashboard from './pages/Dashboard'; 
// --------------------------------
=======
>>>>>>> f49171856fdedfda78c2209ae274135e2b02ed7c

function ResponsiveAppBar({ isLoggedIn, handleLogout }) {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const navigate = useNavigate();

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  // UPDATED: Added Safety AI to navigation
  const navItems = [
    { label: 'Home', path: '/home' },
    { label: 'Safety AI', path: '/safety-check' }, // ML Feature
    { label: 'Notifications', path: '/notifications' },
    { label: 'Report', path: '/report' },
    { label: 'My Incidents', path: '/my-incidents' },
    { label: 'Emergency Contacts', path: '/emergency-contacts' },
    { label: 'Safety Resources', path: '/resources' },
    { label: 'Profile', path: '/profile' },
  ];

  const list = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {navItems.map((item) => (
          <ListItem button key={item.label} onClick={() => navigate(item.path)}>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
        <Divider />
        <ListItem button onClick={handleLogout}>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          width: '100vw',
          left: 0,
          background: 'rgba(255,255,255,0.35)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
          borderBottom: '1px solid rgba(255,255,255,0.18)',
          overflowX: 'hidden',
        }}
      >
        <Toolbar sx={{ minHeight: 72 }}>
          <Avatar
            sx={{
              bgcolor: 'primary.main',
              mr: 2,
              width: 44,
              height: 44,
              boxShadow: '0 2px 12px #6a82fb55',
            }}
          >
            <SecurityIcon fontSize="large" />
          </Avatar>
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to={isLoggedIn ? '/home' : '/'}
            sx={{
              flexGrow: 1,
              color: 'primary.main',
              fontWeight: 700,
              fontSize: '1.3rem',
              letterSpacing: '0.08em',
              textDecoration: 'none',
            }}
          >
            Vigilant
          </Typography>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            {!isLoggedIn ? (
              <>
                <Button component={Link} to="/register" color="primary">
                  Register
                </Button>
                <Button component={Link} to="/login" color="secondary">
                  Login
                </Button>
              </>
            ) : (
              <>
                {navItems.map((item) => (
                  <Button
                    key={item.label}
                    component={Link}
                    to={item.path}
                    color="primary"
                    sx={{ fontWeight: 600 }}
                  >
                    {item.label}
                  </Button>
                ))}
                <Button
                  color="secondary"
                  sx={{
                    fontWeight: 700,
                    borderRadius: 20,
                    background: 'linear-gradient(90deg, #fc5c7d 0%, #6a82fb 100%)',
                    color: '#fff',
                    px: 3,
                    boxShadow: '0 2px 16px #fc5c7d33',
                    '&:hover': {
                      background: 'linear-gradient(90deg, #6a82fb 0%, #fc5c7d 100%)',
                    },
                  }}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            )}
          </Box>

          {isLoggedIn && (
            <IconButton
              color="primary"
              aria-label="open drawer"
              edge="end"
              onClick={toggleDrawer(true)}
              sx={{ display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        {list()}
      </Drawer>
    </>
  );
}

function App() {
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const RedirectIfLoggedIn = ({ children }) => (isLoggedIn ? <Navigate to="/home" /> : children);

  return (
    <Router>
      <ResponsiveAppBar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />

      <Box
        sx={{
          width: '100vw',
          minHeight: '100vh',
          margin: 0,
          overflowX: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: 0,
          px: 0,
        }}
      >
        {isLoggedIn && (
          <>
            <SOSButton sx={{ position: 'fixed', bottom: 32, right: 32, zIndex: 1200 }} />
            <FindHelperButton sx={{ position: 'fixed', bottom: 100, right: 32, zIndex: 1300 }} />
          </>
        )}

        <Routes>
          <Route path="/" element={isLoggedIn ? <Navigate to="/home" /> : <Landing />} />
          <Route path="/register" element={<RedirectIfLoggedIn><Register /></RedirectIfLoggedIn>} />
          <Route path="/login" element={<RedirectIfLoggedIn><Login /></RedirectIfLoggedIn>} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/report" element={<ProtectedRoute><ReportIncident /></ProtectedRoute>} />
          <Route path="/my-incidents" element={<ProtectedRoute><MyIncidents /></ProtectedRoute>} />
          <Route path="/emergency-contacts" element={<ProtectedRoute><EmergencyContacts /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/track/:incidentId" element={<TrackIncident />} />
          <Route path="/resources" element={<SafetyResources />} />
<<<<<<< HEAD
          
          {/* --- NEW ML SAFETY ROUTE --- */}
          <Route path="/safety-check" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          {/* --------------------------- */}

          <Route path="*" element={<NotFound />} />
=======
>>>>>>> f49171856fdedfda78c2209ae274135e2b02ed7c
        </Routes>
      </Box>
    </Router>
  );
}

export default App;

<<<<<<< HEAD
// import React from 'react';
=======

// import React, { useState } from 'react';
>>>>>>> f49171856fdedfda78c2209ae274135e2b02ed7c
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
<<<<<<< HEAD
// import { AppBar, Toolbar, Button, Box, Avatar, IconButton, Drawer, List, ListItem, ListItemText, Divider, Typography } from '@mui/material';
// import SecurityIcon from '@mui/icons-material/Security';
// import MenuIcon from '@mui/icons-material/Menu';
// import SafetyResources from './pages/SafetyResources';


// function ResponsiveAppBar({ isLoggedIn, handleLogout }) {
//   const [drawerOpen, setDrawerOpen] = React.useState(false);
=======
// import VoiceListener from './components/VoiceListener';
// import VoiceSOSConsentModal from './components/VoiceSOSConsentModal';
// import VoiceSOSFab from './components/VoiceSOSFab';
// import { AppBar, Toolbar, Button, Box, Avatar, Snackbar, Alert, IconButton, Drawer, List, ListItem, ListItemText, Divider, Typography } from '@mui/material';
// import SecurityIcon from '@mui/icons-material/Security';
// import MenuIcon from '@mui/icons-material/Menu';
// import SafetyResources from './pages/SafetyResources';
// import axios from "axios";

// function ResponsiveAppBar({ isLoggedIn, handleLogout }) {
//   const [drawerOpen, setDrawerOpen] = useState(false);
>>>>>>> f49171856fdedfda78c2209ae274135e2b02ed7c
//   const navigate = useNavigate();

//   const toggleDrawer = (open) => () => {
//     setDrawerOpen(open);
//   };

//   const navItems = [
//     { label: 'Home', path: '/home' },
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

<<<<<<< HEAD
=======
//           {/* Desktop nav buttons */}
>>>>>>> f49171856fdedfda78c2209ae274135e2b02ed7c
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

<<<<<<< HEAD
=======
//           {/* Mobile hamburger menu */}
>>>>>>> f49171856fdedfda78c2209ae274135e2b02ed7c
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

<<<<<<< HEAD
=======
//   const [voiceConsent, setVoiceConsent] = useState(() => localStorage.getItem('voiceSOSConsent') === 'true');
//   const [listening, setListening] = useState(false);
//   const [feedback, setFeedback] = useState('');
//   const [open, setOpen] = useState(false);

//   const handleAllowVoiceSOS = () => {
//     setVoiceConsent(true);
//     localStorage.setItem('voiceSOSConsent', 'true');
//     setListening(true);
//   };

//   const handleDenyVoiceSOS = () => {
//     setVoiceConsent(false);
//     localStorage.setItem('voiceSOSConsent', 'false');
//     setListening(false);
//   };

//   const toggleVoiceSOS = () => {
//     setListening((prev) => !prev);
//   };

//   const handleSendSOS = async () => {
//     try {
//       await axios.post("/api/incidents/sos", {/* your SOS payload here */});
//       setFeedback('SOS sent! Your selected contacts have been notified.');
//       setOpen(true);
//     } catch (error) {
//       setFeedback('Failed to send SOS.');
//       setOpen(true);
//       console.error('SOS error:', error);
//     }
//   };

>>>>>>> f49171856fdedfda78c2209ae274135e2b02ed7c
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
<<<<<<< HEAD
=======
//         {!voiceConsent && isLoggedIn && (
//           <VoiceSOSConsentModal
//             open={!voiceConsent}
//             onAllow={handleAllowVoiceSOS}
//             onDeny={handleDenyVoiceSOS}
//           />
//         )}

>>>>>>> f49171856fdedfda78c2209ae274135e2b02ed7c
//         {isLoggedIn && (
//           <>
//             <SOSButton sx={{ position: 'fixed', bottom: 32, right: 32, zIndex: 1200 }} />
//             <FindHelperButton sx={{ position: 'fixed', bottom: 100, right: 32, zIndex: 1300 }} />
<<<<<<< HEAD
=======
//             <VoiceSOSFab listening={listening} onToggle={toggleVoiceSOS} sx={{ position: 'fixed', bottom: 170, right: 32, zIndex: 1400 }} />
//             {listening && <VoiceListener onTrigger={handleSendSOS} setFeedback={setFeedback} setOpen={setOpen} sx={{ position: 'fixed', bottom: 210, right: 32, zIndex: 1400 }} />}
>>>>>>> f49171856fdedfda78c2209ae274135e2b02ed7c
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
//           <Route path="*" element={<NotFound />} />
//           <Route path="/resources" element={<SafetyResources />} />
//         </Routes>
<<<<<<< HEAD
=======

//         <Snackbar open={open} autoHideDuration={4000} onClose={() => setOpen(false)}>
//           <Alert severity={feedback.startsWith('Failed') ? 'error' : 'success'} sx={{ width: '100%' }}>
//             {feedback}
//           </Alert>
//         </Snackbar>
>>>>>>> f49171856fdedfda78c2209ae274135e2b02ed7c
//       </Box>
//     </Router>
//   );
// }

// export default App;
<<<<<<< HEAD

=======
>>>>>>> f49171856fdedfda78c2209ae274135e2b02ed7c
