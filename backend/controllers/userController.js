// userController.js - Controller functions for user management

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models/db');

// Register a new user
exports.register = (req, res) => {
  const { username, email, password, displayName } = req.body;
  const passwordHash = bcrypt.hashSync(password, 10);

  // Check if the user already exists
  const checkQuery = `SELECT * FROM users WHERE username = ? OR email = ?`;
  db.get(checkQuery, [username, email], (err, user) => {
    if (err) {
      console.error('Database error:', err); // Log the actual error to the console for debugging
      return res.status(500).json({ message: 'Error checking user existence', error: err });
    }
  
    if (user) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }
  
    // Proceed with registration
    const query = `INSERT INTO users (username, email, password_hash, display_name) VALUES (?, ?, ?, ?)`;
    db.run(query, [username, email, passwordHash, displayName], function (err) {
      if (err) {
        res.status(500).json({ message: 'Registration failed', error: err });
      } else {
        res.status(201).json({ userId: this.lastID, message: 'User registered successfully' });
      }
    });
  });  
};


// Login a user
exports.login = (req, res) => {
  const { username, password } = req.body;

  const query = `SELECT * FROM users WHERE username = ?`;
  db.get(query, [username], (err, user) => {
    if (err || !user) {
      res.status(404).json({ message: 'User not found' });
    } else if (!bcrypt.compareSync(password, user.password_hash)) {
      res.status(401).json({ message: 'Invalid password' });
    } else {
      const token = jwt.sign({ userId: user.user_id, role: user.role }, 'secret_key', { expiresIn: '1h' });
      res.status(200).json({ token, userId: user.user_id, message: 'Login successful' });
    }
  });
};

// Get user details
exports.getUser = (req, res) => {
  const { id } = req.params;

  const query = `SELECT * FROM users WHERE user_id = ? AND is_deleted = 0`;
  db.get(query, [id], (err, user) => {
    if (err || !user) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.status(200).json(user);
    }
  });
};

// Update user details
exports.updateUser = (req, res) => {
  const { id } = req.params;
  const { displayName, bio, themePreference } = req.body;

  const query = `UPDATE users SET display_name = ?, bio = ?, theme_preference = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ? AND is_deleted = 0`;
  db.run(query, [displayName, bio, themePreference, id], function (err) {
    if (err) {
      res.status(500).json({ message: 'Update failed', error: err });
    } else {
      res.status(200).json({ message: 'User updated successfully' });
    }
  });
};

// Change password
exports.changePassword = (req, res) => {
  const { id } = req.params;
  const { oldPassword, newPassword } = req.body;

  const query = `SELECT * FROM users WHERE user_id = ?`;
  db.get(query, [id], (err, user) => {
    if (err || !user) {
      res.status(404).json({ message: 'User not found' });
    } else if (!bcrypt.compareSync(oldPassword, user.password_hash)) {
      res.status(401).json({ message: 'Old password is incorrect' });
    } else {
      const newPasswordHash = bcrypt.hashSync(newPassword, 10);
      const updateQuery = `UPDATE users SET password_hash = ? WHERE user_id = ?`;
      db.run(updateQuery, [newPasswordHash, id], function (err) {
        if (err) {
          res.status(500).json({ message: 'Password change failed', error: err });
        } else {
          res.status(200).json({ message: 'Password changed successfully' });
        }
      });
    }
  });
};

// Delete user account
exports.deleteUser = (req, res) => {
  const { id } = req.params;

  const query = `UPDATE users SET is_deleted = 1 WHERE user_id = ?`;
  db.run(query, [id], function (err) {
    if (err) {
      res.status(500).json({ message: 'Account deletion failed', error: err });
    } else {
      res.status(200).json({ message: 'User account deleted successfully' });
    }
  });
};

// Add a comment to a recipe
exports.addComment = (req, res) => {
  const { id } = req.params; // user ID
  const { recipeId, comment } = req.body;

  const commentData = {
    userId: id,
    recipeId,
    comment,
    createdAt: new Date().toISOString(),
  };

  const query = `INSERT INTO comments (user_id, recipe_id, comment, created_at) VALUES (?, ?, ?, ?)`;
  db.run(query, [commentData.userId, commentData.recipeId, commentData.comment, commentData.createdAt], function (err) {
    if (err) {
      res.status(500).json({ message: 'Failed to add comment', error: err });
    } else {
      res.status(201).json({ commentId: this.lastID, message: 'Comment added successfully' });
    }
  });
};

// Logout user
exports.logout = (req, res) => {
  // Implementing logout functionality could involve token management, depending on how the frontend handles it.
  res.status(200).json({ message: 'User logged out successfully' });
};

