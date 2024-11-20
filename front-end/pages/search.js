document.addEventListener('DOMContentLoaded', function() {
    // Fetch ingredients from backend
    async function fetchIngredients() {
        try {
            const response = await fetch('http://localhost:3000/api/ingredients');
            const ingredients = await response.json();

            if (response.ok) {
                injectIngredients(ingredients);
            } else {
                console.error('Failed to fetch ingredients:', response.message);
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

            ingredientBox.addEventListener('click', function() {
                const selectedIngredients = document.querySelectorAll('.ingredient-box.selected');
                if (ingredientBox.classList.contains('selected')) {
                    ingredientBox.classList.remove('selected');
                } else if (selectedIngredients.length < 10) {
                    ingredientBox.classList.add('selected');
                } else {
                    document.getElementById('ingredientLimitWarning').style.display = 'block';
                    setTimeout(() => {
                        document.getElementById('ingredientLimitWarning').style.display = 'none';
                    }, 2000);
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
});
