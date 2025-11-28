#!/bin/bash

# Script to create GitHub issues and PRs for Learn Lab project
# Usage: ./scripts/setup-github-issues-prs.sh [GITHUB_TOKEN]
# If GITHUB_TOKEN is not provided, it will try to use gh CLI or prompt for token

set -e

REPO="anand2532/learn-lab"
GITHUB_API="https://api.github.com/repos/${REPO}"

# Get GitHub token
if [ -n "$1" ]; then
    TOKEN="$1"
elif command -v gh &> /dev/null && gh auth status &> /dev/null; then
    TOKEN=$(gh auth token)
else
    echo "Please provide a GitHub token:"
    echo "Usage: $0 [GITHUB_TOKEN]"
    echo "Or install GitHub CLI (gh) and authenticate: gh auth login"
    exit 1
fi

# Function to create an issue
create_issue() {
    local title="$1"
    local body="$2"
    local labels="$3"
    
    echo "Creating issue: $title"
    
    local response=$(curl -s -X POST "${GITHUB_API}/issues" \
        -H "Authorization: token ${TOKEN}" \
        -H "Accept: application/vnd.github.v3+json" \
        -d "{
            \"title\": \"${title}\",
            \"body\": \"${body}\",
            \"labels\": [${labels}]
        }")
    
    local issue_number=$(echo "$response" | grep -o '"number":[0-9]*' | head -1 | cut -d':' -f2)
    echo "Created issue #${issue_number}: ${title}"
    echo "$issue_number"
}

# Function to create a PR
create_pr() {
    local title="$1"
    local body="$2"
    local head="$3"
    local base="$4"
    local issue_number="$5"
    
    echo "Creating PR: $title"
    
    local pr_body="${body}\n\nCloses #${issue_number}"
    
    local response=$(curl -s -X POST "${GITHUB_API}/pulls" \
        -H "Authorization: token ${TOKEN}" \
        -H "Accept: application/vnd.github.v3+json" \
        -d "{
            \"title\": \"${title}\",
            \"body\": \"${pr_body}\",
            \"head\": \"${head}\",
            \"base\": \"${base}\"
        }")
    
    local pr_number=$(echo "$response" | grep -o '"number":[0-9]*' | head -1 | cut -d':' -f2)
    echo "Created PR #${pr_number}: ${title}"
    echo "$pr_number"
}

# Function to merge a PR
merge_pr() {
    local pr_number="$1"
    local commit_message="$2"
    
    echo "Merging PR #${pr_number}"
    
    curl -s -X PUT "${GITHUB_API}/pulls/${pr_number}/merge" \
        -H "Authorization: token ${TOKEN}" \
        -H "Accept: application/vnd.github.v3+json" \
        -d "{
            \"commit_message\": \"${commit_message}\",
            \"merge_method\": \"squash\"
        }" > /dev/null
    
    echo "Merged PR #${pr_number}"
}

# Function to close an issue
close_issue() {
    local issue_number="$1"
    
    echo "Closing issue #${issue_number}"
    
    curl -s -X PATCH "${GITHUB_API}/issues/${issue_number}" \
        -H "Authorization: token ${TOKEN}" \
        -H "Accept: application/vnd.github.v3+json" \
        -d '{"state": "closed"}' > /dev/null
    
    echo "Closed issue #${issue_number}"
}

echo "=========================================="
echo "Setting up GitHub Issues and PRs"
echo "Repository: ${REPO}"
echo "=========================================="
echo ""

# Create labels first (if they don't exist)
echo "Creating labels..."
curl -s -X POST "${GITHUB_API}/labels" \
    -H "Authorization: token ${TOKEN}" \
    -H "Accept: application/vnd.github.v3+json" \
    -d '{"name": "feature", "color": "0E8A16", "description": "New feature"}' 2>/dev/null || true

curl -s -X POST "${GITHUB_API}/labels" \
    -H "Authorization: token ${TOKEN}" \
    -H "Accept: application/vnd.github.v3+json" \
    -d '{"name": "documentation", "color": "0052CC", "description": "Documentation"}' 2>/dev/null || true

curl -s -X POST "${GITHUB_API}/labels" \
    -H "Authorization: token ${TOKEN}" \
    -H "Accept: application/vnd.github.v3+json" \
    -d '{"name": "backend", "color": "B60205", "description": "Backend related"}' 2>/dev/null || true

curl -s -X POST "${GITHUB_API}/labels" \
    -H "Authorization: token ${TOKEN}" \
    -H "Accept: application/vnd.github.v3+json" \
    -d '{"name": "frontend", "color": "1D76DB", "description": "Frontend related"}' 2>/dev/null || true

echo "Labels created (or already exist)"
echo ""

# Issue 1: Project Setup & Configuration
ISSUE1_BODY="## Overview
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
- \`next.config.js\`
- \`tailwind.config.ts\`
- \`tsconfig.json\`
- \`package.json\`
- \`.nvmrc\`
- \`.env.local.example\`
- \`render.yaml\`
- \`.gitignore\`

## Testing
- ✅ Project builds successfully
- ✅ All dependencies installed
- ✅ Configuration validated"

ISSUE1_NUM=$(create_issue "Project Setup & Configuration" "$ISSUE1_BODY" '"feature", "documentation"')

# Issue 2: Authentication System
ISSUE2_BODY="## Overview
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
- \`lib/auth.ts\` - Authentication configuration
- \`app/(auth)/login/page.tsx\` - Login page
- \`app/api/auth/[...nextauth]/route.ts\` - NextAuth handler
- \`app/api/auth/verify/route.ts\` - Verification endpoint
- \`components/StudyBuddy.tsx\` - AI helper component
- \`middleware.ts\` - Route protection
- \`AUTH_SETUP.md\` - Setup documentation
- \`__tests__/login-form.test.tsx\` - Tests

## Testing
- ✅ Login form validation
- ✅ Error handling
- ✅ Session management
- ✅ Protected routes"

ISSUE2_NUM=$(create_issue "Authentication System Implementation" "$ISSUE2_BODY" '"feature", "frontend"')

# Issue 3: Frontend Components & UI
ISSUE3_BODY="## Overview
Reusable UI components and layout components for the application.

## Components
### Layout Components
- \`Header.tsx\` - Main header with navigation
- \`Sidebar.tsx\` - Sidebar navigation
- \`Footer.tsx\` - Footer component
- \`Breadcrumb.tsx\` - Breadcrumb navigation
- \`DashboardLayout.tsx\` - Dashboard layout wrapper

### UI Components
- \`Button.tsx\` - Reusable button component
- \`Card.tsx\` - Card component

### Dashboard Components
- \`DashboardSidebar.tsx\` - Dashboard sidebar
- \`CourseCalendar.tsx\` - Course calendar view

### Providers
- \`Providers.tsx\` - React Query and other providers

## Files
- \`components/layout/*\`
- \`components/ui/*\`
- \`components/dashboard/*\`
- \`components/Providers.tsx\`

## Styling
- Tailwind CSS for all styling
- Responsive design
- Dark mode support"

ISSUE3_NUM=$(create_issue "Frontend Components & UI Library" "$ISSUE3_BODY" '"feature", "frontend"')

# Issue 4: Course System & Learning Console
ISSUE4_BODY="## Overview
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
- \`ContentRenderer.tsx\` - Renders course content
- \`CodeExecutor.tsx\` - Python code execution
- \`PipelineVisualization.tsx\` - Pipeline diagrams
- \`Interactive3DVisualization.tsx\` - 3D visualizations
- \`MathEquation.tsx\` - Math rendering
- \`CourseTopics.tsx\` - Topics sidebar
- \`LearningConsole.tsx\` - Main learning interface
- \`FlowDiagram.tsx\` - Flow diagrams

## Files
- \`lib/course-data.ts\` - Course content data
- \`lib/code-templates.ts\` - Code templates
- \`app/(dashboard)/learn/[courseId]/page.tsx\` - Course page
- \`app/(dashboard)/courses/page.tsx\` - Courses listing
- \`components/learning/*\`
- \`COURSE_STRUCTURE.md\` - Documentation

## Features
- ✅ Interactive course viewer
- ✅ Python code execution in browser
- ✅ Visual pipeline diagrams
- ✅ 3D vector space visualizations
- ✅ Math equation support"

ISSUE4_NUM=$(create_issue "Course System & Learning Console" "$ISSUE4_BODY" '"feature", "frontend"')

# Issue 5: Backend Services Architecture
ISSUE5_BODY="## Overview
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
- \`backend/gateway/\` - API Gateway
- \`backend/services/auth-service/\` - Auth service
- \`backend/services/course-service/\` - Course service
- \`backend/services/ai-service/\` - AI service
- \`backend/services/executor-service/\` - Executor service
- \`backend/services/progress-service/\` - Progress service
- \`backend/proto/\` - Protocol buffer definitions
- \`backend/migrations/\` - Database migrations
- \`backend/BACKEND_ARCHITECTURE.md\` - Architecture docs

## Scripts
- \`backend/scripts/install-dependencies.sh\`
- \`backend/scripts/start-services.sh\`
- \`backend/scripts/stop-services.sh\`"

ISSUE5_NUM=$(create_issue "Backend Services Architecture" "$ISSUE5_BODY" '"feature", "backend"')

# Issue 6: Documentation & Deployment
ISSUE6_BODY="## Overview
Comprehensive documentation and deployment configuration for the project.

## Documentation Files
- \`README.md\` - Main project documentation
- \`SITE_ARCHITECTURE.md\` - Site architecture overview
- \`BACKEND_ARCHITECTURE.md\` - Backend architecture
- \`AUTH_SETUP.md\` - Authentication setup guide
- \`COURSE_STRUCTURE.md\` - Course structure guide
- \`RENDER_DEPLOYMENT.md\` - Deployment guide
- \`DEPLOYMENT_SUMMARY.md\` - Deployment summary
- \`PROJECT_TODO.md\` - Project roadmap
- \`API_CONTRACT.md\` - API documentation
- \`TROUBLESHOOTING.md\` - Troubleshooting guide
- Various other documentation files

## Deployment
- Render.com deployment configuration (\`render.yaml\`)
- Environment variable templates
- Node.js version specification
- Build configuration

## Files
- All \`*.md\` documentation files
- \`render.yaml\`
- \`.env.local.example\`
- \`.nvmrc\`"

ISSUE6_NUM=$(create_issue "Documentation & Deployment Configuration" "$ISSUE6_BODY" '"documentation"')

echo ""
echo "=========================================="
echo "Issues created successfully!"
echo "=========================================="
echo ""
echo "Issue Numbers:"
echo "  #${ISSUE1_NUM} - Project Setup & Configuration"
echo "  #${ISSUE2_NUM} - Authentication System"
echo "  #${ISSUE3_NUM} - Frontend Components & UI"
echo "  #${ISSUE4_NUM} - Course System & Learning Console"
echo "  #${ISSUE5_NUM} - Backend Services Architecture"
echo "  #${ISSUE6_NUM} - Documentation & Deployment"
echo ""
echo "Next steps:"
echo "1. Create feature branches and commit changes"
echo "2. Push branches to GitHub"
echo "3. Run this script again with --create-prs flag to create PRs"
echo "4. Or manually create PRs linking to these issues"
echo ""

