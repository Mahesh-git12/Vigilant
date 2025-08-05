
// // import React, { useState, useRef } from 'react';
// // import {
// //   Fab, Tooltip, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions,
// //   Button, Checkbox, FormControlLabel, FormGroup, CircularProgress, Box
// // } from '@mui/material';
// // import WarningAmberIcon from '@mui/icons-material/WarningAmber';
// // import axios from 'axios';

// // const API_URL = process.env.REACT_APP_API_URL;

// // export default function SOSButton() {
// //   const [open, setOpen] = useState(false);
// //   const [feedback, setFeedback] = useState('');
// //   const [contacts, setContacts] = useState([]);
// //   const [selected, setSelected] = useState([]);
// //   const [dialogOpen, setDialogOpen] = useState(false);
// //   const [loading, setLoading] = useState(false);
// //   const watchIdRef = useRef(null);

// //   // Fetch user's emergency contacts
// //   const fetchContacts = async () => {
// //     setLoading(true);
// //     const token = localStorage.getItem('token');
// //     if (!token) {
// //       setLoading(false);
// //       return;
// //     }
// //     try {
// //       const res = await axios.get(
// //         `${API_URL}/api/users/emergency-contacts`,
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );
// //       setContacts(res.data.emergencyContacts || []);
// //       setSelected((res.data.emergencyContacts || []).map(c => c.email));
// //     } catch (err) {
// //       setFeedback('Failed to load contacts for SOS.');
// //       setOpen(true);
// //     }
// //     setLoading(false);
// //   };

// //   // Show dialog to select contacts for SOS
// //   const handleSOSClick = async () => {
// //     await fetchContacts();
// //     setDialogOpen(true);
// //   };

// //   // Handle contact selection
// //   const handleCheckbox = (email) => {
// //     setSelected((prev) =>
// //       prev.includes(email) ? prev.filter(e => e !== email) : [...prev, email]
// //     );
// //   };

// //   // Start live location tracking for incident (optional)
// //   const startLocationTracking = (incidentId, token) => {
// //     if ('geolocation' in navigator) {
// //       watchIdRef.current = navigator.geolocation.watchPosition(
// //         async (pos) => {
// //           try {
// //             await axios.post(
// //               `${API_URL}/api/incidents/update-location/${incidentId}`,
// //               { latitude: pos.coords.latitude, longitude: pos.coords.longitude },
// //               { headers: { Authorization: `Bearer ${token}` } }
// //             );
// //           } catch (err) {}
// //         },
// //         () => {},
// //         { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
// //       );
// //     }
// //   };

// //   // Stop location tracking
// //   const stopLocationTracking = () => {
// //     if (watchIdRef.current !== null) {
// //       navigator.geolocation.clearWatch(watchIdRef.current);
// //       watchIdRef.current = null;
// //     }
// //   };

// //   // Main function to trigger the SOS flow
// //   const handleSendSOS = async () => {
// //     setDialogOpen(false);
// //     setFeedback('');
// //     // Request geolocation
// //     if (navigator.geolocation) {
// //       navigator.geolocation.getCurrentPosition(
// //         (pos) => {
// //           sendSOS(
// //             `Lat: ${pos.coords.latitude}, Lon: ${pos.coords.longitude}`,
// //             { latitude: pos.coords.latitude, longitude: pos.coords.longitude }
// //           );
// //         },
// //         (err) => {
// //           setFeedback('Location permission denied or unavailable. SOS sent without coordinates.');
// //           sendSOS('Unknown', { latitude: undefined, longitude: undefined });
// //         },
// //         { timeout: 5000 }
// //       );
// //     } else {
// //       setFeedback('Geolocation not supported. SOS sent without location.');
// //       sendSOS('Unknown', { latitude: undefined, longitude: undefined });
// //     }
// //   };

// //   // Send SOS to backend API
// //   const sendSOS = async (location, coords) => {
// //     try {
// //       const token = localStorage.getItem('token');
// //       const selectedContacts = contacts.filter(c => selected.includes(c.email));
// //       if (selectedContacts.length === 0) {
// //         setFeedback('Please select at least one contact.');
// //         setOpen(true);
// //         return;
// //       }
// //       const res = await axios.post(
// //         `${API_URL}/api/incidents/sos`,
// //         {
// //           location,
// //           description: 'SOS Emergency!',
// //           contacts: selectedContacts,
// //           latitude: coords?.latitude,
// //           longitude: coords?.longitude
// //         },
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );
// //       setFeedback('SOS sent! Your selected contacts have been notified.');
// //       setOpen(true);
// //       if (res.data.incidentId) {
// //         startLocationTracking(res.data.incidentId, token);
// //       }
// //     } catch (err) {
// //       setFeedback('Failed to send SOS. Try again.');
// //       setOpen(true);
// //     }
// //   };

// //   return (
// //     <>
// //       <Tooltip title="Send SOS" placement="left">
// //         <Fab
// //           color="error"
// //           onClick={handleSOSClick}
// //           sx={{
// //             position: 'fixed',
// //             bottom: 32,
// //             right: 32,
// //             zIndex: 1200,
// //             boxShadow: '0 6px 32px #fc5c7d88',
// //             width: 72,
// //             height: 72,
// //           }}
// //         >
// //           <WarningAmberIcon sx={{ fontSize: 40 }} />
// //         </Fab>
// //       </Tooltip>
// //       <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
// //         <DialogTitle>Select Contacts for SOS</DialogTitle>
// //         <DialogContent>
// //           {loading ? (
// //             <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
// //               <CircularProgress />
// //             </Box>
// //           ) : (
// //             <FormGroup>
// //               {contacts.length === 0 && (
// //                 <div style={{ color: '#888', marginBottom: 8 }}>
// //                   No emergency contacts found. Please add contacts first.
// //                 </div>
// //               )}
// //               {contacts.map(contact => (
// //                 <FormControlLabel
// //                   key={contact.email}
// //                   control={
// //                     <Checkbox
// //                       checked={selected.includes(contact.email)}
// //                       onChange={() => handleCheckbox(contact.email)}
// //                     />
// //                   }
// //                   label={`${contact.email}${contact.phone ? ' | ' + contact.phone : ''}`}
// //                 />
// //               ))}
// //             </FormGroup>
// //           )}
// //         </DialogContent>
// //         <DialogActions>
// //           <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
// //           <Button
// //             onClick={handleSendSOS}
// //             variant="contained"
// //             color="error"
// //             disabled={contacts.length === 0 || selected.length === 0}
// //           >
// //             Send SOS
// //           </Button>
// //         </DialogActions>
// //       </Dialog>
// //       <Snackbar open={open} autoHideDuration={4000} onClose={() => setOpen(false)}>
// //         <Alert severity={feedback.startsWith('SOS') ? 'success' : 'error'} sx={{ width: '100%' }}>
// //           {feedback}
// //         </Alert>
// //       </Snackbar>
// //     </>
// //   );
// // }


// import React, { useState, useRef } from "react";
// import {
//   Fab, Tooltip, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions,
//   Button, Checkbox, FormControlLabel, FormGroup, CircularProgress, Box
// } from "@mui/material";
// import WarningAmberIcon from "@mui/icons-material/WarningAmber";
// import axios from "axios";

// const API_URL = process.env.REACT_APP_API_URL;

// export default function SOSButton() {
//   const [open, setOpen] = useState(false);
//   const [feedback, setFeedback] = useState("");
//   const [contacts, setContacts] = useState([]);
//   const [selected, setSelected] = useState([]);
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [loading, setLoading] = useState(false);

//   // For nearest user feature
//   const [nearestUser, setNearestUser] = useState(null);
//   const [showNearestDialog, setShowNearestDialog] = useState(false);

//   const watchIdRef = useRef(null);
//   const token = localStorage.getItem("token");

//   // Fetch Emergency Contacts
//   const fetchContacts = async () => {
//     setLoading(true);
//     if (!token) {
//       setLoading(false);
//       return;
//     }
//     try {
//       const res = await axios.get(`${API_URL}/api/users/emergency-contacts`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setContacts(res.data.emergencyContacts || []);
//       setSelected(
//         (res.data.emergencyContacts || []).map((c) => c.email)
//       );
//     } catch {
//       setFeedback("Failed to load emergency contacts.");
//       setOpen(true);
//     }
//     setLoading(false);
//   };

//   // Fetch Nearest User (new feature)
//   const fetchNearestUser = (latitude, longitude) => {
//     axios
//       .get(`${API_URL}/users/nearest?latitude=${latitude}&longitude=${longitude}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((res) => {
//         setNearestUser(res.data);
//         setShowNearestDialog(true);
//       })
//       .catch(() => {
//         setFeedback("Failed to find nearest user.");
//         setOpen(true);
//       });
//   };

//   // Checkbox Selection
//   const toggleSelect = (email) => {
//     if (selected.includes(email)) {
//       setSelected(selected.filter((e) => e !== email));
//     } else {
//       setSelected([...selected, email]);
//     }
//   };

//   // Combined SOS click (find nearest, fetch contacts, open dialog)
//   const handleSOSClick = () => {
//     if (!navigator.geolocation) {
//       alert("Geolocation not supported.");
//       return;
//     }
//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         const { latitude, longitude } = pos.coords;
//         fetchNearestUser(latitude, longitude); // show nearest before or after your SOS dialog as you prefer
//         fetchContacts();
//         setDialogOpen(true);
//       },
//       () => {
//         setFeedback("Unable to get location.");
//         setOpen(true);
//       }
//     );
//   };

//   // Send notification to nearest user (new feature)
//   const handleNotify = () => {
//     if (!nearestUser) return;
//     axios
//       .post(
//         `${API_URL}/users/notify`,
//         { userId: nearestUser._id, message: "SOS Alert" },
//         { headers: { Authorization: `Bearer ${token}` } }
//       )
//       .then(() => {
//         setFeedback("Notification sent.");
//         setOpen(true);
//         setShowNearestDialog(false);
//       })
//       .catch(() => {
//         setFeedback("Failed to send notification.");
//         setOpen(true);
//       });
//   };

//   // Send SOS to selected contacts (existing logic)
//   const sendSOS = async (location, coords) => {
//     setDialogOpen(false);
//     setFeedback("");

//     if (!token) {
//       setFeedback("User not logged in.");
//       setOpen(true);
//       return;
//     }

//     if (!selected.length) {
//       setFeedback("Select at least one contact.");
//       setOpen(true);
//       return;
//     }

//     try {
//       await axios.post(
//         `${API_URL}/api/incidents/sos`,
//         { location, description: "SOS Emergency!", contacts: contacts.filter((c) => selected.includes(c.email)), latitude: coords?.latitude, longitude: coords?.longitude },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setFeedback("SOS sent. Help is on the way!");
//       setOpen(true);
//     } catch {
//       setFeedback("Failed to send SOS.");
//       setOpen(true);
//     }
//   };

//   // Optional: Live location tracking (no changes here)
//   const startLocationTracking = (incidentId) => {
//     if (navigator.geolocation) {
//       watchIdRef.current = navigator.geolocation.watchPosition(
//         (pos) => {
//           axios
//             .post(
//               `${API_URL}/api/incidents/update-location/${incidentId}`,
//               { latitude: pos.coords.latitude, longitude: pos.coords.longitude },
//               { headers: { Authorization: `Bearer ${token}` } }
//             )
//             .catch(() => { });
//         },
//         () => { },
//         { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
//       );
//     }
//   };

//   const stopLocationTracking = () => {
//     if (watchIdRef.current !== null) {
//       navigator.geolocation.clearWatch(watchIdRef.current);
//       watchIdRef.current = null;
//     }
//   };

//   return (
//     <>
//       <Tooltip title="Send SOS" placement="left">
//         <Fab
//           color="error"
//           onClick={handleSOSClick}
//           sx={{
//             position: "fixed",
//             bottom: 32,
//             right: 32,
//             zIndex: 1200,
//             boxShadow: "0 6px 32px #fc7f7f"
//           }}
//         >
//           <WarningAmberIcon sx={{ fontSize: 40 }} />
//         </Fab>
//       </Tooltip>

//       {/* Emergency Contacts Dialog */}
//       <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
//         <DialogTitle>Select Contacts</DialogTitle>
//         <DialogContent>
//           {loading ? (
//             <Box sx={{ display: "flex", justifyContent: "center" }}>
//               <CircularProgress />
//             </Box>
//           ) : contacts.length === 0 ? (
//             <Box>No contacts found.</Box>
//           ) : (
//             <FormGroup>
//               {contacts.map(({ email, phone }) => (
//                 <FormControlLabel
//                   key={email}
//                   control={<Checkbox checked={selected.includes(email)} onChange={() => toggleSelect(email)} />}
//                   label={`${email}${phone ? ` | ${phone}` : ""}`}
//                 />
//               ))}
//             </FormGroup>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
//           <Button
//             variant="contained"
//             color="error"
//             onClick={() => {
//               if (navigator.geolocation) {
//                 navigator.geolocation.getCurrentPosition(
//                   (pos) => {
//                     const loc = `Lat: ${pos.coords.latitude}, Lon: ${pos.coords.longitude}`;
//                     sendSOS(loc, { latitude: pos.coords.latitude, longitude: pos.coords.longitude });
//                   },
//                   () => {
//                     sendSOS('Unknown', { latitude: null, longitude: null });
//                   },
//                   { timeout: 5000 }
//                 );
//               } else {
//                 sendSOS('Unknown', { latitude: null, longitude: null });
//               }
//             }}
//             disabled={selected.length === 0}
//           >
//             Send SOS
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Nearest User Dialog Feature */}
//       {showNearestDialog && nearestUser && (
//         <Dialog open={showNearestDialog} onClose={() => setShowNearestDialog(false)}>
//           <DialogTitle>Nearest Helper Found</DialogTitle>
//           <DialogContent>
//             <div>Name: {nearestUser?.name}</div>
//             <div>Email: {nearestUser?.email}</div>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handleNotify} color="primary">
//               Notify
//             </Button>
//             <Button onClick={() => setShowNearestDialog(false)}>Close</Button>
//           </DialogActions>
//         </Dialog>
//       )}

//       {/* Feedback Snackbar */}
//       <Snackbar
//         open={open}
//         autoHideDuration={4000}
//         onClose={() => setOpen(false)}
//       >
//         <Alert
//           severity={feedback.startsWith("Failed") ? "error" : "success"}
//           onClose={() => setOpen(false)}
//         >
//           {feedback}
//         </Alert>
//       </Snackbar>
//     </>
//   );
// }





// import React, { useState, useRef } from "react";
// import {
//   Fab, Tooltip, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions,
//   Button, Checkbox, FormControlLabel, FormGroup, CircularProgress, Box
// } from "@mui/material";
// import WarningAmberIcon from "@mui/icons-material/WarningAmber";
// import axios from "axios";

// const API_URL = process.env.REACT_APP_API_URL;

// export default function SOSButton() {
//   const [open, setOpen] = useState(false);
//   const [feedback, setFeedback] = useState("");
//   const [contacts, setContacts] = useState([]);
//   const [selected, setSelected] = useState([]);
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [loading, setLoading] = useState(false);

//   // For nearest user feature
//   const [nearestUser, setNearestUser] = useState(null);
//   const [showNearestDialog, setShowNearestDialog] = useState(false);

//   const watchIdRef = useRef(null);
//   const token = localStorage.getItem("token");

//   // Fetch Emergency Contacts
//   const fetchContacts = async () => {
//     setLoading(true);
//     if (!token) {
//       setLoading(false);
//       return;
//     }
//     try {
//       const res = await axios.get(`${API_URL}/api/users/emergency-contacts`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setContacts(res.data.emergencyContacts || []);
//       setSelected(
//         (res.data.emergencyContacts || []).map((c) => c.email)
//       );
//     } catch {
//       setFeedback("Failed to load emergency contacts.");
//       setOpen(true);
//     }
//     setLoading(false);
//   };

//   // Fetch Nearest User (correct API path)
//   const fetchNearestUser = (latitude, longitude) => {
//     axios
//       .get(`${API_URL}/api/users/nearest?latitude=${latitude}&longitude=${longitude}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((res) => {
//         setNearestUser(res.data);
//         setShowNearestDialog(true);
//       })
//       .catch(() => {
//         setFeedback("Failed to find nearest user.");
//         setOpen(true);
//       });
//   };

//   // Checkbox Selection
//   const toggleSelect = (email) => {
//     if (selected.includes(email)) {
//       setSelected(selected.filter((e) => e !== email));
//     } else {
//       setSelected([...selected, email]);
//     }
//   };

//   // Combined SOS click
//   const handleSOSClick = () => {
//     if (!navigator.geolocation) {
//       alert("Geolocation not supported.");
//       return;
//     }
//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         const { latitude, longitude } = pos.coords;
//         fetchNearestUser(latitude, longitude);
//         fetchContacts();
//         setDialogOpen(true);
//       },
//       () => {
//         setFeedback("Unable to get location.");
//         setOpen(true);
//       }
//     );
//   };

//   // Notify nearest user
//   const handleNotify = () => {
//     if (!nearestUser) return;
//     axios
//       .post(
//         `${API_URL}/api/users/notify`,
//         { userId: nearestUser._id, message: "SOS Alert" },
//         { headers: { Authorization: `Bearer ${token}` } }
//       )
//       .then(() => {
//         setFeedback("Notification sent.");
//         setOpen(true);
//         setShowNearestDialog(false);
//       })
//       .catch(() => {
//         setFeedback("Failed to send notification.");
//         setOpen(true);
//       });
//   };

//   // Send SOS
//   const sendSOS = async (location, coords) => {
//     setDialogOpen(false);
//     setFeedback("");

//     if (!token) {
//       setFeedback("User not logged in.");
//       setOpen(true);
//       return;
//     }

//     if (!selected.length) {
//       setFeedback("Select at least one contact.");
//       setOpen(true);
//       return;
//     }

//     try {
//       await axios.post(
//         `${API_URL}/api/incidents/sos`,
//         {
//           location,
//           description: "SOS Emergency!",
//           contacts: contacts.filter((c) => selected.includes(c.email)),
//           latitude: coords?.latitude,
//           longitude: coords?.longitude
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` }
//         }
//       );
//       setFeedback("SOS sent. Help is on the way!");
//       setOpen(true);
//     } catch {
//       setFeedback("Failed to send SOS.");
//       setOpen(true);
//     }
//   };

//   // Location tracking
//   const startLocationTracking = (incidentId) => {
//     if (navigator.geolocation) {
//       watchIdRef.current = navigator.geolocation.watchPosition(
//         (pos) => {
//           axios.post(
//             `${API_URL}/api/incidents/update-location/${incidentId}`,
//             { latitude: pos.coords.latitude, longitude: pos.coords.longitude },
//             { headers: { Authorization: `Bearer ${token}` } }
//           ).catch(() => {});
//         },
//         () => {},
//         { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
//       );
//     }
//   };

//   const stopLocationTracking = () => {
//     if (watchIdRef.current !== null) {
//       navigator.geolocation.clearWatch(watchIdRef.current);
//       watchIdRef.current = null;
//     }
//   };

//   return (
//     <>
//       <Tooltip title="Send SOS" placement="left">
//         <Fab
//           color="error"
//           onClick={handleSOSClick}
//           sx={{
//             position: "fixed",
//             bottom: 32,
//             right: 32,
//             zIndex: 1200,
//             boxShadow: "0 6px 32px #fc7f7f"
//           }}
//         >
//           <WarningAmberIcon />
//         </Fab>
//       </Tooltip>

//       {/* Emergency Contacts Dialog */}
//       <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
//         <DialogTitle>Select Contacts</DialogTitle>
//         <DialogContent>
//           {loading ? (
//             <Box sx={{ display: "flex", justifyContent: "center" }}>
//               <CircularProgress />
//             </Box>
//           ) : contacts.length === 0 ? (
//             <Box>No contacts found.</Box>
//           ) : (
//             <FormGroup>
//               {contacts.map(({ email, phone }) => (
//                 <FormControlLabel
//                   key={email}
//                   control={<Checkbox checked={selected.includes(email)} onChange={() => toggleSelect(email)} />}
//                   label={`${email}${phone ? ` | ${phone}` : ""}`}
//                 />
//               ))}
//             </FormGroup>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
//           <Button
//             onClick={() => {
//               if (navigator.geolocation) {
//                 navigator.geolocation.getCurrentPosition(
//                   (pos) => {
//                     const loc = `Lat: ${pos.coords.latitude}, Lon: ${pos.coords.longitude}`;
//                     sendSOS(loc, { latitude: pos.coords.latitude, longitude: pos.coords.longitude });
//                   },
//                   () => {
//                     sendSOS("Unknown", { latitude: null, longitude: null });
//                   },
//                   { timeout: 5000 }
//                 );
//               } else {
//                 sendSOS("Unknown", { latitude: null, longitude: null });
//               }
//             }}
//             disabled={selected.length === 0}
//             variant="contained"
//             color="error"
//           >
//             Send SOS
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Nearest User Dialog */}
//       {showNearestDialog && nearestUser && (
//         <Dialog open={showNearestDialog} onClose={() => setShowNearestDialog(false)}>
//           <DialogTitle>Nearest Helper Found</DialogTitle>
//           <DialogContent>
//             <div>Name: {nearestUser.name}</div>
//             <div>Email: {nearestUser.email}</div>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handleNotify} color="primary">Notify</Button>
//             <Button onClick={() => setShowNearestDialog(false)}>Close</Button>
//           </DialogActions>
//         </Dialog>
//       )}

//       {/* Feedback Snackbar */}
//       <Snackbar open={open} autoHideDuration={4000} onClose={() => setOpen(false)}>
//         <Alert severity={feedback.startsWith("Failed") ? "error" : "success"} onClose={() => setOpen(false)}>
//           {feedback}
//         </Alert>
//       </Snackbar>
//     </>
//   );
// }



// import React, { useState, useRef, useEffect } from "react";
// import {
//   Fab, Tooltip, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions,
//   Button, Checkbox, FormControlLabel, FormGroup, CircularProgress, Box
// } from "@mui/material";
// import WarningAmberIcon from "@mui/icons-material/WarningAmber";
// import PersonSearchIcon from "@mui/icons-material/PersonSearch";
// import axios from "axios";

// const API_URL = process.env.REACT_APP_API_URL;

// export default function SOSButton() {
//   const [open, setOpen] = useState(false);
//   const [feedback, setFeedback] = useState("");
//   const [contacts, setContacts] = useState([]);
//   const [selected, setSelected] = useState([]);
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [loading, setLoading] = useState(false);

//   // For nearest user feature
//   const [nearestUser, setNearestUser] = useState(null);
//   const [showNearestDialog, setShowNearestDialog] = useState(false);

//   // Track current geolocation for notification
//   const [currentCoords, setCurrentCoords] = useState({ latitude: null, longitude: null });

//   // Store sender's details
//   const [profile, setProfile] = useState({ name: "", email: "" });

//   const watchIdRef = useRef(null);
//   const token = localStorage.getItem("token");

//   // Fetch logged-in user's profile for notification details
//   useEffect(() => {
//     const fetchProfile = async () => {
//       if (!token) return;
//       try {
//         const res = await axios.get(`${API_URL}/api/users/profile`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setProfile({ name: res.data.name, email: res.data.email });
//       } catch { /* fail silently */ }
//     };
//     fetchProfile();
//   }, [token]);

//   // Fetch Emergency Contacts
//   const fetchContacts = async () => {
//     setLoading(true);
//     if (!token) {
//       setLoading(false);
//       return;
//     }
//     try {
//       const res = await axios.get(`${API_URL}/api/users/emergency-contacts`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setContacts(res.data.emergencyContacts || []);
//       setSelected((res.data.emergencyContacts || []).map((c) => c.email));
//     } catch {
//       setFeedback("Failed to load emergency contacts.");
//       setOpen(true);
//     }
//     setLoading(false);
//   };

//   // Fetch Nearest User (correct API path)
//   const fetchNearestUser = (latitude, longitude) => {
//     setCurrentCoords({ latitude, longitude });
//     axios
//       .get(`${API_URL}/api/users/nearest?latitude=${latitude}&longitude=${longitude}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((res) => {
//         setNearestUser(res.data);
//         setShowNearestDialog(true);
//       })
//       .catch(() => {
//         setFeedback("Failed to find nearest user.");
//         setOpen(true);
//       });
//   };

//   // Checkbox Selection
//   const toggleSelect = (email) => {
//     if (selected.includes(email)) {
//       setSelected(selected.filter((e) => e !== email));
//     } else {
//       setSelected([...selected, email]);
//     }
//   };

//   // SOS Button Handler: fetch location, then show both dialogs
//   const handleSOSClick = () => {
//     if (!navigator.geolocation) {
//       alert("Geolocation not supported.");
//       return;
//     }
//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         const { latitude, longitude } = pos.coords;
//         setCurrentCoords({ latitude, longitude });
//         fetchNearestUser(latitude, longitude);
//         fetchContacts();
//         setDialogOpen(true);
//       },
//       () => {
//         setFeedback("Unable to get location.");
//         setOpen(true);
//       }
//     );
//   };

//   // NEW: Handler for "Find Helper" button (just finds and shows nearest user)
//   const handleFindHelperClick = () => {
//     if (!navigator.geolocation) {
//       setFeedback("Geolocation not supported.");
//       setOpen(true);
//       return;
//     }
//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         const { latitude, longitude } = pos.coords;
//         setCurrentCoords({ latitude, longitude });
//         fetchNearestUser(latitude, longitude);
//         // Do NOT fetch contacts or open contacts dialog (cleaner UX)
//       },
//       () => {
//         setFeedback("Unable to get location.");
//         setOpen(true);
//       }
//     );
//   };

//   // Notify nearest user -- send all required details
//   const handleNotify = () => {
//     if (!nearestUser) return;
//     axios
//       .post(
//         `${API_URL}/api/users/notify`,
//         {
//           userId: nearestUser._id,
//           message: `SOS alert from ${profile.name || 'Unknown'}`,
//           latitude: currentCoords.latitude,
//           longitude: currentCoords.longitude
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       )
//       .then(() => {
//         setFeedback("Notification sent.");
//         setOpen(true);
//         setShowNearestDialog(false);
//       })
//       .catch(() => {
//         setFeedback("Failed to send notification.");
//         setOpen(true);
//       });
//   };

//   // Send SOS (as before)
//   const sendSOS = async (location, coords) => {
//     setDialogOpen(false);
//     setFeedback("");

//     if (!token) {
//       setFeedback("User not logged in.");
//       setOpen(true);
//       return;
//     }
//     if (!selected.length) {
//       setFeedback("Select at least one contact.");
//       setOpen(true);
//       return;
//     }
//     try {
//       await axios.post(
//         `${API_URL}/api/incidents/sos`,
//         {
//           location,
//           description: "SOS Emergency!",
//           contacts: contacts.filter((c) => selected.includes(c.email)),
//           latitude: coords?.latitude,
//           longitude: coords?.longitude
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` }
//         }
//       );
//       setFeedback("SOS sent. Help is on the way!");
//       setOpen(true);
//     } catch {
//       setFeedback("Failed to send SOS.");
//       setOpen(true);
//     }
//   };

//   // Location tracking (optional)
//   const startLocationTracking = (incidentId) => {
//     if (navigator.geolocation) {
//       watchIdRef.current = navigator.geolocation.watchPosition(
//         (pos) => {
//           axios.post(
//             `${API_URL}/api/incidents/update-location/${incidentId}`,
//             { latitude: pos.coords.latitude, longitude: pos.coords.longitude },
//             { headers: { Authorization: `Bearer ${token}` } }
//           ).catch(() => {});
//         },
//         () => {},
//         { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
//       );
//     }
//   };

//   const stopLocationTracking = () => {
//     if (watchIdRef.current !== null) {
//       navigator.geolocation.clearWatch(watchIdRef.current);
//       watchIdRef.current = null;
//     }
//   };

//   return (
//     <>
//       {/* SOS Button */}
//       <Tooltip title="Send SOS" placement="left">
//         <Fab
//           color="error"
//           onClick={handleSOSClick}
//           sx={{
//             position: "fixed",
//             bottom: 32,
//             right: 32,
//             zIndex: 1200,
//             boxShadow: "0 6px 32px #fc7f7f"
//           }}
//         >
//           <WarningAmberIcon />
//         </Fab>
//       </Tooltip>

//       {/* NEW: Find Helper Button (above SOS) */}
//       <Tooltip title="Find Nearby Helper" placement="left">
//         <Fab
//           color="primary"
//           onClick={handleFindHelperClick}
//           sx={{
//             position: "fixed",
//             bottom: 112, // Above the SOS button
//             right: 32,
//             zIndex: 1200,
//             boxShadow: "0 6px 32px #6a82fb88"
//           }}
//         >
//           <PersonSearchIcon />
//         </Fab>
//       </Tooltip>

//       {/* Emergency Contacts Dialog */}
//       <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
//         <DialogTitle>Select Contacts</DialogTitle>
//         <DialogContent>
//           {loading ? (
//             <Box sx={{ display: "flex", justifyContent: "center" }}>
//               <CircularProgress />
//             </Box>
//           ) : contacts.length === 0 ? (
//             <Box>No contacts found.</Box>
//           ) : (
//             <FormGroup>
//               {contacts.map(({ email, phone }) => (
//                 <FormControlLabel
//                   key={email}
//                   control={<Checkbox checked={selected.includes(email)} onChange={() => toggleSelect(email)} />}
//                   label={`${email}${phone ? ` | ${phone}` : ""}`}
//                 />
//               ))}
//             </FormGroup>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
//           <Button
//             onClick={() => {
//               if (navigator.geolocation) {
//                 navigator.geolocation.getCurrentPosition(
//                   (pos) => {
//                     const loc = `Lat: ${pos.coords.latitude}, Lon: ${pos.coords.longitude}`;
//                     sendSOS(loc, { latitude: pos.coords.latitude, longitude: pos.coords.longitude });
//                   },
//                   () => {
//                     sendSOS("Unknown", { latitude: null, longitude: null });
//                   },
//                   { timeout: 5000 }
//                 );
//               } else {
//                 sendSOS("Unknown", { latitude: null, longitude: null });
//               }
//             }}
//             disabled={selected.length === 0}
//             variant="contained"
//             color="error"
//           >
//             Send SOS
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Nearest User Dialog */}
//       {showNearestDialog && nearestUser && (
//         <Dialog open={showNearestDialog} onClose={() => setShowNearestDialog(false)}>
//           <DialogTitle>Nearest Helper Found</DialogTitle>
//           <DialogContent>
//             <div>Name: {nearestUser.name}</div>
//             <div>Email: {nearestUser.email}</div>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handleNotify} color="primary">Notify</Button>
//             <Button onClick={() => setShowNearestDialog(false)}>Close</Button>
//           </DialogActions>
//         </Dialog>
//       )}

//       {/* Feedback Snackbar */}
//       <Snackbar open={open} autoHideDuration={4000} onClose={() => setOpen(false)}>
//         <Alert severity={feedback.startsWith("Failed") ? "error" : "success"} onClose={() => setOpen(false)}>
//           {feedback}
//         </Alert>
//       </Snackbar>
//     </>
//   );
// }




import React, { useState, useRef } from "react";
import {
  Fab, Tooltip, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Checkbox, FormControlLabel, FormGroup, CircularProgress, Box
} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export default function SOSButton() {
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [contacts, setContacts] = useState([]);
  const [selected, setSelected] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const watchIdRef = useRef(null);
  const token = localStorage.getItem("token");

  const fetchContacts = async () => {
    setLoading(true);
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await axios.get(`${API_URL}/api/users/emergency-contacts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContacts(res.data.emergencyContacts || []);
      setSelected((res.data.emergencyContacts || []).map(c => c.email));
    } catch {
      setFeedback("Failed to load emergency contacts.");
      setOpen(true);
    }
    setLoading(false);
  };

  const toggleSelect = (email) => {
    setSelected(prev =>
      prev.includes(email) ? prev.filter(e => e !== email) : [...prev, email]
    );
  };

  const handleSOSClick = async () => {
    await fetchContacts();
    setDialogOpen(true);
  };

  const sendSOS = async (location, coords) => {
    setDialogOpen(false);
    setFeedback("");
    if (!token) {
      setFeedback("User not logged in.");
      setOpen(true);
      return;
    }
    if (!selected.length) {
      setFeedback("Select at least one contact.");
      setOpen(true);
      return;
    }
    try {
      await axios.post(
        `${API_URL}/api/incidents/sos`,
        {
          location,
          description: "SOS Emergency!",
          contacts: contacts.filter(c => selected.includes(c.email)),
          latitude: coords?.latitude,
          longitude: coords?.longitude
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setFeedback("SOS sent. Help is on the way!");
      setOpen(true);
    } catch {
      setFeedback("Failed to send SOS.");
      setOpen(true);
    }
  };

  return (
    <>
      <Tooltip title="Send SOS" placement="left">
        <Fab
          color="error"
          onClick={handleSOSClick}
          sx={{
            position: "fixed",
            bottom: 32,
            right: 32,
            zIndex: 1200,
            boxShadow: "0 6px 32px #fc7f7f"
          }}
        >
          <WarningAmberIcon />
        </Fab>
      </Tooltip>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Select Contacts for SOS</DialogTitle>
        <DialogContent>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
              <CircularProgress />
            </Box>
          ) : (
            <FormGroup>
              {contacts.length === 0 && (
                <div style={{ color: "#888", marginBottom: 8 }}>
                  No emergency contacts found. Please add contacts first.
                </div>
              )}
              {contacts.map(contact => (
                <FormControlLabel
                  key={contact.email}
                  control={
                    <Checkbox
                      checked={selected.includes(contact.email)}
                      onChange={() => toggleSelect(contact.email)}
                    />
                  }
                  label={`${contact.email}${contact.phone ? " | " + contact.phone : ""}`}
                />
              ))}
            </FormGroup>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                  pos => {
                    const loc = `Lat: ${pos.coords.latitude}, Lon: ${pos.coords.longitude}`;
                    sendSOS(loc, { latitude: pos.coords.latitude, longitude: pos.coords.longitude });
                  },
                  () => {
                    sendSOS("Unknown", { latitude: null, longitude: null });
                  },
                  { timeout: 5000 }
                );
              } else {
                sendSOS("Unknown", { latitude: null, longitude: null });
              }
            }}
            disabled={contacts.length === 0 || selected.length === 0}
            variant="contained"
            color="error"
          >
            Send SOS
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={open} autoHideDuration={4000} onClose={() => setOpen(false)}>
        <Alert severity={feedback.startsWith("Failed") ? "error" : "success"} onClose={() => setOpen(false)}>
          {feedback}
        </Alert>
      </Snackbar>
    </>
  );
}
