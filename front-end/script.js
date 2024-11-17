// Global Variables
let currentIndex = 0; // Start at the first recipe
let recipes = []; // Array to hold recipes

// Load Recipes
async function loadRecipes() {
    try {
        const response = await fetch('recipes.json'); // Path to JSON file (same directory)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        recipes = await response.json(); // Store recipes globally
        console.log('Loaded recipes:', recipes); // Debugging: log recipes
        displayRecipes(); // Display recipes in the carousel
    } catch (error) {
        console.error('Error loading recipes:', error);
    }
}

// Display Recipes in Carousel
function displayRecipes() {
    const carouselContainer = document.getElementById('carouselContainer');
    carouselContainer.innerHTML = ''; // Clear existing content

    if (recipes.length === 0) {
        console.log('No recipes to display'); // Debugging: log no recipes
        return; // Exit if no recipes are found
    }

    // Loop through the recipes array and create recipe cards
    recipes.forEach((recipe) => {
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('recipe-card');
        recipeCard.setAttribute("data-recipe-name", recipe.title);
        recipeCard.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}">
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
        const response = await fetch('recipes.json'); // Path to JSON file
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

// Event Listeners
document.addEventListener('DOMContentLoaded', loadRecipes);
document.getElementById('prevBtn').addEventListener('click', () => changeRecipe(-1));
document.getElementById('nextBtn').addEventListener('click', () => changeRecipe(1));pe(1));
