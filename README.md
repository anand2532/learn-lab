# Learn Lab

A full-stack Next.js project built with TypeScript, featuring modern development tools and best practices.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: SWR & React Query (TanStack Query)
- **Database**: Drizzle ORM (can be switched to Prisma)
- **Authentication**: NextAuth.js (can be switched to Clerk)
- **Utilities**: clsx for conditional classNames
- **Code Quality**: ESLint + Prettier

## Project Structure

```
learn-lab/
├── app/              # Next.js App Router pages and layouts
├── components/       # Reusable React components
├── lib/             # Utility functions and helpers
├── server/          # Server-side code (API routes, server actions)
├── public/          # Static assets
├── scripts/         # Build and utility scripts
└── ...
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm (or yarn/pnpm)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run test` - Run tests (to be configured)

## Configuration

### Tailwind CSS

Tailwind is configured in `tailwind.config.ts`. Customize the theme and add plugins as needed.

### ESLint

ESLint configuration extends Next.js recommended rules. See `.eslintrc.json` for details.

### Prettier

Prettier is configured with Tailwind plugin for class sorting. See `.prettierrc` for formatting options.

## Authentication

The project includes a complete authentication flow with:
- NextAuth.js v5 (beta) with email/password and Google OAuth
- Polished login page with animations
- Study Buddy AI helper component
- Form validation with React Hook Form + Zod
- Session management and protected routes
- **Credential storage**: User credentials are stored in `data/users.json` (automatically created on first run)

### Default Credentials
- **Email**: `demo@example.com`
- **Password**: `demo123`

**Note**: When you first open the website, you'll be redirected to the login page. The credentials file (`data/users.json`) is automatically created with the default user.

See `AUTH_SETUP.md` for detailed setup instructions.

## API Documentation

- `/api/ai/help` - Returns tips about sign-in benefits (see `API_CONTRACT.md`)

## Testing

Run tests with:
```bash
npm test
```

Tests cover login form validation and error handling.

## Course System

The project includes a comprehensive course learning system:

- **Course Page**: `/learn/[courseId]` - Interactive course viewer
- **Course Data**: `lib/course-data.ts` - All course content
- **Components**: 
  - `ContentRenderer` - Renders markdown-like content
  - `CodeExecutor` - Python code execution in browser
  - `PipelineVisualization` - Visual pipeline diagrams
  - `CourseTopics` - Navigation sidebar

### Accessing Courses

1. Login with `demo@example.com` / `demo123`
2. Navigate to `/courses` to see all courses
3. Click on "From Words to Vectors" or go to `/learn/course-1`

See `COURSE_STRUCTURE.md` for detailed documentation on adding new courses.

## Deployment

### Deploy to Render

This project is configured for easy deployment on Render. See `RENDER_DEPLOYMENT.md` for detailed instructions.

**Quick Deploy:**
1. Push your code to GitHub
2. Connect your repository to Render
3. Render will auto-detect `render.yaml` and configure the service
4. Set environment variables in Render dashboard:
   - `NEXTAUTH_URL`: Your Render app URL
   - `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
5. Deploy!

For more details, see `RENDER_DEPLOYMENT.md`.

## Next Steps

1. Set up database connection (Drizzle or Prisma) for production auth
2. Configure Google OAuth credentials (see `AUTH_SETUP.md`)
3. Add more API routes in `app/api/`
4. Create additional reusable components in `components/`
5. Set up environment variables for production
6. Add more courses using the structure in `COURSE_STRUCTURE.md`

## License

MIT

