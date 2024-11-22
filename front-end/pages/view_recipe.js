//veiw_recipe.js
document.addEventListener('DOMContentLoaded', function () {
    // Get the recipe ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get('id');
    
    if (!recipeId) {
        console.error('Recipe ID not found in URL.');
        return;
    }

    // Fetch the recipe details using the ID
    async function fetchRecipeDetails() {
        try {
            const response = await fetch(`http://localhost:3000/api/recipes/${recipeId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch recipe details.');
            }

            const recipe = await response.json();

            // Populate the HTML with the recipe data
            document.getElementById('recipe-title').textContent = recipe.title;
            document.getElementById('recipe-image').src = recipe.image || 'placeholder.jpg';
            document.getElementById('recipe-description').textContent = recipe.description;
            document.getElementById('recipe-prep-time').textContent = recipe.preparation_time;

            // Populate ingredients
            const ingredientsList = document.getElementById('recipe-ingredients');
            const ingredients = JSON.parse(recipe.ingredients);
            ingredients.forEach(ingredient => {
                const li = document.createElement('li');
                li.textContent = `${ingredient.amount} of ${ingredient.id}`;
                ingredientsList.appendChild(li);
            });

            // Populate instructions
            document.getElementById('recipe-instructions').textContent = JSON.parse(recipe.instructions);

        } catch (error) {
            console.error('Error fetching recipe details:', error);
        }
    }

    // Load recipe details
    fetchRecipeDetails();
});
