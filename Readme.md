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

