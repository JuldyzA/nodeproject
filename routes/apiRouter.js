"use strict";
const express = require('express');
const fs = require("fs");
const path = require("path");

const router = express.Router();

const projectsData = path.join(__dirname, '..', 'data', 'projects.json');

//only return active projects
router.get('/projects', (req, res) => {
    fs.readFile(projectsData, 'utf-8', (err, data) => {
      if(err){
        return res.status(500).json({ error: 'Failed to read projects data' });
      }
      try{
        const allProjects = JSON.parse(data).projects;
        const activeProjects = allProjects.filter(p => p.status === true);
        res.json(activeProjects);
      }catch(parseErr){
        res.status(500).json({ error: 'Failed to parse projects data' });
      }
    });
    // if (searchTerm) {
    //     const term = searchTerm.toLowerCase();
    //     results = results.filter(p => p.title.toLowerCase().includes(term) || 
    //     p.tagline.toLowerCase().includes(term) ||
    //     p.description.toLowerCase().includes(term) ||
    //     p.stack.some(s => s.toLowerCase().includes(term)) ||
    //     p.tags.some(t => t.toLowerCase().includes(term)));
    // }
    // res.json(results);
});

//return project by id
router.get('/projects/:id', (req, res) => {
  const projectId = req.params.id;
  fs.readFile(projectsData, 'utf-8', (err, data) => {
    if(err){
      return res.status(500).json({ error: 'Failed to read projects data' });
    }
    try{  
      const allProjects = JSON.parse(data).projects;
      const project = allProjects.find(p => p.id === projectId);
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      } 
      res.json(project);
    }
    catch(parseErr){
      res.status(500).json({ error: 'Failed to parse projects data' });
    }
  });
});

module.exports = router;