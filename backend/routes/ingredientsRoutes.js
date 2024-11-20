const express = require('express');
const router = express.Router();
const ingredientsController = require('../controllers/ingredientsController');

// Route to get all ingredients
router.get('/', ingredientsController.getIngredients);

// Route to add a new ingredient
router.post('/', ingredientsController.addIngredient);

module.exports = router;
