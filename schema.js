/**
 * Database schema definitions for Facebook Automation Suite
 * This file defines the structure of database tables
 */

// Define user table schema
const userSchema = {
  id: "SERIAL PRIMARY KEY",
  username: "VARCHAR(255) NOT NULL UNIQUE",
  password_hash: "VARCHAR(255) NOT NULL",
  email: "VARCHAR(255)",
  created_at: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP"
};

// Define token table schema
const tokenSchema = {
  id: "SERIAL PRIMARY KEY",
  user_id: "INTEGER REFERENCES users(id)",
  token: "TEXT NOT NULL",
  created_at: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP"
};

// Define activity table schema
const activitySchema = {
  id: "SERIAL PRIMARY KEY",
  user_id: "INTEGER REFERENCES users(id)",
  activity_type: "VARCHAR(50) NOT NULL",
  target_id: "VARCHAR(255) NOT NULL",
  details: "TEXT",
  timestamp: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP"
};

// Export all schemas
module.exports = {
  userSchema,
  tokenSchema,
  activitySchema
};
