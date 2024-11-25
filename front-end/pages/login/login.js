document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the form's default behavior

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    try {
        const response = await fetch('http://localhost:3000/api/users/login', { // Updated endpoint
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        if (response.ok) {
            alert('Login successful! Redirecting to home page...');
            localStorage.setItem('token', data.token); // Save JWT token to localStorage
            localStorage.setItem('currentUser', username); // Save current user to localStorage
            localStorage.setItem('currentUserId', data.userId); // Save userId to localStorage
            window.location.href = '../../landing_page.html'; // Redirect to user home page
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert('An error occurred during login. Please try again.');
    }
});

// Check if user is already logged in
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        document.getElementById('loginLink').style.display = 'none';
        document.getElementById('accountLink').style.display = 'block';
    } else {
        document.getElementById('accountLink').style.display = 'none';
        document.getElementById('loginLink').style.display = 'block';
    }
});