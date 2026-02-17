const express = require('express');
const router = express.Router();

const projectsData = require('../data/projects.json');

router.get('/projects', (req, res) => {
    const searchTerm = req.query.q;
    let results = projectsData.projects.filter(p => p.status === true);
    
    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        results = results.filter(p => p.title.toLowerCase().includes(term) || 
        p.tagline.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.stack.some(s => s.toLowerCase().includes(term)) ||
        p.tags.some(t => t.toLowerCase().includes(term)));
    }
    res.json(results);
  
});

router.get('/projects/:id', (req, res) => {
  const projectId = req.params.id;

  const project = projectsData.projects.find(
    p => p.id === projectId
  );

  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  res.json(project);
});

module.exports = router;