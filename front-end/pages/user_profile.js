document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Replace this URL with the actual endpoint to get the user data
        const response = await fetch('http://localhost:3000/api/users/1');
        
        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }

        const userData = await response.json();

        // Populate user profile fields with data from the API response
        document.getElementById('usernameDisplay').textContent = userData.username || 'User';
        document.getElementById('usernameInfo').textContent = userData.username || 'No username available';
        document.getElementById('emailInfo').textContent = userData.email || 'No email available';
        document.getElementById('displayNameInfo').textContent = userData.display_name || 'No display name available';
        document.getElementById('bioInfo').textContent = userData.bio || 'No bio available';
        document.getElementById('themePreferenceInfo').textContent = userData.theme_preference || 'No preference available';
    } catch (error) {
        console.error('Error loading user profile:', error);
    }

    // Edit Account Button
    document.getElementById('editAccountButton').addEventListener('click', () => {
        window.location.href = 'edit_user_profile.html'; // Redirect to edit profile page
    });

    // Delete Account Button
    document.getElementById('deleteAccountButton').addEventListener('click', () => {
        if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            // Add logic to delete user account here
            alert('Account deleted successfully.');
            window.location.href = '../landing_page.html';
        }
    });

    // Logout Button
    document.getElementById('logoutButton').addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        alert('Logged out successfully!');
        window.location.href = '../landing_page.html';
    });
});
