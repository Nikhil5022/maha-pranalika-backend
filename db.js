const mongoose = require('mongoose');

const connectDB = async () => {
  console.log('Connecting to MongoDB Atlas...');
  try {
    await mongoose.connect('mongodb+srv://gsnagc5022:TwkzWXNov3tGLzPp@cluster0.hc0mzf2.mongodb.net/users', {
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
