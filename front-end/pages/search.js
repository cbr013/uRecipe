document.addEventListener('DOMContentLoaded', function () {

    // ingredient container start

    // Fetch ingredients from backend
    async function fetchIngredients() {
        try {
            console.log('Fetching ingredients...');
            const response = await fetch('http://localhost:3000/api/ingredients');
            const ingredients = await response.json();

            if (response.ok) {
                console.log('Ingredients fetched successfully:', ingredients);
                injectIngredients(ingredients);
            } else {
                console.error('Failed to fetch ingredients:', response.status, response.statusText, ingredients);
            }
        } catch (error) {
            console.error('Error fetching ingredients:', error);
        }
    }

    // Inject ingredients into the ingredients container
    function injectIngredients(ingredients) {
        const ingredientsContainer = document.getElementById('ingredientsContainer');
        ingredientsContainer.innerHTML = ''; // Clear previous data
        ingredients.forEach(ingredient => {
            const ingredientBox = document.createElement('div');
            ingredientBox.classList.add('ingredient-box');
            ingredientBox.textContent = ingredient.name;
            ingredientBox.dataset.ingredientId = ingredient.ingredient_id; // Store ID

            ingredientBox.addEventListener('click', function () {
                const selectedIngredients = document.querySelectorAll('.ingredient-box.selected');
                if (ingredientBox.classList.contains('selected')) {
                    ingredientBox.classList.remove('selected');
                } else if (selectedIngredients.length < 10) {
                    ingredientBox.classList.add('selected');
                    addIngredientToSelectedList(ingredient.name, ingredient.ingredient_id);
                } else {
                    alert('You can only select up to 10 ingredients.');
                }
            });

            ingredientsContainer.appendChild(ingredientBox);
        });
    }

    fetchIngredients(); // Call fetch function to get ingredients from backend

    // Real-time filtering of ingredients
    const ingredientSearchInput = document.getElementById('ingredientSearchInput');
    ingredientSearchInput.addEventListener('input', filterIngredients);

    function filterIngredients() {
        const searchValue = ingredientSearchInput.value.toLowerCase();
        const ingredientBoxes = document.querySelectorAll('.ingredient-box');

        ingredientBoxes.forEach(box => {
            if (box.textContent.toLowerCase().includes(searchValue)) {
                box.style.display = 'block';
            } else {
                box.style.display = 'none';
            }
        });
    }
    // ingredient container end

    // tags container start

    // Fetch tags from backend
    async function fetchTags() {
        try {
            console.log('Fetching tags...');
            const response = await fetch('http://localhost:3000/api/tags');
            const tags = await response.json();

            if (response.ok) {
                console.log('Tags fetched successfully:', tags);
                injectTags(tags);
            } else {
                console.error('Failed to fetch tags:', response.status, response.statusText, tags);
            }
        } catch (error) {
            console.error('Error fetching tags:', error);
        }
    }

    // Inject tags into the tags container
    function injectTags(tags) {
        const tagsContainer = document.getElementById('tagsContainer');
        tagsContainer.innerHTML = ''; // Clear previous data
        tags.forEach(tag => {
            const tagBox = document.createElement('div');
            tagBox.classList.add('tag-box');
            tagBox.textContent = tag.name;
            tagBox.dataset.tagId = tag.tag_id; // Store ID

            tagBox.addEventListener('click', function () {
                const selectedTags = document.querySelectorAll('.tag-box.selected');
                if (tagBox.classList.contains('selected')) {
                    tagBox.classList.remove('selected');
                } else if (selectedTags.length < 10) {
                    tagBox.classList.add('selected');
                } else {
                    alert('You can only select up to 10 tags.');
                }
            });

            tagsContainer.appendChild(tagBox);
        });
    }

    fetchTags(); // Call fetch function to get tags from backend

    // Real-time filtering of tags
    const tagSearchInput = document.getElementById('tagSearchInput');
    tagSearchInput.addEventListener('input', filterTags);

    function filterTags() {
        const searchValue = tagSearchInput.value.toLowerCase();
        const tagBoxes = document.querySelectorAll('.tag-box');

        tagBoxes.forEach(box => {
            if (box.textContent.toLowerCase().includes(searchValue)) {
                box.style.display = 'block';
            } else {
                box.style.display = 'none';
            }
        });
    }

    // tags container end

    // search container start

    let offset = 0;
    const limit = 20;
    let isLoading = false;
    const loadedRecipeIds = new Set();  // New: Set to keep track of loaded recipes

    // Fetch ingredients from backend
    async function fetchIngredients() {
        try {
            console.log('Fetching ingredients...');
            const response = await fetch('http://localhost:3000/api/ingredients');
            const ingredients = await response.json();

            if (response.ok) {
                injectIngredients(ingredients);
            } else {
                console.error('Failed to fetch ingredients:', response.status, response.statusText, ingredients);
            }
        } catch (error) {
            console.error('Error fetching ingredients:', error);
        }
    }

    // Inject ingredients into the ingredients container
    function injectIngredients(ingredients) {
        const ingredientsContainer = document.getElementById('ingredientsContainer');
        ingredientsContainer.innerHTML = '';
        ingredients.forEach(ingredient => {
            const ingredientBox = document.createElement('div');
            ingredientBox.classList.add('ingredient-box');
            ingredientBox.textContent = ingredient.name;
            ingredientBox.dataset.ingredientId = ingredient.ingredient_id;

            ingredientBox.addEventListener('click', function () {
                if (ingredientBox.classList.contains('selected')) {
                    ingredientBox.classList.remove('selected');
                } else {
                    ingredientBox.classList.add('selected');
                }
            });

            ingredientsContainer.appendChild(ingredientBox);
        });
    }

    // Fetch tags from backend
    async function fetchTags() {
        try {
            console.log('Fetching tags...');
            const response = await fetch('http://localhost:3000/api/tags');
            const tags = await response.json();

            if (response.ok) {
                injectTags(tags);
            } else {
                console.error('Failed to fetch tags:', response.status, response.statusText, tags);
            }
        } catch (error) {
            console.error('Error fetching tags:', error);
        }
    }

    // Inject tags into the tags container
    function injectTags(tags) {
        const tagsContainer = document.getElementById('tagsContainer');
        tagsContainer.innerHTML = '';
        tags.forEach(tag => {
            const tagBox = document.createElement('div');
            tagBox.classList.add('tag-box');
            tagBox.textContent = tag.name;
            tagBox.dataset.tagId = tag.tag_id;

            tagBox.addEventListener('click', function () {
                if (tagBox.classList.contains('selected')) {
                    tagBox.classList.remove('selected');
                } else {
                    tagBox.classList.add('selected');
                }
            });

            tagsContainer.appendChild(tagBox);
        });
    }

    // Fetch recipes from backend
    async function fetchRecipes() {
        if (isLoading) return;
        isLoading = true;

        const query = document.getElementById('searchInput').value || '';
        const selectedIngredients = Array.from(document.querySelectorAll('.ingredient-box.selected')).map(box => box.dataset.ingredientId);
        const selectedTags = Array.from(document.querySelectorAll('.tag-box.selected')).map(box => box.dataset.tagId);

        const params = new URLSearchParams({
            name: query,
            ingredients: selectedIngredients.join(','),
            tags: selectedTags.join(','),
            offset,
            limit
        });

        try {
            console.log('Fetching recipes with parameters:', params.toString()); // Debug statement
            const response = await fetch(`http://localhost:3000/api/recipes/search?${params}`);
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
                    document.getElementById('resultsContainer').innerHTML = '<p>No recipes found. Try different search terms or filters.</p>';
                }
            }

        } catch (error) {
            console.error('Error fetching recipes:', error);
        } finally {
            isLoading = false;
        }
    }

    // Inject recipes into the results container
    function injectRecipes(recipes) {
        const resultsContainer = document.getElementById('resultsContainer');

        recipes.forEach(recipe => {
            const recipeCard = document.createElement('div');
            recipeCard.className = 'recipe-card';
            recipeCard.innerHTML = `
                <img src="${recipe.image ? `../../backend/images/recipes/${recipe.image}` : '../../backend/images/recipes/placeholder.jpg'}" alt="${recipe.title}">
                <h3>${recipe.title}</h3>
                <p>${recipe.description || ''}</p>
                <a href="view_recipe.html?id=${recipe.recipe_id}" class="view-recipe-btn">View Recipe</a>
            `;
            resultsContainer.appendChild(recipeCard);
        });
    }

    // Handle form submission for search
    document.getElementById('searchForm').addEventListener('submit', (e) => {
        e.preventDefault();
        offset = 0;
        loadedRecipeIds.clear(); // Clear the loaded recipes Set to allow new results
        document.getElementById('resultsContainer').innerHTML = '';
        fetchRecipes();
    });

    // Infinite scroll functionality
    window.addEventListener('scroll', () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
            // Only fetch more recipes if not already in the process of loading
            if (!isLoading) {
                fetchRecipes();
            }
        }
    });

    // Initial load of data
    fetchRecipes();

    // search container end
})