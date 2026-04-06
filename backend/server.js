require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Route Imports
const userRoutes = require('./routes/userRoutes');
const incidentRoutes = require('./routes/incidentRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const safetyRoutes = require('./routes/safetyRoutes');

const app = express();
const PORT = process.env.PORT || 4000;

// --- DYNAMIC CORS CONFIGURATION ---
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:4000',
  'https://women-safety-app-new.vercel.app',         // ✅ your main Vercel domain
  'https://vigilant-wwki.vercel.app',                 // ✅ keep old one just in case
  process.env.FRONTEND_URL                            // from Render env vars
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (Postman, mobile apps)
    if (!origin) return callback(null, true);

    // Exact match check
    const isExplicitlyAllowed = allowedOrigins.includes(origin);

    // ✅ Allow ANY vercel.app subdomain for your project (covers preview deploys)
    const isVercelDomain = origin.endsWith('.vercel.app');

    if (isExplicitlyAllowed || isVercelDomain) {
      callback(null, true);
    } else {
      console.error(`CORS Blocked: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ Preflight handler — Express 5 compatible
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    return res.sendStatus(204);
  }
  next();
});

// --- MIDDLEWARE ---
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// --- ROUTES ---
app.use('/api/users', userRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/safety', safetyRoutes);
app.use('/api/resources', resourceRoutes);

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Sample Notifications Endpoint
app.get('/api/notifications', (req, res) => {
  const notifications = [
    { _id: '1', title: 'Welcome to Vigilant', message: 'The AI Safety system is active.' },
    { _id: '2', title: 'Security Tip', message: 'Keep your emergency contacts updated.' }
  ];
  res.json({ notifications });
});

// --- DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Atlas connected successfully'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Root Endpoint
app.get('/', (req, res) => {
  res.send('Vigilant Women Safety API is running...');
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
