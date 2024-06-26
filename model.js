//Defines the schema for the recipes and interacts with the MongoDB database using Mongoose.

// Import mongoose
const mongoose = require('mongoose');

// Define a schema
const recipeSchema = new mongoose.Schema({
    // Define properties
    id: mongoose.Schema.Types.ObjectId, // Unique identifier for each recipe
    title: {
        type: String,
        required: true 
    },
    ingredients: {
        type: [String], 
        required: true
    },
    instructions: {
        type: String,
        required: true
    },
    cookingTime: {
        type: Number, // Time in minutes
        required: true
    }
});


// Create a model from the schema
// The first parameter is the singular name of the collection the model is for.
// Mongoose automatically looks for the plural, lowercased version of the model name.
// Thus, for the model Recipe, the collection will be recipes.
module.exports = mongoose.model('Recipe', recipeSchema);