// frontend/src/pages/ResetPassword.js
import React, { useState } from "react";
import { Box, Card, CardContent, Typography, TextField, Button, Alert, Fade } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export default function ResetPassword() {
  const { token } = useParams(); // get token from URL
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await axios.put(`${API_URL}/api/users/reset-password/${token}`, {
        password,
      });

      setMessage(res.data.message);
      // Redirect to login after a short delay
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to reset password");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #fc6363 0%, #6a82fb 100%)",
        p: 2,
      }}
    >
      <Fade in>
        <Card sx={{ maxWidth: 400, width: "100%", borderRadius: 4, boxShadow: 6 }}>
          <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="h5" color="secondary" align="center" gutterBottom>
              Reset Password
            </Typography>

            <form onSubmit={handleSubmit}>
              <TextField
                label="New Password"
                type="password"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <TextField
                label="Confirm Password"
                type="password"
                fullWidth
                margin="normal"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                fullWidth
                sx={{ mt: 2, py: 1.5, borderRadius: 3, fontWeight: "bold" }}
              >
                Reset Password
              </Button>
            </form>

            {message && (
              <Alert severity="success" sx={{ mt: 2 }}>
                {message}
              </Alert>
            )}

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </CardContent>
        </Card>
      </Fade>
    </Box>
  );
}
