const db = require('../models/db');

// Get all tags
exports.getTags = (req, res) => {
  const query = `SELECT * FROM tags ORDER BY name ASC`;
  db.all(query, [], (err, tags) => {
    if (err) {
      res.status(500).json({ message: 'Error retrieving tags', error: err });
    } else {
      res.status(200).json(tags);
    }
  });
};

// Add a new tag
exports.addTag = (req, res) => {
  const { name } = req.body;
  const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

  const query = `INSERT INTO tags (name) VALUES (?)`;
  db.run(query, [capitalizedName], function (err) {
    if (err) {
      res.status(500).json({ message: 'Failed to add tag', error: err });
    } else {
      res.status(201).json({ tagId: this.lastID, message: 'Tag added successfully' });
    }
  });
};
