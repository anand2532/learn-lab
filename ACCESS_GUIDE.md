# Site Access Guide

## Quick Start

1. **Start the Development Server**
   ```bash
   npm run dev
   ```
   Wait for: `✓ Ready in X.Xs` message

2. **Open Browser**
   - Go to: `http://localhost:3000`
   - You will be redirected to `/login` (this is normal)

3. **Login**
   - Email: `demo@example.com`
   - Password: `demo123`
   - Click "Sign In"

4. **Access Dashboard**
   - After login, you'll be redirected to `/dashboard`

5. **Access Course**
   - Option 1: Go to `/courses` → Click "From Words to Vectors"
   - Option 2: Go directly to `/learn/course-1`

## Troubleshooting

### "Cannot access site" or blank page

1. **Check if server is running**
   ```bash
   ps aux | grep "next dev"
   ```
   If not running, start it:
   ```bash
   npm run dev
   ```

2. **Check port 3000**
   ```bash
   lsof -ti:3000
   ```
   If port is in use, kill it:
   ```bash
   lsof -ti:3000 | xargs kill -9
   ```

3. **Clear browser cache**
   - Hard refresh: `Ctrl+Shift+R` (Linux/Windows) or `Cmd+Shift+R` (Mac)
   - Or clear browser cache

4. **Check browser console**
   - Open DevTools (F12)
   - Check Console tab for errors
   - Check Network tab for failed requests

5. **Rebuild the project**
   ```bash
   npm run build
   ```
   Look for any errors

### "Redirected to login" when accessing course

This is **normal behavior**. The site requires authentication:
- All routes except `/login` are protected
- You must login first
- After login, you can access all pages

### Course page shows "Course not found"

1. Check the course ID in the URL: `/learn/course-1`
2. Verify the course exists in `lib/course-data.ts`
3. Check browser console for errors

### Build errors

If you see build errors:
```bash
npm run build
```

Common issues:
- Missing dependencies: `npm install`
- Type errors: Check TypeScript compilation
- Import errors: Verify file paths

## Server Status

Check if server is responding:
```bash
curl http://localhost:3000/login
```

Should return HTML (not an error).

## Common Routes

- `/` → Redirects to `/dashboard` (if logged in) or `/login`
- `/login` → Login page
- `/dashboard` → Main dashboard (requires auth)
- `/courses` → Course listings (requires auth)
- `/learn/course-1` → Word to Vector course (requires auth)
- `/leaderboard` → Leaderboard (requires auth)

## Still Having Issues?

1. Check the terminal where `npm run dev` is running for errors
2. Check browser console (F12) for JavaScript errors
3. Verify Node.js version: `node --version` (should be 18+)
4. Try a fresh install:
   ```bash
   rm -rf node_modules .next
   npm install
   npm run dev
   ```

