/**
 * activities.js - Activity logging for Facebook Automation Suite
 */
const { db } = require('./db');

/**
 * Log an activity in the database
 * @param {number} userId - User ID
 * @param {string} activityType - Type of activity ('post_reaction', 'comment_reaction', 'post_comment', 'follow', 'unfollow', 'share')
 * @param {string} targetId - ID of the target (post, comment, user)
 * @param {string} details - Additional details
 * @returns {Promise<boolean>} - Success status
 */
async function logActivity(userId, activityType, targetId, details = null) {
  try {
    const timestamp = new Date();
    
    // Insert activity into database
    await db.query(
      'INSERT INTO activities (user_id, activity_type, target_id, details, timestamp) VALUES ($1, $2, $3, $4, $5)',
      [userId, activityType, targetId, details, timestamp]
    );
    
    console.log(`Activity logged: ${activityType} on ${targetId}`);
    return true;
  } catch (error) {
    console.error('Error logging activity:', error.message);
    return false;
  }
}

/**
 * Get recent activities for a user
 * @param {number} userId - User ID
 * @param {number} limit - Maximum number of activities to return
 * @returns {Promise<Array>} - Array of activity objects
 */
async function getRecentActivities(userId, limit = 10) {
  try {
    const result = await db.query(
      'SELECT * FROM activities WHERE user_id = $1 ORDER BY timestamp DESC LIMIT $2',
      [userId, limit]
    );
    
    return result.rows;
  } catch (error) {
    console.error('Error getting recent activities:', error.message);
    return [];
  }
}

module.exports = {
  logActivity,
  getRecentActivities
};
