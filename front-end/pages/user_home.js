// Global Variables
let currentIndex = 0; // Start at the first recipe
let recipes = []; // Array to hold recipes

// Load Recipes (from localStorage and server)
async function loadRecipes() {
    const username = localStorage.getItem('currentUser');
    if (!username) {
        alert('You must log in first!');
        window.location.href = '/uRecipe-main/front-end/pages/login/login.html';
        return;
    }

    // Load user-specific recipes from localStorage
    const storedUserRecipes = JSON.parse(localStorage.getItem(username + '_recipes')) || [];
    
    // Fetch recipes from recipes.json (default server recipes)
    try {
        const response = await fetch('../recipes.json'); // Path to JSON file on server
        if (response.ok) {
            const serverRecipes = await response.json();
            // Merge server recipes with user-specific recipes
            recipes = [...serverRecipes, ...storedUserRecipes]; // Prioritize user recipes
            // Store the merged list back to localStorage for future reference
            localStorage.setItem('recipes', JSON.stringify(recipes)); // Store merged recipes
        }
    } catch (error) {
        console.error('Error loading recipes from server:', error);
    }

    displayRecipes(); // Display recipes in the carousel
}

// Display Recipes in Carousel
function displayRecipes() {
    const carouselContainer = document.getElementById('carouselContainer');
    carouselContainer.innerHTML = ''; // Clear existing content

    // Loop through the recipes array and create recipe cards
    recipes.forEach((recipe) => {
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('recipe-card');
        recipeCard.setAttribute("data-recipe-name", recipe.title);  // Use 'title' to match how recipes are stored
        recipeCard.innerHTML = `
            <img src="${recipe.image || 'default_image.jpg'}" alt="${recipe.title}">
            <h3>${recipe.title}</h3>
            <p>${recipe.description}</p>
            <a href="view_recipe.html?id=${recipe.id}" class="view-recipe-btn">View Recipe</a>
        `;
        carouselContainer.appendChild(recipeCard);
    });

    // Update initial carousel display and set navigation limits
    updateCarousel();
}

// Update Carousel Display
function updateCarousel() {
    const carouselContainer = document.getElementById('carouselContainer');
    const recipeCards = document.querySelectorAll('.recipe-card');
    if (recipeCards.length === 0) return; // Prevent errors if there are no cards
    // Calculate the width of the carousel based on the number of cards
    const cardWidth = recipeCards[0].offsetWidth + 20; // Get width of one card including margin
    const offset = currentIndex * cardWidth;
    // Apply the offset to the carousel
    carouselContainer.style.transform = `translateX(-${offset}px)`;
    // Update button states
    document.querySelector('.prev').disabled = currentIndex === 0 && recipeCards.length <= 1;
    document.querySelector('.next').disabled = currentIndex === recipeCards.length - 1 && recipeCards.length <= 1;
}

// Carousel Navigation Function
function changeRecipe(direction) {
    const recipeCards = document.querySelectorAll('.recipe-card');
    if (direction === 1) {
        currentIndex = (currentIndex + 1) % recipeCards.length;
    } else if (direction === -1) {
        currentIndex = (currentIndex - 1 + recipeCards.length) % recipeCards.length;
    }
    updateCarousel(); // Update the carousel position
}

// Load Recipe Details (for the recipe page)
async function loadRecipeDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get('id');
    try {
        const response = await fetch('../recipes.json'); // Update with the correct path to the file
        const recipes = await response.json();
        const recipe = recipes.find(r => r.id == recipeId);
        if (recipe) {
            const recipeContainer = document.getElementById('recipeDetails');
            recipeContainer.innerHTML = `
                <h1>${recipe.title}</h1>
                <img src="${recipe.image}" alt="${recipe.title}">
                <h2>Ingredients</h2>
                <ul>
                    ${recipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                </ul>
                <h2>Instructions</h2>
                <p>${recipe.instructions.join('<br>')}</p>
            `;
        } else {
            console.error('Recipe not found');
        }
    } catch (error) {
        console.error('Error loading recipe details:', error);
    }
}

// Add a new recipe (simulated via localStorage and updating recipes.json)
function addRecipe(newRecipe) {
    const username = localStorage.getItem('currentUser');
    if (!username) {
        alert('You must log in first!');
        return;
    }

    // Load user recipes from localStorage
    const userRecipes = JSON.parse(localStorage.getItem(username + '_recipes')) || [];
    userRecipes.push(newRecipe);  // Add new recipe to the local array
    localStorage.setItem(username + '_recipes', JSON.stringify(userRecipes));  // Store updated recipes in localStorage

    // Add the new recipe to the global recipes list (merging with server recipes)
    recipes = [...recipes, newRecipe];  // Add new recipe to the list
    displayRecipes();  // Re-display the recipes
}

// Event Listeners
document.addEventListener('DOMContentLoaded', loadRecipes);
document.getElementById('prevBtn').addEventListener('click', () => changeRecipe(-1));
document.getElementById('nextBtn').addEventListener('click', () => changeRecipe(1));

// Example of adding a new recipe (triggered by form or button)
document.getElementById('addRecipeBtn').addEventListener('click', () => {
    const newRecipe = {
        id: Date.now(),  // Unique ID based on timestamp
        title: 'New Recipe',
        description: 'A delicious new recipe!',
        image: 'path_to_image.jpg',
        ingredients: ['ingredient1', 'ingredient2'],
        instructions: ['Step 1', 'Step 2']
    };
    addRecipe(newRecipe);  // Add the new recipe
});
