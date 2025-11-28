// Mock data for development (no database)
export interface User {
  id: string;
  email: string;
  name: string;
  xp: number;
  level: number;
  streak: number;
  badges: string[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  module: string;
  track: "fundamentals" | "advanced";
  duration: number; // in minutes
  progress: number; // 0-100
  lessons: number;
  completedLessons: number;
}

export interface Track {
  id: string;
  name: string;
  description: string;
  courses: Course[];
  progress: number;
}

export const mockUser: User = {
  id: "1",
  email: "demo@example.com",
  name: "Demo User",
  xp: 2450,
  level: 3,
  streak: 7,
  badges: ["First Steps", "Week Warrior"],
};

export const mockTracks: Track[] = [
  {
    id: "track-1",
    name: "Generative AI Fundamentals",
    description: "Master the foundations of Generative AI",
    progress: 35,
    courses: [
      {
        id: "course-1",
        title: "From Words to Vectors",
        description: "Understanding how machines understand text",
        module: "Foundation of Semantics",
        track: "fundamentals",
        duration: 30,
        progress: 100,
        lessons: 5,
        completedLessons: 5,
      },
      {
        id: "course-2",
        title: "The Limits of Static Embeddings",
        description: "Why context matters in embeddings",
        module: "Foundation of Semantics",
        track: "fundamentals",
        duration: 25,
        progress: 75,
        lessons: 4,
        completedLessons: 3,
      },
      {
        id: "course-3",
        title: "Recurrent Neural Networks (RNNs)",
        description: "Introduction to sequence processing",
        module: "Sequential Models",
        track: "fundamentals",
        duration: 35,
        progress: 0,
        lessons: 6,
        completedLessons: 0,
      },
      {
        id: "course-4",
        title: "LSTMs & GRUs",
        description: "Solving the memory bottleneck",
        module: "Sequential Models",
        track: "fundamentals",
        duration: 40,
        progress: 0,
        lessons: 7,
        completedLessons: 0,
      },
    ],
  },
  {
    id: "track-2",
    name: "Advanced Agentic AI",
    description: "Build production-ready AI agents",
    progress: 0,
    courses: [
      {
        id: "course-18",
        title: "Image Engineering for AI",
        description: "Pixels, tensors, and augmentations",
        module: "Visual Media Fundamentals",
        track: "advanced",
        duration: 30,
        progress: 0,
        lessons: 5,
        completedLessons: 0,
      },
      {
        id: "course-19",
        title: "Diffusion Models Deconstructed",
        description: "How Stable Diffusion works",
        module: "Visual Media Fundamentals",
        track: "advanced",
        duration: 40,
        progress: 0,
        lessons: 6,
        completedLessons: 0,
      },
    ],
  },
];

export const mockNotifications = [
  {
    id: "1",
    type: "achievement",
    message: "You earned the 'Week Warrior' badge!",
    timestamp: new Date(Date.now() - 3600000),
    read: false,
  },
  {
    id: "2",
    type: "level",
    message: "Level up! You're now Level 3",
    timestamp: new Date(Date.now() - 7200000),
    read: false,
  },
  {
    id: "3",
    type: "course",
    message: "New course available: Attention Mechanisms",
    timestamp: new Date(Date.now() - 86400000),
    read: true,
  },
];

