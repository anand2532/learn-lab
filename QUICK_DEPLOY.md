# Quick Deploy to Render

## 🚀 Fast Deployment (5 minutes)

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Ready for Render deployment"
git push origin main
```

### Step 2: Deploy on Render

1. **Go to Render**: https://dashboard.render.com
2. **Click**: "New +" → "Blueprint"
3. **Connect**: Your GitHub repository
4. **Review**: Settings (auto-detected from `render.yaml`)
5. **Click**: "Apply"

### Step 3: Set Environment Variables

After service is created, go to **Environment** tab:

1. **NEXTAUTH_URL**
   ```
   https://your-app-name.onrender.com
   ```
   (Replace `your-app-name` with your actual app name)

2. **NEXTAUTH_SECRET**
   ```bash
   openssl rand -base64 32
   ```
   (Copy output and paste as value)

3. **GOOGLE_CLIENT_ID** (Optional - leave empty if not using)
4. **GOOGLE_CLIENT_SECRET** (Optional - leave empty if not using)

### Step 4: Wait & Test

- ⏱️ Wait 5-10 minutes for build
- ✅ Check build logs for success
- 🌐 Visit your app URL
- 🔐 Login with: `demo@example.com` / `demo123`

## ✅ That's It!

Your app is now live on Render!

## 📋 Quick Checklist

- [ ] Code pushed to GitHub
- [ ] Render service created
- [ ] Environment variables set
- [ ] Build completed successfully
- [ ] App accessible at your URL
- [ ] Login works

## 🐛 Issues?

See `DEPLOY_CHECKLIST.md` for detailed troubleshooting.


