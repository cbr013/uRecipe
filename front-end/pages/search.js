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
                    <a href="view_recipe.html?id=${recipe.id}" class="view-recipe-btn">View Recipe</a>
                `;
                resultsContainer.appendChild(recipeCard);
            });
        }
    }

    // Ingredient data
    const ingredients = [
    "Salt", "Pepper", "Garlic", "Onion", "Olive Oil", "Butter", "Milk", "Eggs", "Flour", "Sugar", 
    "Basil", "Tomato", "Cheese", "Chicken", "Beef", "Pasta", "Rice", "Potato", "Carrot", "Broccoli",
    "Cilantro", "Thyme", "Rosemary", "Paprika", "Ginger", "Soy Sauce", "Parsley", "Oregano",
    "Cinnamon", "Nutmeg", "Vanilla Extract", "Baking Powder", "Baking Soda", "Yeast", "Honey", 
    "Brown Sugar", "Vinegar", "Lemon", "Lime", "Chili Powder", "Cumin", "Turmeric", "Mustard", 
    "Mayonnaise", "Ketchup", "Tomato Sauce", "Soybean Oil", "Sunflower Oil", "Coconut Oil", "Sesame Oil",
    "Cornstarch", "Allspice", "Almonds", "Walnuts", "Peanuts", "Cashews", "Hazelnuts", "Pine Nuts",
    "Raisins", "Dates", "Dried Cranberries", "Dried Apricots", "Apples", "Bananas", "Strawberries",
    "Blueberries", "Raspberries", "Blackberries", "Grapes", "Oranges", "Pineapple", "Coconut", 
    "Mango", "Papaya", "Peaches", "Pears", "Plums", "Cherries", "Kiwi", "Watermelon", "Cantaloupe",
    "Honeydew", "Spinach", "Kale", "Swiss Chard", "Arugula", "Romaine Lettuce", "Iceberg Lettuce",
    "Cabbage", "Cauliflower", "Zucchini", "Yellow Squash", "Eggplant", "Bell Pepper", "Jalapeno",
    "Habanero", "Green Beans", "Snow Peas", "Snap Peas", "Asparagus", "Artichoke", "Brussels Sprouts",
    "Leeks", "Scallions", "Shallots", "Radishes", "Beets", "Turnips", "Parsnips", "Celery", "Fennel",
    "Butternut Squash", "Acorn Squash", "Spaghetti Squash", "Pumpkin", "Sweet Potato", "Corn", 
    "Mushrooms", "Portobello Mushrooms", "Shiitake Mushrooms", "Oyster Mushrooms", "Enoki Mushrooms",
    "Tofu", "Tempeh", "Seitan", "Lentils", "Chickpeas", "Black Beans", "Kidney Beans", "Pinto Beans",
    "White Beans", "Butter Beans", "Lima Beans", "Green Lentils", "Red Lentils", "Yellow Lentils",
    "Quinoa", "Couscous", "Farro", "Bulgar", "Barley", "Oats", "Rolled Oats", "Steel Cut Oats",
    "Quinoa Flakes", "Polenta", "Grits", "Cornmeal", "Breadcrumbs", "Panko", "Crackers", "Tortilla",
    "Pita Bread", "Sourdough", "Baguette", "Ciabatta", "Focaccia", "Bagels", "English Muffins",
    "Croissants", "Wheat Bread", "White Bread", "Rye Bread", "Rice Noodles", "Egg Noodles", "Udon",
    "Soba", "Ramen", "Vermicelli", "Fettuccine", "Spaghetti", "Linguine", "Penne", "Rigatoni",
    "Tortellini", "Ravioli", "Gnocchi", "Lasagna Sheets", "Cheddar Cheese", "Mozzarella Cheese",
    "Parmesan Cheese", "Feta Cheese", "Goat Cheese", "Blue Cheese", "Brie", "Camembert", "Gruyere",
    "Provolone", "Ricotta", "Cream Cheese", "Cottage Cheese", "Sour Cream", "Yogurt", "Greek Yogurt",
    "Heavy Cream", "Whipping Cream", "Half and Half", "Evaporated Milk", "Condensed Milk", 
    "Buttermilk", "Ice Cream", "Chocolate Chips", "Cocoa Powder", "Baking Chocolate", "White Chocolate",
    "Dark Chocolate", "Milk Chocolate", "Gelatin", "Agar Agar", "Vanilla Beans", "Cardamom",
    "Star Anise", "Cloves", "Fennel Seeds", "Coriander", "Fenugreek", "Bay Leaves", "Saffron", 
    "Marjoram", "Herbes de Provence", "Curry Powder", "Garam Masala", "Fish Sauce", "Worcestershire Sauce",
    "Hot Sauce", "Chili Flakes", "Chili Paste", "Wasabi", "Miso Paste", "Tahini", "Peanut Butter",
    "Almond Butter", "Sesame Seeds", "Poppy Seeds", "Chia Seeds", "Flaxseeds", "Hemp Seeds",
    "Pumpkin Seeds", "Sunflower Seeds", "Breadcrumbs", "Panko Breadcrumbs", "Cornflakes", 
    "Rolled Oats", "Steel-Cut Oats", "Quick Oats", "Bran Flakes", "Wheat Germ", "Ghee",
    "Clarified Butter", "Lard", "Duck Fat", "Shortening", "Suet", "Pork Belly", "Bacon", 
    "Ham", "Prosciutto", "Salami", "Chorizo", "Sausage", "Pepperoni", "Turkey", "Duck",
    "Lamb", "Veal", "Ground Beef", "Ground Turkey", "Ground Pork", "Shrimp", "Prawns",
    "Scallops", "Mussels", "Clams", "Oysters", "Crab", "Lobster", "Tilapia", "Salmon",
    "Cod", "Haddock", "Halibut", "Trout", "Tuna", "Mahi Mahi", "Swordfish", "Seaweed",
    "Nori", "Kombu", "Wakame", "Caviar", "Anchovies", "Sardines", "Capers", "Gherkins",
    "Pickles", "Relish", "Horseradish", "Chutney", "Pesto", "Chimichurri", "Salsa",
    "Tomato Paste", "Crushed Tomatoes", "Diced Tomatoes", "Stewed Tomatoes", "Passata",
    "Chicken Broth", "Beef Broth", "Vegetable Broth", "Bouillon Cubes", "Stock Concentrate",
    "Water", "Sparkling Water", "Club Soda", "Tonic Water", "Coconut Water", "Apple Juice",
    "Orange Juice", "Pineapple Juice", "Cranberry Juice", "Tomato Juice", "Lemonade",
    "Iced Tea", "Green Tea", "Black Tea", "Herbal Tea", "Chai Tea", "Coffee Beans", 
    "Ground Coffee", "Espresso", "Instant Coffee", "Almond Milk", "Soy Milk", "Oat Milk",
    "Rice Milk", "Coconut Milk", "Cashew Milk", "Hazelnut Milk", "Maple Syrup", "Agave Syrup",
    "Molasses", "Corn Syrup", "Golden Syrup", "Jam", "Jelly", "Marmalade", "Peaches in Syrup",
    "Pears in Syrup", "Applesauce", "Pumpkin Puree", "Cranberry Sauce", "Barbecue Sauce",
    "Teriyaki Sauce", "Sweet and Sour Sauce", "Gravy", "Salted Butter", "Unsalted Butter",
    "Ghee", "Clarified Butter", "Shallot", "Caperberries", "Sriracha", "Liquid Smoke",
    "Truffle Oil", "Olives", "Pecorino", "Swiss Cheese", "Havarti", "Edam", "Manchego"
];


    // Inject ingredients into the ingredients container
    const ingredientsContainer = document.getElementById('ingredientsContainer');
    ingredients.forEach(ingredient => {
        // Create a wrapper div for each ingredient box
        const ingredientBox = document.createElement('div');
        ingredientBox.classList.add('ingredient-box');
        ingredientBox.textContent = ingredient;

        // Add click event to toggle selection
        ingredientBox.addEventListener('click', function() {
            // Count currently selected boxes
            const selectedIngredients = document.querySelectorAll('.ingredient-box.selected');
            if (ingredientBox.classList.contains('selected')) {
                // If already selected, deselect it
                ingredientBox.classList.remove('selected');
            } else if (selectedIngredients.length < 10) {
                // Select the box if less than 10 are currently selected
                ingredientBox.classList.add('selected');
            } else {
                // Show warning if limit exceeded
                document.getElementById('ingredientLimitWarning').style.display = 'block';
                setTimeout(() => {
                    document.getElementById('ingredientLimitWarning').style.display = 'none';
                }, 2000);
            }
        });

        // Append the box to the ingredients container
        ingredientsContainer.appendChild(ingredientBox);
    });

    // Handle real-time filtering of ingredients
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
});
