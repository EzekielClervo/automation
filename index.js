#!/usr/bin/env node

/**
 * Facebook Automation implementation
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
    // Handle different routes
    if (req.url === '/api/status') {
      // API endpoint for status
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(JSON.stringify({
        status: 'running',
        time: new Date().toISOString(),
        database: 'connected'
      }));
      return;
    }
    
    // Main web interface
    res.writeHead(200, {'Content-Type': 'text/html'});
    
    // Enhanced HTML page with interactive UI
    res.end(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Facebook Automation Suite</title>
          <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
          <style>
            :root {
              --primary: #1877f2;
              --primary-dark: #1664d9;
              --secondary: #42b72a;
              --secondary-dark: #36a420;
              --text: #333;
              --text-light: #666;
              --bg: #f0f2f5;
              --white: #fff;
              --border: #ddd;
              --shadow: 0 2px 5px rgba(0,0,0,0.1);
            }
            
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Poppins', Arial, sans-serif;
              background-color: var(--bg);
              color: var(--text);
              line-height: 1.6;
            }
            
            .container {
              max-width: 1100px;
              margin: 0 auto;
              padding: 20px;
            }
            
            header {
              background-color: var(--white);
              box-shadow: var(--shadow);
              padding: 15px 0;
              position: sticky;
              top: 0;
              z-index: 100;
            }
            
            .header-content {
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            
            .logo {
              color: var(--primary);
              font-size: 24px;
              font-weight: 700;
              text-decoration: none;
            }
            
            .hero {
              background-color: var(--white);
              border-radius: 10px;
              box-shadow: var(--shadow);
              padding: 40px;
              margin: 30px 0;
              text-align: center;
            }
            
            .hero h1 {
              color: var(--primary);
              font-size: 36px;
              margin-bottom: 20px;
            }
            
            .hero p {
              color: var(--text-light);
              font-size: 18px;
              max-width: 800px;
              margin: 0 auto 30px;
            }
            
            .features {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
              gap: 20px;
              margin: 40px 0;
            }
            
            .feature-card {
              background-color: var(--white);
              border-radius: 10px;
              box-shadow: var(--shadow);
              padding: 25px;
              transition: transform 0.3s ease;
            }
            
            .feature-card:hover {
              transform: translateY(-5px);
            }
            
            .feature-card h3 {
              color: var(--primary);
              margin-bottom: 15px;
              display: flex;
              align-items: center;
            }
            
            .feature-card h3 svg {
              margin-right: 10px;
            }
            
            .feature-card p {
              color: var(--text-light);
            }
            
            .status-card {
              background-color: var(--white);
              border-radius: 10px;
              box-shadow: var(--shadow);
              padding: 25px;
              margin: 30px 0;
            }
            
            .status-label {
              display: inline-block;
              background-color: #e7f3ff;
              color: var(--primary);
              font-weight: 600;
              padding: 5px 10px;
              border-radius: 5px;
              margin-bottom: 10px;
            }
            
            .cta-section {
              background-color: var(--primary);
              border-radius: 10px;
              color: var(--white);
              padding: 40px;
              text-align: center;
              margin: 40px 0;
            }
            
            .cta-section h2 {
              font-size: 28px;
              margin-bottom: 20px;
            }
            
            .btn {
              display: inline-block;
              background-color: var(--secondary);
              color: var(--white);
              font-weight: 600;
              padding: 12px 24px;
              border-radius: 5px;
              text-decoration: none;
              transition: background-color 0.3s ease;
            }
            
            .btn:hover {
              background-color: var(--secondary-dark);
            }
            
            .api-section {
              background-color: var(--white);
              border-radius: 10px;
              box-shadow: var(--shadow);
              padding: 25px;
              margin: 30px 0;
            }
            
            .api-section pre {
              background: #f5f5f5;
              padding: 15px;
              border-radius: 5px;
              overflow-x: auto;
            }
            
            footer {
              background-color: var(--white);
              box-shadow: var(--shadow);
              padding: 20px 0;
              margin-top: 40px;
              text-align: center;
              color: var(--text-light);
            }
            
            @media (max-width: 768px) {
              .hero {
                padding: 30px 20px;
              }
              
              .features {
                grid-template-columns: 1fr;
              }
            }
          </style>
        </head>
        <body>
          <header>
            <div class="container header-content">
              <a href="/" class="logo">FB Automation Suite</a>
              <span id="server-time"></span>
            </div>
          </header>
          
          <div class="container">
            <section class="hero">
              <h1>Facebook Automation Suite</h1>
              <p>Your powerful tool for automating Facebook interactions and managing social media presence efficiently.</p>
            </section>
            
            <section class="features">
              <div class="feature-card">
                <h3>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 15.5C14.21 15.5 16 13.71 16 11.5C16 9.29 14.21 7.5 12 7.5C9.79 7.5 8 9.29 8 11.5C8 13.71 9.79 15.5 12 15.5Z" stroke="#1877F2" stroke-width="2"/>
                    <path d="M19 11.5H21M3 11.5H5M12 4.5V2.5M12 20.5V18.5" stroke="#1877F2" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                  Token Acquisition
                </h3>
                <p>Automatically obtain Facebook access tokens for API integration and automated tasks.</p>
              </div>
              
              <div class="feature-card">
                <h3>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#1877F2" stroke-width="2"/>
                    <path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14" stroke="#1877F2" stroke-width="2" stroke-linecap="round"/>
                    <path d="M9 9H9.01" stroke="#1877F2" stroke-width="2" stroke-linecap="round"/>
                    <path d="M15 9H15.01" stroke="#1877F2" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                  Auto Reactions
                </h3>
                <p>Automate reactions on posts and comments with customizable reaction types.</p>
              </div>
              
              <div class="feature-card">
                <h3>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z" stroke="#1877F2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  Auto Comments
                </h3>
                <p>Post comments on Facebook content with customizable message templates.</p>
              </div>
              
              <div class="feature-card">
                <h3>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 19V17C16 15.9391 15.5786 14.9217 14.8284 14.1716C14.0783 13.4214 13.0609 13 12 13H5C3.93913 13 2.92172 13.4214 2.17157 14.1716C1.42143 14.9217 1 15.9391 1 17V19" stroke="#1877F2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 22V16" stroke="#1877F2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M8.5 19H16" stroke="#1877F2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M8.5 3C8.5 4.65685 9.84315 6 11.5 6C13.1569 6 14.5 4.65685 14.5 3C14.5 1.34315 13.1569 0 11.5 0C9.84315 0 8.5 1.34315 8.5 3Z" fill="#1877F2"/>
                    <path d="M20 11L22 13L23 12" stroke="#1877F2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  Follow/Unfollow
                </h3>
                <p>Automatically follow or unfollow Facebook users based on custom criteria.</p>
              </div>
              
              <div class="feature-card">
                <h3>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 12V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V12" stroke="#1877F2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M16 6L12 2L8 6" stroke="#1877F2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 2V15" stroke="#1877F2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  Auto Sharing
                </h3>
                <p>Share Facebook posts automatically to increase reach and engagement.</p>
              </div>
              
              <div class="feature-card">
                <h3>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#1877F2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M14 2V8H20" stroke="#1877F2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M16 13H8" stroke="#1877F2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M16 17H8" stroke="#1877F2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M10 9H9H8" stroke="#1877F2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  Activity Logging
                </h3>
                <p>Detailed logs of all automation activities for analysis and monitoring.</p>
              </div>
            </section>
            
            <section class="status-card">
              <span class="status-label">Status</span>
              <h2>System Information</h2>
              <p><strong>Service:</strong> Running with PostgreSQL database connection</p>
              <p><strong>Server Time:</strong> <span id="current-time">${new Date().toISOString()}</span></p>
            </section>
            
            <section class="cta-section">
              <h2>Ready to Automate Your Facebook Activities?</h2>
              <p>Access the full functionality through our CLI interface or API integration.</p>
              <a href="https://github.com/EzekielClervo/automation" class="btn" target="_blank">View on GitHub</a>
            </section>
            
            <section class="api-section">
              <h2>API Integration</h2>
              <p>Access automation features programmatically through our API endpoints:</p>
              <pre>
// Example API usage
fetch('/api/status')
  .then(response => response.json())
  .then(data => console.log(data));</pre>
            </section>
          </div>
          
          <footer>
            <div class="container">
              <p>Facebook Automation Suite &copy; 2025 | Developed by Gabo</p>
            </div>
          </footer>
          
          <script>
            // Update server time
            function updateTime() {
              const timeElement = document.getElementById('current-time');
              timeElement.textContent = new Date().toISOString();
            }
            
            // Update time every second
            setInterval(updateTime, 1000);
            
            // Display current time in header
            function updateHeaderTime() {
              const headerTime = document.getElementById('server-time');
              const now = new Date();
              const options = { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              };
              headerTime.textContent = now.toLocaleDateString('en-US', options);
            }
            
            // Update header time every second
            updateHeaderTime();
            setInterval(updateHeaderTime, 1000);
          </script>
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
