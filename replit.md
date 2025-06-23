# FitForHire - AI-Powered Resume Tailoring Platform

## Overview

FitForHire is a modern web application designed to help job seekers tailor their resumes using AI technology. The platform features a React-based frontend with a Node.js/Express backend, utilizing PostgreSQL for data persistence and Drizzle ORM for database management. Currently, the application implements a waitlist feature for user registration before the main resume tailoring functionality.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state management
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **Build Tool**: Vite for development and production builds
- **Animations**: Framer Motion for enhanced user interactions

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for API server
- **Database**: PostgreSQL with Drizzle ORM
- **Session Management**: Connect-pg-simple for PostgreSQL-backed sessions
- **Development**: tsx for TypeScript execution during development
- **Production**: esbuild for optimized server bundle

### Database Schema
The application uses Drizzle ORM with PostgreSQL, currently implementing:
- **Users Table**: Basic user authentication with username/password
- **Waitlist Table**: Email collection system with timestamps
- **Schema Validation**: Zod integration for type-safe data validation

## Key Components

### Data Flow
1. **Client Requests**: React frontend communicates with Express API
2. **API Processing**: Express routes handle business logic and data validation
3. **Database Operations**: Drizzle ORM manages PostgreSQL interactions
4. **Response Handling**: TanStack Query manages client-side caching and updates

### Authentication System
- Prepared for username/password authentication
- Session-based authentication using PostgreSQL storage
- Password hashing and validation (implementation pending)

### Waitlist Management
- Email collection with duplicate prevention
- Real-time waitlist count tracking
- Success/error feedback with friendly messaging

### UI/UX Features
- Responsive design optimized for mobile and desktop
- Golden yellow and orange accent color scheme
- Comprehensive component library with consistent styling
- Accessible design patterns using Radix UI primitives

## External Dependencies

### Core Dependencies
- **Database**: @neondatabase/serverless for PostgreSQL connectivity
- **ORM**: drizzle-orm with drizzle-zod for schema validation
- **UI Components**: Complete Radix UI component suite
- **Validation**: Zod for runtime type checking
- **Animations**: Framer Motion for smooth interactions
- **Date Handling**: date-fns for date manipulation
- **State Management**: TanStack React Query for server state

### Development Dependencies
- **Build Tools**: Vite, esbuild, TypeScript compiler
- **Code Quality**: ESLint, Prettier configurations
- **Styling**: Tailwind CSS with PostCSS processing

## Deployment Strategy

### Environment Configuration
- **Development**: Local development with hot reload via Vite
- **Production**: Optimized builds with static asset serving
- **Database**: Environment-based DATABASE_URL configuration
- **Port Configuration**: Configurable port mapping (default: 5000 → 80)

### Build Process
1. **Frontend Build**: Vite compiles React application to static assets
2. **Backend Build**: esbuild bundles server code for production
3. **Asset Serving**: Express serves static files in production mode
4. **Database Migration**: Drizzle Kit handles schema migrations

### Scaling Considerations
- **Static Assets**: Prepared for CDN distribution
- **Database**: PostgreSQL ready for connection pooling
- **Session Storage**: PostgreSQL-backed sessions for horizontal scaling
- **API Structure**: RESTful design suitable for load balancing

## Changelog

```
Changelog:
- June 13, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```