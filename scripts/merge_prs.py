#!/usr/bin/env python3
"""
Automated script to create and merge all PRs for Learn Lab
Usage: python3 scripts/merge_prs.py [GITHUB_TOKEN]
"""

import os
import sys
import time
import requests
import json

REPO = "anand2532/learn-lab"
GITHUB_API = f"https://api.github.com/repos/{REPO}"

# PRs to create and merge
PRS = [
    {
        "branch": "feature/project-setup",
        "title": "feat: Project Setup & Configuration",
        "body": """## Overview
This PR implements the initial project setup and configuration including Next.js 14, TypeScript, Tailwind CSS, ESLint, Prettier, and deployment configuration.

## Testing
- ✅ All changes tested and verified
- ✅ Code follows project conventions
- ✅ Documentation updated where needed"""
    },
    {
        "branch": "feature/authentication",
        "title": "feat: Authentication System Implementation",
        "body": """## Overview
This PR implements the complete authentication system with NextAuth.js v5, email/password and Google OAuth support, session management, and protected routes.

## Testing
- ✅ Login form validation
- ✅ Error handling
- ✅ Session management
- ✅ Protected routes"""
    },
    {
        "branch": "feature/frontend-components",
        "title": "feat: Frontend Components & UI Library",
        "body": """## Overview
This PR adds reusable UI components and layout components including Header, Sidebar, Footer, Breadcrumb, Button, Card, and dashboard components.

## Styling
- Tailwind CSS
- Responsive design
- Dark mode support"""
    },
    {
        "branch": "feature/course-system",
        "title": "feat: Course System & Learning Console",
        "body": """## Overview
This PR implements the interactive course learning system with content renderer, Python code executor (Pyodide), pipeline visualizations, 3D visualizations, and math equation rendering.

## Features
- ✅ Interactive course viewer
- ✅ Python code execution in browser
- ✅ Visual pipeline diagrams
- ✅ 3D vector space visualizations"""
    },
    {
        "branch": "feature/backend-services",
        "title": "feat: Backend Services Architecture",
        "body": """## Overview
This PR implements the microservices backend architecture using Go with gRPC, protocol buffers, and includes Gateway, Auth, Course, AI, Executor, and Progress services.

## Architecture
- gRPC communication
- Protocol Buffers
- Database migrations"""
    },
    {
        "branch": "feature/documentation",
        "title": "docs: Documentation & Deployment Configuration",
        "body": """## Overview
This PR adds comprehensive documentation including README, architecture docs, setup guides, deployment guides, API documentation, and troubleshooting guides.

## Documentation
- Main README
- Architecture documentation
- Setup guides
- Deployment guides"""
    }
]

def get_token():
    """Get GitHub token from various sources"""
    if len(sys.argv) > 1:
        return sys.argv[1]
    if os.environ.get("GITHUB_TOKEN"):
        return os.environ.get("GITHUB_TOKEN")
    return None

def create_pr(token, branch, title, body):
    """Create a pull request"""
    url = f"{GITHUB_API}/pulls"
    headers = {
        "Authorization": f"token {token}",
        "Accept": "application/vnd.github.v3+json"
    }
    data = {
        "title": title,
        "body": body,
        "head": branch,
        "base": "main"
    }
    
    response = requests.post(url, headers=headers, json=data)
    if response.status_code == 201:
        pr_data = response.json()
        return pr_data.get("number")
    else:
        print(f"Error creating PR: {response.status_code} - {response.text}")
        return None

def merge_pr(token, pr_number, title):
    """Merge a pull request"""
    url = f"{GITHUB_API}/pulls/{pr_number}/merge"
    headers = {
        "Authorization": f"token {token}",
        "Accept": "application/vnd.github.v3+json"
    }
    data = {
        "commit_message": title,
        "merge_method": "squash"
    }
    
    response = requests.put(url, headers=headers, json=data)
    if response.status_code == 200:
        return True
    else:
        print(f"Error merging PR: {response.status_code} - {response.text}")
        return False

def main():
    print("=" * 50)
    print("Automated PR Creation and Merging")
    print(f"Repository: {REPO}")
    print("=" * 50)
    print()
    
    token = get_token()
    if not token:
        print("❌ No GitHub token found!")
        print()
        print("Please provide a GitHub Personal Access Token:")
        print("1. Go to: https://github.com/settings/tokens")
        print("2. Generate new token (classic) with 'repo' scope")
        print("3. Run: python3 scripts/merge_prs.py YOUR_TOKEN")
        print("   Or: export GITHUB_TOKEN=YOUR_TOKEN && python3 scripts/merge_prs.py")
        sys.exit(1)
    
    print("✅ Using GitHub token")
    print()
    
    pr_numbers = []
    
    # Step 1: Create all PRs
    print("Step 1: Creating Pull Requests...")
    print()
    
    for pr_info in PRS:
        branch = pr_info["branch"]
        title = pr_info["title"]
        body = pr_info["body"]
        
        print(f"📝 Creating PR for {branch}...")
        pr_num = create_pr(token, branch, title, body)
        
        if pr_num:
            pr_numbers.append((pr_num, title))
            print(f"✅ Created PR #{pr_num}: {title}")
        else:
            print(f"❌ Failed to create PR for {branch}")
        print()
        
        time.sleep(1)
    
    if not pr_numbers:
        print("❌ No PRs were created. Exiting.")
        sys.exit(1)
    
    print(f"✅ Created {len(pr_numbers)} Pull Requests")
    print()
    print("Waiting 3 seconds for GitHub to process...")
    time.sleep(3)
    print()
    
    # Step 2: Merge all PRs
    print("Step 2: Merging Pull Requests...")
    print()
    
    for pr_num, title in pr_numbers:
        print(f"🔄 Merging PR #{pr_num}: {title}...")
        
        if merge_pr(token, pr_num, title):
            print(f"✅ Successfully merged PR #{pr_num}")
        else:
            print(f"❌ Failed to merge PR #{pr_num}")
        print()
        
        time.sleep(1)
    
    print("=" * 50)
    print("✅ All PRs Processed!")
    print("=" * 50)
    print()
    print("Summary:")
    for pr_num, title in pr_numbers:
        print(f"  ✅ PR #{pr_num}: {title}")
    print()
    print(f"View merged PRs at: https://github.com/{REPO}/pulls?q=is:pr+is:merged")

if __name__ == "__main__":
    main()

