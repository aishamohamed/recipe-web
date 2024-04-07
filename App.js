// The main server file to set up and start Express server.
// RUN = npm run dev 
require('dotenv').config(); // Import environment variables from .env file

// Import mongoose and model
const mongoose = require('mongoose');
const express = require('express');
const recipeModel = require('./model');
 const path = require('path');

const options = { 
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
};

const app = express(); // Initializing Express app

const CONNECTION_URL = process.env.CONNECTION_URL;
const PORT = process.env.PORT; 


mongoose.connect(CONNECTION_URL)
    .then(() => console.log("Connected to MongoDB!"))
    .catch(err => console.error("Error connecting to MongoDB:", err));

// Middleware to serve static files (like index.html)
app.use(express.static(path.join(__dirname, 'public')));


// Send index.html when the root route ('/') is requested
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});