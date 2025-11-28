# Render Deployment Guide

This guide will help you deploy Learn Lab to Render.

## Prerequisites

1. A GitHub account with this repository
2. A Render account (sign up at https://render.com)

## Step-by-Step Deployment

### Option 1: Using render.yaml (Recommended)

1. **Push your code to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   git push origin main
   ```

2. **Connect to Render**:
   - Go to https://dashboard.render.com
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect `render.yaml` and use it

3. **Set Environment Variables**:
   After the service is created, go to Environment tab and set:
   - `NEXTAUTH_URL`: Your Render app URL (e.g., `https://learn-lab.onrender.com`)
   - `NEXTAUTH_SECRET`: Generate one using:
     ```bash
     openssl rand -base64 32
     ```
   - `GOOGLE_CLIENT_ID`: (Optional) If using Google OAuth
   - `GOOGLE_CLIENT_SECRET`: (Optional) If using Google OAuth

4. **Deploy**:
   - Render will automatically build and deploy
   - Wait for the build to complete (usually 5-10 minutes)

### Option 2: Manual Setup

1. **Create a new Web Service**:
   - Go to https://dashboard.render.com
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure the service**:
   - **Name**: `learn-lab` (or your preferred name)
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free (or choose a paid plan)

3. **Set Environment Variables**:
   - `NODE_ENV`: `production`
   - `NEXTAUTH_URL`: Your Render app URL
   - `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
   - `GOOGLE_CLIENT_ID`: (Optional)
   - `GOOGLE_CLIENT_SECRET`: (Optional)

4. **Deploy**:
   - Click "Create Web Service"
   - Wait for the build to complete

## Important Notes

### Free Tier Limitations

- Render free tier services **spin down after 15 minutes of inactivity**
- First request after spin-down may take 30-60 seconds
- For production, consider upgrading to a paid plan

### Environment Variables

**Required:**
- `NEXTAUTH_URL`: Must match your Render app URL exactly
- `NEXTAUTH_SECRET`: Must be a secure random string

**Optional:**
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`: Only needed if using Google OAuth

### Google OAuth Setup (if using)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth credentials
3. Add authorized redirect URI: `https://your-app.onrender.com/api/auth/callback/google`
4. Copy Client ID and Secret to Render environment variables

### Default Login Credentials

After deployment, you can use:
- **Email**: `demo@example.com`
- **Password**: `demo123`

The `data/users.json` file will be automatically created on first run.

## Troubleshooting

### Build Fails

- Check build logs in Render dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility (should be 18+)

### App Won't Start

- Check that `NEXTAUTH_URL` matches your app URL exactly
- Verify `NEXTAUTH_SECRET` is set
- Check runtime logs in Render dashboard

### 500 Errors

- Check environment variables are set correctly
- Verify the `data/users.json` file can be created (file system is writable on Render)

### Slow First Load

- This is normal on free tier (cold starts)
- Consider upgrading to paid plan for better performance

## Post-Deployment

1. Test the login page
2. Verify authentication works
3. Test course navigation
4. Check API endpoints

## Updating Your App

Simply push changes to your GitHub repository, and Render will automatically redeploy.

```bash
git add .
git commit -m "Your changes"
git push origin main
```

Render will detect the push and trigger a new deployment.


