// Wait until the HTML document is fully loaded before running the script
document.addEventListener('DOMContentLoaded', function () {
    // Fetch and display existing recipes immediately after loading
    fetchRecipes();

    // Event listener for adding a new recipe
    document.getElementById('add-recipe-form').addEventListener('submit', function (e) {
        e.preventDefault(); // Prevent the default form submission behavior
         // Collect data from the form inputs
        const newRecipe = {
            title: document.getElementById('add-title').value,
            ingredients: document.getElementById('add-ingredients').value.split(','),
            instructions: document.getElementById('add-instructions').value,
            cookingTime: parseInt(document.getElementById('add-cookingTime').value)
        };
        // Call function to add a new recipe
        addRecipe(newRecipe);
    });

    // Event listener for updating an existing recipe
    document.getElementById('edit-recipe-form').addEventListener('submit', function (e) {
        e.preventDefault();    // Prevent the default form submission behavior
        // Collect updated data from the form inputs
        const updatedRecipe = {
            title: document.getElementById('update-title').value,
            ingredients: document.getElementById('update-ingredients').value,
            instructions: document.getElementById('update-instructions').value,
            cookingTime: parseInt(document.getElementById('update-cookingTime').value)
        };
        const id = document.getElementById('update-id').value; // Retrieve the recipe ID
    
        // Call function to submit the updated recipe
        submitUpdate(updatedRecipe, id);
    });
});


// Function to fetch and display recipes from the server
function fetchRecipes() {
    fetch("http://localhost:5000/api/recipes")
        .then(response => response.json()) // Parse the JSON response
        .then(data => {
            displayRecipes(data);// Display the recipes on the page
        })
        .catch(error => console.error("Error fetching recipes:", error)); // Log errors if fetch fails
}

// Function to display recipes in a table
function displayRecipes(recipes) {
    const table = document.createElement('table'); // Create a new table element

    // Create and append table headers
    const headerRow = table.insertRow();
    headerRow.innerHTML = '<th>Title</th><th>Ingredients</th><th>Instructions</th><th>Cooking Time</th><th>Actions</th>';

    // Iterate through each recipe and append a row to the table
    recipes.forEach(recipe => {
        const row = table.insertRow();
        row.innerHTML = `
            <td>${recipe.title}</td>
            <td>${recipe.ingredients.join(', ')}</td>
            <td>${recipe.instructions}</td>
            <td>${recipe.cookingTime}</td>
        `;

        // Create and append action buttons for updating and deleting recipes
        const actionsCell = row.insertCell();
        actionsCell.appendChild(createButton('Update', () => showUpdateForm(recipe._id)));
        actionsCell.appendChild(createButton('Delete', () => deleteRecipe(recipe._id)));
    });

    // Clear existing content and add the newly created table to the page

    const recipeTableDiv = document.getElementById('recipe-table');
    recipeTableDiv.innerHTML = '';  // Clear existing content
    recipeTableDiv.appendChild(table);  // Add the newly created table
}

// Function to create a button element
function createButton(text, action) {
    const button = document.createElement('button');
    button.textContent = text; // Set button text
    button.onclick = action; // Set action to perform on click
    return button;
}

// Function to add a new recipe to the server
function addRecipe(recipe) {
    fetch("http://localhost:5000/api/recipes", {
        method: 'POST', // HTTP method
        headers: { 'Content-Type': 'application/json' }, // Set content type to JSON
        body: JSON.stringify(recipe) // Send recipe data as JSON string
    })
    .then(() => {
        fetchRecipes();  // Refresh the recipe list
        // Clear form fields after submission
        document.getElementById('add-title').value = '';
        document.getElementById('add-ingredients').value = '';
        document.getElementById('add-instructions').value = '';
        document.getElementById('add-cookingTime').value = '';
    })
    .catch(error => console.error('Error adding recipe:', error)); // Log errors if fetch fails
}

// Function to show the update form with pre-filled recipe data
function showUpdateForm(id) {
    fetch(`http://localhost:5000/api/recipes/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`); // Properly handle a non-200 response
            }
            return response.json(); // Parse JSON response
        })
        .then(recipe => {
            // Pre-fill form inputs with recipe data
            document.getElementById('update-title').value = recipe.title;
            document.getElementById('update-ingredients').value = recipe.ingredients.join(',');
            document.getElementById('update-instructions').value = recipe.instructions;
            document.getElementById('update-cookingTime').value = recipe.cookingTime;
            document.getElementById('update-id').value = recipe._id;  
            document.getElementById('update-form').style.display = 'block'; // Show the update form
        })
        .catch(error => console.error('Error fetching recipe for update:', error));
}

// Function to submit updated recipe data to the server
function submitUpdate(updatedRecipe, id) {
    fetch(`http://localhost:5000/api/recipes/${id}`, {
        method: 'PUT', // HTTP method
        headers: {
            'Content-Type': 'application/json' // Set content type to JSON
        },
        body: JSON.stringify(updatedRecipe)  // Send updated recipe data as JSON string
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText); // Handle non-200 responses
        }
        return response.json();  // Parse JSON response
    })
    .then(data => {
        fetchRecipes(); // Refresh the recipe list
        document.getElementById('update-form').style.display = 'none'; // Hide the update form
    })
    .catch(error => {
        console.error('Error updating recipe:', error);  // Log errors if fetch fails
    });
}

// Function to delete a recipe from the server
function deleteRecipe(id) {
    if (confirm('Are you sure you want to delete this recipe?')) { // Confirm before deleting
        fetch(`http://localhost:5000/api/recipes/${id}`, {
            method: 'DELETE' // HTTP method
        })
        .then(() => {
            fetchRecipes();  // Refresh the recipe list
        })
        .catch(error => console.error('Error deleting recipe:', error)); // Log errors if fetch fails
    }
}
