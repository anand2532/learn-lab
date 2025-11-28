# Troubleshooting: Site Cannot Be Reached

## ✅ Current Status
The development server **IS RUNNING** and responding correctly.

## Quick Fix Steps

### 1. Verify Server is Running
```bash
# Check if server process exists
ps aux | grep "next dev" | grep -v grep

# Check if port 3000 is listening
lsof -i :3000
# OR
netstat -tlnp | grep :3000
```

### 2. Access the Site
Open your browser and go to:
- **http://localhost:3000**
- **http://127.0.0.1:3000**

You should be automatically redirected to `/login`

### 3. If Still Not Working

#### Option A: Restart the Server
```bash
cd /home/anand/personal/learn-lab

# Kill existing server
pkill -f "next dev"

# Start fresh
npm run dev
```

#### Option B: Use the Start Script
```bash
cd /home/anand/personal/learn-lab
./start-server.sh
```

### 4. Browser Issues

If the server is running but browser shows "cannot be reached":

1. **Hard Refresh**: Press `Ctrl+Shift+R` (Linux/Windows) or `Cmd+Shift+R` (Mac)
2. **Clear Cache**: Clear browser cache and cookies
3. **Try Incognito**: Open in private/incognito window
4. **Check Console**: Press F12, check Console tab for errors
5. **Try Different Browser**: Test in Chrome, Firefox, or Edge

### 5. Network/Firewall Issues

```bash
# Test from command line
curl http://localhost:3000/login

# Should return HTML (not an error)
```

If curl works but browser doesn't:
- Check firewall settings
- Disable VPN if active
- Check proxy settings in browser

### 6. Port Already in Use

If port 3000 is busy:
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

### 7. Check Server Logs

The server should show:
```
✓ Ready in X.Xs
- Local:        http://localhost:3000
```

If you see errors, check:
- `.env.local` file exists
- All dependencies installed: `npm install`
- No TypeScript errors: `npm run build`

## Common Issues

### Issue: "Connection Refused"
**Cause**: Server is not running
**Fix**: Start the server with `npm run dev`

### Issue: "This site can't be reached" (Browser)
**Cause**: Browser cache or network issue
**Fix**: 
1. Hard refresh (Ctrl+Shift+R)
2. Try incognito mode
3. Check browser console for errors

### Issue: Server starts but immediately stops
**Cause**: Build errors or missing dependencies
**Fix**:
```bash
rm -rf .next node_modules
npm install
npm run build
npm run dev
```

### Issue: Redirects to login but shows blank page
**Cause**: JavaScript errors or missing environment variables
**Fix**: Check browser console (F12) for errors

## Verification Commands

```bash
# 1. Check server is running
ps aux | grep "next dev" | grep -v grep

# 2. Check port is listening
lsof -i :3000

# 3. Test HTTP response
curl -I http://localhost:3000/login

# 4. Check environment file
cat .env.local

# 5. Test build
npm run build
```

## Expected Behavior

1. **Server starts**: Shows "Ready in X.Xs"
2. **Visit http://localhost:3000**: Automatically redirects to `/login`
3. **Login page loads**: Shows "Learn Lab" and login form
4. **After login**: Redirects to `/dashboard`

## Still Not Working?

1. Share the output of: `npm run dev`
2. Share browser console errors (F12 → Console)
3. Share the output of: `curl http://localhost:3000/login`
4. Check if you're accessing from a different machine (use your IP address instead of localhost)

