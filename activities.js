Logreretivities.js - Activity logging for Facebook Automation Suite

const { db } = require('./db');
const { activities } = require('./schema');
const chalk = require('chalk');
const { eq } = require('drizzle-orm');

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
    await db.insert(activities).values({
      user_id: userId,
      activity_type: activityType,
      target_id: targetId,
      details
    });
    
    console.log(chalk.green(`Activity logged: ${activityType}`));
    return true;
  } catch (error) {
    console.log(chalk.red(`Failed to log activity: ${error.message}`));
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
    const result = await db.select()
      .from(activities)
      .where(eq(activities.user_id, userId))
      .orderBy(activities.created_at, 'desc')
      .limit(limit);
    
    return result;
  } catch (error) {
    console.log(chalk.red(`Failed to get recent activities: ${error.message}`));
    return [];
  }
}

module.exports = {
  logActivity,
  getRecentActivities
};
