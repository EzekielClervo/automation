/**
 * Facebook actions module for Facebook Automation Suite
 * Contains functions for interaction with Facebook API
 */
const axios = require('axios');
const { logActivity } = require('../activities');

// Base URL for Facebook Graph API
const FB_API_BASE = 'https://graph.facebook.com/v16.0';

/**
 * React to a Facebook post
 * @param {string} accessToken - Facebook access token
 * @param {string} postId - ID of the post to react to
 * @param {string} reactionType - Type of reaction (LIKE, LOVE, HAHA, WOW, SAD, ANGRY)
 * @returns {Promise<object|null>} - Response data or null if failed
 */
async function reactToPost(accessToken, postId, reactionType = "LIKE") {
  try {
    const url = `${FB_API_BASE}/${postId}/reactions`;
    const params = {
      type: reactionType,
      access_token: accessToken
    };
    const response = await axios.post(url, params);
    
    // Log the activity
    await logActivity(1, 'post_reaction', postId, reactionType);
    
    return response.data;
  } catch (error) {
    console.error('Error reacting to post:', error.message);
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
    const url = `${FB_API_BASE}/${commentId}/reactions`;
    const params = {
      type: reactionType,
      access_token: accessToken
    };
    const response = await axios.post(url, params);
    
    // Log the activity
    await logActivity(1, 'comment_reaction', commentId, reactionType);
    
    return response.data;
  } catch (error) {
    console.error('Error reacting to comment:', error.message);
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
    const url = `${FB_API_BASE}/${postId}/comments`;
    const params = {
      message: message,
      access_token: accessToken
    };
    const response = await axios.post(url, params);
    
    // Log the activity
    await logActivity(1, 'post_comment', postId, message.substring(0, 30));
    
    return response.data;
  } catch (error) {
    console.error('Error posting comment:', error.message);
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
    const url = `${FB_API_BASE}/${userId}/subscribers`;
    const params = {
      access_token: accessToken
    };
    const response = await axios.post(url, params);
    
    // Log the activity
    await logActivity(1, 'follow', userId);
    
    return response.data;
  } catch (error) {
    console.error('Error following user:', error.message);
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
    const url = `${FB_API_BASE}/${userId}/subscribers`;
    const params = {
      access_token: accessToken
    };
    const response = await axios.delete(url, { data: params });
    
    // Log the activity
    await logActivity(1, 'unfollow', userId);
    
    return response.data;
  } catch (error) {
    console.error('Error unfollowing user:', error.message);
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
    const url = `${FB_API_BASE}/me/feed`;
    const params = {
      link: `https://www.facebook.com/${postId}`,
      access_token: accessToken
    };
    const response = await axios.post(url, params);
    
    // Log the activity
    await logActivity(1, 'share', postId);
    
    return response.data;
  } catch (error) {
    console.error('Error sharing post:', error.message);
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
