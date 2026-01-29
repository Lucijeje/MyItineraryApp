# Deployment Guide - GitHub Pages

This guide explains how to deploy the My Itinerary App to GitHub Pages.

## Prerequisites

1. A GitHub repository (already set up)
2. GitHub Pages enabled in repository settings

## Setup Steps

### 1. Enable GitHub Pages

1. Go to your repository on GitHub
2. Navigate to **Settings** > **Pages**
3. Under **Source**, select **GitHub Actions**

### 2. Configure API URL (Optional)

If you have a backend server deployed separately:

1. Go to **Settings** > **Secrets and variables** > **Actions**
2. Click **New repository secret**
3. Name: `REACT_APP_API_URL`
4. Value: Your backend server URL (e.g., `https://your-backend.herokuapp.com`)
5. Click **Add secret**

If you don't set this secret, the app will default to `http://localhost:2000` (which won't work in production).

### 3. Deploy

The deployment happens automatically when you push to the `master` branch:

```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin master
```

### 4. View Your App

After the GitHub Action completes (usually takes 1-2 minutes), your app will be available at:

**https://Lucijeje.github.io/MyItineraryApp**

You can check the deployment status in the **Actions** tab of your repository.

## Important Notes

### Backend Server

GitHub Pages only hosts static files. Your Express backend server needs to be hosted separately. Options include:

- **Heroku**: Free tier available
- **Railway**: Easy deployment
- **Render**: Free tier available
- **Vercel**: Good for Node.js apps
- **DigitalOcean App Platform**: Simple deployment

Once your backend is deployed, update the `REACT_APP_API_URL` secret in GitHub.

### Environment Variables

- The build process uses the `REACT_APP_API_URL` environment variable
- If not set, it defaults to `http://localhost:2000`
- For production, make sure to set this to your actual backend URL

### Troubleshooting

1. **404 errors on refresh**: This is normal for single-page apps. GitHub Pages should handle this automatically with the `404.html` file created during build.

2. **API calls failing**: Make sure:
   - Your backend server is running and accessible
   - CORS is properly configured on your backend
   - The `REACT_APP_API_URL` secret is set correctly

3. **Build fails**: Check the Actions tab for error messages. Common issues:
   - Missing dependencies
   - Syntax errors in code
   - Environment variable issues

## Manual Deployment (Alternative)

If you prefer to deploy manually:

```bash
cd client
npm install
npm run build
```

Then use a tool like `gh-pages`:

```bash
npm install --save-dev gh-pages
```

Add to `package.json`:

```json
"scripts": {
  "deploy": "gh-pages -d build"
}
```

Then run:

```bash
npm run deploy
```

However, the GitHub Actions workflow is recommended as it's automated and keeps your repository clean.
