document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('searchForm');
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');
    const searchQueryElement = document.getElementById('searchQuery');
    const resultsContainer = document.getElementById('resultsContainer');

    // Check if there is a search query in the URL (for when redirected to search page)
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('query');
    
    if (query) {
        searchInput.value = query; // Pre-fill the search box with the query
        searchQueryElement.textContent = query; // Display the search query
        performSearch(query);
    }

    // Event listener for form submission
    searchForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission (page reload)
        
        const query = searchInput.value.trim(); // Get search query

        if (query) {
            searchQueryElement.textContent = query; // Update displayed search query

            // Update URL to show the query in the address bar
            const newUrl = new URL(window.location);
            newUrl.searchParams.set('query', query);
            window.history.pushState({}, '', newUrl);

            // Perform the search
            performSearch(query);
        } else {
            resultsContainer.innerHTML = '<p>Please enter a search term.</p>';
        }
    });

    // Function to perform search and display results
    function performSearch(query) {
        fetch('../recipes.json') // Adjust path to your recipes.json if necessary
            .then(response => response.json())
            .then(recipes => {
                // Filter recipes based on the search query
                const filteredRecipes = recipes.filter(recipe =>
                    recipe.name.toLowerCase().includes(query.toLowerCase())
                );
                // Display the filtered recipes
                displayResults(filteredRecipes);
            })
            .catch(error => {
                console.error('Error fetching recipes:', error);
                resultsContainer.innerHTML = '<p>There was an error loading recipes. Please try again later.</p>';
            });
    }

    // Function to display results in the DOM
    function displayResults(recipes) {
        resultsContainer.innerHTML = ''; // Clear any existing results

        if (recipes.length === 0) {
            resultsContainer.innerHTML = '<p>No recipes found</p>';
        } else {
            recipes.forEach(recipe => {
                const recipeCard = document.createElement('div');
                recipeCard.classList.add('recipe-card');
                recipeCard.innerHTML = `
                    <img src="${recipe.image}" alt="${recipe.name}">
                    <h3>${recipe.name}</h3>
                    <p>${recipe.description}</p>
                    <a href="recipe.html?id=${recipe.id}" class="view-recipe-btn">View Recipe</a>
                `;
                resultsContainer.appendChild(recipeCard);
            });
        }
    }
});
