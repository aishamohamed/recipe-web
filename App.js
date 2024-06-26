// The main server file to set up and start Express server.
// RUN = npm run dev 
require('dotenv').config(); // Import environment variables from .env file

// Import mongoose and model
const mongoose = require('mongoose');
const express = require('express');
const recipeModel = require('./model');
const path = require('path');
const recipeRoutes = require('./routes');


 
const options = { 
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
};

const app = express(); // Initializing Express app
app.use(express.json()); // for parsing application/json

// Use the recipe routes
app.use(recipeRoutes);


const CONNECTION_URL = process.env.CONNECTION_URL;
const PORT = process.env.PORT; 


mongoose.connect(CONNECTION_URL)
    .then(() => console.log("Connected to MongoDB!"))
    .catch(err => console.error("Error connecting to MongoDB:", err));

// path.join() joins together the supllied path segments
// Middleware to serve static files (like index.html), takes in the name of the directory to serve static files
app.use(express.static(path.join(__dirname, 'public')));


// Send index.html when the root route ('/') is requested
app.get('/', (req, res) => {
    res.sendFile('index.html');
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});