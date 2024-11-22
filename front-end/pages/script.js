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
        window.location.href = '../landing_page.html';
    };

    if (logoutLink) {
        logoutLink.addEventListener('click', logoutHandler);
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', logoutHandler);
    }
});
