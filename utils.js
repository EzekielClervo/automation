/**
 * Utility functions for Facebook Automation Suite
 */

const chalk = require('chalk');
const { URL } = require('url');
const { execSync } = require('child_process');
const { readAccessToken: dbReadAccessToken, readAccessTokenSync } = require('./auth');

// Color definitions
const colors = {
  red: chalk.bold.red,
  green: chalk.bold.green,
  yellow: chalk.bold.yellow,
  blue: chalk.bold.blue,
  magenta: chalk.bold.magenta,
  cyan: chalk.bold.cyan,
  white: chalk.bold.white
};

/**
 * Clear the terminal screen
 */
function clear() {
  const isWindows = process.platform === 'win32';
  try {
    isWindows ? execSync('cls', { stdio: 'inherit' }) : execSync('clear', { stdio: 'inherit' });
  } catch (e) {
    // Fallback for environments where execSync might not work
    console.log('\x1Bc');
  }
  logo();
}

/**
 * Display the application logo
 */
function logo() {
  const logoColor = randomColor();
  
  console.log(logoColor(`
  ______________________________
 /  _____/\\_   _____/\\__    ___/
/   \\  ___ |    __)_   |    |   
\\    \\_\\  \\|        \\  |    |   
 \\______  /_______  /  |____|   
        \\/        \\/`));
  
  console.log(colors.yellow('FACEBOOK AUTOMATION SUITE'));
  console.log(colors.red('DEVELOPED BY GABO'));
  console.log('----------------------------------------');
}

/**
 * Return a random color function
 * @returns {Function} A random color function
 */
function randomColor() {
  const colorList = [
    colors.red,
    colors.green,
    colors.yellow,
    colors.blue,
    colors.magenta,
    colors.cyan
  ];
  
  return colorList[Math.floor(Math.random() * colorList.length)];
}

/**
 * Read Facebook access token
 * This is maintained for backward compatibility
 * @returns {string|null} - Access token or null if not found
 */
function readAccessToken() {
  // This will use the synchronous version for compatibility
  return readAccessTokenSync();
}

/**
 * Extract comment ID from Facebook comment URL
 * @param {string} url - Comment URL
 * @returns {string|null} - Comment ID or null if not found
 */
function extractCommentIdFromUrl(url) {
  try {
    const parsedUrl = new URL(url);
    const commentId = parsedUrl.searchParams.get('comment_id');
    
    if (!commentId) {
      throw new Error("No comment_id found in the URL.");
    }
    
    const decoded = Buffer.from(commentId, 'base64').toString('utf-8');
    return decoded.split("_").pop();
  } catch (error) {
    console.log(colors.red(`Error extracting comment ID: ${error.message}`));
    return null;
  }
}

/**
 * Convert Facebook post URL to proper ID format
 * @param {string} url - Post URL
 * @returns {string|null} - Post ID or null if not found
 */
function convertPostLink(url) {
  try {
    const parsedUrl = new URL(url);
    const pathParts = parsedUrl.pathname.split('/').filter(part => part);
    
    if (pathParts.includes('posts')) {
      const postIndex = pathParts.indexOf('posts');
      return `${pathParts[postIndex-1]}_${pathParts[postIndex+1]}`;
    } else if (parsedUrl.pathname.includes('story.php')) {
      const storyId = parsedUrl.searchParams.get('story_fbid');
      const id = parsedUrl.searchParams.get('id');
      return `${id}_${storyId}`;
    }
    
    return pathParts[pathParts.length - 1];
  } catch (error) {
    console.log(colors.red(`Error converting post URL: ${error.message}`));
    return null;
  }
}

/**
 * Extract user ID from Facebook profile URL
 * @param {string} url - Profile URL
 * @returns {string|null} - User ID or null if not found
 */
function extractUserIdFromUrl(url) {
  try {
    const parsedUrl = new URL(url);
    const userId = parsedUrl.searchParams.get('id');
    
    if (!userId) {
      throw new Error("No user ID found in the URL.");
    }
    
    return userId;
  } catch (error) {
    console.log(colors.red(`Error extracting user ID: ${error.message}`));
    return null;
  }
}

/**
 * Sleep for specified milliseconds
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>} - Promise that resolves after sleep
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
  clear,
  logo,
  colors,
  randomColor,
  readAccessToken,
  extractCommentIdFromUrl,
  convertPostLink,
  extractUserIdFromUrl,
  sleep
};
