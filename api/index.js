const express = require('express');
const connectDB = require('../db');
const app = express();
connectDB();

const allowedOrigins = [
  "https://swayamkrush.com",     // ✅ Your frontend domain
  "https://www.swayamkrush.com",
  "http://localhost:5173"        // ✅ Local dev
];

// ✅ CORS middleware (before any routes)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // ✅ IMPORTANT: Reply immediately for preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});

// ✅ Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Your routes
app.use('/api/auth', require('../routes/auth'));
app.use('/api/firm', require('../routes/Firmapi'));
app.use('/api/cibil', require('../routes/Cibiltrainingapi'));
app.use('/api/cibil-repair', require('../routes/Cibilrepairapi'));
app.use('/api/user', require('../routes/Users'));
app.use('/api/msme', require('../routes/Msmeapi'));
app.use('/api', require('../routes/Search'));
app.use('/api/visa', require('../routes/Visaapi'));

app.get('/', (req, res) => {
  res.send('Welcome to Maha Pranalika Backend API');
});

module.exports = app;
