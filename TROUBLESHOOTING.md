# Troubleshooting Guide - "Site Cannot Be Reached"

## Quick Fixes

### 1. Check if Server is Running

```bash
# Check if port 3000 is in use
lsof -ti:3000

# Check if Next.js process is running
ps aux | grep "next dev"
```

### 2. Start the Development Server

```bash
cd /home/anand/personal/learn-lab
npm run dev
```

Wait for the message: `✓ Ready in X.Xs` or `Local: http://localhost:3000`

### 3. Common Issues and Solutions

#### Issue: Port 3000 Already in Use

**Solution:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

#### Issue: "Cannot GET /" or Blank Page

**This is normal!** The app redirects to `/login` automatically.

**Solution:**
- Go directly to: http://localhost:3000/login
- Or wait for the redirect

#### Issue: Server Won't Start

**Solution:**
```bash
# Clean install
rm -rf node_modules .next
npm install
npm run dev
```

#### Issue: Environment Variables Missing

**Solution:**
```bash
# Check if .env.local exists
cat .env.local

# Should contain:
# NEXTAUTH_URL=http://localhost:3000
# NEXTAUTH_SECRET=your-secret-here
```

#### Issue: Build Errors

**Solution:**
```bash
# Rebuild
npm run build

# Check for TypeScript errors
npx tsc --noEmit
```

### 4. Verify Server is Working

```bash
# Test with curl
curl http://localhost:3000/login

# Should return HTML (not an error)
```

### 5. Browser Issues

- **Hard refresh**: `Ctrl+Shift+R` (Linux/Windows) or `Cmd+Shift+R` (Mac)
- **Clear cache**: Clear browser cache and cookies
- **Try incognito mode**: Open in private/incognito window
- **Check browser console**: Press F12, check Console tab for errors

### 6. Network Issues

- **Firewall**: Check if firewall is blocking port 3000
- **VPN**: Disable VPN if it's interfering
- **Proxy**: Check proxy settings

## Expected Behavior

1. **First visit to http://localhost:3000**:
   - Should redirect to `/login`
   - This is normal behavior (authentication required)

2. **Login page**:
   - Should show login form
   - Use: `demo@example.com` / `demo123`

3. **After login**:
   - Should redirect to `/dashboard`

## Server Status Commands

```bash
# Check if server is running
curl http://localhost:3000/login

# Check port
lsof -ti:3000

# View server logs
# (Check the terminal where you ran `npm run dev`)
```

## Still Not Working?

1. **Check server logs**: Look at the terminal where `npm run dev` is running
2. **Check browser console**: Press F12, check for JavaScript errors
3. **Verify Node.js version**: `node --version` (should be 18+)
4. **Try production build**:
   ```bash
   npm run build
   npm start
   ```

## Getting Help

If none of these work:
1. Share the error message from the terminal
2. Share the browser console errors (F12)
3. Share the output of `npm run dev`


