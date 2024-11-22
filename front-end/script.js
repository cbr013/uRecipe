// Global Variables
let currentIndex = 0; // Start at the first recipe
let recipes = []; // Array to hold recipes

// Load Recipes
async function loadRecipes() {
    try {
        console.log("Attempting to load recipes...");
        const response = await fetch('http://localhost:3000/api/recipes/featured'); // Use '../' to access from other pages

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
    console.log("Displaying recipes...");
    const carouselContainer = document.getElementById('carouselContainer');
    if (!carouselContainer) {
        console.error("Could not find element with ID 'carouselContainer'");
        return;
    }
    carouselContainer.innerHTML = ''; // Clear existing content

    if (recipes.length === 0) {
        console.log('No recipes to display'); // Debugging: log no recipes
        return; // Exit if no recipes are found
    }

    // Loop through the recipes array and create recipe cards
    recipes.forEach((recipe) => {
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('recipe-card');
        recipeCard.setAttribute("data-recipe-name", recipe.name);
        recipeCard.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.name}">
            <h3>${recipe.name}</h3>
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
    console.log("Updating carousel...");
    const carouselContainer = document.getElementById('carouselContainer');
    const recipeCards = document.querySelectorAll('.recipe-card');
    if (recipeCards.length === 0) {
        console.warn("No recipe cards found");
        return; // Prevent errors if there are no cards
    }
    // Calculate the width of the carousel based on the number of cards
    const cardWidth = recipeCards[0].offsetWidth + 20; // Get width of one card including margin
    const offset = currentIndex * cardWidth;
    // Apply the offset to the carousel
    carouselContainer.style.transform = `translateX(-${offset}px)`;
    // Update button states if they exist
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    if (prevBtn) prevBtn.disabled = currentIndex === 0 && recipeCards.length <= 1;
    if (nextBtn) nextBtn.disabled = currentIndex === recipeCards.length - 1 && recipeCards.length <= 1;
}

// Carousel Navigation Function
function changeRecipe(direction) {
    console.log(`Changing recipe, direction: ${direction}`);
    const recipeCards = document.querySelectorAll('.recipe-card');
    if (recipeCards.length === 0) {
        console.warn("No recipe cards available to change");
        return;
    }

    if (direction === 1) {
        currentIndex = (currentIndex + 1) % recipeCards.length;
    } else if (direction === -1) {
        currentIndex = (currentIndex - 1 + recipeCards.length) % recipeCards.length;
    }
    updateCarousel(); // Update the carousel position
}

// User Login State Handling
document.addEventListener('DOMContentLoaded', () => {
    console.log("Checking login state...");
    const currentUser = localStorage.getItem('currentUser');
    const notLoggedInLinks = document.getElementById('notLoggedInLinks');
    const loggedInLinks = document.getElementById('loggedInLinks');
    const userInfo = document.getElementById('user-info');

    if (currentUser) {
        console.log(`User is logged in as: ${currentUser}`);
        if (notLoggedInLinks) notLoggedInLinks.style.display = 'none';
        if (loggedInLinks) loggedInLinks.style.display = 'block';
        if (userInfo) userInfo.textContent = `Welcome, ${currentUser}`;

        // Populate profile information if on profile page
        if (document.getElementById('usernameDisplay')) {
            console.log("Populating user profile information...");
            document.getElementById('usernameDisplay').textContent = currentUser;
            document.getElementById('usernameInfo').textContent = currentUser;

            // Assuming we have user data stored locally for email
            const userData = JSON.parse(localStorage.getItem(currentUser));
            if (userData && userData.email) {
                document.getElementById('emailInfo').textContent = userData.email;
            } else {
                console.warn("User data or email not found in localStorage");
                document.getElementById('emailInfo').textContent = 'No email available';
            }
        }
    } else {
        console.warn("No user logged in");
        if (notLoggedInLinks) notLoggedInLinks.style.display = 'block';
        if (loggedInLinks) loggedInLinks.style.display = 'none';

        // Redirect to login page if user is not logged in and on profile page
        if (document.getElementById('usernameDisplay')) {
            alert('You must log in first!');
            window.location.href = '../login/login.html';
        }
    }

    // Logout functionality
    const logoutLink = document.getElementById('logoutLink');
    const logoutButton = document.getElementById('logoutButton');
    const logoutHandler = () => {
        console.log("Logging out...");
        localStorage.removeItem('currentUser');
        alert('Logged out successfully!');
        window.location.href = './landing_page.html';
    };

    if (logoutLink) {
        logoutLink.addEventListener('click', logoutHandler);
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', logoutHandler);
    }
});

// Event Listeners for Carousel Buttons
document.addEventListener('DOMContentLoaded', () => {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => changeRecipe(-1));
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', () => changeRecipe(1));
    }
});
