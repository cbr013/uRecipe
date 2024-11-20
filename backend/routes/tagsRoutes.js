const express = require('express');
const router = express.Router();
const tagsController = require('../controllers/tagsController');

// Route to get all tags
router.get('/', tagsController.getTags);

// Route to add a new tag
router.post('/', tagsController.addTag);

module.exports = router;
