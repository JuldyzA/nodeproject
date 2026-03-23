# Node Portfolio Launchpad (A03)

## Overview
This project is a Node.js + Express portfolio application using MongoDB Atlas with Mongoose.

It includes:

- Server-side rendered pages (EJS)
- REST-style API endpoints
- Admin CMS for managing projects, categories, contacts, and users
- Role-based authorization (USER, MODERATOR, ADMIN)
- Project image upload and image metadata management


## Highlights
✅ REST API (JSON)

✅ Server-side rendered pages (EJS)

✅ Clean routing and middleware layers

✅ Repository pattern architecture

✅ Authentication with Passport + session

✅ Authorization with role-based access control

✅ Project image upload (Multer) with metadata editing


## Architecture Overview
Client (Browser / Postman)
        ↓
Express Server
        ↓
Routes
   ├── Page Routes
   ├── API Routes (/api/*)
   ├── Auth Routes (/auth/*)
   └── Admin Routes (/admin/*)
        ↓
Middleware
   ├── Authentication (session + passport)
   ├── Authorization (role checks)
   └── Upload (multer)
        ↓
Repositories
        ↓
Mongoose Models
        ↓
MongoDB Atlas


## Authorization (Implemented)
The app now includes full authentication + authorization flow:

- Local login strategy with Passport
- Session-based authentication via express-session
- Password hashing via bcrypt
- Role-aware route protection

Roles:

- USER: Public browsing and basic authenticated experience
- MODERATOR: Access to admin dashboard and contact moderation
- ADMIN: Full CMS access (projects, categories, users, image management)

Route guards:

- isAuthenticated
- isModeratorOrAdmin
- isAdmin

Unauthorized attempts are logged, and forbidden access renders a 403 page.


## Project Image Upload (Implemented)
Admins can manage images per project from the CMS.

Features:

- Upload image files to project-specific folders
- Auto-sanitized filename generation
- Metadata support: alt text, caption, featured flag
- Update image metadata in place
- Delete image metadata from project gallery

Upload behavior:

- Accepted files: image/* MIME types
- Max file size: 5 MB
- Storage path: public/uploads/:project-slug/
- URL path persisted in DB: /uploads/:project-slug/:filename
- Only one featured image is kept at a time per project


## Tech Stack
- Node.js
- Express
- EJS
- MongoDB Atlas + Mongoose
- Passport (passport-local)
- express-session
- Multer
- bcrypt
- Morgan
- Dotenv


## UI / Styling Notes
- Public site styles are served from public/css/styles.css.
- Admin dashboard styles are served from public/css/admin-style.css.
- Navigation and cards use gradient accents and compact utility button classes.
- The layout is responsive, with mobile navigation behavior and stacked content sections on smaller screens.
- Project detail and listing pages render project images using metadata (featured image + gallery support).


## Setup
Install dependencies:

npm install

Create a .env file:

MONGO_URI=your_mongodb_connection_string
SESSION_SECRET=your_session_secret
PORT=3000
APP_TIMEZONE=America/Vancouver
TRUST_PROXY=false

Run the server:

npm start

or (watch mode):

npm run dev

Open in browser:

http://localhost:3000


## Main Routes
Public pages:

/- Home
/about - About page
/projects - Project list
/projects/:slug - Project detail
/contact - Contact form

Auth routes:

/auth/register
/auth/login
/auth/logout

API routes:

/api/projects
/api/projects?q=term
/api/projects?tag=tagName
/api/projects/category/:slug
/api/categories

Admin CMS:

/admin
/admin/projects
/admin/categories
/admin/contacts
/admin/users

Project image management (Admin only):

GET /admin/projects/:projectId/images
POST /admin/projects/:projectId/images?slug=:projectSlug
PATCH /admin/projects/:projectId/images/:imageId
DELETE /admin/projects/:projectId/images/:imageId


## Notes
- First registered account becomes ADMIN automatically.
- Additional users are USER by default unless created/updated by ADMIN.
- Public project pages can render featured images and image galleries from projectImages metadata.

