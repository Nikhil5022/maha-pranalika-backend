const express = require('express');
const cors = require('cors');
const connectDB = require('../db');

const app = express();
connectDB();
const port=5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('../routes/auth'));
app.use('/api/firm', require('../routes/Firmapi'));
app.use('/api/cibil', require('../routes/Cibiltrainingapi'));
app.use('/api/cibil-repair', require('../routes/Cibilrepairapi'));
app.use('/api/user', require('../routes/Users'));
app.use('/api/msme', require('../routes/Msmeapi'));
app.use('/api',require('../routes/Search'));
app.use('/api/visa', require('../routes/Visaapi'));
app.get('/', (req, res) => {
  res.send('Welcome to Maha Pranalika Backend API');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

module.exports = app;
