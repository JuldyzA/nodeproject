"use strict";

const express = require('express');
const router = express.Router();
const repo = require("../lib/projects.repository");

// GET /api/projects
router.get("/projects", (req, res) => {
  const q = req.query.q;

  let projects = repo.getAllActive();

  if (q) {
    projects = projects.filter(p =>
      p.title.toLowerCase().includes(q.toLowerCase()) ||
      p.description.toLowerCase().includes(q.toLowerCase())
    );
  }

  res.json(projects);
});
// GET /api/projects/:id
router.get('/projects/:id', (req, res) => {
  const project = repo.getById(req.params.id);
  if (!project || project.status !== true) {
    return res.status(404).json({ error: 'Project not found' });
  }
  res.json(project);
})

//API 404 handler
router.use((req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

module.exports = router;