const { drizzle } = require('drizzle-orm/node-postgres');
const { Pool } = require('pg');
const { users, access_tokens, activities } = require('./schema');

// Get database URL from environment or use default for development
const databaseUrl = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/facebook_automation';

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString: databaseUrl,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Create a Drizzle ORM instance
const db = drizzle(pool);

/**
 * Initialize the database
 */
async function initializeDatabase() {
  try {
    // Test the database connection
    await pool.query('SELECT NOW()');
    console.log('Database connection successful');
    
    // Create tables if they don't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS access_tokens (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        token TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        last_used_at TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS activities (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        activity_type VARCHAR(50) NOT NULL,
        target_id TEXT,
        details TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    
    // Create default user if not exists
    const defaultUser = await pool.query('SELECT id FROM users WHERE id = 1');
    if (defaultUser.rows.length === 0) {
      await pool.query('INSERT INTO users (id, username) VALUES (1, \'default\')');
    }
    
    console.log('Database initialized');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

// Initialize the database when this module is imported
initializeDatabase().catch(console.error);

// Export the db instance for use in other modules
module.exports = { db, pool };
