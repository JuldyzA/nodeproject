"use strict";
const express = require('express');
const router = express.Router();
const repo = require("../lib/projects.repository");
const contactRepo = require("../lib/contact.repository");
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
    const selectedTag = typeof req.query.tag ==="string" ? req.query.tag.trim() : "";

    //const projects = await repo.getAllActive();
    const projects = selectedTag ? await repo.getByTag(selectedTag): await repo.getAllActive();

    console.log("Projects from DB:", projects.length);

    res.render("projects", { projects, selectedTag }); 

  } catch (err) {
    res.status(500).send("Server error");
  }

});

//Project details page
router.get("/projects/:slug", async (req, res) => {
  try {

    const project = await repo.getBySlug(req.params.slug);
    if (!project) {
      return res.status(404).render("404");
    }

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
router.post("/contact", async (req, res) => {

  const { name, email, message } = req.body;
  const wantsJson =
    (req.headers.accept && req.headers.accept.includes("application/json")) ||
    req.headers["content-type"] === "application/json";

  if (!name || !email || !message) {
    if (wantsJson) {
      return res.status(400).json({ message: "All fields are required" });
    }

    return res.status(400).render("contact", {
      error: "All fields are required"
    });
  }

  try {

    await contactRepo.createContact({
      name,
      email,
      message
    });

    if (wantsJson) {
      return res.status(200).json({ message: "Message sent successfully" });
    }

    return res.render("contact", {
      success: "Message sent successfully"
    });

  } catch (err) {
    console.error(err);

    if (wantsJson) {
      return res.status(500).json({ message: "Could not send message" });
    }

    return res.status(500).render("contact", {
      error: "Could not send message"
    });
  }

});

//HTML 404 handler
router.use((req, res) => {
  res.status(404).render('404');
});

module.exports = router;