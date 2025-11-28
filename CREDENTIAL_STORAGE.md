# Credential Storage System

## Overview

The application stores user credentials in a JSON file located at `data/users.json`. This file is automatically created when the application first runs.

## How It Works

1. **Automatic Initialization**: When the app starts, if `data/users.json` doesn't exist, it's automatically created with a default user:
   - Email: `demo@example.com`
   - Password: `demo123`
   - Name: `Demo User`

2. **File Location**: `data/users.json` (in the project root)

3. **File Format**:
```json
[
  {
    "id": "1",
    "email": "demo@example.com",
    "password": "demo123",
    "name": "Demo User"
  }
]
```

## Security Notes

⚠️ **Important**: This is a development/demo setup. For production:
- Passwords should be hashed using bcrypt or similar
- Use a proper database (PostgreSQL, MySQL, etc.)
- Never commit `data/users.json` to version control (already in `.gitignore`)

## API Endpoints

### Verify Credentials
- **POST** `/api/auth/verify`
- Body: `{ "email": "user@example.com", "password": "password123" }`
- Returns: User object (without password) or error

### Manage Users (Protected)
- **GET** `/api/users` - List all users (requires authentication)
- **POST** `/api/users` - Create new user (requires authentication)
  - Body: `{ "email": "user@example.com", "password": "password123", "name": "User Name" }`

## Adding New Users

You can add users by:
1. Editing `data/users.json` directly (not recommended for production)
2. Using the `/api/users` POST endpoint (requires authentication)
3. Programmatically via the `createUser` function in `lib/users-server.ts`

## Login Flow

1. User visits website → Redirected to `/login` if not authenticated
2. User enters email/password
3. Credentials are verified via `/api/auth/verify`
4. NextAuth.js creates a session
5. User is redirected to home page

## Default Behavior

When you first open the website:
- You'll see the login page
- Use the default credentials: `demo@example.com` / `demo123`
- After login, you'll be redirected to the home page

