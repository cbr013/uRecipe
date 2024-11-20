// db.js - SQLite schema creation for the users and recipes tables for uRecipe web app
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
  // Create users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      user_id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      display_name TEXT,
      bio TEXT,
      profile_image TEXT,
      role TEXT CHECK( role IN ('user', 'admin') ) DEFAULT 'user',
      account_created DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_login DATETIME,
      theme_preference TEXT CHECK( theme_preference IN ('light', 'dark') ) DEFAULT 'light',
      is_deleted BOOLEAN DEFAULT 0,
      favorites TEXT,  -- JSON string to store list of favorite recipe IDs
      hidden_recipes TEXT,  -- JSON string to store list of hidden recipe IDs
      notifications TEXT,  -- JSON string to store user notifications
      user_recipes TEXT,  -- JSON string to store list of user's own recipe IDs
      comments TEXT  -- JSON string to store list of user's comment IDs
    );
  `);

  console.log("Users table has been created.");

  // Create recipes table
  db.run(`
    CREATE TABLE IF NOT EXISTS recipes (
      recipe_id INTEGER PRIMARY KEY AUTOINCREMENT,
      creator_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      ingredients TEXT NOT NULL,  -- JSON string to store list of ingredients
      instructions TEXT NOT NULL,  -- JSON string to store list of instructions
      tags TEXT,  -- JSON string to store list of tags
      image TEXT,  -- Path or URL to the recipe image
      is_hidden BOOLEAN DEFAULT 0,  -- Indicates if the recipe is hidden by the creator
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME,
      ratings TEXT,  -- JSON string to store ratings information
      comments TEXT,  -- JSON string to store list of comment IDs
      preparation_time INTEGER,  -- Preparation time in minutes
      FOREIGN KEY (creator_id) REFERENCES users(user_id) ON DELETE CASCADE
    );
  `);

  console.log("Recipes table has been created.");

  // Create ingredients table
  db.run(`
    CREATE TABLE IF NOT EXISTS ingredients (
      ingredient_id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL CHECK(name GLOB '[A-Z][a-z]*')
    );
  `);

  console.log("ingredients table has been created.");

   // Create tags table
   db.run(`
    CREATE TABLE IF NOT EXISTS tags (
      tag_id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL CHECK(name GLOB '[A-Z][a-z]*')
    );
  `);

  console.log("Tags table has been created.");
});

//db.close();