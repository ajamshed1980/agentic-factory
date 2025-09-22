# Agentic Factory - Project Documentation

## Overview
This is a Next.js monorepo project that will become an "IdeaBoard" application. The project is structured as a monorepo with the main web application located in `apps/web/`.

## Project Architecture
- **Framework**: Next.js 15.5.3 with Turbopack
- **Frontend**: React 19.1.0 with Tailwind CSS 4
- **Language**: TypeScript 5
- **Monorepo Structure**: 
  - Root level contains monorepo configuration
  - `apps/web/` contains the main Next.js application
  - Testing setup with Playwright for e2e tests

## Current State (September 22, 2025)
- ✅ Dependencies installed for both root and web app
- ✅ Next.js configured for Replit environment with proper host settings
- ✅ Development server configured to run on 0.0.0.0:5000
- ✅ Workflow setup for continuous development
- ✅ Deployment configuration set for autoscale deployment
- ✅ Cross-origin requests properly configured for Replit proxy

## Development Configuration
- **Dev Server**: Runs on 0.0.0.0:5000 with Turbopack enabled
- **Workflow**: "Web Server" workflow runs the development server
- **Replit Integration**: Configured `allowedDevOrigins` for cross-origin requests

## Build Request Details
The application will feature:
- User authentication/sign-in
- Note creation with tagging system
- Search functionality
- Public sharing pages
- PostgreSQL database with Drizzle ORM integration
- Playwright e2e testing suite

## Recent Changes
- **2025-09-22**: Project imported from GitHub and configured for Replit environment
- Configured Next.js for proxy compatibility
- Setup development workflow on port 5000
- Configured autoscale deployment settings

## Next Steps
The project is ready for development. Future features will include authentication, database integration, and the IdeaBoard functionality as outlined in the build request.