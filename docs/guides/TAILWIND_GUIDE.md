# Tailwind CSS Quick Reference for Pawsport

## Using Tailwind Classes

### Basic Usage
```tsx
// Simple example
<div className="bg-white p-4 rounded-lg shadow-md">
  Content here
</div>

// With conditional classes using cn() utility
import { cn } from '../lib/utils';

<button className={cn(
  "px-4 py-2 rounded-full",
  isActive && "bg-brand-orange-400",
  !isActive && "bg-gray-200"
)}>
  Click me
</button>
```

## Brand Colors

### Orange
- `text-brand-orange-400` - Primary orange text
- `bg-brand-orange-400` - Primary orange background
- `border-brand-orange-400` - Primary orange border

### Pink
- `text-brand-pink-400` - Primary pink text
- `bg-brand-pink-400` - Primary pink background
- `border-brand-pink-400` - Primary pink border

### Purple
- `text-brand-purple-400` - Primary purple text
- `bg-brand-purple-400` - Primary purple background
- `border-brand-purple-400` - Primary purple border

## Gradients

### Primary Gradient (Orange to Pink)
```tsx
<div className="bg-gradient-to-r from-brand-orange-400 to-brand-pink-400">
  Gradient background
</div>

// For text gradients
<h1 className="bg-gradient-to-r from-brand-orange-500 to-brand-pink-500 bg-clip-text text-transparent">
  Gradient Text
</h1>
```

### Hero Background
```tsx
<section className="bg-gradient-to-br from-brand-pink-50 via-brand-orange-50 to-brand-yellow-50">
  Hero content
</section>
```

## Common Patterns

### Rounded Button with Shadow
```tsx
<button className="px-6 py-3 bg-gradient-to-r from-brand-orange-400 to-brand-pink-400 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow">
  Get Started
</button>
```

### Card Component
```tsx
<div className="p-6 bg-white rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
  <h3 className="text-xl font-semibold mb-2">Card Title</h3>
  <p className="text-gray-600">Card content</p>
</div>
```

### Badge
```tsx
<span className="inline-flex items-center gap-2 px-4 py-2 bg-brand-orange-50 border-2 border-brand-orange-200 rounded-full text-brand-orange-700">
  Badge Text
</span>
```

### Responsive Grid
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Grid items */}
</div>
```

## Icons (Lucide React)

```tsx
import { PawPrint, Heart, MapPin, Sparkles } from 'lucide-react';

<PawPrint className="w-6 h-6 text-brand-orange-400" />
<Heart className="w-5 h-5 text-brand-pink-400" />
<MapPin className="w-4 h-4 text-gray-600" />
<Sparkles className="w-5 h-5 text-brand-purple-400" />
```

## Spacing Scale
- `p-4` = 1rem (16px)
- `p-6` = 1.5rem (24px)
- `p-8` = 2rem (32px)
- `p-12` = 3rem (48px)

## Border Radius
- `rounded-lg` = 0.5rem (8px)
- `rounded-xl` = 0.75rem (12px)
- `rounded-2xl` = 1rem (16px)
- `rounded-3xl` = 1.5rem (24px)
- `rounded-full` = 9999px (fully rounded)

## Shadows
- `shadow-sm` = Small shadow
- `shadow` = Default shadow
- `shadow-md` = Medium shadow
- `shadow-lg` = Large shadow
- `shadow-xl` = Extra large shadow
- `shadow-2xl` = 2X large shadow

## Hover Effects
```tsx
// Scale up on hover
<div className="transform hover:scale-105 transition-transform">

// Lift up on hover
<div className="hover:-translate-y-2 transition-transform">

// Change shadow on hover
<div className="shadow-lg hover:shadow-2xl transition-shadow">
```

## Responsive Breakpoints
- `sm:` - 640px and up
- `md:` - 768px and up
- `lg:` - 1024px and up
- `xl:` - 1280px and up

Example:
```tsx
<div className="text-2xl md:text-4xl lg:text-6xl">
  Responsive text size
</div>
```

## Tips
1. Use the `cn()` utility from `lib/utils.ts` for conditional classes
2. Combine with existing CSS when needed - Tailwind doesn't replace everything
3. Use `@apply` in CSS files for repeated patterns
4. Check browser DevTools to see which Tailwind classes are applied
