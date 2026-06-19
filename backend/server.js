const express = require('express');
const cors = require('cors');
const notesRouter = require('./routes/notes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/notes', notesRouter);

app.get('/', (req, res) => {
  res.json({ message: 'Notes Management System API is active' });
});

app.listen(PORT, () => {
  console.log(`Backend API Server running on port ${PORT}`);
});
