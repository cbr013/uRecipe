document.addEventListener('DOMContentLoaded', function () {
    // search container start

    let offset = 0;
    const limit = 20;
    let isLoading = false;
    const loadedRecipeIds = new Set(); // New: Set to keep track of loaded recipes

    // Fetch recipes by creator ID
    async function fetchRecipesByCreator() {
        if (isLoading) return;
        isLoading = true;

        const creatorId = localStorage.getItem('currentUser'); // Assuming you store the current user's ID in localStorage

        if (!creatorId) {
            console.error('User ID not found. You must be logged in to view your recipes.');
            return;
        }

        try {
            console.log('Fetching recipes by creator ID:', creatorId); // Debug statement
            const response = await fetch(`http://localhost:3000/api/recipes/creator/${creatorId}`); // Updated URL to match the new route
            const recipes = await response.json();

            console.log('Received recipes:', recipes); // Debug statement

            if (recipes.length > 0) {
                // Filter out recipes that have already been loaded
                const newRecipes = recipes.filter(recipe => !loadedRecipeIds.has(recipe.recipe_id));

                if (newRecipes.length > 0) {
                    // Update the offset only for the newly added recipes
                    offset += newRecipes.length;

                    // Add the newly loaded recipe IDs to the Set
                    newRecipes.forEach(recipe => loadedRecipeIds.add(recipe.recipe_id));

                    // Inject the filtered recipes
                    injectRecipes(newRecipes);
                }
            } else {
                // No more recipes to load
                if (offset === 0) {
                    // Only show the "No recipes found" message if this is the initial load
                    document.getElementById('recipeContainer').innerHTML = '<p>No recipes found. Try adding some recipes first!</p>';
                }
            }

        } catch (error) {
            console.error('Error fetching recipes by creator ID:', error);
        } finally {
            isLoading = false;
        }
    }


    // Inject recipes into the results container
    function injectRecipes(recipes) {
        const recipeContainer = document.getElementById('recipeContainer');

        recipes.forEach(recipe => {
            const recipeCard = document.createElement('div');
            recipeCard.className = 'recipe-card';
            recipeCard.innerHTML = `
                <img src="${recipe.image || 'placeholder.jpg'}" alt="${recipe.title}">
                <h3>${recipe.title}</h3>
                <p>${recipe.description || ''}</p>
                <a href="view_recipe.html?id=${recipe.recipe_id}" class="view-recipe-btn">View Recipe</a>
            `;
            recipeContainer.appendChild(recipeCard);
        });
    }

    // Infinite scroll functionality
    window.addEventListener('scroll', () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
            // Only fetch more recipes if not already in the process of loading
            if (!isLoading) {
                fetchRecipesByCreator();
            }
        }
    });

    // Initial load of data
    fetchRecipesByCreator();

    // search container end
});
