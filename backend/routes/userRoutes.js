// userRoutes.js - Routes related to user management

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Route to register a new user
router.post('/register', userController.register);

// Route to login a user
router.post('/login', userController.login);

// Route to get user details
router.get('/:id', userController.getUser);

// Route to update user details
router.put('/:id/update', userController.updateUser);

// Route to change password
router.put('/:id/change-password', userController.changePassword);

// Route to delete a user account
router.delete('/:id/delete', userController.deleteUser);

// Route to add a comment to a recipe
router.post('/:id/comment', userController.addComment);

// Route to log out a user
router.post('/logout', userController.logout);

module.exports = router;
