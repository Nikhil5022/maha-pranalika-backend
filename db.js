const mongoose = require('mongoose');

require('dotenv').config();

const connectDB = async () => {

  try {
    await mongoose.connect(process.env.MONGOURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(' Connected to MongoDB Atlas');
  } catch (error) {
    console.error(' MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
