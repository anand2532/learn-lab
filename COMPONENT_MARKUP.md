# Login Page Component Markup

## Overview
The login page is located at `app/(auth)/login/page.tsx` and features:
- Animated card entry using Framer Motion
- Form validation with React Hook Form + Zod
- Study Buddy AI helper component
- Email/Password and Google OAuth authentication

## Component Structure

```tsx
<LoginPage>
  <div className="min-h-screen flex items-center justify-center">
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        {/* Header */}
        <h1>Welcome Back</h1>
        <p>Sign in to continue your learning journey</p>
        
        {/* Study Buddy Component */}
        <StudyBuddy />
        
        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <input type="email" {...register("email")} />
          <input type="password" {...register("password")} />
          <button type="submit">Sign In</button>
        </form>
        
        {/* Google OAuth Button */}
        <button onClick={handleGoogleSignIn}>
          Sign in with Google
        </button>
      </div>
    </motion.div>
  </div>
</LoginPage>
```

## Study Buddy Component

The Study Buddy component (`components/StudyBuddy.tsx`) displays:
- An animated card with gradient background
- AI robot emoji icon
- Dynamic tips fetched from `/api/ai/help`
- Loading state while fetching tips

## Form Validation

- **Email**: Must be a valid email format (Zod validation)
- **Password**: Minimum 6 characters (Zod validation)
- Real-time error messages displayed below each field
- Form submission disabled during loading state

## Animations

- Card entry: Fade in + slide down animation (0.5s duration)
- Study Buddy: Delayed fade in + slide up (0.3s delay, 0.5s duration)
- Smooth transitions on all interactive elements

## Styling

- Tailwind CSS with dark mode support
- Responsive design (max-width: 28rem on mobile)
- Gradient backgrounds and modern card design
- Accessible color contrasts

