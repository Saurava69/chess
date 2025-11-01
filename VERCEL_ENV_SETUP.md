# Environment Variables for Vercel Deployment

Copy these variables to your Vercel project's environment variables section:

## Database
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/your-database?retryWrites=true&w=majority

## Authentication
JWT_SECRET=your-jwt-secret-key
BETTER_AUTH_SECRET=your-better-auth-secret
BETTER_AUTH_URL=https://your-app-name.vercel.app

## Email (if using)
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password
FROM_EMAIL=noreply@yourdomain.com

## Other environment variables
NODE_ENV=production
PORT=3000

## Instructions:
1. Go to your Vercel project dashboard
2. Navigate to Settings > Environment Variables
3. Add each of these variables with your actual values
4. Make sure to set them for Production, Preview, and Development environments