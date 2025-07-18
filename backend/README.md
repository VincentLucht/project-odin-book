[![en](https://img.shields.io/badge/lang-en-red.svg)](README.md)
[![de](https://img.shields.io/badge/lang-de-blue.svg)](README.de.md)

# Backend - Reddnir
The backend API for [Reddnir](https://github.com/VincentLucht/project-odin-book) built with Node.js, Express, and TypeScript.

## ✨ Key Features
**API Architecture:**
- 100+ secure REST endpoints with comprehensive input validation
- Role-based access control ensuring proper authorization across all routes
- Structured error handling with consistent response formats
- comprehensive Security middleware

**Database Management:**
- PostgreSQL database with Prisma ORM for type-safe database operations
- Complex relational schema supporting communities, posts, comments, users, and moderation
- Raw SQL queries for advanced operations and performance optimization
- Database migrations and seeding for development and production environments

**Authentication & Security:**
- JWT-based authentication with refresh token rotation
- Password hashing using bcrypt with salt rounds
- CORS configuration for secure cross-origin requests
- Input sanitization and validation using Zod schemas

**Community System:**
- Community creation, management, and privacy controls (public, restricted, private)
- Membership management with join/leave functionality
- Moderation tools including user bans, reports handling, and mod mail
- Custom community settings with icon and banner upload support

**Content Management:**
- Post CRUD operations with voting system and karma calculation
- Threaded comment system with unlimited nesting levels
- Content sorting algorithms (new, popular, hot) with optimized queries
- Save/unsave functionality for user content curation

**User Management:**
- User registration and authentication with email verification
- Profile customization with bio, avatar, and description
- Karma tracking across posts and comments
- User activity feeds and interaction history

## 🧰 Installation & Setup
### ‼️ Prerequisites
You **need** these environment variables:
- `DATABASE_URL` (PostgreSQL connection string)
- `JWT_SECRET` (Secret key for JWT tokens)
- `JWT_REFRESH_SECRET` (Secret key for refresh tokens)
- `CORS_ORIGIN` (Frontend URL for CORS)
- `NODE_ENV` (development/production)

### ⚙️ Installation
Clone the Project:
```bash
git clone https://github.com/VincentLucht/project-odin-book.git
```

Go to the project directory and then into the backend dir:
```bash
cd project-odin-book
cd backend
```

Install dependencies:
```bash
npm install
```

Set up the database:
```bash
npx prisma migrate dev
```

Start the server:
```bash
npm run dev
```

Run the seed script (optional)
```bash
npm run db
```

## ⚡️ Tech Stack
[![Tech Stack](https://skillicons.dev/icons?i=ts,nodejs,express,postgres,prisma)](https://skillicons.dev)