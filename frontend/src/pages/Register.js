import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Avatar,
  Alert,
  Fade,
  useMediaQuery,
} from "@mui/material";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", emergencyContacts: "" });
  const [message, setMessage] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const isMobile = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    setShow(true);
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    if (!navigator.geolocation) {
      setMessage("Location permission is required.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const contactsArr = form.emergencyContacts
            .split(",")
            .map((c) => ({ email: c.trim() }))
            .filter((c) => c.email);

          const location = {
            type: "Point",
            coordinates: [pos.coords.longitude, pos.coords.latitude],
          };

          const res = await axios.post(`${API_URL}/api/users/register`, {
            name: form.name,
            email: form.email,
            password: form.password,
            emergencyContacts: contactsArr,
            location,
          });

          setMessage(res.data.message || "Registered successfully!");
          setForm({ name: "", email: "", password: "", emergencyContacts: "" });
        } catch (err) {
          setMessage(err.response?.data?.message || "Registration failed.");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setMessage("Location access denied.");
        setLoading(false);
      }
    );
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        background: "linear-gradient(135deg, #fc6363 0%, #6a82fb 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: isMobile ? 2 : 4,
        boxSizing: "border-box",
      }}
    >
      <Fade in={show} timeout={900}>
        <Card
          sx={{
            width: "100%",
            maxWidth: 420,
            mx: "auto",
            px: isMobile ? 2 : 3,
            py: isMobile ? 3 : 4,
            borderRadius: 5,
            boxShadow: "0 4px 28px #6a82fb66",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          <CardContent>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
              <Avatar
                sx={{ bgcolor: "secondary.main", width: 62, height: 62, boxShadow: "0 4px 32px #fc6363" }}
              >
                <PersonAddAltIcon fontSize="large" />
              </Avatar>
              <Typography variant="h4" color="secondary" sx={{ fontWeight: 700, mb: 2 }}>
                Create Account
              </Typography>
              <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
                <TextField label="Name" name="name" value={form.name} onChange={handleChange} fullWidth margin="normal" required />
                <TextField label="Email" name="email" value={form.email} onChange={handleChange} fullWidth margin="normal" required />
                <TextField label="Password" name="password" value={form.password} onChange={handleChange} fullWidth margin="normal" required />
                <TextField label="Emergency Contacts (comma separated)" name="emergencyContacts" value={form.emergencyContacts} onChange={handleChange} fullWidth margin="normal" />
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  fullWidth
                  disabled={loading}
                  sx={{
                    mt: 3,
                    py: 1.5,
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                    background: "linear-gradient(90deg, #6a82fb 0%, #fc6363 100%)",
                    borderRadius: 20,
                  }}
                >
                  {loading ? "Registering..." : "Register"}
                </Button>
              </Box>
              {message && (
                <Fade in>
                  <Alert
                    severity={message.toLowerCase().includes("success") ? "success" : "error"}
                    sx={{ width: "100%" }}
                  >
                    {message}
                  </Alert>
                </Fade>
              )}
              <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
                Already have an account? <a href="/login">Login</a>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Fade>
    </Box>
  );
}


// import React, { useState } from 'react';
// import {
//   Card, CardContent, Typography, TextField, Button, Box, Avatar, Alert, Fade
// } from '@mui/material';
// import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
// import axios from 'axios';

// const API_URL = process.env.REACT_APP_API_URL;

// export default function Register() {
//   const [form, setForm] = useState({ name: '', email: '', password: '', emergencyContacts: '' });
//   const [message, setMessage] = useState('');
//   const [show, setShow] = useState(false);
//   const [loading, setLoading] = useState(false);

//   React.useEffect(() => { setShow(true); }, []);

//   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage('');
//     setLoading(true);

//     if (!navigator.geolocation) {
//       setMessage('Geolocation permission is required for registration.');
//       setLoading(false);
//       return;
//     }

//     navigator.geolocation.getCurrentPosition(async (pos) => {
//       try {
//         const contactsArray = form.emergencyContacts
//           .split(',')
//           .map((c) => ({ email: c.trim() }))
//           .filter((c) => c.email);

//         const location = {
//           type: 'Point',
//           coordinates: [pos.coords.longitude, pos.coords.latitude]
//         };

//         const res = await axios.post(
//           `${API_URL}/api/users/register`,
//           {
//             name: form.name,
//             email: form.email,
//             password: form.password,
//             emergencyContacts: contactsArray,
//             location
//           }
//         );
//         setMessage(res.data.message || 'Registered successfully!');
//         setForm({ name: '', email: '', password: '', emergencyContacts: '' });
//       } catch (err) {
//         setMessage(err.response?.data?.message || 'Registration failed.');
//       } finally {
//         setLoading(false);
//       }
//     }, () => {
//       setMessage('Location permission denied. Registration requires your location.');
//       setLoading(false);
//     });
//   };

//   return (
//     <Box sx={{
//       minHeight: '100vh',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       background: 'linear-gradient(135deg, #fc5c7d 0%, #6a82fb 100%)'
//     }}>
//       <Fade in={show} timeout={900}>
//         <Card sx={{ maxWidth: 420, width: '100%', p: 3, borderRadius: 5 }}>
//           <CardContent>
//             <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
//               <Avatar sx={{
//                 bgcolor: 'primary.main', width: 70, height: 70, boxShadow: '0 4px 32px #6a82fb44',
//               }}>
//                 <PersonAddAltIcon fontSize="large" />
//               </Avatar>
//               <Typography variant="h4" color="primary" sx={{ fontWeight: 700, letterSpacing: '0.08em', mb: 2 }}>
//                 Create Account
//               </Typography>
//               <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
//                 <TextField label="Name" name="name" value={form.name} onChange={handleChange} fullWidth margin="normal" required />
//                 <TextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} fullWidth margin="normal" required />
//                 <TextField label="Password" name="password" type="password" value={form.password} onChange={handleChange} fullWidth margin="normal" required />
//                 <TextField label="Emergency Contacts (comma separated emails)" name="emergencyContacts" value={form.emergencyContacts} onChange={handleChange} fullWidth margin="normal" required />
//                 <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}
//                   sx={{
//                     mt: 3, py: 1.5, fontWeight: 'bold', fontSize: '1.1rem',
//                     background: 'linear-gradient(90deg, #fc5c7d 0%, #6a82fb 100%)',
//                     borderRadius: 20,
//                   }}>
//                   {loading ? "Registering..." : "Register"}
//                 </Button>
//               </Box>
//               <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
//                 Location permission is required to enable nearest helper features.
//               </Typography>
//               {message && (
//                 <Fade in>
//                   <Alert severity={message.toLowerCase().includes('success') ? "success" : "error"} sx={{ width: '100%' }}>
//                     {message}
//                   </Alert>
//                 </Fade>
//               )}
//               <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
//                 Already have an account? <a href="/login">Login</a>
//               </Typography>
//             </Box>
//           </CardContent>
//         </Card>
//       </Fade>
//     </Box>
//   );
// }

// // import React, { useState } from 'react';
// // import {
// //   Card, CardContent, Typography, TextField, Button, Box, Avatar, Alert, Fade
// // } from '@mui/material';
// // import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
// // import axios from 'axios';

// // const API_URL = process.env.REACT_APP_API_URL;

// // export default function Register() {
// //   const [form, setForm] = useState({ name: '', email: '', password: '', emergencyContacts: '' });
// //   const [message, setMessage] = useState('');
// //   const [show, setShow] = useState(false);
// //   const [loading, setLoading] = useState(false);

// //   React.useEffect(() => { setShow(true); }, []);

// //   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setMessage('');
// //     setLoading(true);

// //     if (!navigator.geolocation) {
// //       setMessage('Geolocation permission is required for registration.');
// //       setLoading(false);
// //       return;
// //     }

// //     navigator.geolocation.getCurrentPosition(async (pos) => {
// //       try {
// //         const contactsArray = form.emergencyContacts
// //           .split(',')
// //           .map((c) => ({ email: c.trim() }))
// //           .filter((c) => c.email);

// //         const location = {
// //           type: 'Point',
// //           coordinates: [pos.coords.longitude, pos.coords.latitude]
// //         };

// //         const res = await axios.post(
// //           `${API_URL}/api/users/register`,
// //           {
// //             name: form.name,
// //             email: form.email,
// //             password: form.password,
// //             emergencyContacts: contactsArray,
// //             location
// //           }
// //         );
// //         setMessage(res.data.message || 'Registered successfully!');
// //         setForm({ name: '', email: '', password: '', emergencyContacts: '' });
// //       } catch (err) {
// //         setMessage(err.response?.data?.message || 'Registration failed.');
// //       } finally {
// //         setLoading(false);
// //       }
// //     }, () => {
// //       setMessage('Location permission denied. Registration requires your location.');
// //       setLoading(false);
// //     });
// //   };

// //   return (
// //     <Box sx={{
// //       minHeight: '100vh',
// //       display: 'flex',
// //       alignItems: 'center',
// //       justifyContent: 'center',
// //       background: 'linear-gradient(135deg, #fc5c7d 0%, #6a82fb 100%)'
// //     }}>
// //       <Fade in={show} timeout={900}>
// //         <Card sx={{ maxWidth: 420, width: '100%', p: 3, borderRadius: 5 }}>
// //           <CardContent>
// //             <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
// //               <Avatar sx={{
// //                 bgcolor: 'primary.main', width: 70, height: 70, boxShadow: '0 4px 32px #6a82fb44',
// //               }}>
// //                 <PersonAddAltIcon fontSize="large" />
// //               </Avatar>
// //               <Typography variant="h4" color="primary" sx={{ fontWeight: 700, letterSpacing: '0.08em', mb: 2 }}>
// //                 Create Account
// //               </Typography>
// //               <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
// //                 <TextField label="Name" name="name" value={form.name} onChange={handleChange} fullWidth margin="normal" required />
// //                 <TextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} fullWidth margin="normal" required />
// //                 <TextField label="Password" name="password" type="password" value={form.password} onChange={handleChange} fullWidth margin="normal" required />
// //                 <TextField label="Emergency Contacts (comma separated emails)" name="emergencyContacts" value={form.emergencyContacts} onChange={handleChange} fullWidth margin="normal" required />
// //                 <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}
// //                   sx={{
// //                     mt: 3, py: 1.5, fontWeight: 'bold', fontSize: '1.1rem',
// //                     background: 'linear-gradient(90deg, #fc5c7d 0%, #6a82fb 100%)',
// //                     borderRadius: 20,
// //                   }}>
// //                   {loading ? "Registering..." : "Register"}
// //                 </Button>
// //               </Box>
// //               <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
// //                 Location permission is required to enable nearest helper features.
// //               </Typography>
// //               {message && (
// //                 <Fade in>
// //                   <Alert severity={message.toLowerCase().includes('success') ? "success" : "error"} sx={{ width: '100%' }}>
// //                     {message}
// //                   </Alert>
// //                 </Fade>
// //               )}
// //               <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
// //                 Already have an account? <a href="/login">Login</a>
// //               </Typography>
// //             </Box>
// //           </CardContent>
// //         </Card>
// //       </Fade>
// //     </Box>
// //   );
// // }
