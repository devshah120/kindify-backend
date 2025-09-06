require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path'); 
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const postRoutes = require('./routes/postRoutes');
const storyRoutes = require('./routes/storyRoutes'); 
const contactRoutes = require('./routes/contactRoutes');
const volunteerRoutes = require('./routes/volunteerRoutes');

const app = express();
app.use(bodyParser.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

app.use('/auth', authRoutes);
app.use('/api', profileRoutes);
app.use('/api', postRoutes);
app.use('/api', storyRoutes);
app.use('/api', contactRoutes);
app.use('/api', volunteerRoutes);

app.use((req, res) => res.status(404).json({ message: 'Not found' }));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
