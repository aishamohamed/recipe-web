// handle routing for API endpoints

const express = require('express');
const router = express.Router();
const Recipe = require('./model');

// GET all recipes
router.get('/api/recipes', async (req, res) => {
    try {
        const recipes = await Recipe.find();
        res.json(recipes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/api/recipes/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).send({ message: 'Recipe not found' });
        }
        res.json(recipe);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});


// POST a new recipe
router.post('/api/recipes', async (req, res) => {
    const recipe = new Recipe({
        title: req.body.title,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions,
        cookingTime: req.body.cookingTime
    });

    try {
        const existingRecipe = await Recipe.findOne({ title: req.body.title });
        if (existingRecipe) {
            return res.status(409).json({ message: "Recipe already exists" });
        }
        const newRecipe = await recipe.save();
        res.status(201).json(newRecipe);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT update a recipe
router.put('/api/recipes/:id', async (req, res) => {
    //console.log('Received PUT request for ID:', req.params.id); // Server-side log
    //console.log('Update data:', req.body);  // Log data received to update
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            console.log('No recipe found with ID:', req.params.id);
            return res.status(404).json({ message: 'Recipe not found' });
        }
        console.log('Updated recipe:', recipe);
        Object.assign(recipe, req.body);
        await recipe.save();
        res.json(recipe);
    } catch (err) {
        console.error('Error updating recipe:', err);
        res.status(500).json({ message: err.message });
    }
});


// DELETE a recipe
router.delete('/api/recipes/:id', async (req, res) => {
    try {
        // Attempt to find and delete the recipe by ID
        const recipe = await Recipe.findByIdAndDelete(req.params.id);
        // If the recipe is found and deleted
        if (recipe) {
            res.status(200).json({ message: 'Recipe deleted successfully!' });
        } else {
            // If no recipe is found with the given ID
            res.status(404).json({ message: 'Recipe not found' });
        }
    } catch (err) {
        // If there's an error during the operation, return a server error response
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;