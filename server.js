require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const postRoutes = require('./routes/postRoutes');

const app = express();
app.use(bodyParser.json());

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

app.use((req, res) => res.status(404).json({ message: 'Not found' }));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
