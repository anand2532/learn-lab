# Animation Strategy & Tools

## 🎨 Animation Philosophy

**Principles:**
- **Purposeful**: Every animation should enhance UX, not distract
- **Performant**: 60fps animations, optimized for all devices
- **Accessible**: Respect `prefers-reduced-motion`
- **Consistent**: Unified animation language across the platform

---

## 🛠️ Animation Tools Stack

### Primary Tools (Already Installed)
1. **Framer Motion** (`framer-motion@12.23.24`) ✅
   - **Use for**: Page transitions, component animations, layout animations
   - **Strengths**: Declarative API, gesture support, layout animations
   - **Best for**: Most UI animations

### Recommended Additional Tools

2. **React Spring** (`@react-spring/web`)
   - **Use for**: Physics-based animations, smooth number transitions (XP, scores)
   - **Strengths**: Spring physics, interpolation, performance
   - **Best for**: Counter animations, badge unlocks, leaderboard updates

3. **Lottie React** (`lottie-react`)
   - **Use for**: Complex animations (badge unlocks, achievements, celebrations)
   - **Strengths**: After Effects integration, complex animations
   - **Best for**: Achievement celebrations, loading states, illustrations

4. **React Confetti** (`react-confetti`)
   - **Use for**: Celebration effects (level ups, major achievements)
   - **Strengths**: Simple, effective celebration
   - **Best for**: Level up, course completion, badge unlocks

5. **React Transition Group** (`react-transition-group`)
   - **Use for**: List transitions, enter/exit animations
   - **Strengths**: Simple, lightweight
   - **Best for**: Leaderboard updates, list item animations

---

## 🎯 Animation Use Cases

### 1. Page Transitions
**Tool**: Framer Motion
```tsx
// Smooth page transitions
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.3 }}
>
  {children}
</motion.div>
```

### 2. Component Entrance
**Tool**: Framer Motion
```tsx
// Staggered list animations
<motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ delay: index * 0.1 }}
>
  {item}
</motion.div>
```

### 3. XP & Score Counters
**Tool**: React Spring
```tsx
// Smooth number counting animation
const { number } = useSpring({
  from: { number: 0 },
  to: { number: currentXP },
  config: { tension: 50, friction: 30 }
});

<animated.span>
  {number.to(n => Math.floor(n))}
</animated.span>
```

### 4. Badge Unlock
**Tool**: Lottie + React Spring
```tsx
// Badge unlock animation
// 1. Lottie animation for badge reveal
// 2. React Spring for bounce effect
// 3. Confetti for celebration
```

### 5. Leaderboard Updates
**Tool**: React Spring + Framer Motion
```tsx
// Smooth rank changes
// Animate position changes
// Highlight rank changes
```

### 6. Code Execution
**Tool**: Framer Motion
```tsx
// Running indicator
// Results reveal animation
// Success/error states
```

### 7. Loading States
**Tool**: Framer Motion (skeleton) + Lottie (complex)
```tsx
// Skeleton screens with shimmer
// Complex loading animations (Lottie)
```

### 8. Micro-interactions
**Tool**: Framer Motion
```tsx
// Button hover/press
// Card lift on hover
// Input focus animations
```

---

## 📦 Installation Commands

```bash
# Install additional animation libraries
npm install @react-spring/web lottie-react react-confetti react-transition-group

# Type definitions (if needed)
npm install -D @types/react-transition-group
```

---

## 🎬 Animation Patterns

### Pattern 1: Fade In + Slide Up
**Use**: Component entrances
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
```

### Pattern 2: Scale + Fade
**Use**: Modal appearances, badge unlocks
```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ type: "spring", stiffness: 300 }}
>
```

### Pattern 3: Staggered List
**Use**: Course lists, leaderboard entries
```tsx
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};
```

### Pattern 4: Number Counter
**Use**: XP gains, score updates
```tsx
const { number } = useSpring({
  from: { number: 0 },
  to: { number: targetValue },
  config: { tension: 50, friction: 30 }
});
```

### Pattern 5: Celebration
**Use**: Achievements, completions
```tsx
// Combine: Confetti + Lottie animation + Sound (optional)
```

---

## ⚡ Performance Best Practices

### 1. Use `will-change` Sparingly
```css
.animated-element {
  will-change: transform, opacity;
}
```

### 2. Prefer Transforms
- Use `transform` and `opacity` (GPU-accelerated)
- Avoid animating `width`, `height`, `top`, `left`

### 3. Debounce Rapid Animations
```tsx
const debouncedUpdate = useMemo(
  () => debounce(updateFunction, 100),
  []
);
```

### 4. Lazy Load Heavy Animations
```tsx
const LottieAnimation = dynamic(() => import('./LottieAnimation'), {
  ssr: false
});
```

### 5. Respect Reduced Motion
```tsx
const prefersReducedMotion = useReducedMotion();

<motion.div
  animate={prefersReducedMotion ? {} : { opacity: 1 }}
>
```

---

## 🎨 Animation Timing

### Durations
- **Fast**: 150-200ms (micro-interactions)
- **Medium**: 300-400ms (component entrances)
- **Slow**: 500-600ms (page transitions, major changes)

### Easing
- **Ease Out**: Most UI animations (feels natural)
- **Ease In Out**: Page transitions
- **Spring**: Playful, bouncy (achievements, badges)

---

## 📱 Mobile Considerations

### Touch Interactions
- Larger touch targets
- Haptic feedback (where supported)
- Swipe gestures for navigation

### Performance
- Simpler animations on mobile
- Reduce particle effects
- Optimize Lottie file sizes

---

## 🎯 Specific Implementation Examples

### Achievement Toast
```tsx
// Combination of:
// 1. Framer Motion (slide in from top)
// 2. Lottie (badge animation)
// 3. React Spring (XP counter)
// 4. React Confetti (celebration)
```

### Leaderboard Rank Change
```tsx
// 1. Detect rank change
// 2. Animate position with React Spring
// 3. Highlight with Framer Motion
// 4. Show change indicator (+/-)
```

### Code Execution
```tsx
// 1. Show loading spinner (Framer Motion)
// 2. Animate results reveal (slide up)
// 3. Success/error state (color transition)
```

### Video Progress
```tsx
// 1. Smooth progress bar (Framer Motion)
// 2. Milestone markers (scale animation)
// 3. Completion celebration (Lottie)
```

---

## 🔧 Utility Functions

### Animation Presets
```tsx
// lib/animations/presets.ts
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 }
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { type: "spring", stiffness: 300 }
};
```

### Hooks
```tsx
// hooks/useCounterAnimation.ts
export function useCounterAnimation(target: number) {
  const { number } = useSpring({
    from: { number: 0 },
    to: { number: target },
    config: { tension: 50, friction: 30 }
  });
  return number;
}
```

---

## 📊 Animation Performance Monitoring

### Metrics to Track
- FPS during animations
- Animation completion rates
- User engagement with animated elements

### Tools
- React DevTools Profiler
- Chrome Performance tab
- Lighthouse

---

## ✅ Checklist for Each Animation

- [ ] Purpose is clear (enhances UX)
- [ ] Performance tested (60fps)
- [ ] Reduced motion respected
- [ ] Mobile optimized
- [ ] Accessibility considered
- [ ] Consistent with design system

---

This animation strategy ensures smooth, performant, and delightful user experiences throughout the platform.

