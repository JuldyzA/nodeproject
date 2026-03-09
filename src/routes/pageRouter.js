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
router.get("/projects", async (req, res) => {

  try {

    const projects = await repo.getAllActive();

    console.log("Projects from DB:", projects.length);

    res.render("projects", { projects }); 

  } catch (err) {
    res.status(500).send("Server error");
  }

});

//Project details page
router.get("/projects/:slug", async (req, res) => {
  try {

    const project = await repo.getBySlug(req.params.slug);

    const otherProjects = (await repo.getAllActive())
  .filter(p => p.slug !== req.params.slug);

    res.render("project-detail", {
      project,
      otherProjects
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
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