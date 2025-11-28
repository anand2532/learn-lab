# Render Deployment Checklist

## ✅ Pre-Deployment Checklist

### Build Verification
- [x] `npm run build` completes successfully
- [x] No TypeScript errors
- [x] No linting errors
- [x] All dependencies installed

### Configuration Files
- [x] `render.yaml` configured correctly
- [x] `next.config.js` optimized for production
- [x] `.nvmrc` specifies Node.js version (18+)
- [x] `package.json` has correct start script

### Environment Variables
- [ ] `NEXTAUTH_URL` - Set to your Render app URL
- [ ] `NEXTAUTH_SECRET` - Generate with `openssl rand -base64 32`
- [ ] `GOOGLE_CLIENT_ID` - Optional (if using Google OAuth)
- [ ] `GOOGLE_CLIENT_SECRET` - Optional (if using Google OAuth)

## 🚀 Deployment Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Ready for Render deployment"
git push origin main
```

### 2. Deploy on Render

#### Option A: Using Blueprint (Recommended)
1. Go to https://dashboard.render.com
2. Click "New +" → "Blueprint"
3. Connect your GitHub repository
4. Render will auto-detect `render.yaml`
5. Review settings and click "Apply"

#### Option B: Manual Setup
1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `learn-lab`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free
5. Click "Create Web Service"

### 3. Set Environment Variables

After service is created, go to **Environment** tab:

1. **NEXTAUTH_URL**
   - Value: `https://your-app-name.onrender.com`
   - Replace `your-app-name` with your actual app name

2. **NEXTAUTH_SECRET**
   - Generate: `openssl rand -base64 32`
   - Copy the output and paste as value

3. **GOOGLE_CLIENT_ID** (Optional)
   - Only if using Google OAuth
   - Leave empty if not using

4. **GOOGLE_CLIENT_SECRET** (Optional)
   - Only if using Google OAuth
   - Leave empty if not using

### 4. Deploy

- Render will automatically start building
- Wait 5-10 minutes for build to complete
- Check build logs for any errors

## ✅ Post-Deployment Verification

### Test These URLs:
- [ ] `https://your-app.onrender.com` - Should redirect to login
- [ ] `https://your-app.onrender.com/login` - Login page loads
- [ ] Login with `demo@example.com` / `demo123` - Authentication works
- [ ] `https://your-app.onrender.com/dashboard` - Dashboard loads after login
- [ ] `https://your-app.onrender.com/courses` - Courses page loads
- [ ] `https://your-app.onrender.com/learn/course-1` - Course page loads

### Check These Features:
- [ ] Authentication flow works
- [ ] Code executor loads (Python runtime)
- [ ] Course content displays correctly
- [ ] Navigation works
- [ ] No console errors in browser

## 🐛 Common Issues & Fixes

### Build Fails
**Error**: Build command fails
**Fix**: 
- Check build logs in Render dashboard
- Verify all dependencies in `package.json`
- Ensure Node.js version is 18+

### App Won't Start
**Error**: Service shows "Unhealthy" or won't start
**Fix**:
- Check `NEXTAUTH_URL` matches app URL exactly
- Verify `NEXTAUTH_SECRET` is set
- Check runtime logs in Render dashboard

### 500 Errors
**Error**: Internal server errors
**Fix**:
- Verify environment variables are set
- Check that `data/users.json` can be created
- Review server logs

### Slow First Load
**Issue**: First request takes 30-60 seconds
**Fix**: 
- This is normal on free tier (cold starts)
- Service spins down after 15 min inactivity
- Consider upgrading to paid plan

### Authentication Not Working
**Error**: Can't login or redirects fail
**Fix**:
- Verify `NEXTAUTH_URL` is exactly your app URL
- Check `NEXTAUTH_SECRET` is set correctly
- Ensure no trailing slashes in URLs

## 📝 Notes

- **Free Tier**: Services spin down after 15 min inactivity
- **Cold Starts**: First request after spin-down takes 30-60 seconds
- **File System**: `data/users.json` is created automatically on first run
- **Auto-Deploy**: Render auto-deploys on git push to main branch

## 🔄 Updating Your App

After making changes:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

Render will automatically detect the push and redeploy.

## 📞 Support

If you encounter issues:
1. Check Render dashboard logs
2. Review browser console (F12)
3. Verify environment variables
4. Check Render status page: https://status.render.com


