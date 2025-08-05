import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Avatar, Button, Stack, Grid, CircularProgress,
  Alert, Chip, IconButton, Fade
} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ContactsIcon from '@mui/icons-material/Contacts';
import ReportIcon from '@mui/icons-material/Report';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';
import AddIcCallIcon from '@mui/icons-material/AddIcCall';
import HelpIcon from '@mui/icons-material/Help';
import ShareLocationIcon from '@mui/icons-material/ShareLocation';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
// import MapView from "../components/MapView"; // Uncomment and configure this import if mini map is needed
import Carousel from 'react-material-ui-carousel';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showTips, setShowTips] = useState(true);
  const [status, setStatus] = useState("safe"); // I'm Safe/Need Help

  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const [prof, conts, incs] = await Promise.all([
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
        setUser(prof.data);
        setContacts(conts.data.emergencyContacts || []);
        setIncidents(incs.data.incidents || []);
      } catch (err) {
        setError("Failed to load dashboard data.");
      }
      setLoading(false);
    };
    fetchHomeData();
  }, []);

  const mainGradient = "linear-gradient(135deg, #fc5c7d 0%, #6a82fb 100%)";
  const cardGradient1 = "linear-gradient(120deg, #fbc2eb 0%, #a6c1ee 100%)";
  const cardGradient2 = "linear-gradient(120deg, #fcdff2 0%, #e2e2e2 100%)";
  const highlightGradient = "linear-gradient(120deg, #91eac9 0%, #fad0c4 100%)";

  // Carousel safety tips data
  const tips = [
    "Always share your location with a trusted contact.",
    "Keep emergency numbers saved on your phone.",
    "If in danger, double-tap SOS to send an instant alert.",
    "Stay in well-lit areas after dark.",
    "Check in with friends or family when you arrive at your destination.",
  ];

  return (
    <Box sx={{
      minHeight: '100vh',
      background: mainGradient,
      py: 5, px: { xs: 1, sm: 4 },
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      transition: 'background 0.4s'
    }}>

      {/* Status Toggle */}
      <Box mb={2} width="100%" maxWidth={540} display="flex" justifyContent="center">
        <ToggleButtonGroup
          value={status}
          exclusive
          onChange={(e, v) => setStatus(v)}
          size="large"
          sx={{ borderRadius: 3, boxShadow: "0 2px 8px #43cea244" }}
        >
          <ToggleButton value="safe"
            sx={{
              background: status === 'safe' ? 'linear-gradient(90deg,#28a745,#b7e774)' : undefined,
              color: status === 'safe' ? '#fff' : undefined, fontWeight: 700,
              borderRadius: 3
            }}>
            <SecurityIcon sx={{ mr: 1 }} /> I?m Safe
          </ToggleButton>
          <ToggleButton value="alert"
            sx={{
              background: status === 'alert' ? 'linear-gradient(90deg,#fc5c7d 0%,#f7971e 100%)' : undefined,
              color: status === 'alert' ? '#fff' : undefined, fontWeight: 700, borderRadius: 3
            }}>
            <ReportIcon sx={{ mr: 1 }} /> Need Help
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Header row: Avatar, Greeting, Profile */}
      <Box display="flex" alignItems="center" gap={3} mb={3} width="100%" maxWidth={560} justifyContent="space-between">
        <Avatar sx={{
          bgcolor: 'primary.main', width: 68, height: 68, fontSize: 38,
          boxShadow: '0 3px 18px #fc5c7d45'
        }}>
          {user?.name ? user.name.charAt(0).toUpperCase() : <SecurityIcon />}
        </Avatar>
        <Typography
          variant="h5" fontWeight={800} letterSpacing={0.5} sx={{
            flex: 1, color: "#fff",
            textShadow: "0px 2px 12px #70508070"
          }}>
          Welcome, {user?.name || "User"}!
        </Typography>
        <Button
          href="/profile"
          variant="contained"
          sx={{
            background: "linear-gradient(90deg,#6a82fb,#fc5c7d)", color: "#fff",
            fontWeight: 600, boxShadow: '0 2px 12px #6a82fb21'
          }}
          startIcon={<SecurityIcon />}
        >
          Profile
        </Button>
      </Box>

      {/* Mini Map Widget (uncomment and configure MapView when ready) */}
      {/* <Box width="100%" maxWidth={560} mb={3}>
        <Typography fontWeight={700} mb={1} color="#fff">Your Nearby Area</Typography>
        <MapView
          userLocation={user?.latitude && user?.longitude ? [user.latitude, user.longitude] : [12.9716, 77.5946]}
          helpers={incidents.slice(0, 3).map(inc => ({
            _id: inc._id,
            name: inc.type,
            email: inc.description,
            location: { coordinates: [inc.longitude, inc.latitude] }
          }))}
        />
      </Box> */}

      {/* Main Actions Area */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        width="100%"
        maxWidth={560}
        mb={4}
      >
        <Button
          href="/report"
          size="large"
          fullWidth
          sx={{
            background: "linear-gradient(90deg,#ff6363,#fbc2eb)",
            color: "#fff", fontWeight: 700,
            boxShadow: '0 2px 12px #fc5c7d44',
            borderRadius: 3,
            '&:hover': { opacity: 0.93, boxShadow: '0 4px 18px #ffaaa90d' }
          }}
          startIcon={<WarningAmberIcon />}
        >
          Report Incident
        </Button>
        <Button
          href="/emergency-contacts"
          size="large"
          fullWidth
          sx={{
            background: "linear-gradient(90deg,#6a82fb,#a6c1ee)",
            color: "#fff", fontWeight: 700,
            boxShadow: '0 2px 12px #6a82fb16',
            borderRadius: 3,
            '&:hover': { opacity: 0.93 }
          }}
          startIcon={<ContactsIcon />}
        >
          Add Contact
        </Button>
        <Button
          href="/my-incidents"
          size="large"
          fullWidth
          sx={{
            background: "linear-gradient(90deg,#43cea2,#185a9d)",
            color: "#fff", fontWeight: 700,
            boxShadow: '0 2px 13px #43cea240',
            borderRadius: 3,
            '&:hover': { opacity: 0.93 }
          }}
          startIcon={<ReportIcon />}
        >
          My Incidents
        </Button>
      </Stack>

      {/* Status Overview Cards */}
      <Grid container spacing={2} mb={3} justifyContent="center" maxWidth={560}>
        <Grid item xs={6} sm={4}>
          <Paper
            sx={{
              p: 2, borderRadius: 3, textAlign: 'center',
              background: cardGradient1,
              color: "#35477d", fontWeight: 700,
              boxShadow: "0 2px 8px #91eac910"
            }}>
            <Typography variant="body2">Contacts</Typography>
            <Typography fontWeight="bold" color="primary" fontSize={28}>{contacts.length}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={4}>
          <Paper
            sx={{
              p: 2, borderRadius: 3, textAlign: 'center',
              background: highlightGradient,
              color: "#822e81", fontWeight: 700,
              boxShadow: "0 2px 12px #fc5c7d22"
            }}>
            <Typography variant="body2">Incidents</Typography>
            <Typography fontWeight="bold" color="error" fontSize={28}>{incidents.length}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper
            sx={{
              p: 2, borderRadius: 3, textAlign: 'center',
              background: cardGradient2,
              color: "#333",
              boxShadow: "0 2px 8px #bbcaff14"
            }}>
            <Typography variant="body2">Active SOS</Typography>
            <Chip
              color="secondary"
              label="No active SOS"
              size="small"
              sx={{
                background: "linear-gradient(90deg,#f7971e,#ffd200)",
                color: "#4e2608", fontWeight: 700
              }}
            />
          </Paper>
        </Grid>
      </Grid>
      {/* Animated divider */}
      <Fade in timeout={800}>
        <Box sx={{
          height: 8, width: "100%", maxWidth: 520,
          borderRadius: 6, my: 2,
          background:
            "linear-gradient(90deg,#f7971e,#6a82fb,#43cea2,#fc5c7d,#fbc2eb 80%)"
        }} />
      </Fade>

      {/* Safety Tips (Carousel) */}
      <Box mb={3} width="100%" maxWidth={540}>
        <Carousel
          autoPlay
          animation="fade"
          interval={5500}
          indicators={false}
          navButtonsAlwaysInvisible
          sx={{ mb: 1, width: "100%", minHeight: 62 }}
        >
          {tips.map((tip, i) => (
            <Paper sx={{
              p: 2,
              background: "linear-gradient(90deg,#a8edea 40%,#fed6e3 100%)",
              borderRadius: 2, boxShadow: '0 2px 8px #6a82fb16',
              display: 'flex', alignItems: 'center', gap: 2
            }} key={i}>
              <InfoIcon color="primary" sx={{ mr: 1 }} />
              <Typography component="span" fontWeight={600}>{tip}</Typography>
            </Paper>
          ))}
        </Carousel>
      </Box>

      {/* Recent Activity Feed */}
      <Box width="100%" maxWidth={560}>
        <Typography fontWeight={700} fontSize={18} mb={1}
          sx={{ color: "#fff", textShadow: "0 2px 8px #3335" }}>Recent Activity</Typography>
        <Stack spacing={2} mb={3}>
          {loading ? (
            <CircularProgress />
          ) : (incidents.length === 0 ? (
            <Typography variant="body2" color="text.secondary"
              sx={{ color: "#fefefe", opacity: 0.92 }}>
              No incidents reported yet.
            </Typography>
          ) : (
            incidents.slice(0, 4).map(inc => (
              <Paper key={inc._id} sx={{
                p: 2, borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: "linear-gradient(90deg,#fff7fa 0%, #eeefff 100%)",
                borderLeft: inc.type === "sos" ? "6px solid #fc5c7d" : "6px solid #6a82fb"
              }}>
                <Box>
                  <Typography fontWeight="bold">{inc.location}</Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>{inc.description}</Typography>
                  <Typography variant="caption" color="text.secondary">{new Date(inc.date).toLocaleString()}</Typography>
                </Box>
                <Chip
                  label={inc.type?.toUpperCase() || "INCIDENT"}
                  color={inc.type === "sos" ? "error" : "info"}
                  sx={{
                    fontWeight: 700,
                    background: inc.type === "sos"
                      ? "linear-gradient(80deg,#fc5c7d,#f7971e)"
                      : "linear-gradient(80deg,#6a82fb,#43cea2)",
                    color: "#fff", letterSpacing: .7, fontSize: 13
                  }}
                  size="small"
                />
              </Paper>
            ))
          ))}
        </Stack>
        <Button
          href="/my-incidents"
          variant="outlined"
          fullWidth
          sx={{
            fontWeight: 600,
            background: "rgba(255,255,255,0.80)",
            borderColor: "#6a82fb",
            color: "#6a82fb",
            '&:hover': {
              background: "#6a82fb",
              color: "#fff",
              borderColor: "#fc5c7d",
            }
          }}
        >View All</Button>
      </Box>

      {/* Onboarding or Tips (dismissible) */}
      {showTips && (
        <Paper sx={{
          mt: 3, p: 2, borderRadius: 2, background: 'linear-gradient(90deg,#fffde4,#fbc2eb 95%)',
          display: 'flex', alignItems: 'center', gap: 2, boxShadow: "0 6px 18px #fc5c7d15"
        }}>
          <InfoIcon color="secondary" />
          <Box flex={1}>
            <Typography fontWeight={700} color="primary.main">Get Started:</Typography>
            <Typography variant="body2" color="text.secondary">
              Add your first emergency contact.<br />
              Submit a test incident to see alerts in action.<br />
              Review your profile information.
            </Typography>
          </Box>
          <IconButton onClick={() => setShowTips(false)}>
            <CloseIcon />
          </IconButton>
        </Paper>
      )}

      {/* Error handling */}
      {error && (
        <Alert severity="error" sx={{ mt: 3, width: '100%', maxWidth: 540 }}>
          {error}
        </Alert>
      )}

      {/* Quick Actions SpeedDial */}
      <SpeedDial
        ariaLabel="Quick Actions"
        sx={{ position: 'fixed', bottom: 32, right: 32, zIndex: 1500 }}
        icon={<LiveHelpIcon />}
      >
        <SpeedDialAction icon={<HelpIcon />} tooltipTitle="Send SOS" onClick={() => window.location = "/report"} />
        <SpeedDialAction icon={<AddIcCallIcon />} tooltipTitle="Call Emergency" onClick={() => window.location = "/emergency-contacts"} />
        <SpeedDialAction icon={<ShareLocationIcon />} tooltipTitle="Share Location" onClick={() => alert('Sharing location...')} />
      </SpeedDial>
    </Box>
  );
}

// import React, { useEffect, useState } from 'react';
// import {
//   Box, Typography, Paper, Avatar, Button, Stack, Grid, CircularProgress,
//   Alert, Chip, IconButton, Fade
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
//           axios.get(`${API_URL}/api/users/profile`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           axios.get(`${API_URL}/api/users/emergency-contacts`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           axios.get(`${API_URL}/api/incidents/my-incidents`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//         ]);
//         setUser(prof.data);
//         setContacts(conts.data.emergencyContacts || []);
//         setIncidents(incs.data.incidents || []);
//       } catch (err) {
//         setError("Failed to load dashboard data.");
//       }
//       setLoading(false);
//     };
//     fetchHomeData();
//   }, []);

//   // --- COLORS & GRADIENTS ---
//   const mainGradient = "linear-gradient(135deg, #fc5c7d 0%, #6a82fb 100%)";
//   const cardGradient1 = "linear-gradient(120deg, #fbc2eb 0%, #a6c1ee 100%)";
//   const cardGradient2 = "linear-gradient(120deg, #fcdff2 0%, #e2e2e2 100%)";
//   const highlightGradient = "linear-gradient(120deg, #91eac9 0%, #fad0c4 100%)";

//   return (
//     <Box sx={{
//       minHeight: '100vh',
//       background: mainGradient,
//       py: 5, px: { xs: 1, sm: 4 },
//       display: 'flex', flexDirection: 'column', alignItems: 'center',
//       transition: 'background 0.4s'
//     }}>
//       {/* Header row: Avatar, Greeting, Profile */}
//       <Box display="flex" alignItems="center" gap={3} mb={3} width="100%" maxWidth={560} justifyContent="space-between">
//         <Avatar sx={{
//           bgcolor: 'primary.main',
//           width: 68, height: 68, fontSize: 38,
//           boxShadow: '0 3px 18px #fc5c7d45'
//         }}>
//           {user?.name ? user.name.charAt(0).toUpperCase() : <SecurityIcon />}
//         </Avatar>
//         <Typography
//           variant="h5" fontWeight={800} letterSpacing={0.5} sx={{
//           flex: 1,
//           color: "#fff",
//           textShadow: "0px 2px 12px #70508070"
//         }}>
//           Welcome, {user?.name || "User"}!
//         </Typography>
//         <Button
//           href="/profile"
//           variant="contained"
//           sx={{
//             background: "linear-gradient(90deg,#6a82fb,#fc5c7d)", color: "#fff",
//             fontWeight: 600, boxShadow: '0 2px 12px #6a82fb21'
//           }}
//           startIcon={<SecurityIcon />}
//         >
//           Profile
//         </Button>
//       </Box>

//       {/* Main Actions Area */}
//       <Stack
//         direction={{ xs: "column", sm: "row" }}
//         spacing={2}
//         width="100%"
//         maxWidth={560}
//         mb={4}
//       >
//         <Button
//           href="/report"
//           size="large"
//           fullWidth
//           sx={{
//             background: "linear-gradient(90deg,#ff6363,#fbc2eb)",
//             color: "#fff", fontWeight: 700,
//             boxShadow: '0 2px 12px #fc5c7d44',
//             borderRadius: 3,
//             '&:hover': { opacity: 0.93, boxShadow: '0 4px 18px #ffaaa90d' }
//           }}
//           startIcon={<WarningAmberIcon />}
//         >
//           Report Incident
//         </Button>
//         <Button
//           href="/emergency-contacts"
//           size="large"
//           fullWidth
//           sx={{
//             background: "linear-gradient(90deg,#6a82fb,#a6c1ee)",
//             color: "#fff", fontWeight: 700,
//             boxShadow: '0 2px 12px #6a82fb16',
//             borderRadius: 3,
//             '&:hover': { opacity: 0.93 }
//           }}
//           startIcon={<ContactsIcon />}
//         >
//           Add Contact
//         </Button>
//         <Button
//           href="/my-incidents"
//           size="large"
//           fullWidth
//           sx={{
//             background: "linear-gradient(90deg,#43cea2,#185a9d)",
//             color: "#fff", fontWeight: 700,
//             boxShadow: '0 2px 13px #43cea240',
//             borderRadius: 3,
//             '&:hover': { opacity: 0.93 }
//           }}
//           startIcon={<ReportIcon />}
//         >
//           My Incidents
//         </Button>
//       </Stack>

//       {/* Status Overview Cards */}
//       <Grid container spacing={2} mb={3} justifyContent="center" maxWidth={560}>
//         <Grid item xs={6} sm={4}>
//           <Paper
//             sx={{
//               p: 2, borderRadius: 3, textAlign: 'center',
//               background: cardGradient1,
//               color: "#35477d", fontWeight: 700,
//               boxShadow: "0 2px 8px #91eac910"
//             }}>
//             <Typography variant="body2">Contacts</Typography>
//             <Typography fontWeight="bold" color="primary" fontSize={28}>{contacts.length}</Typography>
//           </Paper>
//         </Grid>
//         <Grid item xs={6} sm={4}>
//           <Paper
//             sx={{
//               p: 2, borderRadius: 3, textAlign: 'center',
//               background: highlightGradient,
//               color: "#822e81", fontWeight: 700,
//               boxShadow: "0 2px 12px #fc5c7d22"
//             }}>
//             <Typography variant="body2">Incidents</Typography>
//             <Typography fontWeight="bold" color="error" fontSize={28}>{incidents.length}</Typography>
//           </Paper>
//         </Grid>
//         <Grid item xs={12} sm={4}>
//           <Paper
//             sx={{
//               p: 2, borderRadius: 3, textAlign: 'center',
//               background: cardGradient2,
//               color: "#333",
//               boxShadow: "0 2px 8px #bbcaff14"
//             }}>
//             <Typography variant="body2">Active SOS</Typography>
//             <Chip
//               color="secondary"
//               label="No active SOS"
//               size="small"
//               sx={{
//                 background: "linear-gradient(90deg,#f7971e,#ffd200)",
//                 color: "#4e2608", fontWeight: 700
//               }}
//             />
//           </Paper>
//         </Grid>
//       </Grid>
//       {/* Animated color divider */}
//       <Fade in timeout={800}>
//         <Box sx={{
//           height: 8, width: "100%", maxWidth: 520,
//           borderRadius: 6, my: 2,
//           background:
//             "linear-gradient(90deg,#f7971e,#6a82fb,#43cea2,#fc5c7d,#fbc2eb 80%)"
//         }} />
//       </Fade>

//       {/* Recent Activity Feed */}
//       <Box width="100%" maxWidth={560}>
//         <Typography fontWeight={700} fontSize={18} mb={1}
//           sx={{ color: "#fff", textShadow: "0 2px 8px #3335" }}>Recent Activity</Typography>
//         <Stack spacing={2} mb={3}>
//           {loading ? (
//             <CircularProgress />
//           ) : (incidents.length === 0 ? (
//             <Typography variant="body2" color="text.secondary"
//               sx={{ color: "#fefefe", opacity: 0.92 }}>
//               No incidents reported yet.
//             </Typography>
//           ) : (
//             incidents.slice(0, 4).map(inc => (
//               <Paper key={inc._id} sx={{
//                 p: 2, borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
//                 background: "linear-gradient(90deg,#fff7fa 0%, #eeefff 100%)",
//                 borderLeft: inc.type === "sos" ? "6px solid #fc5c7d" : "6px solid #6a82fb"
//               }}>
//                 <Box>
//                   <Typography fontWeight="bold">{inc.location}</Typography>
//                   <Typography variant="body2" sx={{ mb: 0.5 }}>{inc.description}</Typography>
//                   <Typography variant="caption" color="text.secondary">{new Date(inc.date).toLocaleString()}</Typography>
//                 </Box>
//                 <Chip
//                   label={inc.type?.toUpperCase() || "INCIDENT"}
//                   color={inc.type === "sos" ? "error" : "info"}
//                   sx={{
//                     fontWeight: 700,
//                     background: inc.type === "sos"
//                       ? "linear-gradient(80deg,#fc5c7d,#f7971e)"
//                       : "linear-gradient(80deg,#6a82fb,#43cea2)",
//                     color: "#fff", letterSpacing: .7, fontSize: 13
//                   }}
//                   size="small"
//                 />
//               </Paper>
//             ))
//           ))}
//         </Stack>
//         <Button
//           href="/my-incidents"
//           variant="outlined"
//           fullWidth
//           sx={{
//             fontWeight: 600,
//             background: "rgba(255,255,255,0.80)",
//             borderColor: "#6a82fb",
//             color: "#6a82fb",
//             '&:hover': {
//               background: "#6a82fb",
//               color: "#fff",
//               borderColor: "#fc5c7d",
//             }
//           }}
//         >View All</Button>
//       </Box>

//       {/* Onboarding or Tips (dismissible) */}
//       {showTips && (
//         <Paper sx={{
//           mt: 3, p: 2, borderRadius: 2, background: 'linear-gradient(90deg,#fffde4,#fbc2eb 95%)',
//           display: 'flex', alignItems: 'center', gap: 2, boxShadow: "0 6px 18px #fc5c7d15"
//         }}>
//           <InfoIcon color="secondary" />
//           <Box flex={1}>
//             <Typography fontWeight={700} color="primary.main">Get Started:</Typography>
//             <Typography variant="body2" color="text.secondary">
//               Add your first emergency contact.<br />
//               Submit a test incident to see alerts in action.<br />
//               Review your profile information.
//             </Typography>
//           </Box>
//           <IconButton onClick={() => setShowTips(false)}>
//             <CloseIcon />
//           </IconButton>
//         </Paper>
//       )}

//       {/* Error handling */}
//       {error && (
//         <Alert severity="error" sx={{ mt: 3, width: '100%', maxWidth: 540 }}>
//           {error}
//         </Alert>
//       )}
//     </Box>
//   );
// }
