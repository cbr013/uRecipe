// Global Variables
let currentIndex = 0; // Start at the first recipe
let recipes = []; // Array to hold recipes

// Recipe Search Function
function searchRecipes() {
    let searchQuery = document.getElementById("searchInput").value.toLowerCase();
    let recipeCards = document.querySelectorAll(".recipe-card");

    recipeCards.forEach(card => {
        let recipeName = card.getAttribute("data-recipe-name").toLowerCase();
        if (recipeName.includes(searchQuery)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });

    // Reset carousel index after search
    currentIndex = 0; 
    updateCarousel(); // Update the carousel after filtering
}

// Load Recipes
async function loadRecipes() {
    try {
        const response = await fetch('path/to/your/recipes.json'); // Update with the actual path
        recipes = await response.json(); // Store recipes globally
        displayRecipes(); // Display recipes in the carousel
    } catch (error) {
        console.error('Error loading recipes:', error);
    }
}

// Display Recipes in Carousel
function displayRecipes() {
    const carouselContainer = document.getElementById('carouselContainer');
    carouselContainer.innerHTML = ''; // Clear existing content

    // Loop through the recipes array and create recipe cards
    recipes.forEach((recipe) => {
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('recipe-card');
        recipeCard.setAttribute("data-recipe-name", recipe.name); // Set data attribute for searching
        recipeCard.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.name}">
            <h3>${recipe.name}</h3>
            <p>${recipe.description}</p>
            <a href="pages/recipe.html?id=${recipe.id}" class="view-recipe-btn">View Recipe</a>
        `;
        carouselContainer.appendChild(recipeCard);
    });

    updateCarousel(); // Update carousel to show the first set of recipes
}

// Update Carousel Position
function updateCarousel() {
    const carouselContainer = document.getElementById('carouselContainer');
    const recipeCards = document.querySelectorAll('.recipe-card');

    if (recipeCards.length === 0) return; // Prevent errors if there are no cards

    // Calculate the width of the carousel based on the number of cards
    const cardWidth = recipeCards[0].offsetWidth; // Get width of one card
    const offset = currentIndex * cardWidth;

    // Apply the offset to the carousel
    carouselContainer.style.transform = `translateX(-${offset}px)`;

    // Update button states
    document.querySelector('.prev').disabled = currentIndex === 0;
    document.querySelector('.next').disabled = currentIndex >= recipeCards.length - 1;
}

// Change Recipe (carousel navigation)
function changeRecipe(direction) {
    const recipeCards = document.querySelectorAll('.recipe-card');
    if (direction === 1 && currentIndex < recipeCards.length - 1) {
        currentIndex++;
    } else if (direction === -1 && currentIndex > 0) {
        currentIndex--;
    }
    updateCarousel(); // Update the carousel position
}

// Load Recipe Details (for the recipe page)
async function loadRecipeDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get('id');

    try {
        const response = await fetch('path/to/your/recipes.json'); // Update with the actual path
        const recipes = await response.json();
        const recipe = recipes.find(r => r.id == recipeId);

        if (recipe) {
            const recipeContainer = document.getElementById('recipeDetails');
            recipeContainer.innerHTML = `
                <h1>${recipe.name}</h1>
                <img src="${recipe.image}" alt="${recipe.name}">
                <h2>Ingredients</h2>
                <ul>
                    ${recipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                </ul>
                <h2>Instructions</h2>
                <p>${recipe.instructions}</p>
            `;
        } else {
            console.error('Recipe not found');
        }
    } catch (error) {
        console.error('Error loading recipe details:', error);
    }
}

// Call loadRecipes on page load
document.addEventListener('DOMContentLoaded', loadRecipes);

// Add event listeners for navigation buttons
document.getElementById('prevBtn').addEventListener('click', () => changeRecipe(-1));
document.getElementById('nextBtn').addEventListener('click', () => changeRecipe(1));
