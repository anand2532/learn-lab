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

## Next Steps

1. Set up database connection (Drizzle or Prisma)
2. Configure authentication (NextAuth or Clerk)
3. Add API routes in `app/api/`
4. Create reusable components in `components/`
5. Set up environment variables for production

## License

MIT

