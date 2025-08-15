const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  trustName: String,
  adminName: String,
  mobile: String,
  darpanId: String,
  darpanCertificate: String, // store file name
  email: { type: String, lowercase: true, trim: true, required: true, unique: true },
  mobile: { type: String, required: false },
  role: {
  type: String,
  enum: ['Trust', 'User', 'Admin'], // removed Trust-Pending
  default: 'User'
},
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
