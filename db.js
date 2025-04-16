/**
 * Database connection and initialization for Facebook Automation Suite
 */
const { Pool } = require('pg');

// Check if we're in a database-enabled environment
const isDbEnabled = !!process.env.DATABASE_URL;

// Create a PostgreSQL connection pool or fallback to in-memory storage
let pool = null;
if (isDbEnabled) {
  try {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false // Required for Render.com PostgreSQL connections
      }
    });
    console.log('PostgreSQL connection pool created');
  } catch (error) {
    console.error('Error creating PostgreSQL pool:', error.message);
    // Continue with fallback memory storage
  }
}

// In-memory storage as fallback when database isn't available
const memoryStorage = {
  users: [],
  tokens: [],
  activities: []
};

// Simple query method wrapper with fallback to in-memory storage
async function query(text, params) {
  // If database is enabled and pool exists, use real database
  if (isDbEnabled && pool) {
    try {
      const result = await pool.query(text, params);
      return result;
    } catch (error) {
      console.error('Database query error:', error.message);
      throw error;
    }
  } else {
    // Fallback to in-memory storage when database isn't available
    console.log('Using in-memory storage for query:', text);
    return handleMemoryQuery(text, params);
  }
}

// Handle in-memory queries as a fallback
function handleMemoryQuery(text, params) {
  // Simple parsing of SQL for memory storage
  if (text.includes('CREATE TABLE IF NOT EXISTS')) {
    // Table creation queries - just log and return success
    return { rowCount: 0 };
  }
  
  if (text.includes('INSERT INTO users')) {
    // Insert user
    const id = memoryStorage.users.length + 1;
    const user = { id, ...params[0] };
    memoryStorage.users.push(user);
    return { rows: [user], rowCount: 1 };
  }
  
  if (text.includes('INSERT INTO tokens')) {
    // Insert token
    const id = memoryStorage.tokens.length + 1;
    const token = { id, ...params[0] };
    memoryStorage.tokens.push(token);
    return { rows: [token], rowCount: 1 };
  }
  
  if (text.includes('INSERT INTO activities')) {
    // Insert activity
    const id = memoryStorage.activities.length + 1;
    const activity = { id, ...params[0] };
    memoryStorage.activities.push(activity);
    return { rows: [activity], rowCount: 1 };
  }
  
  if (text.includes('SELECT * FROM users')) {
    // Select users
    return { rows: memoryStorage.users, rowCount: memoryStorage.users.length };
  }
  
  if (text.includes('SELECT * FROM tokens')) {
    // Select tokens
    return { rows: memoryStorage.tokens, rowCount: memoryStorage.tokens.length };
  }
  
  if (text.includes('SELECT * FROM activities')) {
    // Select activities
    return { rows: memoryStorage.activities, rowCount: memoryStorage.activities.length };
  }
  
  if (text.includes('SELECT NOW()')) {
    // Current time query
    return { rows: [{ now: new Date() }], rowCount: 1 };
  }
  
  // Default response for other queries
  return { rows: [], rowCount: 0 };
}

/**
 * Initialize the database by creating required tables if they don't exist
 */
async function initializeDatabase() {
  try {
    // Create users table if it doesn't exist
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create tokens table if it doesn't exist
    await query(`
      CREATE TABLE IF NOT EXISTS tokens (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        token TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create activities table if it doesn't exist
    await query(`
      CREATE TABLE IF NOT EXISTS activities (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        activity_type VARCHAR(50) NOT NULL,
        target_id VARCHAR(255) NOT NULL,
        details TEXT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Database initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error.message);
    return false;
  }
}

// Export database functions
module.exports = {
  query,
  initializeDatabase,
  db: { query }, // Export as db.query for compatibility with existing code
  pool: {
    // Provide a mock end method if pool doesn't exist
    end: async () => {
      console.log('No database pool to end');
      return true;
    }
  }
};
