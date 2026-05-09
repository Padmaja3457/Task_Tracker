require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db'); // Import the function from db.js

const app = express();

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
// Connect to Database
connectDB();

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());
// ... existing middleware ...
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Test route for database verify
app.get('/api/test', (req, res) => res.send('API and DB connected!'));

// A simple test route to make sure the API is working
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

// Add '0.0.0.0' to allow external connections from Railway's network
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});