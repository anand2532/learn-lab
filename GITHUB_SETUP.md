# GitHub Issues and Pull Requests Setup Guide

This guide helps you set up GitHub issues and pull requests for the Learn Lab project.

## Overview

The project has been organized into 6 feature branches:
1. `feature/project-setup` - Project configuration and setup
2. `feature/authentication` - Authentication system
3. `feature/frontend-components` - UI components library
4. `feature/course-system` - Course learning system
5. `feature/backend-services` - Backend microservices
6. `feature/documentation` - Documentation and remaining features

## Quick Setup (Using GitHub CLI)

If you have GitHub CLI installed:

```bash
# Authenticate
gh auth login

# Run the automation script
./scripts/setup-github-issues-prs.sh
```

## Manual Setup

### Step 1: Create Issues

Create the following issues on GitHub:

#### Issue #1: Project Setup & Configuration

**Title:** Project Setup & Configuration

**Labels:** `feature`, `documentation`

**Body:**
```markdown
## Overview
This issue covers the initial project setup, configuration files, and development environment setup.

## Changes Included
- Next.js 14 configuration with TypeScript
- Tailwind CSS setup and configuration
- ESLint and Prettier configuration
- Environment variable templates (.env.local.example)
- Node.js version specification (.nvmrc)
- Package.json with all dependencies
- Build and deployment configuration (render.yaml)
- Git ignore configuration

## Files
- `next.config.js`
- `tailwind.config.ts`
- `tsconfig.json`
- `package.json`
- `.nvmrc`
- `.env.local.example`
- `render.yaml`
- `.gitignore`

## Testing
- ✅ Project builds successfully
- ✅ All dependencies installed
- ✅ Configuration validated
```

#### Issue #2: Authentication System Implementation

**Title:** Authentication System Implementation

**Labels:** `feature`, `frontend`

**Body:**
```markdown
## Overview
Complete authentication system implementation using NextAuth.js v5 with email/password and Google OAuth support.

## Features
- NextAuth.js v5 (beta) integration
- Email/Password authentication
- Google OAuth integration
- Session management
- Protected routes with middleware
- Login page with animations
- Form validation (React Hook Form + Zod)
- Study Buddy AI helper component

## Files
- `lib/auth.ts` - Authentication configuration
- `app/(auth)/login/page.tsx` - Login page
- `app/api/auth/[...nextauth]/route.ts` - NextAuth handler
- `app/api/auth/verify/route.ts` - Verification endpoint
- `components/StudyBuddy.tsx` - AI helper component
- `middleware.ts` - Route protection
- `AUTH_SETUP.md` - Setup documentation
- `__tests__/login-form.test.tsx` - Tests

## Testing
- ✅ Login form validation
- ✅ Error handling
- ✅ Session management
- ✅ Protected routes
```

#### Issue #3: Frontend Components & UI Library

**Title:** Frontend Components & UI Library

**Labels:** `feature`, `frontend`

**Body:**
```markdown
## Overview
Reusable UI components and layout components for the application.

## Components
### Layout Components
- `Header.tsx` - Main header with navigation
- `Sidebar.tsx` - Sidebar navigation
- `Footer.tsx` - Footer component
- `Breadcrumb.tsx` - Breadcrumb navigation
- `DashboardLayout.tsx` - Dashboard layout wrapper

### UI Components
- `Button.tsx` - Reusable button component
- `Card.tsx` - Card component

### Dashboard Components
- `DashboardSidebar.tsx` - Dashboard sidebar
- `CourseCalendar.tsx` - Course calendar view

### Providers
- `Providers.tsx` - React Query and other providers

## Files
- `components/layout/*`
- `components/ui/*`
- `components/dashboard/*`
- `components/Providers.tsx`

## Styling
- Tailwind CSS for all styling
- Responsive design
- Dark mode support
```

#### Issue #4: Course System & Learning Console

**Title:** Course System & Learning Console

**Labels:** `feature`, `frontend`

**Body:**
```markdown
## Overview
Complete course learning system with interactive content rendering, code execution, and visualizations.

## Features
- Course data structure and management
- Interactive content renderer (markdown-like)
- Python code executor (Pyodide)
- Pipeline visualizations
- 3D visualizations
- Math equation rendering (KaTeX)
- Course topics navigation
- Learning console interface

## Components
- `ContentRenderer.tsx` - Renders course content
- `CodeExecutor.tsx` - Python code execution
- `PipelineVisualization.tsx` - Pipeline diagrams
- `Interactive3DVisualization.tsx` - 3D visualizations
- `MathEquation.tsx` - Math rendering
- `CourseTopics.tsx` - Topics sidebar
- `LearningConsole.tsx` - Main learning interface
- `FlowDiagram.tsx` - Flow diagrams

## Files
- `lib/course-data.ts` - Course content data
- `lib/code-templates.ts` - Code templates
- `app/(dashboard)/learn/[courseId]/page.tsx` - Course page
- `app/(dashboard)/courses/page.tsx` - Courses listing
- `components/learning/*`
- `COURSE_STRUCTURE.md` - Documentation

## Features
- ✅ Interactive course viewer
- ✅ Python code execution in browser
- ✅ Visual pipeline diagrams
- ✅ 3D vector space visualizations
- ✅ Math equation support
```

#### Issue #5: Backend Services Architecture

**Title:** Backend Services Architecture

**Labels:** `feature`, `backend`

**Body:**
```markdown
## Overview
Microservices backend architecture using Go with gRPC and protocol buffers.

## Services
- **Gateway Service** - API gateway
- **Auth Service** - Authentication and user management
- **Course Service** - Course content management
- **AI Service** - AI/ML functionality
- **Executor Service** - Code execution service
- **Progress Service** - User progress tracking

## Architecture
- gRPC for inter-service communication
- Protocol Buffers for API definitions
- Database migrations
- Service-specific configurations

## Files
- `backend/gateway/` - API Gateway
- `backend/services/auth-service/` - Auth service
- `backend/services/course-service/` - Course service
- `backend/services/ai-service/` - AI service
- `backend/services/executor-service/` - Executor service
- `backend/services/progress-service/` - Progress service
- `backend/proto/` - Protocol buffer definitions
- `backend/migrations/` - Database migrations
- `backend/BACKEND_ARCHITECTURE.md` - Architecture docs

## Scripts
- `backend/scripts/install-dependencies.sh`
- `backend/scripts/start-services.sh`
- `backend/scripts/stop-services.sh`
```

#### Issue #6: Documentation & Deployment Configuration

**Title:** Documentation & Deployment Configuration

**Labels:** `documentation`

**Body:**
```markdown
## Overview
Comprehensive documentation and deployment configuration for the project.

## Documentation Files
- `README.md` - Main project documentation
- `SITE_ARCHITECTURE.md` - Site architecture overview
- `BACKEND_ARCHITECTURE.md` - Backend architecture
- `AUTH_SETUP.md` - Authentication setup guide
- `COURSE_STRUCTURE.md` - Course structure guide
- `RENDER_DEPLOYMENT.md` - Deployment guide
- `DEPLOYMENT_SUMMARY.md` - Deployment summary
- `PROJECT_TODO.md` - Project roadmap
- `API_CONTRACT.md` - API documentation
- `TROUBLESHOOTING.md` - Troubleshooting guide
- Various other documentation files

## Deployment
- Render.com deployment configuration (`render.yaml`)
- Environment variable templates
- Node.js version specification
- Build configuration

## Files
- All `*.md` documentation files
- `render.yaml`
- `.env.local.example`
- `.nvmrc`
```

### Step 2: Create Pull Requests

For each feature branch, create a pull request:

1. **PR #1: Project Setup & Configuration**
   - Base: `main`
   - Head: `feature/project-setup`
   - Title: "feat: Project Setup & Configuration"
   - Description: "Implements project setup and configuration. Closes #1"
   - Labels: `feature`, `documentation`

2. **PR #2: Authentication System**
   - Base: `main`
   - Head: `feature/authentication`
   - Title: "feat: Authentication System Implementation"
   - Description: "Implements complete authentication system with NextAuth.js. Closes #2"
   - Labels: `feature`, `frontend`

3. **PR #3: Frontend Components**
   - Base: `main`
   - Head: `feature/frontend-components`
   - Title: "feat: Frontend Components & UI Library"
   - Description: "Adds reusable UI components and layout components. Closes #3"
   - Labels: `feature`, `frontend`

4. **PR #4: Course System**
   - Base: `main`
   - Head: `feature/course-system`
   - Title: "feat: Course System & Learning Console"
   - Description: "Implements interactive course learning system. Closes #4"
   - Labels: `feature`, `frontend`

5. **PR #5: Backend Services**
   - Base: `main`
   - Head: `feature/backend-services`
   - Title: "feat: Backend Services Architecture"
   - Description: "Implements microservices backend architecture. Closes #5"
   - Labels: `feature`, `backend`

6. **PR #6: Documentation**
   - Base: `main`
   - Head: `feature/documentation`
   - Title: "docs: Documentation & Deployment Configuration"
   - Description: "Adds comprehensive documentation and deployment config. Closes #6"
   - Labels: `documentation`

### Step 3: Merge Pull Requests

Merge each PR in order (1-6) using squash merge to keep history clean.

### Step 4: Close Issues

After merging each PR, the corresponding issue will be automatically closed if you used "Closes #X" in the PR description.

## Using the Automation Script

The script `scripts/setup-github-issues-prs.sh` can automate the creation of issues. To use it:

1. Get a GitHub Personal Access Token:
   - Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Generate a new token with `repo` scope

2. Run the script:
   ```bash
   ./scripts/setup-github-issues-prs.sh YOUR_GITHUB_TOKEN
   ```

3. The script will create all 6 issues with proper labels and descriptions.

4. Then manually create PRs linking to these issues, or use the GitHub web interface.

## Branch Status

All feature branches have been pushed to GitHub:
- ✅ `feature/project-setup`
- ✅ `feature/authentication`
- ✅ `feature/frontend-components`
- ✅ `feature/course-system`
- ✅ `feature/backend-services`
- ✅ `feature/documentation`

## Next Steps

1. Create issues using the templates above
2. Create pull requests for each branch
3. Review and merge PRs in order
4. Issues will auto-close when PRs are merged

