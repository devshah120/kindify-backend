const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, lowercase: true, trim: true, required: true, unique: true },
  mobile: { type: String, required: false },
  role: { type: String, enum: ['User', 'Trust'], required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
