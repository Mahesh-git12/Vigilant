import React, { useState, useEffect, useRef } from 'react';
import Webcam from "react-webcam";
import { MapContainer, TileLayer, Marker, Circle, Polyline, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Box, Typography, Slider, Switch, FormControlLabel, Button, 
  CircularProgress, Paper, Stack, Divider, Fade, Grow, Snackbar, Alert 
} from '@mui/material';
import { 
  Security as SecurityIcon, GpsFixed as GpsIcon, Warning as WarningIcon, 
  Navigation as NavIcon, NotificationsActive as AlertIcon, Radar as RadarIcon
} from '@mui/icons-material';
import axios from 'axios';

// Component Imports
import SOSButton from '../components/SOSButton'; 
import AIVisionSOS from '../components/AIVisionSOS'; 

// Fixed Coordinates for Katpadi Police Station
const KATPADI_POLICE_STATION = { lat: 12.9752361, lng: 79.1372087 };

const userIcon = new L.Icon({ iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', iconSize: [35, 35] });
const policeIcon = new L.Icon({ iconUrl: 'https://cdn-icons-png.flaticon.com/512/2561/2561730.png', iconSize: [40, 40] });

function MapHandler({ center }) {
  const map = useMap();
  useEffect(() => { 
    if (center) {
        map.flyTo([center.lat, center.lng], 15);
        setTimeout(() => map.invalidateSize(), 600); 
    }
  }, [center, map]);
  return null;
}

const Dashboard = () => {
  const webcamRef = useRef(null);
  const aiSosRef = useRef(); 
  const [coords, setCoords] = useState({ lat: 12.9165, lng: 79.1325 });
  const [audit, setAudit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAutoGuard, setIsAutoGuard] = useState(true); 
  const [env, setEnv] = useState({ people_freq: 1, lighting_score: 1, is_wine_shop: 0 });
  const [showNotification, setShowNotification] = useState(false);
  const [rescueRoute, setRescueRoute] = useState([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(p => {
      setCoords({ lat: p.coords.latitude, lng: p.coords.longitude });
    });
  }, []);

  // Optimized Navigation Handler
  const handleRescueNavigation = () => {
    const start = [coords.lat, coords.lng];
    const end = [KATPADI_POLICE_STATION.lat, KATPADI_POLICE_STATION.lng];
    setRescueRoute([start, end]);
    
    // Fixed template string syntax for external navigation
    const navUrl = `https://www.google.com/maps/dir/?api=1&origin=${coords.lat},${coords.lng}&destination=${KATPADI_POLICE_STATION.lat},${KATPADI_POLICE_STATION.lng}&travelmode=driving`;
    window.open(navUrl, "_blank");
  };

  useEffect(() => {
    let interval;
    if (isAutoGuard) {
      interval = setInterval(() => {
        if (webcamRef.current) runAudit(true); 
      }, 5000); 
    }
    return () => clearInterval(interval);
  }, [isAutoGuard, coords, env]);

  const runAudit = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    const snap = webcamRef.current?.getScreenshot();
    if (!snap) return;

    try {
      const response = await axios.post('http://127.0.0.1:8000/analyze_all', {
        features: { ...coords, ...env, hour_of_day: new Date().getHours(), is_weekend: 0 },
        image: snap
      });
      
      setAudit(response.data);
      
      if (response.data.is_weapon) {
          aiSosRef.current.triggerWeaponAlert(response.data.status);
          setShowNotification(true);
          handleRescueNavigation(); 
          setIsAutoGuard(false); 
      }
    } catch (e) { 
        console.error("Audit Failed", e); 
    } finally { 
        if (!isSilent) setLoading(false); 
    }
  };

  return (
    <Box sx={{ height: '100vh', width: '100vw', display: 'flex', bgcolor: '#05070a', overflow: 'hidden', position: 'fixed', top: 0, left: 0 }}>
      
      {/* SIDEBAR */}
      <Box sx={{ width: 420, p: 3, bgcolor: '#0b0e14', borderRight: '1px solid #1e2530', display: 'flex', flexDirection: 'column', zIndex: 10 }}>
        <Stack direction="row" spacing={2} sx={{ mb: 4 }} alignItems="center">
          <SecurityIcon sx={{ color: isAutoGuard ? '#00e676' : '#fff', fontSize: 32 }} />
          <Typography variant="h5" fontWeight={900} color="white">VIGILANT AI</Typography>
        </Stack>
        
        <Box sx={{ borderRadius: 5, overflow: 'hidden', mb: 3, border: isAutoGuard ? '2px solid #00e676' : '1px solid #2a2f3b', aspectRatio: '16/10', position: 'relative' }}>
          <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" width="100%" height="100%" style={{ objectFit: 'cover' }} />
          {isAutoGuard && (
             <Box sx={{ position: 'absolute', top: 10, right: 10, display: 'flex', alignItems: 'center', gap: 1, bgcolor: 'rgba(0,0,0,0.6)', px: 1, borderRadius: 2 }}>
                <RadarIcon sx={{ color: '#00e676', fontSize: 16 }} className="radar-animate" />
                <Typography sx={{ color: '#00e676', fontSize: '0.7rem', fontWeight: 'bold' }}>AUTO-GUARD ACTIVE</Typography>
             </Box>
          )}
        </Box>

        <Box sx={{ flexGrow: 1 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="caption" color="gray" fontWeight={900}>SYSTEM CONTROLS</Typography>
            <FormControlLabel 
              control={<Switch size="small" checked={isAutoGuard} onChange={(e) => setIsAutoGuard(e.target.checked)} color="success" />} 
              label={<Typography sx={{ color: isAutoGuard ? '#00e676' : 'gray', fontSize: '0.7rem', fontWeight: 900 }}>AUTO-GUARD</Typography>} 
            />
          </Stack>

          <Stack spacing={3}>
            <Box>
              <Typography variant="caption" color="white" sx={{ fontWeight: 800 }}>Public Presence</Typography>
              <Slider size="small" value={env.people_freq} min={0} max={2} step={1} onChange={(e, v) => setEnv({...env, people_freq: v})} sx={{ color: '#00e676' }} />
            </Box>
            <FormControlLabel control={<Switch size="small" checked={env.lighting_score === 1} color="success" onChange={e => setEnv({...env, lighting_score: e.target.checked?1:0})} />} label={<Typography color="white" variant="caption" fontWeight={700}>Street Lighting</Typography>} />
            <FormControlLabel control={<Switch size="small" checked={env.is_wine_shop === 1} color="error" onChange={e => setEnv({...env, is_wine_shop: e.target.checked?1:0})} />} label={<Typography color="white" variant="caption" fontWeight={700}>Wine Shop Proximity</Typography>} />
          </Stack>
          
          <Button fullWidth variant="contained" onClick={() => runAudit(false)} disabled={loading || isAutoGuard} sx={{ mt: 4, py: 2, borderRadius: 3, bgcolor: '#00e676', color: '#000', fontWeight: 900 }}>
            {loading ? <CircularProgress size={24} color="inherit" /> : isAutoGuard ? "GUARDING..." : "MANUAL AUDIT"}
          </Button>
        </Box>

        <Box sx={{ mt: 'auto', minHeight: 200 }}>
          <Divider sx={{ mb: 3, borderColor: '#1e2530' }} />
          {audit ? (
            <Grow in={true}>
              <Paper sx={{ p: 2.5, bgcolor: '#161b22', borderRadius: 4, borderLeft: `6px solid ${audit.color}` }}>
                <Typography variant="h3" sx={{ color: audit.color, fontWeight: 900,transition: 'all 0.5s ease-in-out' }}>{audit.score}%</Typography>
                <Typography variant="subtitle2" color="white" sx={{ fontWeight: 800 }}>{audit.status}</Typography>
                {audit.is_weapon && (
                  <Button fullWidth size="small" variant="contained" color="error" sx={{ mt: 2, fontWeight: 900 }} startIcon={<NavIcon />} 
                    onClick={handleRescueNavigation}>
                    RE-OPEN NAVIGATION
                  </Button>
                )}
              </Paper>
            </Grow>
          ) : <Typography variant="caption" color="gray">Initializing system...</Typography>}
        </Box>
      </Box>

      {/* MAP */}
      <Box sx={{ flexGrow: 1, height: '100%', position: 'relative' }}>
        <MapContainer center={[coords.lat, coords.lng]} zoom={15} style={{ height: '100%', width: '100%' }} zoomControl={false}>
          <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
          <MapHandler center={coords} />
          
          <Marker position={[coords.lat, coords.lng]} icon={userIcon} />
          <Marker position={[KATPADI_POLICE_STATION.lat, KATPADI_POLICE_STATION.lng]} icon={policeIcon}>
                <Tooltip permanent direction="top">Katpadi Police Station</Tooltip>
          </Marker>

          {rescueRoute.length > 0 && (
            <Polyline 
                positions={rescueRoute} 
                pathOptions={{ color: '#ff1744', weight: 8, opacity: 0.9, dashArray: '15, 20' }} 
            />
          )}

          {audit && <Circle center={[coords.lat, coords.lng]} radius={600} pathOptions={{ color: audit.color, fillOpacity: 0.1, weight: 1 }} />}
        </MapContainer>
      </Box>

      <AIVisionSOS ref={aiSosRef} />
      <SOSButton />

      <Snackbar open={showNotification} autoHideDuration={6000} onClose={() => setShowNotification(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity="error" variant="filled" icon={<AlertIcon />} sx={{ width: '100%', fontWeight: 'bold' }}>
          DANGER: Weapon Detected! Auto-SOS sent to Katpadi Police.
        </Alert>
      </Snackbar>

      <style>{`
        .leaflet-container { height: 100% !important; width: 100% !important; z-index: 1; }
        .radar-animate { animation: blinker 1s linear infinite; }
        @keyframes blinker { 50% { opacity: 0; } }
      `}</style>
    </Box>
  );
};

export default Dashboard;