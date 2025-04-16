#!/usr/bin/env node

/**
 * Facebook Automation Suite
 * Node.js implementation
 * 
 * Main entry point for the application
 */

const http = require('http');
const inquirer = require('inquirer');
const { clear, logo } = require('./lib/utils');
const { getToken } = require('./lib/auth');
const { db, initializeDatabase } = require('./db');
const { 
  autoPostReactionFlow, 
  autoCommentReactionFlow, 
  autoPostCommentFlow, 
  autoFollowUserFlow,
  autoUnfollowUserFlow,
  autoSharePostFlow 
} = require('./lib/ui');

// Determine if we're running in a server environment (Render.com)
const isServerMode = process.env.PORT || process.env.RENDER;

async function mainMenu() {
  clear();
  
  const { choice } = await inquirer.prompt([
    {
      type: 'list',
      name: 'choice',
      message: 'Choose an option:',
      choices: [
        { name: 'Token Getter (Email & Password)', value: '1' },
        { name: 'Auto Post Reaction', value: '2' },
        { name: 'Auto Comment Reaction', value: '3' },
        { name: 'Auto Post Comment', value: '4' },
        { name: 'Auto Follow User', value: '5' },
        { name: 'Auto Unfollow User', value: '6' },
        { name: 'Auto Share Post', value: '7' },
        { name: 'Exit', value: '8' }
      ]
    }
  ]);
  
  return choice;
}

async function main() {
  try {
    // Initialize the database before starting the application
    await initializeDatabase();
    console.log('Database connected successfully!');
    
    if (isServerMode) {
      // Start the web server for Render.com deployment
      startWebServer();
    } else {
      // Start CLI mode for local development
      while (true) {
        const choice = await mainMenu();
        
        switch (choice) {
          case '1':
            await tokenGetterFlow();
            break;
          case '2':
            await autoPostReactionFlow();
            break;
          case '3':
            await autoCommentReactionFlow();
            break;
          case '4':
            await autoPostCommentFlow();
            break;
          case '5':
            await autoFollowUserFlow();
            break;
          case '6':
            await autoUnfollowUserFlow();
            break;
          case '7':
            await autoSharePostFlow();
            break;
          case '8':
            console.log('Exiting...');
            await db.pool.end(); // Close database connections before exiting
            process.exit(0);
          default:
            console.log('Invalid option, please try again.');
        }
      }
    }
  } catch (error) {
    console.error('Failed to initialize database:', error.message);
    process.exit(1);
  }
}

// Web server functionality for Render.com
function startWebServer() {
  const PORT = process.env.PORT || 3000;
  
  const server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'});
    
    // Simple HTML page with app description
    res.end(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Facebook Automation Suite</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
            h1 { color: #1877f2; } /* Facebook blue */
            .feature { margin-bottom: 10px; }
            pre { background: #f5f5f5; padding: 10px; border-radius: 5px; }
          </style>
        </head>
        <body>
          <h1>Facebook Automation Suite</h1>
          <p>Successfully deployed! This application provides various Facebook automation capabilities:</p>
          
          <div class="feature">✓ Facebook token acquisition</div>
          <div class="feature">✓ Auto post reactions</div>
          <div class="feature">✓ Auto comment reactions</div>
          <div class="feature">✓ Auto post commenting</div>
          <div class="feature">✓ Auto follow/unfollow users</div>
          <div class="feature">✓ Auto share posts</div>
          <div class="feature">✓ Activity logging</div>
          
          <p>Status: <strong>Running</strong> with PostgreSQL database connection</p>
          <p>Server Time: ${new Date().toISOString()}</p>
          
          <h3>API Usage</h3>
          <p>Access this application programmatically or through CLI interface.</p>
          
          <h3>Deployment Information</h3>
          <p>This is a Node.js application deployed on Render.com</p>
        </body>
      </html>
    `);
  });
  
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Web server running on port ${PORT}`);
    console.log('Application successfully deployed on Render.com');
  });
  
  // Log database status periodically to keep logs active
  setInterval(async () => {
    try {
      // Simple query to check database connection
      const result = await db.query('SELECT NOW()');
      console.log(`Database connection check: ${result.rows[0].now}`);
    } catch (error) {
      console.error('Database connection check failed:', error.message);
    }
  }, 300000); // Every 5 minutes
}

async function tokenGetterFlow() {
  clear();
  
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'email',
      message: 'Enter Facebook Email/ID:'
    },
    {
      type: 'password',
      name: 'password',
      message: 'Enter Password:'
    }
  ]);
  
  const token = await getToken(answers.email, answers.password);
  clear();
  
  if (token) {
    console.log('Token obtained successfully!');
    console.log(token);
  } else {
    console.log('Failed to obtain token!');
  }
  
  await inquirer.prompt({
    type: 'input',
    name: 'continue',
    message: 'Press Enter to return to main menu...'
  });
}

// Graceful shutdown handling
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await db.pool.end();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down gracefully...');
  await db.pool.end();
  process.exit(0);
});

// Start the application
main().catch(error => {
  console.error('An error occurred:', error);
  process.exit(1);
});
