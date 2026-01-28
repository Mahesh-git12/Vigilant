require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const incidentRoutes = require('./routes/incidentRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const safetyRoutes = require('./routes/safetyRoutes');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 4000;

// Allow CORS from frontend
const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL
];
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },

  credentials: true
}));


app.use(express.json());  //middleware
app.use('/api/users', userRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/safety', safetyRoutes);

// Serve avatar uploads statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


//Resources 
app.use('/api/resources', resourceRoutes);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));


// Sample Notifications
app.get('/notifications', (req, res) => {
  const notifications = [
    { _id: '1', title: 'Welcome to Vigilant', message: 'Thanks for joining!' },
    { _id: '2', title: 'New Alert', message: 'You have received a new notification.' }
  ];
  res.json({ notifications });
});


// ? FIXED Mongoose connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Atlas connected Sucessfully'))
  .catch((err) => console.error('MongoDB connection error:', err));
  
app.get('/', (req, res) => {
  res.send('Women Safety App Backend is running');
});

app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});



// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');

// const userRoutes = require('./routes/userRoutes');
// const incidentRoutes = require('./routes/incidentRoutes');
// const resourceRoutes = require('./routes/resourceRoutes');
// const path = require('path');
// const app = express();
// const PORT = process.env.PORT || 4000;

// // Allow CORS from frontend
// const allowedOrigins = [
//   'http://localhost:3000',
//   process.env.FRONTEND_URL
// ];
// app.use(cors({
//   origin: function(origin, callback) {
//     if (!origin) return callback(null, true);
//     if (allowedOrigins.includes(origin)) return callback(null, true);
//     return callback(new Error('Not allowed by CORS'));
//   },

//   credentials: true
// }));


// app.use(express.json());  //middleware
// app.use('/api/users', userRoutes);
// app.use('/api/incidents', incidentRoutes);


// // Serve avatar uploads statically
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// //Resources 
// app.use('/api/resources', resourceRoutes);



// // Sample Notifications
// app.get('/notifications', (req, res) => {
//   const notifications = [
//     { _id: '1', title: 'Welcome to Vigilant', message: 'Thanks for joining!' },
//     { _id: '2', title: 'New Alert', message: 'You have received a new notification.' }
//   ];
//   res.json({ notifications });
// });


// // ? FIXED Mongoose connection
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log('MongoDB Atlas connected Sucessfully'))
//   .catch((err) => console.error('MongoDB connection error:', err));
  
// app.get('/', (req, res) => {
//   res.send('Women Safety App Backend is running');
// });

// app.listen(PORT, () => {
//   console.log(` Server running on port ${PORT}`);
// });




