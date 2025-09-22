# IdeaBoard MVP

A minimal web application for individuals to collect, tag, and share ideas as notes.

## Features

- **User Authentication**: Sign up and sign in with email/password
- **Note Management**: Create, edit, delete notes with rich content
- **Tagging System**: Add multiple tags to organize your notes
- **Search & Filter**: Find notes by keyword or tag
- **Public Sharing**: Generate shareable links for any note (read-only)
- **Clean UI**: Simple, intuitive interface built with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: PostgreSQL (Neon) with Drizzle ORM
- **Authentication**: NextAuth.js with credentials provider
- **Testing**: Playwright for e2e tests
- **Deployment**: Configured for Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (Neon recommended)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd agentic-factory
```

2. Install dependencies:
```bash
npm install
cd apps/web && npm install
```

3. Set up environment variables:
```bash
cd apps/web
cp .env.example .env.local
```

4. Configure your environment variables in `.env.local`:
```env
# Database - Replace with your Neon database URL
DATABASE_URL=postgresql://username:password@host:5432/database

# NextAuth - Generate a random secret
NEXTAUTH_SECRET=your-random-secret-key
NEXTAUTH_URL=http://localhost:5000

# Environment
NODE_ENV=development
```

5. Generate and push database schema:
```bash
npm run db:generate
npm run db:push
```

6. Start the development server:
```bash
npm run dev
```

The application will be available at [http://localhost:5000](http://localhost:5000).

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `NEXTAUTH_SECRET` | Secret for NextAuth.js sessions | `your-random-secret-key` |
| `NEXTAUTH_URL` | Base URL of your application | `http://localhost:5000` |

## Database Schema

The application uses the following database tables:

- **users**: User accounts (id, email, password_hash, created_at)
- **notes**: User notes (id, user_id, content, share_id, created_at, updated_at)
- **tags**: Tag definitions (id, label)
- **note_tags**: Many-to-many relationship between notes and tags

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/signin` - Sign in user
- `POST /api/auth/signout` - Sign out user

### Notes (Authenticated)
- `GET /api/notes` - List user's notes (with search/filter)
- `POST /api/notes` - Create new note
- `GET /api/notes/[id]` - Get specific note
- `PUT /api/notes/[id]` - Update note
- `DELETE /api/notes/[id]` - Delete note

### Public Sharing
- `GET /api/shared/[shareId]` - Get public note by share ID

## Usage

### Creating Notes
1. Sign up or sign in to your account
2. Click "Create Note" from the dashboard
3. Write your idea in the content area
4. Add tags by typing and pressing Enter
5. Save your note

### Sharing Notes
1. Open any of your notes
2. Click "Copy Share Link" to get a public URL
3. Anyone with the link can view the note (read-only)

### Searching & Filtering
- Use the search bar to find notes by content
- Filter by tags using the dropdown
- Click on any tag to filter by that tag

## Development

### Database Operations
```bash
# Generate migration files
npm run db:generate

# Push schema changes to database
npm run db:push

# Open Drizzle Studio
npm run db:studio
```

### Testing
```bash
# Run unit tests
npm run test

# Install Playwright dependencies
npm run test:e2e:install

# Run e2e tests
npm run test:e2e
```

### Linting
```bash
# Run ESLint
npm run lint

# Fix linting issues
npm run lint:fix
```

## Deployment

The application is configured for deployment on Vercel:

1. Connect your repository to Vercel
2. Set the environment variables in Vercel dashboard
3. Deploy

Required environment variables for production:
- `DATABASE_URL`
- `NEXTAUTH_SECRET` 
- `NEXTAUTH_URL`

## Security

- Passwords are hashed using bcrypt
- Share IDs are UUIDs for security
- API routes validate user ownership
- No third-party analytics or trackers
- Public notes are read-only

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if needed
5. Submit a pull request

## License

MIT License - see LICENSE file for details.