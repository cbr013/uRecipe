document.addEventListener('DOMContentLoaded', function() {
    // Extract the recipe ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get('id');

    if (recipeId) {
        fetch('../recipes.json') // Adjust the path to your recipes.json file if necessary
            .then(response => response.json())
            .then(recipes => {
                // Find the recipe with the matching ID
                const recipe = recipes.find(r => r.id === parseInt(recipeId));

                if (recipe) {
                    displayRecipe(recipe);
                } else {
                    document.querySelector('.recipe-container').innerHTML = '<p>Recipe not found.</p>';
                }
            })
            .catch(error => {
                console.error('Error loading recipe:', error);
                document.querySelector('.recipe-container').innerHTML = '<p>Error loading recipe. Please try again later.</p>';
            });
    } else {
        document.querySelector('.recipe-container').innerHTML = '<p>No recipe selected.</p>';
    }

    // Function to display the recipe details
    function displayRecipe(recipe) {
        document.getElementById('recipeName').textContent = recipe.name;
        document.getElementById('recipeImage').src = recipe.image;
        document.getElementById('recipeImage').alt = recipe.name;
        document.getElementById('recipeDescription').textContent = recipe.description;

        // Display ingredients
        const ingredientsList = document.getElementById('ingredientsList');
        recipe.ingredients.forEach(ingredient => {
            const li = document.createElement('li');
            li.textContent = ingredient;
            ingredientsList.appendChild(li);
        });

        // Display instructions
        const instructionsList = document.getElementById('instructionsList');
        recipe.instructions.forEach(instruction => {
            const li = document.createElement('li');
            li.textContent = instruction;
            instructionsList.appendChild(li);
        });
    }
});
