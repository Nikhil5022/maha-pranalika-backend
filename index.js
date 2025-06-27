const express = require('express');
const cors = require('cors');

const app = express();
const PORT =  5000;
const connectDB = require('./db');

connectDB();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const firmRoutes = require('./routes/Firmapi');
app.use('/api/firm', firmRoutes);

const cibilRoutes = require('./routes/Cibiltrainingapi');
app.use('/api/cibil', cibilRoutes);

const cibilRepairRoutes = require('./routes/Cibilrepairapi');
app.use('/api/cibil-repair',cibilRepairRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to Maha Pranalika Backend API');
});

app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});

module.exports = app;
