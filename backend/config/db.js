const mongoose = require('mongoose');
const User = require('../models/User');

async function connectDB() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/file-share';
  await mongoose.connect(uri);
  // Reconcile User indexes so a legacy unique name index cannot block signup.
  await User.syncIndexes();
  console.log('MongoDB connected');
}

module.exports = connectDB;