# AGENTS.md - Development Guidelines for AI Agents

This document provides guidelines for AI agents working on this codebase.

## Project Overview

This is a Next.js 16 application with TypeScript, Tailwind CSS 4, and shadcn/ui. It serves as a lottery system for distributing football match tickets for Atlético Nacional fans (Caracolí Verdaga).

## Technology Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4 + shadcn/ui components
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod
- **State**: React useState/useEffect + LocalStorage
- **PDF Generation**: Python ReportLab (via API route)
- **Package Manager**: pnpm

## Build Commands

```bash
# Install dependencies
pnpm install

# Start development server (port 3000)
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint

# Prisma commands (if needed)
pnpm db:push    # Sync Prisma schema
pnpm db:generate # Generate Prisma client
pnpm db:migrate  # Run migrations
pnpm db:reset    # Reset database
```

## Testing

This project does **not** currently have a test framework configured. If you need to add tests:

```bash
# Install Vitest (recommended for Next.js)
pnpm add -D vitest @vitejs/plugin-react

# Run a single test file
npx vitest run src/components/ui/button.test.tsx
```

## Code Style Guidelines

### TypeScript

- Use explicit types for function parameters and return types when not obvious
- Prefer `interface` over `type` for object shapes
- Use `any` sparingly - disable ESLint rule if needed
- Use `as` type assertions when absolutely necessary

### React Patterns

- Use `'use client'` directive for client-side components
- Handle hydration mismatch with `useState` + `useEffect` mounting check
- Use functional components exclusively
- Destructure props in function parameters

```tsx
// Good
function Button({
  className,
  variant,
  size,
  ...props
}: ButtonProps) {
  return <button className={cn(className)} {...props} />
}

// Handle hydration
const [mounted, setMounted] = useState(false)
useEffect(() => setMounted(true), [])
if (!mounted) return null
```

### Imports

- Use `@/` path alias for imports from `src/` directory
- Group imports: React > External > Internal > Components
- Use named imports for UI components

```tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
```

### Naming Conventions

- **Components**: PascalCase (e.g., `Button`, `CardHeader`)
- **Functions**: camelCase (e.g., `handleSubmit`, `agregarParticipante`)
- **Interfaces**: PascalCase with descriptive names (e.g., `Participante`, `ResultadoSorteo`)
- **Files**: kebab-case for components (e.g., `button.tsx`, `use-toast.ts`)

### CSS / Tailwind

- Use Tailwind utility classes exclusively
- Follow shadcn/ui component patterns (cva for variants)
- Use `cn()` utility from `@/lib/utils` for conditional classes
- Support dark mode with `dark:` prefix

```tsx
// Good - conditional classes
className={cn(
  "base-class",
  variant === "default" && "default-variant",
  className
)}
```

### Error Handling

- Use try/catch for async operations
- Log errors to console with descriptive messages
- Show user-friendly error messages via alerts or toasts

```tsx
try {
  const response = await fetch('/api/endpoint')
  if (!response.ok) throw new Error('Failed')
} catch (error) {
  console.error('Operation failed:', error)
  alert('Something went wrong')
}
```

### ESLint Configuration

The project uses a permissive ESLint config that disables many strict rules. Key disabled rules:
- No explicit any
- No unused vars (use `// @ts-ignore` if needed)
- No non-null assertions
- No prefer-const
- React hooks exhaustive-deps disabled
- No console warnings

If your code triggers lint errors, they are likely already disabled in `eslint.config.mjs`.

### Project Structure

```
src/
├── app/                   # Next.js App Router pages
│   ├── api/               # API routes
│   │   └── exportar-pdf/
│   │       └── route.ts   # PDF generation endpoint
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main lottery page
├── components/
│   └── ui/                # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       └── ...
├── hooks/                 # Custom React hooks
└── lib/
    └── utils.ts           # Utilities (cn function)
```

### Data Storage

The app uses LocalStorage for persistence:
- `nacional-participantes` - List of participants
- `nacional-resultados` - Lottery results
- `nacional-sorteo-realizado` - Lottery state

### Adding New Features

1. Create components in `src/components/`
2. Use shadcn/ui components from `src/components/ui/`
3. Follow existing patterns in `src/app/page.tsx`
4. Test with `pnpm dev`

### Common Tasks

**Adding a new shadcn/ui component:**
```bash
npx shadcn@latest add button
```

**Adding a new API route:**
Create `src/app/api/[route]/route.ts` with Next.js App Router syntax.

## Notes

- This is a frontend-focused app with LocalStorage persistence
- Prisma dependencies are installed but not actively used (no database)
- The PDF generation uses Python's ReportLab via a subprocess
- Run `pnpm dev` to start the development server
