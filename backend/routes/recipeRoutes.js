// recipeRoutes.js - Routes related to recipes

const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');

// Route to create a new recipe
router.post('/create', recipeController.createRecipe);

// Route to get the 10 newest featured recipes
router.get('/featured', recipeController.getFeaturedRecipes);

// Route to get all recipes
router.get('/all', recipeController.getAllRecipes);

// Route to search recipes by name, ingredients, or tags
router.get('/search', recipeController.getRecipeSearch);

// Route to get all recipes by creator ID
router.get('/creator/:creatorId', recipeController.getRecipesByCreator);

// Route to get a specific recipe by ID
router.get('/:id', recipeController.getRecipeById);

// Route to update a recipe (by the author)
router.put('/:id/update', recipeController.updateRecipe);

// Route to delete a recipe (by the author or admin)
router.delete('/:id/delete', recipeController.deleteRecipe);

module.exports = router;