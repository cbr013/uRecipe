const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models/db');

// Register User
exports.register = (req, res) => {
  const { name, username, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);
  const query = `INSERT INTO Users (name, username, email, password) VALUES (?, ?, ?, ?)`;

  db.run(query, [name, username, email, hashedPassword], function (err) {
    if (err) {
      return res.status(500).send({ message: 'Error registering user', error: err });
    }
    res.status(201).send({ message: 'User registered successfully' });
  });
};

// Login User
exports.login = (req, res) => {
  const { username, password } = req.body;
  db.get(`SELECT * FROM Users WHERE username = ?`, [username], (err, user) => {
    if (err || !user) {
      return res.status(404).send({ message: 'User not found' });
    }
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).send({ message: 'Invalid password' });
    }

    const token = jwt.sign({ id: user.id }, 'your-secret-key', { expiresIn: 86400 });
    res.status(200).send({ message: 'Login successful', token });
  });
};

// Get User
exports.getUser = (req, res) => {
  const userId = req.params.id;
  db.get(`SELECT * FROM Users WHERE id = ?`, [userId], (err, user) => {
    if (err || !user) {
      return res.status(404).send({ message: 'User not found' });
    }
    res.status(200).send(user);
  });
};
