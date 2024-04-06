// The main server file to set up and start Express server.

// Import mongoose and model
const Mongoose = require('mongoose');
const recipeModel = require('model');

Mongoose.connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});