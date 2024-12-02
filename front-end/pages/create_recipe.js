document.addEventListener('DOMContentLoaded', () => {

    // ---------------------------------------------------------- LOG USER ----------------------------------------------------------
    const currentUser = localStorage.getItem('currentUser');
    const notLoggedInLinks = document.getElementById('notLoggedInLinks');
    const loggedInLinks = document.getElementById('loggedInLinks');
    const userInfo = document.getElementById('user-info');

    if (currentUser) {
        notLoggedInLinks.style.display = 'none';
        loggedInLinks.style.display = 'block';
        userInfo.textContent = `Welcome, ${currentUser}`;
    } else {
        notLoggedInLinks.style.display = 'block';
        loggedInLinks.style.display = 'none';
    }

    document.getElementById('logoutLink').addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        alert('Logged out successfully!');
        window.location.href = '../landing_page.html';
    });

    // ---------------------------------------------------------- ingredients ----------------------------------------------------------

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
                } else if (selectedIngredients.length < 40) {
                    ingredientBox.classList.add('selected');
                    addIngredientToSelectedList(ingredient.name, ingredient.ingredient_id);
                } else {
                    alert('You can only select up to 40 ingredients.');
                }
            });

            ingredientsContainer.appendChild(ingredientBox);
        });
    }


    // Add selected ingredient to the list with an input for quantity
    function addIngredientToSelectedList(ingredientName, ingredientId) {
        const selectedIngredientsContainer = document.getElementById('selectedIngredientsContainer');

        // Create a container for the selected ingredient and its quantity input
        const ingredientRow = document.createElement('div');
        ingredientRow.classList.add('ingredient-row');

        const ingredientNameDiv = document.createElement('div');
        ingredientNameDiv.classList.add('ingredient-name');
        ingredientNameDiv.textContent = ingredientName;
        ingredientNameDiv.dataset.ingredientId = ingredientId; // Store ID

        const ingredientAmountInput = document.createElement('input');
        ingredientAmountInput.type = 'text';
        ingredientAmountInput.placeholder = 'Enter amount (e.g., 200g)';
        ingredientAmountInput.classList.add('ingredient-amount');

        // Append the name and input to the row
        ingredientRow.appendChild(ingredientNameDiv);
        ingredientRow.appendChild(ingredientAmountInput);

        // Append the row to the container
        selectedIngredientsContainer.appendChild(ingredientRow);
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


    // Add new ingredient
    document.getElementById('addNewIngredientButton').addEventListener('click', async () => {
        const ingredientName = prompt("Enter the new ingredient name:");
        if (!ingredientName) {
            console.warn('No ingredient name entered.');
            return;
        }

        try {
            console.log('Adding new ingredient:', ingredientName);
            const response = await fetch('http://localhost:3000/api/ingredients', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: ingredientName }),
            });

            const data = await response.json();
            if (response.ok) {
                console.log('Ingredient added successfully:', data);
                alert('Ingredient added successfully!');
                await fetchIngredients(); // Refresh ingredient list and wait for completion
            } else {
                console.error('Failed to add ingredient:', response.status, response.statusText, data);
                alert(`Failed to add ingredient: ${data.message}`);
            }
        } catch (error) {
            console.error('Error adding ingredient:', error);
        }
    });

    // ---------------------------------------------------------- Tags ----------------------------------------------------------


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

    // Add new tag
    document.getElementById('addNewTagButton').addEventListener('click', async () => {
        const tagName = prompt("Enter the new tag name:");
        if (!tagName) {
            console.warn('No tag name entered.');
            return;
        }

        try {
            console.log('Adding new tag:', tagName);
            const response = await fetch('http://localhost:3000/api/tags', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: tagName }),
            });

            const data = await response.json();
            if (response.ok) {
                console.log('Tag added successfully:', data);
                alert('Tag added successfully!');
                await fetchTags(); // Refresh tag list and wait for completion
            } else {
                console.error('Failed to add tag:', response.status, response.statusText, data);
                alert(`Failed to add tag: ${data.message}`);
            }
        } catch (error) {
            console.error('Error adding tag:', error);
        }
    });

    // ---------------------------------------------------------- submission ----------------------------------------------------------

    // On form submission, gather selected ingredients and their quantities
    document.getElementById('createRecipeForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const currentUser = localStorage.getItem('currentUser');
        if (!currentUser) {
            alert('You must be logged in to create a recipe.');
            return;
        }

        // Gather selected ingredients
        const selectedIngredients = [];
        // Define `ingredientRows` inside the event listener to make sure it's available in scope
        const ingredientRows = document.querySelectorAll('.ingredient-row');

        ingredientRows.forEach(row => {
            // Make sure ingredientId is properly extracted
            const ingredientNameElement = row.querySelector('.ingredient-name');
            const ingredientId = ingredientNameElement ? ingredientNameElement.dataset.ingredientId : null;

            if (!ingredientId) {
                console.error('Missing ingredient ID for:', ingredientNameElement.textContent);
                alert(`There is an issue with the ingredient: ${ingredientNameElement.textContent}`);
                return;
            }

            const amount = row.querySelector('.ingredient-amount').value.trim();
            if (amount) {
                selectedIngredients.push({ id: ingredientId, amount });
            } else {
                alert(`Please enter an amount for ${ingredientNameElement.textContent}`);
                return; // If any amount is missing, halt the form submission
            }
        });

        // Gather selected tags
        const selectedTags = [];
        const tagBoxes = document.querySelectorAll('.tag-box.selected');
        tagBoxes.forEach(tagBox => {
            const tagId = tagBox.dataset.tagId;
            if (tagId) {
                selectedTags.push(tagId);
            }
        });

        // Gather other form data
        const isHidden = document.getElementById('isHidden').checked;
        const title = document.getElementById('recipeTitle').value.trim();
        const description = document.getElementById('recipeDescription').value.trim();
        const instructions = document.getElementById('recipeInstructions').value.trim();
        const preparationTime = parseInt(document.getElementById('preparationTime').value);

        if (!title || !description || !instructions || !preparationTime) {
            alert('Please fill out all required fields.');
            return;
        }

        const recipeData = {
            creatorId: localStorage.getItem('currentUser'),  // Add the creatorId
            title,
            description,
            instructions,
            preparationTime,
            ingredients: selectedIngredients,
            tags: selectedTags, // Include selected tags
        };

        try {
            const response = await fetch('http://localhost:3000/api/recipes/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(recipeData),
            });

            const data = await response.json();
            if (response.ok) {
                alert('Recipe created successfully!');
                // Optionally redirect to another page or clear the form
            } else {
                console.error('Failed to create recipe:', response.status, response.statusText, data);
                alert(`Failed to create recipe: ${data.message}`);
            }
        } catch (error) {
            console.error('Error creating recipe:', error);
        }
    });
});




// Ensure these functions are defined and ready to use
function filterIngredients() {
    const searchValue = document.getElementById('ingredientSearchInput').value.toLowerCase();
    const ingredientBoxes = document.querySelectorAll('.ingredient-box');

    ingredientBoxes.forEach(box => {
        if (box.textContent.toLowerCase().includes(searchValue)) {
            box.style.display = 'block';
        } else {
            box.style.display = 'none';
        }
    });
}

function filterTags() {
    const searchValue = document.getElementById('tagSearchInput').value.toLowerCase();
    const tagBoxes = document.querySelectorAll('.tag-box');

    tagBoxes.forEach(box => {
        if (box.textContent.toLowerCase().includes(searchValue)) {
            box.style.display = 'block';
        } else {
            box.style.display = 'none';
        }
    });
}