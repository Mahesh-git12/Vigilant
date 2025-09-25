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