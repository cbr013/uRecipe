const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Could not connect to database', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

module.exports = db;


db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS Users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        username TEXT UNIQUE,
        email TEXT UNIQUE,
        password TEXT,
        role TEXT DEFAULT 'user'
      )
    `);
  
    db.run(`
      CREATE TABLE IF NOT EXISTS Recipes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        description TEXT,
        prep_time INTEGER,
        image TEXT,
        ingredients TEXT,
        additional_ingredients TEXT,
        user_id INTEGER,
        FOREIGN KEY(user_id) REFERENCES Users(id)
      )
    `);
  });
  