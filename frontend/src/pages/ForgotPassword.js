import React, { useState } from 'react';
import { Box, Card, CardContent, TextField, Button, Typography, Alert, Fade } from '@mui/material';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await axios.post(`${API_URL}/api/users/forgot-password`, { email });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error sending email');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2 }}>
      <Fade in timeout={700}>
        <Card sx={{ width: '100%', maxWidth: 400, p: 3 }}>
          <CardContent>
            <Typography variant="h5" sx={{ mb: 2 }}>Forgot Password</Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                required
                sx={{ mb: 2 }}
              />
              <Button type="submit" variant="contained" fullWidth>Send Reset Link</Button>
            </form>
            {message && (
              <Fade in>
                <Alert severity="info" sx={{ mt: 2 }}>{message}</Alert>
              </Fade>
            )}
          </CardContent>
        </Card>
      </Fade>
    </Box>
  );
}
