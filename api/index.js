const express = require('express');
const connectDB = require('../db');

const app = express();
connectDB();

// ✅ Allowed frontend origins
const allowedOrigins = [
  "https://swayamkrush.com",
  "https://www.swayamkrush.com",
  "http://localhost:5173" // for local dev
];

// ✅ CORS middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // ✅ Preflight response for OPTIONS
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// ✅ Body parsers
app.use(express.json({ limit: "50mb" })); // Allow larger uploads if needed
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// ✅ Routes
app.use('/api/auth', require('../routes/auth'));
app.use('/api/firm', require('../routes/Firmapi'));
app.use('/api/cibil', require('../routes/Cibiltrainingapi'));
app.use('/api/cibil-repair', require('../routes/Cibilrepairapi'));
app.use('/api/user', require('../routes/Users'));
app.use('/api/msme', require('../routes/Msmeapi'));
app.use('/api', require('../routes/Search'));
app.use('/api/visa', require('../routes/Visaapi'));

// ✅ Health check
app.get('/', (req, res) => {
  res.send('Welcome to Maha Pranalika Backend API');
});

// ✅ IMPORTANT for Render (use assigned PORT)
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});

module.exports = app;
