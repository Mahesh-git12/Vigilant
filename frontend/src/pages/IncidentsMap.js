// import React from 'react';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import L from 'leaflet';

// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
//   iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
//   shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
// });

// export default function IncidentsMap({ incidents }) {
//   const validIncidents = incidents.filter(i => i.latitude && i.longitude);
//   const defaultPosition = validIncidents.length
//     ? [validIncidents[0].latitude, validIncidents[0].longitude]
//     : [20.5937, 78.9629]; // fallback: India

//   return (
//     <MapContainer center={defaultPosition} zoom={5} style={{ height: "350px", width: "100%", marginBottom: 24, borderRadius: 16 }}>
//       <TileLayer
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//       />
//       {validIncidents.map((incident) => (
//         <Marker key={incident._id} position={[incident.latitude, incident.longitude]}>
//           <Popup>
//             <strong>{incident.type === 'sos' ? 'SOS' : 'Incident'}</strong><br />
//             {incident.location}<br />
//             {incident.description}<br />
//             {new Date(incident.date).toLocaleString()}
//           </Popup>
//         </Marker>
//       ))}
//     </MapContainer>
//   );
// }

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const sosIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  iconSize: [27, 41], iconAnchor: [13, 41], popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png', shadowSize: [41, 41],
});
const incidentIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x.png',
  iconSize: [27, 41], iconAnchor: [13, 41], popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png', shadowSize: [41, 41],
});

const css = `
  .im-wrap {
    border-radius: 14px;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,0.07);
    position: relative;
    box-shadow: 0 4px 24px rgba(0,0,0,0.4);
    margin-bottom: 24px;
  }
  .im-overlay {
    position: absolute; bottom: 0; left: 0; right: 0;
    height: 48px;
    background: linear-gradient(to top, rgba(9,12,15,0.85), transparent);
    z-index: 400; pointer-events: none;
  }
  .im-badge {
    position: absolute; top: 12px; left: 12px; z-index: 500;
    display: inline-flex; align-items: center; gap: 6px;
    padding: 5px 11px;
    background: rgba(9,12,15,0.82);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(0,194,179,0.25);
    border-radius: 100px;
    font-family: 'JetBrains Mono', monospace;
    font-size: .62rem; color: #00C2B3;
    letter-spacing: .08em; text-transform: uppercase;
    pointer-events: none;
  }
  .im-badge-dot {
    width: 5px; height: 5px; border-radius: 50%;
    background: #00C2B3; animation: imd 2s infinite;
  }
  @keyframes imd{0%,100%{opacity:1}50%{opacity:.3}}
  .leaflet-popup-content-wrapper {
    background: #0E1318 !important;
    border: 1px solid rgba(0,194,179,0.2) !important;
    border-radius: 10px !important;
    box-shadow: 0 8px 28px rgba(0,0,0,0.5) !important;
  }
  .leaflet-popup-tip { background: #0E1318 !important; }
  .leaflet-popup-content { color: #E8EDF2 !important; font-family: 'Outfit', sans-serif !important; }
  .im-popup-type {
    font-size: .66rem; font-weight: 700;
    text-transform: uppercase; letter-spacing: .1em;
    margin-bottom: 5px;
  }
  .im-popup-loc { font-size: .78rem; font-weight: 600; margin-bottom: 3px; }
  .im-popup-desc { font-size: .72rem; color: rgba(232,237,242,0.55); margin-bottom: 6px; line-height: 1.4; }
  .im-popup-time {
    font-family: 'JetBrains Mono', monospace;
    font-size: .6rem; color: rgba(232,237,242,0.3);
  }
  .im-popup-track {
    display: inline-flex; align-items: center; gap: 5px;
    margin-top: 8px; padding: 4px 10px;
    background: rgba(0,194,179,0.1); border: 1px solid rgba(0,194,179,0.25);
    border-radius: 6px; text-decoration: none;
    font-size: .7rem; font-weight: 600; color: #00C2B3;
    transition: all .15s;
  }
  .im-popup-track:hover { background: rgba(0,194,179,0.2); }
`;

export default function IncidentsMap({ incidents }) {
  const valid = (incidents || []).filter(i => i.latitude && i.longitude);
  const center = valid.length
    ? [valid.reduce((s, i) => s + i.latitude, 0) / valid.length,
       valid.reduce((s, i) => s + i.longitude, 0) / valid.length]
    : [20.5937, 78.9629];

  return (
    <>
      <style>{css}</style>
      <div className="im-wrap">
        <div className="im-badge">
          <div className="im-badge-dot" />
          {valid.length} incident{valid.length !== 1 ? 's' : ''}
        </div>
        <MapContainer center={center} zoom={valid.length ? 5 : 4}
          style={{ height: 360, width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='© OpenStreetMap contributors'
          />
          {valid.map(inc => (
            <Marker key={inc._id}
              position={[inc.latitude, inc.longitude]}
              icon={inc.type === 'sos' ? sosIcon : incidentIcon}>
              <Popup>
                <div className="im-popup-type" style={{ color: inc.type === 'sos' ? '#f87171' : '#00C2B3' }}>
                  {inc.type === 'sos' ? '🆘 SOS' : '⚠️ Incident'}
                </div>
                <div className="im-popup-loc">{inc.location}</div>
                <div className="im-popup-desc">{inc.description}</div>
                <div className="im-popup-time">{new Date(inc.date).toLocaleString()}</div>
                <a href={`/track/${inc._id}`} className="im-popup-track">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>
                  </svg>
                  Track
                </a>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
        <div className="im-overlay" />
      </div>
    </>
  );
}