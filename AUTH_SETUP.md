# Authentication Setup Guide

This project uses NextAuth.js v5 (beta) for authentication with support for:
- Email/Password authentication (Credentials provider)
- Google OAuth

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Generating NEXTAUTH_SECRET

You can generate a secure secret using:

```bash
openssl rand -base64 32
```

Or use an online generator: https://generate-secret.vercel.app/32

### Setting up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Configure the OAuth consent screen
6. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
7. Copy the Client ID and Client Secret to your `.env.local` file

## Demo Credentials

For testing purposes, you can use:
- **Email**: `demo@example.com`
- **Password**: `demo123`

**Note**: In production, replace the demo credentials in `lib/auth.ts` with actual database authentication.

## Authentication Flow

1. **Login Page**: `/login` - Users can sign in with email/password or Google
2. **Protected Routes**: All routes except `/login` require authentication
3. **Session Management**: Handled automatically by NextAuth.js
4. **Middleware**: Redirects unauthenticated users to `/login`

## Components

### Login Page (`app/(auth)/login/page.tsx`)
- Animated card entry using Framer Motion
- Form validation with React Hook Form and Zod
- Study Buddy AI helper component
- Google OAuth button

### Study Buddy Component (`components/StudyBuddy.tsx`)
- Displays tips about sign-in benefits
- Fetches tips from `/api/ai/help` endpoint
- Animated entry with Framer Motion

## API Routes

### `/api/auth/[...nextauth]`
NextAuth.js handler for all authentication operations.

### `/api/ai/help`
Returns tips about sign-in benefits. See `API_CONTRACT.md` for details.

## Testing

Run the test suite:

```bash
npm test
```

Tests cover:
- Form validation (email format, password length)
- Error handling
- Loading states
- Successful login flow

## Production Considerations

1. **Database Integration**: Replace demo credentials with actual database queries
2. **Password Hashing**: Use bcrypt or similar for password storage
3. **Rate Limiting**: Add rate limiting to prevent brute force attacks
4. **Email Verification**: Add email verification for new accounts
5. **Session Security**: Configure secure session cookies for production
6. **Environment Variables**: Never commit `.env.local` to version control

