# Node Portfolio Launchpad (A01)

## Overview
This project is a Node.js + Express portfolio server that:

- Serves static HTML pages from the `/pages` folder
- Serves static assets (CSS, JS, images) from `/public`
- Provides a JSON API for project data
- Dynamically renders projects on the frontend using vanilla JavaScript and fetch()

This assignment focuses on Express routing, middleware, API design, and frontend API integration.



# Node Portfolio Launchpad (A02)

#Overview
✅ REST API (JSON)

✅ Server-side rendered pages (EJS)

✅ Proper routing

✅ Search functionality

✅ 404 handling (API vs HTML)

✅ Clean architecture (repository pattern)


#Architecture Overview
Client (Browser / Postman)
        ↓
Express Server
        ↓
Routes
   ├── API Routes (/api/*)
   └── Page Routes (/projects, /projects/:slug)
        ↓
Repository (projects.repository.js)
        ↓
Data (projects.json)


# Node Portfolio Lunchpad (A03)
This project is a Node.js + Express portfolio application that uses MongoDB Atlas with Mongoose as the database. The application replaces a previous JSON file data source and implements a minimal Admin CMS to manage Projects, Categories, and Contact submissions.

The system includes server-rendered pages using EJS, API endpoints for project data, and an admin interface for content management.

Features

MongoDB Atlas database integration

Mongoose schemas for Projects, Categories, and Contacts

Admin CMS for managing content

Contact form submissions stored in MongoDB

Project filtering by search and tag

Category-based project browsing

REST-style API endpoints



Setup

Install dependencies:

npm install

Create .env file:

MONGO_URI=your_mongodb_connection_string
PORT=3000

Run the server:

node server.js

Open in browser:

http://localhost:3000


Main Routes

Public pages

/                Home
/about           About page
/projects        Project list
/projects/:slug  Project detail
/contact         Contact form

API routes

/api/projects
/api/projects?q=term
/api/projects?tag=tagName
/api/projects/category/:slug
/api/categories

Admin CMS

/admin
/admin/projects
/admin/categories
/admin/contacts