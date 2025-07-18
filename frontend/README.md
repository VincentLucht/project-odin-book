[![en](https://img.shields.io/badge/lang-en-red.svg)](README.md)
[![de](https://img.shields.io/badge/lang-de-blue.svg)](README.de.md)

# Frontend - Reddnir
The frontend for [Reddnir](https://github.com/VincentLucht/project-odin-book) built with React and Typescript.

## ✨ Key Features
**Community Management:**
- Browse, create, and customize communities with custom icons and banners
- Create community flairs
- Join/leave communities
- View community member lists and moderation tools for authorized users
- Edit community settings and flairs, view mod mail and reports

**Post Interaction:**
- Create posts within communities with full CRUD operations
- Voting system with upvote/downvote functionality and karma updates
- Multiple sorting algorithms (new, popular, hot) for post sorting
- Save/unsave posts for later viewing

**Comment System:**
- Threaded comment discussions with unlimited nesting levels
- Create, edit, or delete comments
- Vote on comments with instant UI feedback
- Collapsible comment threads for better readability
- Reply chains with visual indentation and connection lines

**User Experience:**
- Responsive design optimized for desktop, tablet, and mobile devices (down to 360px)
- Advanced search functionality across posts, comments, and communities
- User profile customization with bio, avatar, and description

**Performance & Navigation:**
- Client-side routing with React Router for seamless navigation
- Optimistic UI updates for immediate user feedback
- Infinite scrolling and virtualization for smooth performance on large datasets

**Social Features:**
- Chat system for direct user messaging
- User karma tracking and display across posts and comments
- Comprehensive activity feeds showing user's posts, comments, and interactions
- Report system for content moderation

## 🧰 Installation & Setup
### ‼️ Prerequisites
You <u>need</u> 1 environment variable:
`VITE_API_URL` (URL of your vite Port)

### ⚙️ Installation
Clone the Project:
```bash
git clone https://github.com/VincentLucht/project-odin-book.git
```

Go to the project directory and then into the frontend dir:
```bash
cd project-odin-book
cd frontend
```

Install dependencies:
```bash
npm install
```

Start the server:
```bash
npm run dev
```

## ⚡️ Tech Stack
[![Tech Stack](https://skillicons.dev/icons?i=ts,react,tailwind,vite)](https://skillicons.dev)