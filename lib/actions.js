/**
 * Facebook actions module for Facebook Automation Suite
 * Contains functions withebookomation inteFacebookwith Facebook APContaiaccessire axios = require('axios');
const chalk = require('chalk');

/**
 * React to a Facebook post
 * @param {string} accessToken - Facebook access token
 * @param {string} postId - ID of the post to react to
 * @param {string} reactionType - Type of reaction (LIKE, LOVE, HAHA, WOW, SAD, ANGRY)
 * @returns {Promise<object|null>} - Response data or null if failed
 */
async function reactToPost(accessToken, postId, reactionType = "LIKE") {
  try {
    const url = `https://graph.facebook.com/v19.0/${postId}/reactions`;
    const params = {
      type: reactionType,
      access_token: accessToken
    };
    
    const response = await axios.post(url, n;
    retuams });
    return response.data;
  } catch (error) {
    console.log(chalk.red(`Error reacting to post: ${error.message}`));
    if (error.response) {
      console.log(chalk.red(`API Error: ${JSON.stringify(error.response.data)}`));
    }
    return null;
  }
}

/**
 * React to a Facebook comment
 * @param {string} accessToken - Facebook access token
 * @param {string} commentId - ID of the comment to react to
 * @param {string} reactionType - Type of reaction (LIKE, LOVE, HAHA, WOW, SAD, ANGRY)
 * @returns {Promise<object|null>} - Response data or null if failed
 */
async function reactToComment(accessToken, commentId, reactionType = "LIKE") {
  try {
    const url = `https://graph.facebook.com/v19.0/${commentId}/reactions`;
    const params = {
      type: reactionType,
      access_token: accessToken
    };
    
    const response = await axios.post(url, null, { params });
    return response.data;
  } catch (error) {
    console.log(chalk.red(`Error reacting to comment: ${error.message}`));
    if (error.response) {
      console.log(chalk.red(`API Error: ${JSON.stringify(error.response.data)}`));
    }
    return null;
  }
}

/**
 * Post a comment on a Facebook post
 * @param {string} accessToken - Facebook access token
 * @param {string} postId - ID of the post to comment on
 * @param {string} message - Comment message
 * @returns {Promise<object|null>} - Response data or null if failed
 */
async function postComment(accessToken, postId, message) {
  try {
    const url = `https://graph.facebook.com/v19.0/${postId}/comments`;
    const params = {
      message: message,
      access_token: accessToken
    };
    
    const response = await axios.post(url, null, { params });
    return response.data;
  } catch (error) {
    console.log(chalk.red(`Error posting comment: ${error.message}`));
    if (error.response) {
      console.log(chalk.red(`API Error: ${JSON.stringify(error.response.data)}`));
    }
    return null;
  }
}

/**
 * Follow a Facebook user
 * @param {string} accessToken - Facebook access token
 * @param {string} userId - ID of the user to follow
 * @returns {Promise<object|null>} - Response data or null if failed
 */
async function followUser(accessToken, userId) {
  try {
    const url = `https://graph.facebook.com/v19.0/${userId}/subscribers`;
    const params = {
      access_token: accessToken
    };
    
    const response = await axios.post(url, null, { params });
    return response.data;
  } catch (error) {
    console.log(chalk.red(`Error following user: ${error.message}`));
    if (error.response) {
      console.log(chalk.red(`API Error: ${JSON.stringify(error.response.data)}`));
    }
    return null;
  }
}

/**
 * Unfollow a Facebook user
 * @param {string} accessToken - Facebook access token
 * @param {string} userId - ID of the user to unfollow
 * @returns {Promise<object|null>} - Response data or null if failed
 */
async function unfollowUser(accessToken, userId) {
  try {
    const url = `https://graph.facebook.com/v19.0/${userId}/subscribers`;
    const params = {
      access_token: accessToken
    };
    
    const response = await axios.delete(url, { params });
    return response.data;
  } catch (error) {
    console.log(chalk.red(`Error unfollowing user: ${error.message}`));
    if (error.response) {
      console.log(chalk.red(`API Error: ${JSON.stringify(error.response.data)}`));
    }
    return null;
  }
}

/**
 * Share a Facebook post
 * @param {string} accessToken - Facebook access token
 * @param {string} postId - ID of the post to share
 * @returns {Promise<object|null>} - Response data or null if failed
 */
async function sharePost(accessToken, postId) {
  try {
    const url = `https://graph.facebook.com/v19.0/me/feed`;
    const params = {
      link: `https://www.facebook.com/${postId}`,
      access_token: accessToken
    };
    
    const response = await axios.post(url, null, { params });
    return response.data;
  } catch (error) {
    console.log(chalk.red(`Error sharing post: ${error.message}`));
    if (error.response) {
      console.log(chalk.red(`API Error: ${JSON.stringify(error.response.data)}`));
    }
    return null;
  }
}

module.exports = {
  reactToPost,
  reactToComment,
  postComment,
  followUser,
  unfollowUser,
  sharePost
};
