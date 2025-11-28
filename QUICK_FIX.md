# Quick Fix Guide - Site Not Accessible

## Immediate Steps

1. **Kill all running servers**
   ```bash
   pkill -f "next dev"
   lsof -ti:3000 | xargs kill -9
   ```

2. **Clean build**
   ```bash
   rm -rf .next
   npm run build
   ```

3. **Start fresh server**
   ```bash
   npm run dev
   ```

4. **Wait for ready message**
   Look for: `✓ Ready in X.Xs` or `Local: http://localhost:3000`

5. **Open browser**
   - Go to: `http://localhost:3000`
   - You should see the login page

## If Still Not Working

### Check Server Status
```bash
curl http://localhost:3000/login
```
Should return HTML, not an error.

### Check for Errors
Look at the terminal where `npm run dev` is running for any error messages.

### Verify Environment
```bash
cat .env.local
```
Should have:
- `NEXTAUTH_URL=http://localhost:3000`
- `NEXTAUTH_SECRET=...` (any value)

### Reinstall Dependencies
```bash
rm -rf node_modules .next
npm install
npm run dev
```

## Expected Behavior

1. **First visit**: Redirects to `/login`
2. **After login**: Redirects to `/dashboard`
3. **Course access**: Go to `/learn/course-1` (requires login)

## Login Credentials

- Email: `demo@example.com`
- Password: `demo123`

