# Quick Merge Guide - Merge All PRs

## Option 1: Using GitHub Web Interface (Easiest)

### Step 1: Create Pull Requests

Visit these URLs to create PRs (one at a time):

1. **Project Setup PR:**
   https://github.com/anand2532/learn-lab/compare/main...feature/project-setup?expand=1
   - Title: `feat: Project Setup & Configuration`
   - Click "Create pull request"

2. **Authentication PR:**
   https://github.com/anand2532/learn-lab/compare/main...feature/authentication?expand=1
   - Title: `feat: Authentication System Implementation`
   - Click "Create pull request"

3. **Frontend Components PR:**
   https://github.com/anand2532/learn-lab/compare/main...feature/frontend-components?expand=1
   - Title: `feat: Frontend Components & UI Library`
   - Click "Create pull request"

4. **Course System PR:**
   https://github.com/anand2532/learn-lab/compare/main...feature/course-system?expand=1
   - Title: `feat: Course System & Learning Console`
   - Click "Create pull request"

5. **Backend Services PR:**
   https://github.com/anand2532/learn-lab/compare/main...feature/backend-services?expand=1
   - Title: `feat: Backend Services Architecture`
   - Click "Create pull request`

6. **Documentation PR:**
   https://github.com/anand2532/learn-lab/compare/main...feature/documentation?expand=1
   - Title: `docs: Documentation & Deployment Configuration`
   - Click "Create pull request"

### Step 2: Merge All PRs

After creating all PRs, go to: https://github.com/anand2532/learn-lab/pulls

For each PR:
1. Click on the PR
2. Click "Merge pull request"
3. Select "Squash and merge"
4. Click "Confirm merge"
5. (Optional) Delete the branch after merging

## Option 2: Using GitHub CLI

If you have GitHub CLI installed:

```bash
# Authenticate
gh auth login

# Run the merge script
./scripts/merge-all-prs.sh
```

## Option 3: Using GitHub API with Token

1. Get a GitHub Personal Access Token:
   - Go to: https://github.com/settings/tokens
   - Generate new token (classic) with `repo` scope
   - Copy the token

2. Run the script:
   ```bash
   ./scripts/merge-all-prs.sh YOUR_TOKEN
   ```

## Option 4: Automated Script (All-in-One)

The script `scripts/merge-all-prs.sh` will:
- Create all 6 PRs automatically
- Merge them in order
- Use squash merge to keep history clean

Just provide your GitHub token when prompted.

