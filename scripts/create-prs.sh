#!/bin/bash

# Script to create Pull Requests for Learn Lab project
# Usage: ./scripts/create-prs.sh [GITHUB_TOKEN]
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
    if [ -z "$pr_number" ]; then
        echo "Error creating PR. Response: $response"
        return 1
    fi
    echo "Created PR #${pr_number}: ${title}"
    echo "$pr_number"
}

# Function to merge a PR
merge_pr() {
    local pr_number="$1"
    local commit_message="$2"
    
    echo "Merging PR #${pr_number}"
    
    local response=$(curl -s -X PUT "${GITHUB_API}/pulls/${pr_number}/merge" \
        -H "Authorization: token ${TOKEN}" \
        -H "Accept: application/vnd.github.v3+json" \
        -d "{
            \"commit_message\": \"${commit_message}\",
            \"merge_method\": \"squash\"
        }")
    
    if echo "$response" | grep -q '"merged":true'; then
        echo "✅ Merged PR #${pr_number}"
    else
        echo "Error merging PR. Response: $response"
        return 1
    fi
}

# Function to close an issue
close_issue() {
    local issue_number="$1"
    
    echo "Closing issue #${issue_number}"
    
    curl -s -X PATCH "${GITHUB_API}/issues/${issue_number}" \
        -H "Authorization: token ${TOKEN}" \
        -H "Accept: application/vnd.github.v3+json" \
        -d '{"state": "closed"}' > /dev/null
    
    echo "✅ Closed issue #${issue_number}"
}

echo "=========================================="
echo "Creating Pull Requests for Learn Lab"
echo "Repository: ${REPO}"
echo "=========================================="
echo ""

# Check if issues exist (you need to provide issue numbers)
echo "Please provide the issue numbers (created from setup-github-issues-prs.sh):"
read -p "Issue #1 (Project Setup): " ISSUE1
read -p "Issue #2 (Authentication): " ISSUE2
read -p "Issue #3 (Frontend Components): " ISSUE3
read -p "Issue #4 (Course System): " ISSUE4
read -p "Issue #5 (Backend Services): " ISSUE5
read -p "Issue #6 (Documentation): " ISSUE6

echo ""
echo "Creating Pull Requests..."
echo ""

# PR 1: Project Setup
PR1_BODY="## Overview
This PR implements the initial project setup and configuration.

## Changes
- Next.js 14 configuration with TypeScript
- Tailwind CSS setup and configuration
- ESLint and Prettier configuration
- Environment variable templates
- Node.js version specification
- Build and deployment configuration

## Testing
- ✅ Project builds successfully
- ✅ All dependencies installed
- ✅ Configuration validated"

PR1_NUM=$(create_pr "feat: Project Setup & Configuration" "$PR1_BODY" "feature/project-setup" "main" "$ISSUE1")

# PR 2: Authentication
PR2_BODY="## Overview
This PR implements the complete authentication system.

## Features
- NextAuth.js v5 integration
- Email/Password authentication
- Google OAuth integration
- Session management
- Protected routes
- Login page with animations
- Form validation
- Study Buddy AI helper

## Testing
- ✅ Login form validation
- ✅ Error handling
- ✅ Session management
- ✅ Protected routes"

PR2_NUM=$(create_pr "feat: Authentication System Implementation" "$PR2_BODY" "feature/authentication" "main" "$ISSUE2")

# PR 3: Frontend Components
PR3_BODY="## Overview
This PR adds reusable UI components and layout components.

## Components
- Layout components (Header, Sidebar, Footer, Breadcrumb)
- UI components (Button, Card)
- Dashboard components
- React Query providers

## Styling
- Tailwind CSS
- Responsive design
- Dark mode support"

PR3_NUM=$(create_pr "feat: Frontend Components & UI Library" "$PR3_BODY" "feature/frontend-components" "main" "$ISSUE3")

# PR 4: Course System
PR4_BODY="## Overview
This PR implements the interactive course learning system.

## Features
- Interactive course viewer
- Python code executor (Pyodide)
- Pipeline visualizations
- 3D visualizations
- Math equation rendering
- Course topics navigation
- Learning console interface"

PR4_NUM=$(create_pr "feat: Course System & Learning Console" "$PR4_BODY" "feature/course-system" "main" "$ISSUE4")

# PR 5: Backend Services
PR5_BODY="## Overview
This PR implements the microservices backend architecture.

## Services
- API Gateway
- Auth Service
- Course Service
- AI Service
- Executor Service
- Progress Service

## Architecture
- gRPC communication
- Protocol Buffers
- Database migrations"

PR5_NUM=$(create_pr "feat: Backend Services Architecture" "$PR5_BODY" "feature/backend-services" "main" "$ISSUE5")

# PR 6: Documentation
PR6_BODY="## Overview
This PR adds comprehensive documentation and deployment configuration.

## Documentation
- Main README
- Architecture documentation
- Setup guides
- Deployment guides
- API documentation
- Troubleshooting guides

## Deployment
- Render.com configuration
- Environment templates
- Build configuration"

PR6_NUM=$(create_pr "docs: Documentation & Deployment Configuration" "$PR6_BODY" "feature/documentation" "main" "$ISSUE6")

echo ""
echo "=========================================="
echo "Pull Requests created successfully!"
echo "=========================================="
echo ""
echo "PR Numbers:"
echo "  #${PR1_NUM} - Project Setup & Configuration"
echo "  #${PR2_NUM} - Authentication System"
echo "  #${PR3_NUM} - Frontend Components & UI"
echo "  #${PR4_NUM} - Course System & Learning Console"
echo "  #${PR5_NUM} - Backend Services Architecture"
echo "  #${PR6_NUM} - Documentation & Deployment"
echo ""
read -p "Do you want to merge all PRs now? (y/n): " MERGE_ALL

if [ "$MERGE_ALL" = "y" ]; then
    echo ""
    echo "Merging PRs..."
    merge_pr "$PR1_NUM" "feat: Project Setup & Configuration"
    merge_pr "$PR2_NUM" "feat: Authentication System Implementation"
    merge_pr "$PR3_NUM" "feat: Frontend Components & UI Library"
    merge_pr "$PR4_NUM" "feat: Course System & Learning Console"
    merge_pr "$PR5_NUM" "feat: Backend Services Architecture"
    merge_pr "$PR6_NUM" "docs: Documentation & Deployment Configuration"
    
    echo ""
    echo "Closing issues..."
    close_issue "$ISSUE1"
    close_issue "$ISSUE2"
    close_issue "$ISSUE3"
    close_issue "$ISSUE4"
    close_issue "$ISSUE5"
    close_issue "$ISSUE6"
    
    echo ""
    echo "✅ All PRs merged and issues closed!"
else
    echo ""
    echo "PRs created. You can merge them manually on GitHub."
    echo "Issues will be automatically closed when PRs are merged."
fi

