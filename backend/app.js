require('events').EventEmitter.defaultMaxListeners = 20;
require('dotenv').config();

// Check for required environment variables
if (!process.env.JWT_SECRET || !process.env.DATABASE_PATH) {
    console.error('Missing required environment variables. Please check your .env file.');
    process.exit(1); // Exit the application
}

console.log('All required environment variables are loaded.');

const express = require('express');
const bodyParser = require('body-parser');  // To parse JSON in POST requests
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const reportRoutes = require('./routes/reportRoutes');

const jwtSecret = process.env.JWT_SECRET;
const dbPath = process.env.DATABASE_PATH;
const PORT = process.env.PORT || 5000;

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());      // Parse JSON bodies

//app.use('/users', userRoutes);
app.use(userRoutes);
//app.use(taskRoutes);
app.use('/tasks', taskRoutes);
//app.use('/tasks/:userId', taskRoutes);

const gamificationRoutes = require('./routes/gamificationRoutes');
app.use('/gamification', gamificationRoutes);

// Use report routes
app.use('/reports', reportRoutes);

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
