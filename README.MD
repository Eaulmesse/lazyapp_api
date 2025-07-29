# Backend Configuration

## Environment Setup

1. Copy the environment template:
   `ash
   cp .env.example .env
   `

2. Update the .env file with your actual values:
   - DATABASE_URL: Your MySQL database connection string
   - JWT_SECRET: A secure random string for JWT token signing
   - RESEND_API_KEY: Your Resend API key for email functionality
   - FROM_EMAIL: The email address to send emails from
   - FRONTEND_URL: Your frontend application URL

## Security Note

The .env file contains sensitive information and is not tracked by Git. 
Never commit your actual .env file to version control.

## Available Environment Variables

- NODE_ENV: Environment (development, production, test)
- PORT: Server port (default: 3000)
- DATABASE_URL: MySQL database connection string
- JWT_SECRET: Secret key for JWT token signing
- RESEND_API_KEY: API key for Resend email service
- FROM_EMAIL: Email address for sending emails
- FRONTEND_URL: Frontend application URL
