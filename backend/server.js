const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const notesRouter = require('./routes/notes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/notes', notesRouter);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Notes Management System API is active' });
});

// Database connection bootstrapping
async function connectDB() {
  let mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
  console.error('MONGODB_URI is missing');
  process.exit(1);
}

  try {
    await mongoose.connect(mongoUri);
    console.log('Database connected successfully.');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Backend API Server running on port ${PORT}`);
  });
});
