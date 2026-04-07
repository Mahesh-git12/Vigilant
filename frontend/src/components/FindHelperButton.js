import React, { useState, useEffect, useRef } from "react";
import {
  Tooltip, Fab, Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Snackbar, Alert, Typography, List, ListItem, Checkbox, Chip, Avatar,
  Box, IconButton, CircularProgress, Divider, Badge
} from "@mui/material";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import CloseIcon from "@mui/icons-material/Close";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import axios from "axios";
import MapView from "./MapView";
import { getDistance } from "geolib";

const API_URL = process.env.REACT_APP_API_URL;

function calcDistanceAndETA(userLat, userLng, helperLat, helperLng, walkSpeedKmh = 5) {
  const distanceMeters = getDistance(
    { latitude: userLat, longitude: userLng },
    { latitude: helperLat, longitude: helperLng }
  );
  const distanceKm = (distanceMeters / 1000).toFixed(2);
  const etaMin = Math.max(1, Math.round((distanceKm / walkSpeedKmh) * 60));
  return { distanceKm, etaMin };
}

export default function FindHelperButton() {
  const [helpers, setHelpers] = useState([]);
  const [selectedHelpers, setSelectedHelpers] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState({ message: "", severity: "success" });
  const [locating, setLocating] = useState(false);
  const [sending, setSending] = useState(false);
  const token = localStorage.getItem("token");
  const [currentCoords, setCurrentCoords] = useState({ latitude: null, longitude: null });
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [locationUpdatedAt, setLocationUpdatedAt] = useState(null);

  // Watch ID ref for real-time location tracking
  const watchIdRef = useRef(null);

  useEffect(() => {
    async function fetchUserProfile() {
      if (!token) return;
      try {
        const res = await axios.get(`${API_URL}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile({ name: res.data.name, email: res.data.email });
      } catch {}
    }
    fetchUserProfile();
  }, [token]);

  // Start watching location when dialog opens, stop when it closes
  useEffect(() => {
    if (showDialog) {
      if (!navigator.geolocation) return;
      watchIdRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setCurrentCoords({ latitude, longitude });
          setLocationUpdatedAt(new Date());
        },
        (err) => {
          console.warn("Location watch error:", err.message);
        },
        { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
      );
    } else {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    }
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [showDialog]);

  const fetchNearestUsers = (latitude, longitude) => {
    axios
      .get(`${API_URL}/api/users/nearest?latitude=${latitude}&longitude=${longitude}&limit=5`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => {
        setHelpers(res.data);
        setSelectedHelpers(res.data.slice(0, 1).map((u) => u._id));
        setShowDialog(true);
        setLocating(false);
      })
      .catch((error) => {
        setHelpers([]);
        setSelectedHelpers([]);
        setFeedback({
          message: error.response?.status === 404
            ? "No nearby helpers found."
            : "Failed to find nearby helpers.",
          severity: "error"
        });
        setOpen(true);
        setShowDialog(false);
        setLocating(false);
      });
  };

  const handleFindHelperClick = () => {
    if (!navigator.geolocation) {
      setFeedback({ message: "Geolocation not supported.", severity: "error" });
      setOpen(true);
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCurrentCoords({ latitude, longitude });
        setLocationUpdatedAt(new Date());
        fetchNearestUsers(latitude, longitude);
      },
      () => {
        setFeedback({ message: "Unable to retrieve your location.", severity: "error" });
        setOpen(true);
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleToggle = (id) => {
    setSelectedHelpers((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const handleNotify = () => {
    if (selectedHelpers.length === 0) return;
    setSending(true);
    Promise.all(
      selectedHelpers.map((helperId) =>
        axios.post(
          `${API_URL}/api/users/notify`,
          {
            userId: helperId,
            message: `SOS alert from ${profile.name || "Unknown"}`,
            latitude: currentCoords.latitude,
            longitude: currentCoords.longitude
          },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      )
    )
      .then(() => {
        setFeedback({ message: `Alert sent to ${selectedHelpers.length} helper(s)!`, severity: "success" });
        setOpen(true);
        setShowDialog(false);
        setSending(false);
      })
      .catch(() => {
        setFeedback({ message: "Failed to send notifications.", severity: "error" });
        setOpen(true);
        setSending(false);
      });
  };

  const leafletUserCoords =
    typeof currentCoords.latitude === "number" && typeof currentCoords.longitude === "number"
      ? [currentCoords.latitude, currentCoords.longitude]
      : null;

  const getHelperDistance = (helper) => {
    if (!currentCoords.latitude || !currentCoords.longitude || !helper.location?.coordinates) {
      return null;
    }
    const [lng, lat] = helper.location.coordinates;
    return calcDistanceAndETA(currentCoords.latitude, currentCoords.longitude, lat, lng);
  };

  const formatUpdatedAt = () => {
    if (!locationUpdatedAt) return "";
    const secs = Math.round((Date.now() - locationUpdatedAt.getTime()) / 1000);
    if (secs < 5) return "Just now";
    if (secs < 60) return `${secs}s ago`;
    return `${Math.round(secs / 60)}m ago`;
  };

  // Styles
  const dialogSx = {
    "& .MuiDialog-paper": {
      borderRadius: "20px",
      overflow: "hidden",
      background: "#0f1117",
      color: "#f0f0f0",
      boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
      border: "1px solid rgba(255,255,255,0.07)"
    }
  };

  const ACCENT = "#e8304b";
  const ACCENT2 = "#ff6b6b";


  return (
    <>
      <Tooltip title="Find Nearby Helpers" placement="left">
        <Fab
          onClick={handleFindHelperClick}
          disabled={locating}
          sx={{
            position: "fixed",
            bottom: 125,
            right: 43,
            zIndex: 1200,
            width: 58,
            height: 58,
            background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT2})`,
            boxShadow: `0 4px 20px rgba(232,48,75,0.5)`,
            "&:hover": {
              background: `linear-gradient(135deg, #c8203b, #e85555)`,
              transform: "scale(1.08)",
              boxShadow: `0 6px 28px rgba(232,48,75,0.7)`
            },
            transition: "all 0.2s ease"
          }}
        >
          {locating ? (
            <CircularProgress size={24} sx={{ color: "#fff" }} />
          ) : (
            <PersonSearchIcon sx={{ color: "#fff", fontSize: 26 }} />
          )}
        </Fab>
      </Tooltip>

      <Dialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        maxWidth="sm"
        fullWidth
        sx={dialogSx}
      >
        {/* Header */}
        <DialogTitle
          sx={{
            p: 0,
            background: `linear-gradient(135deg, #1a0a0e 0%, #1e0f14 100%)`,
            borderBottom: "1px solid rgba(232,48,75,0.2)"
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 3, py: 2.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box
                sx={{
                  width: 38, height: 38, borderRadius: "10px",
                  background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT2})`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: `0 4px 14px rgba(232,48,75,0.4)`
                }}
              >
                <PersonSearchIcon sx={{ color: "#fff", fontSize: 20 }} />
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: "1.05rem", color: "#fff", lineHeight: 1.2 }}>
                  Nearby Helpers
                </Typography>
                <Typography sx={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.45)", lineHeight: 1 }}>
                  {helpers.length} helper{helpers.length !== 1 ? "s" : ""} found
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {/* Live location indicator */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.6,
                px: 1.2, py: 0.5, borderRadius: "20px",
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)"
              }}>
                <Box sx={{
                  width: 7, height: 7, borderRadius: "50%",
                  background: "#22c55e",
                  boxShadow: "0 0 6px #22c55e",
                  animation: "pulse 1.8s ease-in-out infinite",
                  "@keyframes pulse": {
                    "0%, 100%": { opacity: 1 },
                    "50%": { opacity: 0.4 }
                  }
                }} />
                <Typography sx={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.5)" }}>
                  Live • {formatUpdatedAt()}
                </Typography>
              </Box>
              <IconButton size="small" onClick={() => setShowDialog(false)}
                sx={{ color: "rgba(255,255,255,0.4)", "&:hover": { color: "#fff", background: "rgba(255,255,255,0.08)" } }}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ p: 0, background: "#0f1117" }}>
          {/* Map */}
          {leafletUserCoords && helpers.length > 0 && (
            <Box sx={{ position: "relative", mx: 2.5, mt: 2.5, borderRadius: "14px", overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 4px 20px rgba(0,0,0,0.4)" }}>
              <MapView userLocation={leafletUserCoords} helpers={helpers} />
              <Box sx={{
                position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)",
                background: "rgba(15,17,23,0.85)", backdropFilter: "blur(8px)",
                borderRadius: "20px", px: 2, py: 0.6,
                border: "1px solid rgba(255,255,255,0.1)",
                display: "flex", alignItems: "center", gap: 0.8
              }}>
                <MyLocationIcon sx={{ fontSize: 13, color: ACCENT }} />
                <Typography sx={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.6)" }}>
                  Live location tracking active
                </Typography>
              </Box>
            </Box>
          )}

          {/* Helpers List */}
          <Box sx={{ px: 2.5, pt: 2, pb: 1 }}>
            <Typography sx={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.08em",
              textTransform: "uppercase", color: "rgba(255,255,255,0.35)", mb: 1.5 }}>
              Select helpers to alert
            </Typography>
            <List disablePadding>
              {helpers.map((user, idx) => {
                const dist = getHelperDistance(user);
                const isSelected = selectedHelpers.includes(user._id);
                return (
                  <React.Fragment key={user._id}>
                    <ListItem
                      disablePadding
                      onClick={() => handleToggle(user._id)}
                      sx={{
                        cursor: "pointer",
                        borderRadius: "12px",
                        mb: 0.8,
                        px: 1.5, py: 1.2,
                        background: isSelected
                          ? "rgba(232,48,75,0.1)"
                          : "rgba(255,255,255,0.03)",
                        border: isSelected
                          ? "1px solid rgba(232,48,75,0.35)"
                          : "1px solid rgba(255,255,255,0.06)",
                        transition: "all 0.18s ease",
                        "&:hover": {
                          background: isSelected
                            ? "rgba(232,48,75,0.15)"
                            : "rgba(255,255,255,0.06)"
                        }
                      }}
                    >
                      <Checkbox
                        checked={isSelected}
                        onChange={() => handleToggle(user._id)}
                        onClick={(e) => e.stopPropagation()}
                        size="small"
                        sx={{
                          color: "rgba(255,255,255,0.3)",
                          "&.Mui-checked": { color: ACCENT },
                          p: 0.5, mr: 1
                        }}
                      />
                      <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                        badgeContent={
                          isSelected ? (
                            <Box sx={{
                              width: 10, height: 10, borderRadius: "50%",
                              background: ACCENT, border: "2px solid #0f1117"
                            }} />
                          ) : null
                        }
                      >
                        <Avatar
                          sx={{
                            bgcolor: isSelected ? ACCENT : "#2a2d3a",
                            width: 40, height: 40, mr: 1.5,
                            fontSize: "0.9rem", fontWeight: 700,
                            transition: "background 0.2s",
                            boxShadow: isSelected ? `0 2px 10px rgba(232,48,75,0.4)` : "none"
                          }}
                        >
                          {user.avatarUrl
                            ? <img src={user.avatarUrl} alt={user.name} style={{ width: "100%" }} />
                            : (user.name?.[0] || "U").toUpperCase()}
                        </Avatar>
                      </Badge>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography sx={{
                          fontWeight: 600, fontSize: "0.88rem", color: "#f0f0f0",
                          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
                        }}>
                          {user.name || "Unknown"}
                        </Typography>
                        <Typography sx={{
                          fontSize: "0.72rem", color: "rgba(255,255,255,0.4)",
                          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
                        }}>
                          {user.email || ""}
                        </Typography>
                      </Box>
                      {dist ? (
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 0.4 }}>
                          <Chip
                            label={`${dist.distanceKm} km`}
                            size="small"
                            sx={{
                              height: 22, fontSize: "0.7rem", fontWeight: 700,
                              background: isSelected ? ACCENT : "rgba(255,255,255,0.08)",
                              color: "#fff",
                              "& .MuiChip-label": { px: 1 }
                            }}
                          />
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.4 }}>
                            <DirectionsWalkIcon sx={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }} />
                            <Typography sx={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.35)" }}>
                              ~{dist.etaMin} min
                            </Typography>
                          </Box>
                        </Box>
                      ) : null}
                    </ListItem>
                  </React.Fragment>
                );
              })}
              {helpers.length === 0 && (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <PersonSearchIcon sx={{ fontSize: 40, color: "rgba(255,255,255,0.15)", mb: 1 }} />
                  <Typography sx={{ color: "rgba(255,255,255,0.35)", fontSize: "0.85rem" }}>
                    No helpers found nearby
                  </Typography>
                </Box>
              )}
            </List>
          </Box>
        </DialogContent>

        {/* Footer */}
        <DialogActions
          sx={{
            px: 2.5, py: 2,
            background: "rgba(255,255,255,0.02)",
            borderTop: "1px solid rgba(255,255,255,0.07)",
            gap: 1.5
          }}
        >
          {selectedHelpers.length > 0 && (
            <Typography sx={{ flex: 1, fontSize: "0.75rem", color: "rgba(255,255,255,0.4)" }}>
              {selectedHelpers.length} helper{selectedHelpers.length > 1 ? "s" : ""} selected
            </Typography>
          )}
          <Button
            onClick={() => setShowDialog(false)}
            sx={{
              color: "rgba(255,255,255,0.45)",
              fontSize: "0.82rem",
              borderRadius: "10px",
              px: 2.5,
              "&:hover": { background: "rgba(255,255,255,0.07)", color: "#fff" }
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={selectedHelpers.length === 0 || sending}
            onClick={handleNotify}
            startIcon={sending
              ? <CircularProgress size={15} sx={{ color: "#fff" }} />
              : <NotificationsActiveIcon sx={{ fontSize: 17 }} />
            }
            sx={{
              background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT2})`,
              color: "#fff",
              fontWeight: 700,
              fontSize: "0.82rem",
              borderRadius: "10px",
              px: 2.5,
              boxShadow: `0 4px 16px rgba(232,48,75,0.4)`,
              "&:hover": {
                background: `linear-gradient(135deg, #c8203b, #e85555)`,
                boxShadow: `0 6px 22px rgba(232,48,75,0.6)`
              },
              "&.Mui-disabled": {
                background: "rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.25)"
              }
            }}
          >
            {sending ? "Sending..." : "Send SOS Alert"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={feedback.severity}
          onClose={() => setOpen(false)}
          sx={{
            borderRadius: "12px",
            fontWeight: 500,
            boxShadow: "0 8px 24px rgba(0,0,0,0.4)"
          }}
        >
          {feedback.message}
        </Alert>
      </Snackbar>
    </>
  );
}