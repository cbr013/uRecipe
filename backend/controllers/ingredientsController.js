// ingredientsController.js - Controller functions for recipe management

const db = require('../models/db');

// Get all ingredients
exports.getIngredients = (req, res) => {
    const query = `SELECT * FROM ingredients ORDER BY name ASC`;
    db.all(query, [], (err, ingredients) => {
      if (err) {
        res.status(500).json({ message: 'Error retrieving ingredients', error: err });
      } else {
        res.status(200).json(ingredients);
      }
    });
  };
  
  // Add a new ingredient
  exports.addIngredient = (req, res) => {
    const { name } = req.body;
    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  
    const query = `INSERT INTO ingredients (name) VALUES (?)`;
    db.run(query, [capitalizedName], function (err) {
      if (err) {
        res.status(500).json({ message: 'Failed to add ingredient', error: err });
      } else {
        res.status(201).json({ ingredientId: this.lastID, message: 'Ingredient added successfully' });
      }
    });
  };