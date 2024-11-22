// recipeController.js - Controller functions for recipe management

const db = require('../models/db');

// Create a new recipe
exports.createRecipe = (req, res) => {
    const { creatorId, title, description, ingredients, instructions, tags, image, preparationTime } = req.body;

    // Validate required fields
    if (!title || !description || !instructions || !preparationTime) {
        return res.status(400).json({ message: 'Title, description, instructions, and preparation time are required' });
    }

    // Validate ingredients
    if (!Array.isArray(ingredients) || ingredients.length === 0) {
        return res.status(400).json({ message: 'Ingredients must be a non-empty array' });
    }

    for (const ingredient of ingredients) {
        if (!ingredient.id || !ingredient.amount) {
            return res.status(400).json({ message: 'Each ingredient must have an ID and an amount' });
        }
    }

    const query = `
        INSERT INTO recipes 
        (creator_id, title, description, ingredients, instructions, tags, image, preparation_time) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    const ingredientsData = ingredients.map(ing => ({ id: ing.id, amount: ing.amount }));
    const tagsData = tags; // Assuming tags is an array of tag IDs

    db.run(
        query,
        [creatorId, title, description, JSON.stringify(ingredientsData), JSON.stringify(instructions), JSON.stringify(tagsData), image, preparationTime],
        function (err) {
            if (err) {
                console.error('Error inserting recipe:', err);
                return res.status(500).json({ message: 'Failed to create recipe', error: err.message });
            } else {
                res.status(201).json({ recipeId: this.lastID, message: 'Recipe created successfully' });
            }
        }
    );
};

// Get the 5 newest recipes
exports.getFeaturedRecipes = (req, res) => {
    const query = `SELECT * FROM recipes WHERE is_hidden = 0 ORDER BY created_at DESC LIMIT 5`;
    db.all(query, [], (err, rows) => { // Change the parameter name from 'recipes' to 'rows' to avoid confusion
        if (err) {
            console.error('Error fetching featured recipes:', err);
            res.status(500).json({ message: 'Failed to get featured recipes', error: err.message });
        } else {
            const recipes = rows; // Assign the result to the 'recipes' variable
            console.log('Fetched recipes:', recipes); // Log the recipes fetched
            res.status(200).json(recipes); // Send the fetched recipes as the response
        }
    });
};

// Update a recipe (by the author)
exports.updateRecipe = (req, res) => {
    const { id } = req.params;
    const { title, description, ingredients, instructions, tags, image, preparationTime } = req.body;

    // Validate required fields
    if (!title || !description || !instructions || !preparationTime) {
        return res.status(400).json({ message: 'Title, description, instructions, and preparation time are required' });
    }

    // Validate ingredients
    if (!Array.isArray(ingredients) || ingredients.length === 0) {
        return res.status(400).json({ message: 'Ingredients must be a non-empty array' });
    }

    for (const ingredient of ingredients) {
        if (!ingredient.name || !ingredient.amount) {
            return res.status(400).json({ message: 'Each ingredient must have a name and an amount' });
        }
    }

    const query = `
        UPDATE recipes 
        SET title = ?, description = ?, ingredients = ?, instructions = ?, tags = ?, image = ?, preparation_time = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE recipe_id = ?`;

    db.run(
        query,
        [title, description, JSON.stringify(ingredients), JSON.stringify(instructions), JSON.stringify(tags), image, preparationTime, id],
        function (err) {
            if (err) {
                console.error('Error updating recipe:', err);
                return res.status(500).json({ message: 'Failed to update recipe', error: err.message });
            } else {
                res.status(200).json({ message: 'Recipe updated successfully' });
            }
        }
    );
};

// Get all recipes
exports.getAllRecipes = (req, res) => {
    const query = `SELECT * FROM recipes WHERE is_hidden = 0`;
    db.all(query, [], (err, recipes) => {
        if (err) {
            console.error('Error fetching all recipes:', err);
            res.status(500).json({ message: 'Failed to get recipes', error: err.message });
        } else {
            res.status(200).json(recipes);
        }
    });
};

// Get recipe by ID
exports.getRecipeById = (req, res) => {
    const { id } = req.params;

    const query = `SELECT * FROM recipes WHERE recipe_id = ? AND is_hidden = 0`;
    db.get(query, [id], (err, recipe) => {
        if (err || !recipe) {
            console.error('Error fetching recipe by ID:', err);
            return res.status(404).json({ message: 'Recipe not found' });
        } else {
            res.status(200).json(recipe);
        }
    });
};

// Search recipes by name, ingredients, or tags
exports.getRecipeSearch = (req, res) => {
    const { name = '', ingredients = '', tags = '' } = req.query;

    let query = `SELECT * FROM recipes WHERE is_hidden = 0`;
    const params = [];

    if (name) {
        query += ` AND title LIKE ?`;
        params.push(`%${name}%`);
    }
    if (ingredients) {
        const ingredientList = ingredients.split(',').filter(Boolean).map(ing => `%${ing.trim()}%`);
        ingredientList.forEach((ingredient) => {
            query += ` AND ingredients LIKE ?`;
            params.push(ingredient);
        });
    }
    if (tags) {
        const tagList = tags.split(',').filter(Boolean).map(tag => `%${tag.trim()}%`);
        tagList.forEach((tag) => {
            query += ` AND tags LIKE ?`;
            params.push(tag);
        });
    }

    // Log the query and parameters for debugging
    console.log('Executing query:', query);
    console.log('With parameters:', params);

    db.all(query, params, (err, recipes) => {
        if (err) {
            console.error('Error searching recipes:', err);
            res.status(500).json({ message: 'Failed to search recipes', error: err.message });
        } else {
            res.status(200).json(recipes);
        }
    });
};

// Get all recipes by creator ID
exports.getRecipesByCreator = (req, res) => {
    const { creatorId } = req.params;

    const query = `SELECT * FROM recipes WHERE creator_id = ? AND is_hidden = 0`;
    db.all(query, [creatorId], (err, recipes) => {
        if (err) {
            console.error('Error fetching recipes by creator ID:', err);
            res.status(500).json({ message: 'Failed to get recipes by creator', error: err.message });
        } else {
            res.status(200).json(recipes);
        }
    });
};


// Delete a recipe (by the author or admin)
exports.deleteRecipe = (req, res) => {
    const { id } = req.params;

    const query = `DELETE FROM recipes WHERE recipe_id = ?`;
    db.run(query, [id], function (err) {
        if (err) {
            console.error('Error deleting recipe:', err);
            res.status(500).json({ message: 'Failed to delete recipe', error: err.message });
        } else {
            res.status(200).json({ message: 'Recipe deleted successfully' });
        }
    });
};
