const express = require('express');
const cors = require('cors');
require('dotenv').config();

// 🔁 Ensure both route files are exporting only the router function!
const personalityRoutes = require('./routes/personality');
const chatRoutes = require('./routes/chat');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Debug route check (optional)
console.log("✅ Routes loaded:");
console.log("👉 personalityRoutes:", typeof personalityRoutes); // should be 'function'
console.log("👉 chatRoutes:", typeof chatRoutes); // should be 'function'

// Routes
app.use('/api/personality', personalityRoutes);
app.use('/api/chat', chatRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running!' });
});

app.listen(PORT, () => {
  console.log(`🚀 PersonaGen Backend running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});
