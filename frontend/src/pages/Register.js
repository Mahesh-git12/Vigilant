import React, { useState } from 'react';
import {
  Card, CardContent, Typography, TextField, Button, Box, Avatar, Alert, Fade
} from '@mui/material';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import axios from 'axios';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', emergencyContacts: '' });
  const [message, setMessage] = useState('');
  const [show, setShow] = useState(false);

  React.useEffect(() => { setShow(true); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const contactsArray = form.emergencyContacts
        .split(',')
        .map((c) => ({ email: c.trim() }))
        .filter((c) => c.email);

      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/register`,
        {
          name: form.name,
          email: form.email,
          password: form.password,
          emergencyContacts: contactsArray,
        }
      );
      setMessage(res.data.message || 'Registered successfully!');
      setForm({ name: '', email: '', password: '', emergencyContacts: '' });
    } catch (err) {
      setMessage(err.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #fc5c7d 0%, #6a82fb 100%)'
    }}>
      <Fade in={show} timeout={900}>
        <Card sx={{ maxWidth: 420, width: '100%', p: 3, borderRadius: 5 }}>
          <CardContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{
                bgcolor: 'primary.main', width: 70, height: 70, boxShadow: '0 4px 32px #6a82fb44',
              }}>
                <PersonAddAltIcon fontSize="large" />
              </Avatar>
              <Typography variant="h4" color="primary" sx={{ fontWeight: 700, letterSpacing: '0.08em', mb: 2 }}>
                Create Account
              </Typography>
              <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                <TextField label="Name" name="name" value={form.name} onChange={handleChange} fullWidth margin="normal" required />
                <TextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} fullWidth margin="normal" required />
                <TextField label="Password" name="password" type="password" value={form.password} onChange={handleChange} fullWidth margin="normal" required />
                <TextField label="Emergency Contacts (comma separated emails)" name="emergencyContacts" value={form.emergencyContacts} onChange={handleChange} fullWidth margin="normal" required />
                <Button type="submit" variant="contained" color="primary" fullWidth
                  sx={{
                    mt: 3, py: 1.5, fontWeight: 'bold', fontSize: '1.1rem',
                    background: 'linear-gradient(90deg, #fc5c7d 0%, #6a82fb 100%)',
                    borderRadius: 20,
                  }}>
                  Register
                </Button>
              </Box>
              {message && (
                <Fade in>
                  <Alert severity={message.includes('success') ? "success" : "error"} sx={{ width: '100%' }}>
                    {message}
                  </Alert>
                </Fade>
              )}
              <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                Already have an account? <a href="/login">Login</a>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Fade>
    </Box>
  );
}
