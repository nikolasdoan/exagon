# Exagon

A project management application with 3D visualization capabilities.

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

## Local Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up the local database:
   ```bash
   ./setup-local-db.sh
   ```
   This script will:
   - Create a local PostgreSQL database
   - Create a database user
   - Set up the necessary permissions
   - Create a `.env` file with local database configuration
   - Run the database migrations

3. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`

## Project Structure

- `client/` - React frontend application
- `server/` - Express.js backend server
- `shared/` - Shared types and database schema
- `migrations/` - Database migrations

## Features

- User authentication and authorization
- Project management
- Task tracking with milestones
- File management with versioning
- Comments and activity tracking
- 3D model visualization

## Environment Variables

The following environment variables are required:

- `LOCAL_DATABASE_URL` - Local PostgreSQL database URL (created by setup script)
- `SESSION_SECRET` - Secret key for session management (created by setup script)

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run check` - Run TypeScript type checking
- `npm run db:push` - Push database schema changes 
