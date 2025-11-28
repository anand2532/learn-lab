# Learn Lab

A comprehensive full-stack learning platform built with Next.js, TypeScript, and Go microservices. Features interactive course learning, code execution, authentication, and a complete backend architecture.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Go 1.21+ (for backend services)

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
```bash
cp .env.local.example .env.local
# Edit .env.local with your configuration
```

3. **Run the development server:**
```bash
npm run dev
```

4. **Open** [http://localhost:3000](http://localhost:3000) in your browser.

### Default Login Credentials
- **Email**: `demo@example.com`
- **Password**: `demo123`

## 📁 Project Structure

```
learn-lab/
├── app/                    # Next.js App Router pages and layouts
│   ├── (auth)/            # Authentication routes
│   ├── (dashboard)/       # Main application (protected)
│   └── api/               # API routes
├── components/            # React components
│   ├── layout/           # Layout components
│   ├── learning/         # Learning-specific components
│   └── ui/               # Reusable UI components
├── lib/                  # Utility functions and helpers
├── backend/             # Go microservices
│   ├── gateway/         # API Gateway
│   ├── services/        # Microservices (auth, course, ai, etc.)
│   └── proto/           # gRPC protocol buffers
└── scripts/              # Build and utility scripts
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: SWR & React Query (TanStack Query)
- **Authentication**: NextAuth.js v5
- **Code Execution**: Pyodide (Python in browser)
- **3D Graphics**: Three.js with React Three Fiber

### Backend
- **Language**: Go
- **Architecture**: Microservices with gRPC
- **Protocol**: Protocol Buffers
- **Database**: PostgreSQL (with migrations)

## 📚 Features

### ✅ Implemented
- **Authentication System**: NextAuth.js with email/password and Google OAuth
- **Course Learning System**: Interactive course viewer with content renderer
- **Code Executor**: Python code execution in browser using Pyodide
- **Visualizations**: Pipeline diagrams, 3D visualizations, math equations
- **UI Components**: Complete component library with layout components
- **Backend Services**: Microservices architecture (Gateway, Auth, Course, AI, Executor, Progress)

### 🚧 In Progress
- Database integration for production
- Video streaming for courses
- Advanced gamification features
- Community features

## 📖 Documentation

### Setup Guides
- **Authentication**: See `AUTH_SETUP.md` for NextAuth.js configuration
- **Course System**: See `COURSE_STRUCTURE.md` for adding new courses
- **Backend**: See `backend/BACKEND_ARCHITECTURE.md` for microservices setup
- **Deployment**: See `RENDER_DEPLOYMENT.md` for Render.com deployment

### Architecture
- **Site Architecture**: `SITE_ARCHITECTURE.md` - Complete frontend architecture
- **Backend Architecture**: `backend/BACKEND_ARCHITECTURE.md` - Microservices design
- **API Contract**: `API_CONTRACT.md` - API documentation

## 🧪 Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
npm run format   # Format code with Prettier
npm test         # Run tests
```

### Backend Services

```bash
cd backend
make install              # Install dependencies
./scripts/start-services.sh  # Start all services
```

## 🚢 Deployment

### Deploy to Render.com

1. **Push to GitHub** (already done)
2. **Connect to Render**:
   - Go to https://dashboard.render.com
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Render will auto-detect `render.yaml`

3. **Set Environment Variables**:
   - `NEXTAUTH_URL`: Your Render app URL
   - `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
   - `GOOGLE_CLIENT_ID`: (Optional, for OAuth)
   - `GOOGLE_CLIENT_SECRET`: (Optional, for OAuth)

4. **Deploy!**

See `RENDER_DEPLOYMENT.md` for detailed instructions.

## 🏗️ Project Organization

The project is organized into feature branches (ready to merge):

- `feature/project-setup` - Project configuration
- `feature/authentication` - Authentication system
- `feature/frontend-components` - UI components library
- `feature/course-system` - Course learning system
- `feature/backend-services` - Backend microservices
- `feature/documentation` - Documentation

## 🔗 Quick Links

- **Repository**: https://github.com/anand2532/learn-lab
- **Issues**: https://github.com/anand2532/learn-lab/issues
- **Pull Requests**: https://github.com/anand2532/learn-lab/pulls

## 📝 Key Files

- `lib/course-data.ts` - All course content
- `lib/auth.ts` - Authentication configuration
- `middleware.ts` - Route protection
- `render.yaml` - Render.com deployment config
- `backend/migrations/` - Database migrations

## 🐛 Troubleshooting

### Common Issues

1. **Build fails**: Check Node.js version (should be 18+)
2. **Auth not working**: Verify `.env.local` has correct `NEXTAUTH_SECRET`
3. **Code executor not working**: Ensure Pyodide script is loaded in `app/layout.tsx`

See `TROUBLESHOOTING.md` for more details.

## 📄 License

MIT

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

**Built with ❤️ for learning and education**
