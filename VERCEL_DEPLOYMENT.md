# Deploying Chess App to Vercel

This guide walks you through deploying your full-stack chess application to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **MongoDB Atlas**: Set up a MongoDB database (or use your existing one)
3. **Git Repository**: Your code should be in a Git repository (GitHub, GitLab, etc.)

## Deployment Steps

### 1. Install Dependencies

First, install the new Vercel dependency:

```bash
npm install
```

### 2. Prepare Your Database

Make sure your MongoDB database is accessible from the internet:
- If using MongoDB Atlas, ensure your IP whitelist includes `0.0.0.0/0` or Vercel's IP ranges
- Note your connection string format: `mongodb+srv://username:password@cluster.mongodb.net/database`

### 3. Deploy to Vercel

#### Option A: Deploy from Git (Recommended)

1. Push your code to GitHub/GitLab
2. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your repository
5. Vercel will automatically detect the configuration

#### Option B: Deploy using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow the prompts
```

### 4. Configure Environment Variables

In your Vercel project dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add these variables for **Production**, **Preview**, and **Development**:

#### Required Variables:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
BETTER_AUTH_SECRET=your-32-character-random-string
BETTER_AUTH_URL=https://your-app-name.vercel.app
NODE_ENV=production
```

#### Optional Variables (if used in your app):
```
JWT_SECRET=your-jwt-secret
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-email-username
SMTP_PASS=your-email-password
FROM_EMAIL=noreply@yourdomain.com
```

### 5. Update BETTER_AUTH_URL

After deployment:
1. Note your Vercel app URL (e.g., `https://your-app-name.vercel.app`)
2. Update the `BETTER_AUTH_URL` environment variable with this URL
3. Redeploy if necessary

### 6. Test Your Deployment

1. Visit your Vercel app URL
2. Test key functionality:
   - Homepage loads correctly
   - Authentication works
   - API endpoints respond
   - Database connections work

## Troubleshooting

### Build Failures

If the build fails:
```bash
# Test build locally
npm run vercel-build

# Check for TypeScript errors
npm run check --workspaces
```

### Database Connection Issues

- Ensure MongoDB URI is correct
- Check IP whitelist in MongoDB Atlas
- Verify username/password in connection string

### Environment Variables

- Make sure all required variables are set
- Check variable names for typos
- Ensure values don't have extra spaces or quotes

### Function Timeout

If API functions timeout:
- Check the `maxDuration` setting in `vercel.json`
- Optimize database queries
- Consider connection pooling

## File Structure After Deployment

```
your-chess-app/
├── api/
│   └── index.ts          # Serverless function handling all API routes
├── client/
│   ├── dist/            # Built JavaScript bundles
│   └── public/          # Static assets and HTML files
├── server/              # Server code (used by api/index.ts)
├── shared/              # Shared utilities
├── vercel.json          # Vercel configuration
├── package.json         # Root package.json with vercel-build script
└── VERCEL_ENV_SETUP.md  # This deployment guide
```

## Custom Domain (Optional)

To use a custom domain:
1. Go to your project settings in Vercel
2. Click "Domains"
3. Add your domain
4. Update DNS records as instructed
5. Update `BETTER_AUTH_URL` environment variable

## Environment-Specific Deployments

- **Production**: Automatic deployment from main branch
- **Preview**: Automatic deployment from pull requests
- **Development**: Manual deployments or branch deployments

## Performance Optimization

1. **Static Assets**: Served directly from Vercel's CDN
2. **API Functions**: Run on-demand, scale automatically
3. **Database**: Use connection pooling and indexing
4. **Client**: JavaScript bundles are optimized by Webpack

## Support

If you encounter issues:
1. Check Vercel's deployment logs
2. Review the Vercel documentation
3. Check your environment variables
4. Test locally with `npm run vercel-build`

---

**Note**: This configuration supports your multi-page chess application with separate HTML files for each route, maintaining SEO benefits while enabling serverless deployment.