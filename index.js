const inquirer = require('inquirer');
const chalk = require('chalk');
const { validateAccessToken, saveAccessToken, getAccessToken } = require('./lib/auth');
const { 
  autoPostReaction,
  autoCommentReaction,
  autoPostComment,
  autoFollow,
  autoUnfollow,
  autoShare
} = require('./lib/ui');
const { db } = require('./db');

// Set up color themes
const colors = {
  primary: chalk.bold.blue,
  secondary: chalk.cyan,
  success: chalk.green,
  error: chalk.red,
  warning: chalk.yellow,
  info: chalk.gray
};

/**
 * Main menu for the application
 */
async function mainMenu() {
  console.clear();
  console.log(colors.primary('=== Facebook Automation Tool ==='));
  
  const token = await getAccessToken();
  
  if (!token) {
    await promptForToken();
    return mainMenu();
  }
  
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        { name: 'Auto Post Reaction', value: 'post_reaction' },
        { name: 'Auto Comment Reaction', value: 'comment_reaction' },
        { name: 'Auto Post Comment', value: 'post_comment' },
        { name: 'Auto Follow', value: 'follow' },
        { name: 'Auto Unfollow', value: 'unfollow' },
        { name: 'Auto Share', value: 'share' },
        { name: 'Change Access Token', value: 'token' },
        { name: 'Exit', value: 'exit' }
      ]
    }
  ]);
  
  switch (action) {
    case 'post_reaction':
      await autoPostReaction();
      break;
    case 'comment_reaction':
      await autoCommentReaction();
      break;
    case 'post_comment':
      await autoPostComment();
      break;
    case 'follow':
      await autoFollow();
      break;
    case 'unfollow':
      await autoUnfollow();
      break;
    case 'share':
      await autoShare();
      break;
    case 'token':
      await promptForToken();
      break;
    case 'exit':
      console.log(colors.info('Goodbye!'));
      process.exit(0);
      break;
  }
  
  const { continue: shouldContinue } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'continue',
      message: 'Return to main menu?',
      default: true
    }
  ]);
  
  if (shouldContinue) {
    await mainMenu();
  } else {
    console.log(colors.info('Goodbye!'));
    process.exit(0);
  }
}

/**
 * Prompt the user for a Facebook access token
 */
async function promptForToken() {
  console.log(colors.info('A valid Facebook access token is required.'));
  console.log(colors.info('You can get one from https://developers.facebook.com/tools/explorer/'));
  
  const { token } = await inquirer.prompt([
    {
      type: 'password',
      name: 'token',
      message: 'Enter your Facebook access token:',
      validate: (input) => input.length > 0 ? true : 'Token cannot be empty'
    }
  ]);
  
  const isValid = await validateAccessToken(token);
  
  if (isValid) {
    await saveAccessToken(token);
    console.log(colors.success('Token saved successfully!'));
  } else {
    console.log(colors.error('Invalid token. Please try again.'));
    await promptForToken();
  }
}

/**
 * Initialize the application
 */
async function init() {
  try {
    console.log(colors.info('Initializing application...'));
    await mainMenu();
  } catch (error) {
    console.error(colors.error('Error initializing application:'), error);
    process.exit(1);
  }
}

// Start the application
init();
