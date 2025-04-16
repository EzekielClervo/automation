// schema.js - Database schema for Facebook Automation Suite

const { pgTable, serial, text, timestamp } = require('drizzle-orm/pg-core');

// Users table - Store user data
const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull(),
  password: text('password').notNull(), // In production, should be hashed
  created_at: timestamp('created_at').defaultNow()
});

// Tokens table - Store Facebook access tokens
const tokens = pgTable('tokens', {
  id: serial('id').primaryKey(),
  user_id: serial('user_id').references(() => users.id),
  access_token: text('access_token').notNull(),
  created_at: timestamp('created_at').defaultNow()
});

// Activities table - Store activity logs
const activities = pgTable('activities', {
  id: serial('id').primaryKey(),
  user_id: serial('user_id').references(() => users.id),
  activity_type: text('activity_type').notNull(), // 'post_reaction', 'comment_reaction', 'post_comment', 'follow', 'unfollow', 'share'
  target_id: text('target_id').notNull(), // ID of the post, comment, or user
  details: text('details'), // Additional details (e.g., reaction type, comment content)
  created_at: timestamp('created_at').defaultNow()
});

module.exports = {
  users,
  tokens,
  activities
};
