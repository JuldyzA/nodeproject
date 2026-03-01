"use strict";
const express = require('express');
const path = require('path');

const router = express.Router();


// Routes
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'src', 'pages', 'index.html'));
});

router.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'src', 'pages', 'about.html'));
});

router.get('/projects', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'src', 'pages', 'projects.html'));
});

router.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'src', 'pages', 'contact.html'));
});

module.exports = router;