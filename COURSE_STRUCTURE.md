# Course Structure Documentation

## Overview

This document explains how the course system is structured and how to add new courses.

## File Structure

```
learn-lab/
├── lib/
│   └── course-data.ts          # Course content data (all course segments)
├── components/
│   └── learning/
│       ├── ContentRenderer.tsx # Renders markdown-like content
│       ├── CodeExecutor.tsx    # Python code execution
│       ├── PipelineVisualization.tsx # Pipeline visualization
│       └── CourseTopics.tsx    # Topics sidebar navigation
└── app/
    └── (dashboard)/
        └── learn/
            └── [courseId]/
                ├── page.tsx    # Main course page component
                ├── error.tsx   # Error boundary
                └── loading.tsx # Loading state
```

## Adding a New Course

### Step 1: Add Course Data

Edit `lib/course-data.ts` and add a new entry to the `courseContent` object:

```typescript
export const courseContent: Record<string, CourseData> = {
  "course-1": { /* existing course */ },
  "course-2": {
    title: "Your Course Title",
    description: "Course description",
    topics: [
      { id: "intro", title: "Introduction", completed: false },
      // ... more topics
    ],
    pipelineSteps: [ /* optional */ ],
    segments: {
      intro: {
        title: "Introduction",
        content: `# Your Content Here
        
Use markdown-like syntax:
- Bullet points
- **Bold text**
- ## Headers
        `,
        code: `# Optional Python code
print("Hello World")`
      }
    }
  }
};
```

### Step 2: Content Formatting

The `ContentRenderer` component supports:

- **Headers**: `# H1`, `## H2`, `### H3`
- **Lists**: `- item` (unordered), `1. item` (ordered)
- **Paragraphs**: Regular text
- **Code**: Use the `code` property in segments

### Step 3: Access the Course

Navigate to `/learn/course-2` (or your course ID)

## Component Architecture

### CoursePage (`app/(dashboard)/learn/[courseId]/page.tsx`)

Main component that:
- Loads course data based on `courseId` param
- Manages active topic state
- Renders course header, topics sidebar, and content

### ContentRenderer (`components/learning/ContentRenderer.tsx`)

Renders markdown-like content with:
- Proper list handling (wraps items in `<ul>`/`<ol>`)
- Header hierarchy
- Paragraph formatting

### CodeExecutor (`components/learning/CodeExecutor.tsx`)

Executes Python code in the browser using Pyodide:
- Loads Pyodide runtime
- Provides code editor and output panel
- Handles errors gracefully

### PipelineVisualization (`components/learning/PipelineVisualization.tsx`)

Displays a visual pipeline with:
- Step-by-step flow
- 3D vector space visualization
- Interactive animations

## Data Structure

```typescript
interface CourseData {
  title: string;
  description: string;
  topics: Array<{ id: string; title: string; completed?: boolean }>;
  pipelineSteps?: Array<{
    id: string;
    title: string;
    description: string;
    color: string;
  }>;
  segments: Record<string, {
    title: string;
    content: string;
    code?: string;
  }>;
}
```

## Best Practices

1. **Keep course data separate**: All course content in `lib/course-data.ts`
2. **Use semantic HTML**: ContentRenderer creates proper list structures
3. **Error handling**: Always check if course exists before rendering
4. **Loading states**: Show loading indicators while content loads
5. **Type safety**: Use TypeScript interfaces for course data

## Troubleshooting

### Course not rendering
- Check if course ID matches in `course-data.ts`
- Verify all required fields are present
- Check browser console for errors

### Content not displaying
- Ensure content uses supported markdown syntax
- Check that segment ID matches topic ID
- Verify ContentRenderer is receiving content

### Code executor not working
- Check if Pyodide script is loaded (in `app/layout.tsx`)
- Verify Python code syntax
- Check browser console for Pyodide errors

