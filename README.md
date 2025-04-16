# Facebook Automation Suite (Node.js)

A Node.js implementation of a Facebook Automation Suite, designed to be deployed on Render.com.

## Features

- Facebook token acquisition using email and password
- Auto post reactions
- Auto comment reactions
- Auto post commenting
- Auto follow/unfollow users
- Auto share posts
- Activity logging in database

## Technical Implementation

- Full Node.js implementation (converted from Python)
- PostgreSQL database integration
- Modular architecture with separate concerns:
  - Authentication
  - Actions
  - UI flows
  - Utilities
  - Activity logging

## Database Schema

The application uses PostgreSQL with the following tables:
- Users: Store user information
- Tokens: Store Facebook access tokens
- Activities: Log user activities

## Requirements

- Node.js (v12 or higher)
- PostgreSQL database
- Environment variable: DATABASE_URL

## Deployment on Render.com

### Automatic Deployment (Recommended)

This application includes a `render.yaml` configuration file for automatic deployment:

1. Push code to a GitHub repository
2. Sign in to Render.com
3. Click the "Blueprint" button
4. Connect to your GitHub repository
5. Render will automatically set up both the web service and PostgreSQL database

### Manual Deployment

Alternatively, you can deploy manually:

1. Push code to a GitHub repository
2. Create a new PostgreSQL database on Render
3. Create a new Web Service on Render
4. Connect to the GitHub repository
5. Set environment variable `DATABASE_URL` to your PostgreSQL connection string
6. Set build command: `npm install`
7. Set start command: `node index.js`
8. Deploy the application

## Local Development

To run the application locally:

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up PostgreSQL database and configure DATABASE_URL
4. Run the application: `node index.js`
