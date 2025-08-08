const User = require('../models/User');
const Otp = require('../models/Otp');
const generateOtp = require('../utils/generateOtp');
const { sendMail } = require('../config/mailer');
const jwt = require('jsonwebtoken');

const OTP_EXPIRE_SECONDS = parseInt(process.env.OTP_EXPIRE_SECONDS || '300', 10);

// helper: send OTP email
async function sendOtpEmail(toEmail, otp) {
  const subject = 'Your OTP code';
  const text = `Your OTP is ${otp}. It expires in ${Math.floor(OTP_EXPIRE_SECONDS/60)} minutes.`;
  await sendMail({ to: toEmail, subject, text });
}

// Register: create OTP (if email/mobile not already registered)
exports.register = async (req, res) => {
  const { email, mobile, role } = req.body;
  if (!email || !role) return res.status(400).json({ message: 'email and role are required' });

  // check existing user
  const existing = await User.findOne({ $or: [{ email }, { mobile }] });
  if (existing) return res.status(409).json({ message: 'Email or mobile already registered' });

  const otpCode = generateOtp();
  await Otp.create({ email, otp: otpCode, role });

  try {
    await sendOtpEmail(email, otpCode);
    return res.json({ message: 'OTP sent to email for verification' });
  } catch (err) {
    console.error('sendOtp error:', err);
    return res.status(500).json({ message: 'Failed to send OTP' });
  }
};

// Verify register: create user if OTP valid
exports.verifyRegister = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: 'email and otp required' });

  const record = await Otp.findOne({ email, otp });
  if (!record) return res.status(400).json({ message: 'Invalid or expired OTP' });

  // Double-check a user wasn't created in the meantime
  const existing = await User.findOne({ $or: [{ email: record.email }, { mobile: record.mobile }] });
  if (existing) {
    await Otp.deleteMany({ email: record.email }); // cleanup
    return res.status(409).json({ message: 'User already exists' });
  }

  await User.create({ email: record.email, mobile: record.mobile, role: record.role });
  await Otp.deleteMany({ email: record.email });

  return res.json({ message: 'Account created successfully' });
};

// Login: accept email or mobile, find user, issue OTP to user's email
exports.login = async (req, res) => {
  const { emailOrMobile } = req.body;
  if (!emailOrMobile) return res.status(400).json({ message: 'emailOrMobile required' });

  const user = await User.findOne({ $or: [{ email: emailOrMobile }, { mobile: emailOrMobile }] });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const otpCode = generateOtp();
  await Otp.create({ email: user.email, mobile: user.mobile, otp: otpCode, role: user.role });

  try {
    await sendOtpEmail(user.email, otpCode);
    return res.json({ message: 'OTP sent to registered email' });
  } catch (err) {
    console.error('sendOtp error:', err);
    return res.status(500).json({ message: 'Failed to send OTP' });
  }
};

// Verify login: validate OTP, return JWT
exports.verifyLogin = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: 'email and otp required' });

  const record = await Otp.findOne({ email, otp });
  if (!record) return res.status(400).json({ message: 'Invalid or expired OTP' });

  // Find user
  const user = await User.findOne({ email: record.email });
  if (!user) {
    await Otp.deleteMany({ email: record.email });
    return res.status(404).json({ message: 'User not found' });
  }

  await Otp.deleteMany({ email: record.email });

  const payload = { id: user._id, email: user.email, role: user.role };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

  return res.json({ message: 'Login successful', token, user: { email: user.email, mobile: user.mobile, role: user.role } });
};
