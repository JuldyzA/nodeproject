"use strict";

const express = require('express');
const router = express.Router();
const repo = require("../lib/projects.repository");
router.get("/test", (req,res)=>{
  res.json({message:"API router works"});
});


// GET /api/projects
router.get("/projects", async (req, res) => {
  const q = req.query.q;
  const tag = req.query.tag;
  try{
    let projects;
    if (tag) {
      projects = await repo.getByTag(tag); 
    }
    else if (q) {
      projects = await repo.searchActive(q);
    }
    else {
      projects = await repo.getAllActive();
    }

    res.json(projects);
    }
  catch(err){
    res.status(500).json({error: "Server error"});
  }
});


// GET /api/projects/category/:slug
router.get("/projects/category/:slug", async (req, res) => {
console.log("CATEGORY ROUTE HIT:", req.params.slug);
  try {

    const projects = await repo.getByCategorySlug(req.params.slug);

    res.json(projects);

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }

});
// GET /api/projects/:id
router.get('/projects/:id', async (req, res) => {
  try{
    const project = await repo.getById(req.params.id);

    if (!project || project.isActive !== true) {
    return res.status(404).json({ error: 'Project not found' });
  }
  res.json(project);

    }catch(err){
      res.status(500).json({ error: "Server error" });
    }
});


// GET /api/categories
router.get("/categories", async (req, res) => {

  try {

    const categories = await repo.getAllCategories();

    res.json(categories);

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }

});
//API 404 handler
router.use((req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

module.exports = router;