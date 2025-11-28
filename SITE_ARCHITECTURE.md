# GenAI & Agentic AI Academy - Site Architecture

## 🏗️ Overall Structure

```
learn-lab/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes
│   │   └── login/
│   ├── (dashboard)/              # Main application (protected)
│   │   ├── dashboard/            # User dashboard
│   │   ├── learn/                # Learning console
│   │   │   └── [courseId]/
│   │   │       └── [lessonId]/
│   │   ├── courses/              # Course listings
│   │   │   ├── page.tsx          # All courses
│   │   │   └── [courseId]/       # Course detail
│   │   ├── leaderboard/          # Rankings
│   │   ├── community/            # Community hub
│   │   │   ├── page.tsx          # Forum home
│   │   │   ├── showcase/         # Show-and-tell
│   │   │   └── [threadId]/       # Discussion thread
│   │   ├── armory/               # Resource library
│   │   ├── profile/               # User profile
│   │   └── admin/                 # Admin dashboard
│   ├── api/                      # API routes
│   │   ├── courses/
│   │   ├── progress/
│   │   ├── exercises/
│   │   ├── leaderboard/
│   │   ├── chatbot/              # Professor AI
│   │   ├── community/
│   │   └── armory/
│   └── layout.tsx                # Root layout
│
├── components/                   # React components
│   ├── learning/                 # Learning-specific
│   │   ├── LearningConsole.tsx  # Split-screen interface
│   │   ├── VideoPlayer.tsx
│   │   ├── CodeSandbox.tsx
│   │   └── ExercisePanel.tsx
│   ├── chatbot/                  # Chatbot components
│   │   ├── ProfessorAI.tsx
│   │   ├── ChatMessage.tsx
│   │   └── ChatInput.tsx
│   ├── gamification/             # Gamification UI
│   │   ├── Leaderboard.tsx
│   │   ├── BadgeDisplay.tsx
│   │   ├── XPBar.tsx
│   │   └── AchievementToast.tsx
│   ├── community/                # Community components
│   │   ├── ForumThread.tsx
│   │   ├── ShowcaseCard.tsx
│   │   └── CommentSection.tsx
│   ├── course/                   # Course components
│   │   ├── CourseCard.tsx
│   │   ├── CourseProgress.tsx
│   │   └── LessonList.tsx
│   └── ui/                       # Reusable UI components
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Modal.tsx
│       └── Skeleton.tsx
│
├── lib/                          # Utilities
│   ├── db/                       # Database utilities
│   │   ├── schema.ts             # Drizzle schema
│   │   └── queries.ts            # Database queries
│   ├── ai/                       # AI integrations
│   │   ├── chatbot.ts            # Professor AI logic
│   │   ├── rag.ts                # RAG system
│   │   └── evaluation.ts         # Auto-grading
│   ├── gamification/            # Gamification logic
│   │   ├── xp.ts                 # XP calculations
│   │   ├── badges.ts             # Badge system
│   │   └── leaderboard.ts        # Ranking algorithms
│   └── sandbox/                  # Code execution
│       └── executor.ts           # Sandbox integration
│
├── server/                       # Server actions
│   ├── courses/
│   ├── progress/
│   ├── exercises/
│   └── community/
│
├── types/                        # TypeScript types
│   ├── course.ts
│   ├── user.ts
│   ├── gamification.ts
│   └── api.ts
│
└── public/                       # Static assets
    ├── videos/                   # Course videos
    ├── badges/                   # Badge images
    └── templates/                # Code templates
```

---

## 🎨 Page Structure & User Flow

### 1. Landing & Authentication
```
/login → Dashboard (if authenticated)
       → Login Page (if not authenticated)
```

### 2. Main Dashboard
```
/dashboard
├── Welcome section (user stats, streak, level)
├── Continue Learning (last course/lesson)
├── Recommended Courses
├── Recent Activity
└── Quick Stats (XP, badges, rank)
```

### 3. Course Discovery
```
/courses
├── Track 1: Generative AI Fundamentals
│   ├── Module 1: Foundation of Semantics
│   │   ├── Course 1: From Words to Vectors
│   │   └── Course 2: Limits of Static Embeddings
│   └── ...
└── Track 2: Advanced Agentic AI
    └── ...
```

### 4. Learning Console (Core Feature)
```
/learn/[courseId]/[lessonId]
├── Left Panel: Video Player
│   ├── Video controls
│   ├── Progress bar
│   ├── Transcript/Subtitles
│   └── Navigation (prev/next lesson)
│
└── Right Panel: Code Sandbox
    ├── Code editor
    ├── Terminal/Output
    ├── Exercise instructions
    ├── Submit button
    └── Professor AI (floating button)
```

### 5. Community Hub
```
/community
├── Forum
│   ├── Course-specific threads
│   ├── General discussions
│   └── Q&A
│
└── Showcase
    ├── Featured submissions
    ├── Recent submissions
    └── Filter by course/metric
```

### 6. Leaderboard
```
/leaderboard
├── Overall Rankings
├── Course-specific Rankings
├── Metric Filters (Efficiency, Accuracy, Creativity)
└── Time Period (All-time, Monthly, Weekly)
```

### 7. User Profile
```
/profile/[userId]
├── Stats (XP, Level, Streak)
├── Badges Collection
├── Course Progress
├── Submissions
└── Activity Feed
```

### 8. The Armory
```
/armory
├── By Course (filtered resources)
├── By Type (Papers, Notebooks, Tools, Spaces)
├── Search
└── Submit Resource (admin)
```

---

## 🎯 Component Hierarchy

### Learning Console Component Tree
```
LearningConsole
├── VideoPlayer
│   ├── VideoControls
│   ├── ProgressBar
│   └── TranscriptPanel
├── CodeSandbox
│   ├── CodeEditor
│   ├── Terminal
│   ├── FileExplorer
│   └── ExercisePanel
│       ├── Instructions
│       ├── TestResults
│       └── SubmitButton
└── ProfessorAI (Floating)
    ├── ChatWindow
    ├── MessageList
    └── ChatInput
```

### Dashboard Component Tree
```
Dashboard
├── Header
│   ├── Navigation
│   ├── UserMenu
│   └── XPBar
├── WelcomeSection
│   ├── UserStats
│   └── StreakDisplay
├── ContinueLearning
│   └── CourseCard
├── RecommendedCourses
│   └── CourseGrid
└── RecentActivity
    └── ActivityFeed
```

---

## 🔄 Data Flow

### Learning Flow
```
User → Selects Course → Loads Lesson
  ↓
Video Player → Tracks Progress → Updates DB
  ↓
Code Sandbox → User Writes Code → Submits
  ↓
Validation → Score Calculation → Update Leaderboard
  ↓
XP Awarded → Badge Check → Level Up Check
```

### Chatbot Flow
```
User Question → Professor AI
  ↓
Context Injection (course, lesson, code)
  ↓
RAG Retrieval (course materials)
  ↓
LLM Processing (OpenAI GPT-4)
  ↓
Response Generation
  ↓
Display to User
```

### Gamification Flow
```
Action (watch video, complete exercise)
  ↓
XP Calculation
  ↓
Update User Profile
  ↓
Check Badge Unlocks
  ↓
Check Level Up
  ↓
Update Leaderboard
  ↓
Show Notifications
```

---

## 🗄️ Database Schema (High-Level)

### Core Tables
- `users` - User profiles, XP, level, streak
- `courses` - Course metadata
- `lessons` - Lesson content, videos, order
- `exercises` - Exercise instructions, tests, solutions
- `user_progress` - Course/lesson completion, watch time
- `submissions` - Code submissions, scores, timestamps
- `badges` - Badge definitions
- `user_badges` - User badge unlocks
- `leaderboard_entries` - Rankings, metrics
- `forum_threads` - Discussion threads
- `forum_posts` - Posts and replies
- `showcase_submissions` - Show-and-tell entries
- `armory_resources` - Curated links and resources

---

## 🎨 Design System

### Color Palette
- **Primary**: Blue/Indigo (learning, trust)
- **Success**: Green (completion, achievements)
- **Warning**: Yellow/Orange (attention, streaks)
- **Error**: Red (errors, failures)
- **Neutral**: Gray scale (text, backgrounds)

### Typography
- **Headings**: Bold, modern sans-serif
- **Body**: Readable sans-serif
- **Code**: Monospace (for code editor)

### Spacing
- Consistent 4px/8px grid system
- Generous whitespace for readability

### Components
- **Cards**: Rounded corners, subtle shadows
- **Buttons**: Clear hierarchy (primary, secondary, ghost)
- **Inputs**: Clear labels, helpful error messages
- **Modals**: Centered, backdrop blur

---

## 🚀 Performance Considerations

### Code Splitting
- Route-based splitting (automatic with Next.js)
- Component lazy loading (heavy components)
- Video lazy loading

### Caching Strategy
- API responses (React Query/SWR)
- Static course content (ISR)
- User progress (client-side cache)

### Optimization
- Image optimization (Next.js Image)
- Video streaming (adaptive bitrate)
- Code editor (monaco-editor or CodeMirror)

---

## 🔐 Security Considerations

### Authentication
- NextAuth.js (already implemented)
- Session management
- Protected routes (middleware)

### Code Execution
- Sandbox isolation
- Resource limits (CPU, memory, time)
- Input sanitization

### API Security
- Rate limiting
- Input validation
- CSRF protection

---

## 📱 Responsive Breakpoints

### Desktop (1024px+)
- Split-screen learning console
- Sidebar navigation
- Multi-column layouts

### Tablet (768px - 1023px)
- Stacked learning console (optional split)
- Collapsible sidebar
- Adjusted column counts

### Mobile (< 768px)
- Full-width stacked layout
- Bottom navigation
- Touch-optimized controls
- Simplified UI elements

---

## 🎭 Animation Strategy

### Page Transitions
- Smooth fade/slide between routes
- Loading states with skeletons

### Component Animations
- Entrance: Fade + slide up
- Exit: Fade out
- Hover: Subtle lift/scale
- Success: Celebration (confetti, bounce)

### Micro-interactions
- Button press feedback
- Badge unlock animation
- XP gain counter animation
- Leaderboard rank change animation

### Performance
- Use `will-change` for animated elements
- Prefer transforms over position changes
- Debounce rapid animations
- Lazy load animation libraries

---

This architecture provides a scalable, maintainable structure for building the GenAI & Agentic AI Academy platform.

