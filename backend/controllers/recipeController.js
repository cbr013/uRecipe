const db = require('../models/db');

// Create a new recipe
exports.createRecipe = (req, res) => {
  const { name, description, prep_time, image, ingredients, additional_ingredients, user_id } = req.body;
  const query = `INSERT INTO Recipes (name, description, prep_time, image, ingredients, additional_ingredients, user_id)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;

  db.run(query, [name, description, prep_time, image, ingredients, additional_ingredients, user_id], function (err) {
    if (err) {
      return res.status(500).send({ message: 'Error creating recipe', error: err });
    }
    res.status(201).send({ message: 'Recipe created successfully' });
  });
};

// Get all recipes
exports.getAllRecipes = (req, res) => {
  db.all(`SELECT * FROM Recipes`, [], (err, recipes) => {
    if (err) {
      return res.status(500).send({ message: 'Error fetching recipes', error: err });
    }
    res.status(200).send(recipes);
  });
};

// Other CRUD operations (update, delete) follow similar patterns
// Get a recipe by ID
exports.getRecipeById = (req, res) => {
  const recipeId = req.params.id;
  db.get(`SELECT * FROM Recipes WHERE id = ?`, [recipeId], (err, recipe) => {
    if (err || !recipe) {
      return res.status(404).send({ message: 'Recipe not found', error: err });
    }
    res.status(200).send(recipe);
  });
};

// Update a recipe by ID
exports.updateRecipe = (req, res) => {
  const recipeId = req.params.id;
  const { name, description, prep_time, image, ingredients, additional_ingredients } = req.body;
  const query = `UPDATE Recipes SET name = ?, description = ?, prep_time = ?, image = ?, ingredients = ?, additional_ingredients = ? WHERE id = ?`;

  db.run(query, [name, description, prep_time, image, ingredients, additional_ingredients, recipeId], function (err) {
    if (err) {
      return res.status(500).send({ message: 'Error updating recipe', error: err });
    }
    res.status(200).send({ message: 'Recipe updated successfully' });
  });
};

// Delete a recipe by ID
exports.deleteRecipe = (req, res) => {
  const recipeId = req.params.id;
  const query = `DELETE FROM Recipes WHERE id = ?`;

  db.run(query, [recipeId], function (err) {
    if (err) {
      return res.status(500).send({ message: 'Error deleting recipe', error: err });
    }
    res.status(200).send({ message: 'Recipe deleted successfully' });
  });
};
