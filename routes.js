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

// GET a single recipe by title
router.get('/api/recipes/:title', async (req, res) => {
    try {
        const recipe = await Recipe.findOne({ title: req.params.title });
        if (recipe) {
            res.json(recipe);
        } else {
            res.status(404).json({ message: 'Recipe not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
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
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (recipe) {
            // Update the recipe properties
            Object.assign(recipe, req.body);
            await recipe.save();
            res.json(recipe);
        } else {
            res.status(404).json({ message: 'Recipe not found' });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a recipe
router.delete('/api/recipes/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (recipe) {
            await recipe.remove();
            res.json({ message: 'Deleted Recipe' });
        } else {
            res.status(404).json({ message: 'Recipe not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;
