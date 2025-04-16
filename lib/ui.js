/**
 * User interface flows for Facebook Automation Suite
 */

const inquirer = require('inquirer');
const chalk = require('chalk');
const { 
  clear, 
  colors, 
  readAccessToken, 
  extractCommentIdFromUrl, 
  convertPostLink,
  extractUserIdFromUrl,
  sleep 
} = require('./utils');
const { 
  reactToPost,
  reactToComment,
  postComment,
  followUser,
  unfollowUser,
  sharePost 
} = require('./actions');
const { logActivity } = require('../activities');

/**
 * Auto post reaction flow
 */
async function autoPostReactionFlow() {
  clear();
  
  const token = readAccessToken();
  if (!token) {
    console.log(colors.red('No access token found. Please obtain one first (Option 1).'));
    await inquirer.prompt({
      type: 'input',
      name: 'continue',
      message: 'Press Enter to return to main menu...'
    });
    return;
  }
  
  const { postLink, reactionType, count } = await inquirer.prompt([
    {
      type: 'input',
      name: 'postLink',
      message: 'Enter post URL:'
    },
    {
      type: 'list',
      name: 'reactionType',
      message: 'Reaction type:',
      choices: ['LIKE', 'LOVE', 'HAHA', 'WOW', 'SAD', 'ANGRY']
    },
    {
      type: 'number',
      name: 'count',
      message: 'How many times do you want to react?',
      default: 1,
      validate: value => value > 0 ? true : 'Please enter a positive number'
    }
  ]);
  
  const postId = convertPostLink(postLink);
  if (!postId) {
    console.log(colors.red('Invalid post URL!'));
    await inquirer.prompt({
      type: 'input',
      name: 'continue',
      message: 'Press Enter to return to main menu...'
    });
    return;
  }
  
  for (let i = 0; i < count; i++) {
    try {
      const result = await reactToPost(token, postId, reactionType);
      if (result && result.success) {
        console.log(colors.green('Successfully reacted to post!'));
        // Log activity to database
        await logActivity(1, 'post_reaction', postId, reactionType);
      } else {
        console.log(colors.red(`Failed to react to post: ${JSON.stringify(result)}`));
      }
      await sleep(1000);
    } catch (error) {
      console.log(colors.red(`Error: ${error.message}`));
    }
  }
  
  await inquirer.prompt({
    type: 'input',
    name: 'continue',
    message: 'Press Enter to continue...'
  });
}

/**
 * Auto comment reaction flow
 */
async function autoCommentReactionFlow() {
  clear();
  
  const token = readAccessToken();
  if (!token) {
    console.log(colors.red('No access token found. Please obtain one first (Option 1).'));
    await inquirer.prompt({
      type: 'input',
      name: 'continue',
      message: 'Press Enter to return to main menu...'
    });
    return;
  }
  
  const { commentLink, reactionType, count } = await inquirer.prompt([
    {
      type: 'input',
      name: 'commentLink',
      message: 'Enter comment URL:'
    },
    {
      type: 'list',
      name: 'reactionType',
      message: 'Reaction type:',
      choices: ['LIKE', 'LOVE', 'HAHA', 'WOW', 'SAD', 'ANGRY']
    },
    {
      type: 'number',
      name: 'count',
      message: 'How many times do you want to react?',
      default: 1,
      validate: value => value > 0 ? true : 'Please enter a positive number'
    }
  ]);
  
  const commentId = extractCommentIdFromUrl(commentLink);
  if (!commentId) {
    console.log(colors.red('Invalid comment URL!'));
    await inquirer.prompt({
      type: 'input',
      name: 'continue',
      message: 'Press Enter to return to main menu...'
    });
    return;
  }
  
  for (let i = 0; i < count; i++) {
    const result = await reactToComment(token, commentId, reactionType);
    if (result && result.success) {
      console.log(colors.green('Successfully reacted to comment!'));
      // Log activity to database
      await logActivity(1, 'comment_reaction', commentId, reactionType);
    } else {
      console.log(colors.red(`Failed to react to comment: ${JSON.stringify(result)}`));
    }
    await sleep(1000);
  }
  
  await inquirer.prompt({
    type: 'input',
    name: 'continue',
    message: 'Press Enter to continue...'
  });
}

/**
 * Auto post comment flow
 */
async function autoPostCommentFlow() {
  clear();
  
  const token = readAccessToken();
  if (!token) {
    console.log(colors.red('No access token found. Please obtain one first (Option 1).'));
    await inquirer.prompt({
      type: 'input',
      name: 'continue',
      message: 'Press Enter to return to main menu...'
    });
    return;
  }
  
  const { postLink, message, count } = await inquirer.prompt([
    {
      type: 'input',
      name: 'postLink',
      message: 'Enter post URL:'
    },
    {
      type: 'input',
      name: 'message',
      message: 'Enter comment message:'
    },
    {
      type: 'number',
      name: 'count',
      message: 'How many times do you want to post this comment?',
      default: 1,
      validate: value => value > 0 ? true : 'Please enter a positive number'
    }
  ]);
  
  const postId = convertPostLink(postLink);
  if (!postId) {
    console.log(colors.red('Invalid post URL!'));
    await inquirer.prompt({
      type: 'input',
      name: 'continue',
      message: 'Press Enter to return to main menu...'
    });
    return;
  }
  
  for (let i = 0; i < count; i++) {
    const result = await postComment(token, postId, message);
    if (result && result.id) {
      console.log(colors.green('Successfully posted comment!'));
      // Log activity to database
      await logActivity(1, 'post_comment', postId, message.substring(0, 100));
    } else {
      console.log(colors.red(`Failed to post comment: ${JSON.stringify(result)}`));
    }
    await sleep(1000);
  }
  
  await inquirer.prompt({
    type: 'input',
    name: 'continue',
    message: 'Press Enter to continue...'
  });
}

/**
 * Auto follow user flow
 */
async function autoFollowUserFlow() {
  clear();
  
  const token = readAccessToken();
  if (!token) {
    console.log(colors.red('No access token found. Please obtain one first (Option 1).'));
    await inquirer.prompt({
      type: 'input',
      name: 'continue',
      message: 'Press Enter to return to main menu...'
    });
    return;
  }
  
  const { profileUrl, count } = await inquirer.prompt([
    {
      type: 'input',
      name: 'profileUrl',
      message: 'Enter profile URL:'
    },
    {
      type: 'number',
      name: 'count',
      message: 'How many times do you want to follow this user?',
      default: 1,
      validate: value => value > 0 ? true : 'Please enter a positive number'
    }
  ]);
  
  const userId = extractUserIdFromUrl(profileUrl);
  if (!userId) {
    console.log(colors.red('Invalid profile URL!'));
    await inquirer.prompt({
      type: 'input',
      name: 'continue',
      message: 'Press Enter to return to main menu...'
    });
    return;
  }
  
  for (let i = 0; i < count; i++) {
    const result = await followUser(token, userId);
    if (result && result.success) {
      console.log(colors.green('Successfully followed user!'));
      // Log activity to database
      await logActivity(1, 'follow', userId, null);
    } else {
      console.log(colors.red(`Failed to follow user: ${JSON.stringify(result)}`));
    }
    await sleep(1000);
  }
  
  await inquirer.prompt({
    type: 'input',
    name: 'continue',
    message: 'Press Enter to continue...'
  });
}

/**
 * Auto unfollow user flow
 */
async function autoUnfollowUserFlow() {
  clear();
  
  const token = readAccessToken();
  if (!token) {
    console.log(colors.red('No access token found. Please obtain one first (Option 1).'));
    await inquirer.prompt({
      type: 'input',
      name: 'continue',
      message: 'Press Enter to return to main menu...'
    });
    return;
  }
  
  const { profileUrl, count } = await inquirer.prompt([
    {
      type: 'input',
      name: 'profileUrl',
      message: 'Enter profile URL:'
    },
    {
      type: 'number',
      name: 'count',
      message: 'How many times do you want to unfollow this user?',
      default: 1,
      validate: value => value > 0 ? true : 'Please enter a positive number'
    }
  ]);
  
  const userId = extractUserIdFromUrl(profileUrl);
  if (!userId) {
    console.log(colors.red('Invalid profile URL!'));
    await inquirer.prompt({
      type: 'input',
      name: 'continue',
      message: 'Press Enter to return to main menu...'
    });
    return;
  }
  
  for (let i = 0; i < count; i++) {
    const result = await unfollowUser(token, userId);
    if (result && result.success) {
      console.log(colors.green('Successfully unfollowed user!'));
      // Log activity to database
      await logActivity(1, 'unfollow', userId, null);
    } else {
      console.log(colors.red(`Failed to unfollow user: ${JSON.stringify(result)}`));
    }
    await sleep(1000);
  }
  
  await inquirer.prompt({
    type: 'input',
    name: 'continue',
    message: 'Press Enter to continue...'
  });
}

/**
 * Auto share post flow
 */
async function autoSharePostFlow() {
  clear();
  
  const token = readAccessToken();
  if (!token) {
    console.log(colors.red('No access token found. Please obtain one first (Option 1).'));
    await inquirer.prompt({
      type: 'input',
      name: 'continue',
      message: 'Press Enter to return to main menu...'
    });
    return;
  }
  
  const { postLink, count } = await inquirer.prompt([
    {
      type: 'input',
      name: 'postLink',
      message: 'Enter post URL:'
    },
    {
      type: 'number',
      name: 'count',
      message: 'How many times do you want to share this post?',
      default: 1,
      validate: value => value > 0 ? true : 'Please enter a positive number'
    }
  ]);
  
  const postId = convertPostLink(postLink);
  if (!postId) {
    console.log(colors.red('Invalid post URL!'));
    await inquirer.prompt({
      type: 'input',
      name: 'continue',
      message: 'Press Enter to return to main menu...'
    });
    return;
  }
  
  for (let i = 0; i < count; i++) {
    const result = await sharePost(token, postId);
    if (result && result.id) {
      console.log(colors.green('Successfully shared post!'));
      // Log activity to database
      await logActivity(1, 'share', postId, null);
    } else {
      console.log(colors.red(`Failed to share post: ${JSON.stringify(result)}`));
    }
    await sleep(1000);
  }
  
  await inquirer.prompt({
    type: 'input',
    name: 'continue',
    message: 'Press Enter to continue...'
  });
}

module.exports = {
  autoPostReactionFlow,
  autoCommentReactionFlow,
  autoPostCommentFlow,
  autoFollowUserFlow,
  autoUnfollowUserFlow,
  autoSharePostFlow
};
