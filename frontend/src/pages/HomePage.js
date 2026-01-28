
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Button,
  Stack,
  Grid,
  CircularProgress,
  Alert,
  Chip,
  Snackbar,
  IconButton,
} from "@mui/material";
import SecurityIcon from "@mui/icons-material/Security";
import InfoIcon from "@mui/icons-material/Info";
import SosIcon from '@mui/icons-material/Sos';
import axios from "axios";
import HandsFreeVoiceSOS from "../components/HandsFreeVoiceSOS";

const API_URL = process.env.REACT_APP_API_URL;

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [selected, setSelected] = useState([]);
  const [contactsLoaded, setContactsLoaded] = useState(false);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [open, setOpen] = useState(false);
  const [showTips, setShowTips] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const [userRes, contactsRes, incidentsRes] = await Promise.all([
          axios.get(`${API_URL}/api/users/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_URL}/api/users/emergency-contacts`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_URL}/api/incidents/my-incidents`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setUser(userRes.data);
        setContacts(contactsRes.data.emergencyContacts || []);
        setSelected(contactsRes.data.emergencyContacts?.map((c) => c.email) || []);
        setContactsLoaded(true);
        setIncidents(incidentsRes.data.incidents || []);
      } catch {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const sendSOS = async (location, coords) => {
    try {
      const token = localStorage.getItem("token");
      const chosenContacts = contacts.filter((c) => selected.includes(c.email));
      if (!chosenContacts.length) {
        setFeedback("Please select at least one contact");
        setOpen(true);
        return;
      }
      await axios.post(
        `${API_URL}/api/incidents/sos`,
        {
          location,
          description: "SOS Emergency",
          contacts: chosenContacts,
          latitude: coords?.latitude,
          longitude: coords?.longitude,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFeedback("SOS sent! Your contacts have been notified.");
      setOpen(true);
    } catch {
      setFeedback("Failed to send SOS. Try again later.");
      setOpen(true);
    }
  };

  const handleSOS = () => {
    if (!contactsLoaded) {
      setFeedback("Loading contacts...");
      setOpen(true);
      return;
    }
    if (!selected.length) {
      setFeedback("Please select at least one contact.");
      setOpen(true);
      return;
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          sendSOS(
            `Lat: ${pos.coords.latitude}, Lon: ${pos.coords.longitude}`,
            { latitude: pos.coords.latitude, longitude: pos.coords.longitude }
          );
        },
        () => {
          setFeedback("Location permission denied. Sending without location.");
          setOpen(true);
          sendSOS("Unknown", {});
        },
        { timeout: 8000 }
      );
    } else {
      setFeedback("Geolocation not supported. Sending without location.");
      setOpen(true);
      sendSOS("Unknown", {});
    }
  };

  const getSeverity = () => {
    if (feedback.startsWith("SOS sent")) return "success";
    if (feedback.includes("Please") || feedback.includes("Loading")) return "warning";
    return "error";
  };

  return (
    <Box sx={{ width: "100vw", minHeight: "100vh", background: "linear-gradient(135deg, #fc5d7d, #6a82fb)", py: 5, px: 2, display: "flex", justifyContent: "center" }}>
      <Box sx={{ maxWidth: 900, width: "100%" }}>
        <Stack direction="row" spacing={2} alignItems="center" mb={4}>
          <Avatar sx={{ bgcolor: "primary.main", width: 68, height: 68 }}>
            {user?.name?.charAt(0).toUpperCase() || <SecurityIcon />}
          </Avatar>
          <Typography variant="h5" color="white" fontWeight="bold" flexGrow={1}>
            Welcome, {user?.name || "User"}
          </Typography>
          <Button variant="contained" href="/profile" startIcon={<SecurityIcon />} sx={{ background: "linear-gradient(to right, #6a82fb, #fc5d7d)" }}>
            Profile
          </Button>
        </Stack>

        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <IconButton
            onClick={handleSOS}
            aria-label="send sos alert"
            sx={{
              width: 160,
              height: 160,
              bgcolor: 'error.main',
              color: 'white',
              boxShadow: '0px 8px 24px rgba(252, 93, 125, 0.6)',
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                bgcolor: 'error.dark',
                transform: 'scale(1.05)',
              },
            }}
          >
            <SosIcon sx={{ fontSize: 90 }} />
          </IconButton>
        </Box>

        {/* --- CHANGE IS IN THIS BLOCK --- */}
        <Grid container spacing={2} mb={4} justifyContent="center">
          <Grid item xs={6} sm={5}>
            <Paper sx={{ p: 2, borderRadius: 3, background: "linear-gradient(120deg, #fdb, #cae)", textAlign: "center" }}>
              <Typography>Contacts</Typography>
              <Typography fontWeight="bold" fontSize={28} color="primary">{contacts.length}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={5}>
            <Paper sx={{ p: 2, borderRadius: 3, background: "linear-gradient(120deg, #9eca, #fadc)", textAlign: "center" }}>
              <Typography>Incidents</Typography>
              <Typography fontWeight="bold" fontSize={28} color="error">{incidents.length}</Typography>
            </Paper>
          </Grid>
        </Grid>
        {/* --- END OF CHANGE --- */}

        <Typography variant="h6" color="white" fontWeight="bold" mb={2} align="center">Recent Activity</Typography>

        {loading ? <CircularProgress sx={{ color: "white", mx: "auto", display: "block" }} /> :
          incidents.length === 0 ?
            <Typography color="rgba(255,255,255,0.7)" py={5} align="center">No incidents reported yet.</Typography>
            : (
              <Stack spacing={2} sx={{ mb: 2 }}>
                {incidents.map((incident) => (
                  <Paper key={incident._id} sx={{ p: 2, borderRadius: 2, display: "flex", justifyContent: "space-between", backgroundColor: "rgba(255,255,255,0.7)" }}>
                    <Box sx={{ overflow: "hidden" }}>
                      <Typography fontWeight="bold" noWrap>{incident.location}</Typography>
                      <Typography noWrap>{incident.description}</Typography>
                      <Typography variant="caption" color="text.secondary">{new Date(incident.date).toLocaleString()}</Typography>
                    </Box>
                    <Chip label={(incident.type || "INCIDENT").toUpperCase()} color={incident.type === "sos" ? "error" : "info"} size="small" />
                  </Paper>
                ))}
              </Stack>
            )
        }

        <Button href="/my-incidents" variant="outlined" fullWidth sx={{ color: "white", borderColor: "white", '&:hover': { bgcolor: "white", color: 'primary.main' } }}>View All</Button>

        {showTips && (
          <Paper sx={{ mt: 3, p: 2, borderRadius: 3, display: "flex", alignItems: "center", gap: 2, background: "linear-gradient(90deg, #fffde4, #fbc)" }}>
            <InfoIcon color="secondary" />
            <Box>
              <Typography fontWeight="bold" color="primary.main">Get Started</Typography>
              <Typography>
                Add your first emergency contact.<br />
                Submit a test incident.<br />
                Review your profile.
              </Typography>
            </Box>
          </Paper>
        )}

        {error && <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>}
      </Box>

      <HandsFreeVoiceSOS onSOS={handleSOS} />

      <Snackbar open={open} onClose={() => setOpen(false)} autoHideDuration={4000} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={getSeverity()}>{feedback}</Alert>
      </Snackbar>
    </Box>
  );
}


// import React, { useEffect, useState } from 'react';
// import {
//   Box,
//   Typography,
//   Paper,
//   Avatar,
//   Button,
//   Stack,
//   Grid,
//   CircularProgress,
//   Alert,
//   Chip,
//   IconButton,
//   Fade,
// } from '@mui/material';
// import SecurityIcon from '@mui/icons-material/Security';
// import WarningAmberIcon from '@mui/icons-material/WarningAmber';
// import ContactsIcon from '@mui/icons-material/Contacts';
// import ReportIcon from '@mui/icons-material/Report';
// import InfoIcon from '@mui/icons-material/Info';
// import CloseIcon from '@mui/icons-material/Close';
// import axios from 'axios';

// const API_URL = process.env.REACT_APP_API_URL;

// export default function HomePage() {
//   const [user, setUser] = useState(null);
//   const [contacts, setContacts] = useState([]);
//   const [incidents, setIncidents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [showTips, setShowTips] = useState(true);

//   useEffect(() => {
//     const fetchHomeData = async () => {
//       setLoading(true);
//       setError('');
//       try {
//         const token = localStorage.getItem('token');
//         const [prof, conts, incs] = await Promise.all([
//           axios.get(`${API_URL}/api/users/profile`, { headers: { Authorization: `Bearer ${token}` } }),
//           axios.get(`${API_URL}/api/users/emergency-contacts`, { headers: { Authorization: `Bearer ${token}` } }),
//           axios.get(`${API_URL}/api/incidents/my-incidents`, { headers: { Authorization: `Bearer ${token}` } }),
//         ]);
//         setUser(prof.data);
//         setContacts(conts.data.emergencyContacts || []);
//         setIncidents(incs.data.incidents || []);
//       } catch (err) {
//         setError('Failed to load dashboard data.');
//       }
//       setLoading(false);
//     };
//     fetchHomeData();
//   }, []);

//   const mainGradient = 'linear-gradient(135deg, #fc5c7d 0%, #6a82fb 100%)';
//   const cardGradient1 = 'linear-gradient(120deg, #fbc2eb 0%, #a6c1ee 100%)';
//   const cardGradient2 = 'linear-gradient(120deg, #fcdff2 0%, #e2e2e2 100%)';
//   const highlightGradient = 'linear-gradient(120deg, #91eac9 0%, #fad0c4 100%)';

//   return (
//     <Box
//       sx={{
//         width: '100vw',
//         minHeight: '100vh',
//         margin: 0,
//         background: 'linear-gradient(135deg, #fc5c7d 0%, #6a82fb 100%)', // body gradient applies
//         py: 5,
//         px: 0,
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         overflowX: 'hidden',
//       }}
//     >
//       <Box
//         sx={{
//           width: '100vw',
//           px: { xs: 2, sm: 4, md: 6 },
//           boxSizing: 'border-box',
//         }}
//       >
//         {/* Header row */}
//         <Box
//           display="flex"
//           alignItems="center"
//           gap={3}
//           mb={3}
//           width="100%"
//           flexWrap="wrap"
//           justifyContent="space-between"
//         >
//           <Avatar
//             sx={{
//               bgcolor: 'primary.main',
//               width: 68,
//               height: 68,
//               fontSize: 38,
//               boxShadow: '0 3px 18px #fc5c7d45',
//             }}
//           >
//             {user?.name ? user.name.charAt(0).toUpperCase() : <SecurityIcon />}
//           </Avatar>
//           <Typography
//             variant="h5"
//             fontWeight={800}
//             letterSpacing={0.5}
//             sx={{ flex: 1, color: '#fff', textShadow: '0px 2px 12px #70508070', minWidth: 160 }}
//           >
//             Welcome, {user?.name || 'User'}!
//           </Typography>
//           <Button
//             href="/profile"
//             variant="contained"
//             sx={{
//               background: 'linear-gradient(90deg,#6a82fb,#fc5c7d)',
//               color: '#fff',
//               fontWeight: 600,
//               boxShadow: '0 2px 12px #6a82fb21',
//               whiteSpace: 'nowrap',
//             }}
//             startIcon={<SecurityIcon />}
//           >
//             Profile
//           </Button>
//         </Box>

//         {/* Main Actions Area */}
//         <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} width="100%" mb={4}>
//           <Button
//             href="/report"
//             size="large"
//             fullWidth
//             sx={{
//               background: 'linear-gradient(90deg,#ff6363,#fbc2eb)',
//               color: '#fff',
//               fontWeight: 700,
//               boxShadow: '0 2px 12px #fc5c7d44',
//               borderRadius: 3,
//               '&:hover': { opacity: 0.93, boxShadow: '0 4px 18px #ffaaa90d' },
//             }}
//             startIcon={<WarningAmberIcon />}
//           >
//             Report Incident
//           </Button>
//           <Button
//             href="/emergency-contacts"
//             size="large"
//             fullWidth
//             sx={{
//               background: 'linear-gradient(90deg,#6a82fb,#a6c1ee)',
//               color: '#fff',
//               fontWeight: 700,
//               boxShadow: '0 2px 12px #6a82fb16',
//               borderRadius: 3,
//               '&:hover': { opacity: 0.93 },
//             }}
//             startIcon={<ContactsIcon />}
//           >
//             Add Contact
//           </Button>
//           <Button
//             href="/my-incidents"
//             size="large"
//             fullWidth
//             sx={{
//               background: 'linear-gradient(90deg,#43cea2,#185a9d)',
//               color: '#fff',
//               fontWeight: 700,
//               boxShadow: '0 2px 13px #43cea240',
//               borderRadius: 3,
//               '&:hover': { opacity: 0.93 },
//             }}
//             startIcon={<ReportIcon />}
//           >
//             My Incidents
//           </Button>
//         </Stack>

//         {/* Status Overview Cards */}
//         <Grid container spacing={2} mb={3} justifyContent="center">
//           <Grid item xs={6} sm={4}>
//             <Paper
//               sx={{
//                 p: 2,
//                 borderRadius: 3,
//                 textAlign: 'center',
//                 background: cardGradient1,
//                 color: '#35477d',
//                 fontWeight: 700,
//                 boxShadow: '0 2px 8px #91eac910',
//               }}
//             >
//               <Typography variant="body2">Contacts</Typography>
//               <Typography fontWeight="bold" color="primary" fontSize={28}>
//                 {contacts.length}
//               </Typography>
//             </Paper>
//           </Grid>
//           <Grid item xs={6} sm={4}>
//             <Paper
//               sx={{
//                 p: 2,
//                 borderRadius: 3,
//                 textAlign: 'center',
//                 background: highlightGradient,
//                 color: '#822e81',
//                 fontWeight: 700,
//                 boxShadow: '0 2px 12px #fc5c7d22',
//               }}
//             >
//               <Typography variant="body2">Incidents</Typography>
//               <Typography fontWeight="bold" color="error" fontSize={28}>
//                 {incidents.length}
//               </Typography>
//             </Paper>
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <Paper
//               sx={{
//                 p: 2,
//                 borderRadius: 3,
//                 textAlign: 'center',
//                 background: cardGradient2,
//                 color: '#333',
//                 boxShadow: '0 2px 8px #bbcaff14',
//               }}
//             >
//               <Typography variant="body2">Active SOS</Typography>
//               <Chip
//                 color="secondary"
//                 label="No active SOS"
//                 size="small"
//                 sx={{
//                   background: 'linear-gradient(90deg,#f7971e,#ffd200)',
//                   color: '#4e2608',
//                   fontWeight: 700,
//                 }}
//               />
//             </Paper>
//           </Grid>
//         </Grid>

//         {/* Gradient divider */}
//         <Fade in timeout={800}>
//           <Box
//             sx={{
//               height: 8,
//               width: '100%',
//               borderRadius: 6,
//               my: 2,
//               background: 'linear-gradient(90deg,#f7971e,#6a82fb,#43cea2,#fc5c7d,#fbc2eb 80%)',
//             }}
//           />
//         </Fade>

//         {/* Recent Activity */}
//         {/* Recent Activity */}
// <Box
//   sx={{
//     width: '100%',
//     maxWidth: 700,
//     mx: 'auto',  // centers horizontally
//     px: { xs: 2, sm: 3 },  // responsive horizontal padding
//   }}
// >
//   <Typography
//     variant="h6"
//     fontWeight="bold"
//     color="white"
//     textAlign="center"
//     mb={2}
//     sx={{ textShadow: '0 0 5px rgba(0,0,0,0.3)' }}
//   >
//     Recent Activity
//   </Typography>

//   {loading ? (
//     <CircularProgress color="inherit" sx={{ display: 'block', mx: 'auto' }} />
//   ) : incidents.length === 0 ? (
//     <Typography color="rgba(255,255,255,0.8)" textAlign="center" py={5}>
//       No incidents reported yet.
//     </Typography>
//   ) : (
//     <Stack
//       spacing={2}
//       maxHeight={350}
//       overflow="auto"
//       sx={{ pr: 1 }} // leave space for scrollbar
//     >
//       {incidents.map((inc) => (
//         <Paper
//           key={inc._id}
//           sx={{
//             px: 2,
//             py: 1.5,
//             borderRadius: 2,
//             backgroundColor: 'rgba(255, 255, 255, 0.7)',
//             boxShadow: 3,
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             minWidth: 0,
//             mx: 'auto',
//           }}
//         >
//           <Box sx={{ minWidth: 0 }}>
//             <Typography
//               variant="body1"
//               fontWeight="bold"
//               noWrap
//               sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
//             >
//               {inc.location}
//             </Typography>
//             <Typography
//               variant="body2"
//               sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
//             >
//               {inc.description}
//             </Typography>
//             <Typography variant="caption" color="text.secondary">
//               {new Date(inc.date).toLocaleString()}
//             </Typography>
//           </Box>

//           <Chip
//             label={inc.type ? inc.type.toUpperCase() : 'INCIDENT'}
//             color={inc.type === 'sos' ? 'error' : 'info'}
//             size="small"
//             sx={{ ml: 2, flexShrink: 0 }}
//           />
//         </Paper>
//       ))}
//     </Stack>
//   )}

//   <Button
//     href="/my-incidents"
//     fullWidth
//     sx={{
//       mt: 2,
//       color: 'white',
//       borderColor: 'white',
//       '&:hover': {
//         bgcolor: 'white',
//         color: 'primary.main',
//       },
//     }}
//     variant="outlined"
//   >
//     View All
//   </Button>
// </Box>


//         {/* Tips Section */}
//         {showTips && (
//           <Paper
//             sx={{
//               mt: 3,
//               p: 2,
//               borderRadius: 2,
//               background: 'linear-gradient(90deg,#fffde4,#fbc2eb 95%)',
//               display: 'flex',
//               alignItems: 'center',
//               gap: 2,
//               boxShadow: '0 6px 18px #fc5c7d15',
//             }}
//           >
//             <InfoIcon color="secondary" />
//             <Box flex={1}>
//               <Typography fontWeight={700} color="primary.main">
//                 Get Started:
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 Add your first emergency contact.
//                 <br />
//                 Submit a test incident to see alerts in action.
//                 <br />
//                 Review your profile information.
//               </Typography>
//             </Box>
//             <IconButton onClick={() => setShowTips(false)}>
//               <CloseIcon />
//             </IconButton>
//           </Paper>
//         )}

//         {/* Error Snackbar */}
//         {error && (
//           <Alert severity="error" sx={{ mt: 3, width: '100%' }}>
//             {error}
//           </Alert>
//         )}
//       </Box>
//     </Box>
//   );
// }
