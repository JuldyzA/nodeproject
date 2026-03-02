"use strict";
const express = require('express');
const router = express.Router();
const repo = require("../lib/projects.repository");

// Routes
//Home page
router.get('/', (req, res) => {
  res.render('index', { title: 'My Portfolio' });
});

//About me page
router.get('/about', (req, res) => {
  res.render('about', { title: 'About Me' });
});

//Projects page
router.get('/projects', (req, res) => {
  const results = repo.searchActive(req.query.search);
  res.render('projects', { title: 'Projects', projects: results });
});

//Project details page
router.get('/projects/:slug', (req, res) => {
  const project = repo.getBySlug(req.params.slug);
  if (!project) {
    return res.status(404).render('404');
  }
  const otherProjects = repo.getAllActive().filter(
    p => p.slug !== project.slug
  );
  
  res.render('project-details', { title: project.title, project: project, otherProjects: otherProjects });
});

//Contact page
router.get('/contact', (req, res) => {
  res.render('contact', { title: 'Contact Me' });
});

//Contact form submission handler
router.post('/contact', (req, res) => {
  const { name, email, message } = req.body;
  //validate input  
  if (!name || !email || !message) {
    return res.status(400).json({ 
      message: 'All fields are required'
    });
  }
  res.status(200).json({ 
    message: 'Thank you! Your message has been received. I will get back to you soon.'
  });
});

//HTML 404 handler
router.use((req, res) => {
  res.status(404).render('404');
});

module.exports = router;