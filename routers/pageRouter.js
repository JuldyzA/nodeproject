const express = require('express');
const path = require('path');

const router = express.Router();

// helper base path
const pagesPath = path.join(__dirname, '..', 'pages');

// Routes
router.get('/', (req, res) => {
  res.sendFile(path.join(pagesPath, 'index.html'));
});

router.get('/about', (req, res) => {
  res.sendFile(path.join(pagesPath, 'about.html'));
});

router.get('/projects', (req, res) => {
  res.sendFile(path.join(pagesPath, 'projects.html'));
});

router.get('/contact', (req, res) => {
  res.sendFile(path.join(pagesPath, 'contact.html'));
});

module.exports = router;