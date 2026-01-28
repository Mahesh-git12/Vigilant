import { useRef, useImperativeHandle, forwardRef, useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

const AIVisionSOS = forwardRef((props, ref) => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const fetchContacts = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await axios.get(`${API_URL}/api/users/emergency-contacts`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setContacts(res.data.emergencyContacts || []);
      } catch (err) {
        console.error("AI Responder: Contacts load failed.");
      }
    };
    fetchContacts();
  }, []);

  useImperativeHandle(ref, () => ({
    triggerWeaponAlert: (threatType) => {
      console.warn("VIGILANT AI: Initiating Autonomous SOS...");
      handleAutoSOS(threatType);
    }
  }));

  const handleAutoSOS = (threat) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => sendAlert(pos.coords.latitude, pos.coords.longitude, threat),
        () => sendAlert(12.9165, 79.1325, threat), // Fallback to Vellore center
        { timeout: 5000 }
      );
    }
  };

  const sendAlert = async (lat, lng, threat) => {
    try {
      const token = localStorage.getItem('token');
      if (contacts.length === 0) return;

      // 1. Coordinates for Katpadi Police Station
      const destLat = 12.9752361;
      const destLng = 79.1372087;

      // 2. Generate the dynamic Google Maps Navigation Link
      // Leaving 'saddr' empty forces Google Maps to use the user's "Current Location"
      const navLink = `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}&travelmode=driving`;

      // 3. Create a clean, structured message body
      const structuredDescription = `
🚨 CRITICAL SECURITY ALERT 🚨

Vigilant AI has detected a potential threat: ${threat.toUpperCase()}

The system has automatically triggered this SOS.
Sender's Current Lat/Lng: ${lat}, ${lng}

The nearest safe haven (Katpadi Police Station) has been identified. 
Click the link below to start navigation from your location to the rescue point:

RESCUE ROUTE: ${navLink}

Please check in on the sender immediately.
      `;

      await axios.post(`${API_URL}/api/incidents/sos`, {
        location: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
        description: structuredDescription,
        contacts: contacts, 
        latitude: lat,
        longitude: lng
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("VIGILANT AI: Automated SOS Email Sent.");
    } catch (err) {
      console.error("AI Responder: SOS Failed", err);
    }
  };

  return null;
});

export default AIVisionSOS;
// import { useRef, useImperativeHandle, forwardRef, useEffect, useState } from 'react';
// import axios from 'axios';

// // Ensure this matches your Node.js Server URL
// const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

// const AIVisionSOS = forwardRef((props, ref) => {
//   const [contacts, setContacts] = useState([]);

//   // 1. Pre-load contacts so they are ready for instant SOS
//   useEffect(() => {
//     const fetchContacts = async () => {
//       const token = localStorage.getItem('token');
//       if (!token) return;
//       try {
//         const res = await axios.get(`${API_URL}/api/users/emergency-contacts`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         setContacts(res.data.emergencyContacts || []);
//       } catch (err) {
//         console.error("AI Responder: Contacts load failed.");
//       }
//     };
//     fetchContacts();
//   }, []);

//   // 2. Expose the trigger function to the Dashboard
//   useImperativeHandle(ref, () => ({
//     triggerWeaponAlert: (threatType) => {
//       console.warn("VIGILANT AI: Initiating Autonomous SOS...");
//       handleAutoSOS(threatType);
//     }
//   }));

//   const handleAutoSOS = (threat) => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (pos) => sendAlert(
//           `Lat: ${pos.coords.latitude}, Lon: ${pos.coords.longitude}`,
//           { lat: pos.coords.latitude, lng: pos.coords.longitude },
//           threat
//         ),
//         () => sendAlert('Unknown Location', {}, threat),
//         { timeout: 5000 }
//       );
//     }
//   };

//   const sendAlert = async (locStr, coords, threat) => {
//     try {
//       const token = localStorage.getItem('token');
//       if (contacts.length === 0) return;

//       // This hits your EXISTING Node.js SOS route
//       await axios.post(`${API_URL}/api/incidents/sos`, {
//         location: locStr,
//         description: `⚠️ AUTOMATED AI ALERT: A ${threat.toUpperCase()} was detected by the camera system. Immediate check-in required.`,
//         contacts: contacts, 
//         latitude: coords.lat,
//         longitude: coords.lng
//       }, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       console.log("VIGILANT AI: Automated SOS Email Sent.");
//     } catch (err) {
//       console.error("AI Responder: SOS Failed", err);
//     }
//   };

//   return null; // Stays invisible
// });

// export default AIVisionSOS;