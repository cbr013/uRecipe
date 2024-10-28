document.getElementById("loginButton").addEventListener("click", function() {
    console.log("Login button clicked!"); // Check if button click is registered

    const usernameInput = document.getElementById("username").value;
    const passwordInput = document.getElementById("password").value;

    // Check if inputs are correctly selected
    console.log("Username:", usernameInput);
    console.log("Password:", passwordInput);

    fetch('users.json') // Adjust path if necessary
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(users => {
            const user = users.find(user => 
                user.username === usernameInput && user.password === passwordInput
            );

            if (user) {
                console.log("Login successful, redirecting to user home page.");
                window.location.href = "../user_home.html"; // Adjust path if necessary
            } else {
                console.log("Invalid username or password.");
                alert("Invalid username or password.");
            }
        })
        .catch(error => {
            console.error("Error fetching user data:", error);
            alert("There was an error logging in. Please try again.");
        });
});
