/**
 * Authentication module for Facebook Automation Suite
 * Handles token acquisition and storage
 */

const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const chalk = require('chalk');
const { db } = require('../db');
const { tokens } = require('../schema');
const { eq } = require('drizzle-orm');

/**
 * Get Facebook access token using email and password
 * @param {string} email - Facebook email/username
 * @param {string} password - Facebook password
 * @returns {Promise<string|null>} - Access token or null if failed
 */
async function getToken(email, password) {
  // Predefined access token for device-based login
  const baseAccessToken = '350685531728|62f8ce9f74b12f84c123cc23437a4a32';
  
  const data = new URLSearchParams({
    'adid': uuidv4(),
    'format': 'json',
    'device_id': uuidv4(),
    'credentials_type': 'device_based_login_password',
    'email': email,
    'password': password,
    'access_token': baseAccessToken,
    'generate_session_cookies': '1',
    'method': 'auth.login'
  });
  
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36',
    'Content-Type': 'application/x-www-form-urlencoded'
  };
  
  try {
    const response = await axios.post('https://b-graph.facebook.com/auth/login', data, { 
      headers: headers,
      timeout: 30000
    });
    
    if (response.status === 200) {
      const result = response.data;
      if ('access_token' in result) {
        // Get user_id or create one if not exists
        let userId = 1; // Default user ID if no user management is implemented
        
        // Save token to database
        await saveAccessToken(result.access_token, userId);
        return result.access_token;
      } else if ('error' in result) {
        console.log(chalk.red(`Error: ${result.error.message}`));
      }
    } else {
      console.log(chalk.red(`Failed: HTTP code ${response.status}`));
    }
  } catch (error) {
    console.log(chalk.red(`Connection Error: ${error.message}`));
  }
  
  return null;
}

/**
 * Save Facebook access token to database
 * @param {string} token - Access token to save
 * @param {number} userId - User ID
 */
async function saveAccessToken(token, userId) {
  try {
    // Insert token into database
    await db.insert(tokens).values({
      user_id: userId,
      access_token: token
    });
    console.log(chalk.green('Token saved to database'));
  } catch (error) {
    console.log(chalk.red(`Error saving access token: ${error.message}`));
  }
}

/**
 * Read most recent Facebook access token from database
 * @param {number} userId - User ID (optional)
 * @returns {Promise<string|null>} - Access token or null if not found
 */
async function readAccessToken(userId = 1) {
  try {
    // Get the most recent token for the user
    const result = await db.select()
      .from(tokens)
      .where(userId ? eq(tokens.user_id, userId) : undefined)
      .orderBy(tokens.created_at, 'desc')
      .limit(1);
    
    if (result && result.length > 0) {
      return result[0].access_token;
    }
    
    return null;
  } catch (error) {
    console.log(chalk.red(`Error reading access token: ${error.message}`));
    return null;
  }
}

// For backward compatibility with existing code - synchronous version
function readAccessTokenSync() {
  try {
    // This is a fallback that should be avoided - ideally all code should be updated to use async version
    console.log(chalk.yellow('Warning: Using synchronous token access, update to async version'));
    // Return a cached token or null
    return null;
  } catch (error) {
    console.log(chalk.red(`Error reading access token: ${error.message}`));
    return null;
  }
}

module.exports = {
  getToken,
  saveAccessToken,
  readAccessToken,
  readAccessTokenSync
};
