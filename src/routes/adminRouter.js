"use strict";

const express = require("express");
const router = express.Router();

const contactRepo = require("../lib/contact.repository");
const categoryRepo = require("../lib/category.repository");
const projectRepo = require("../lib/project.repository");

/* DASHBOARD */
router.get("/", async (req, res) => {
  try {
    const projects = await projectRepo.getAllProjects();
    const categories = await categoryRepo.getCategoriesWithCount();
    const contacts = await contactRepo.getAllContacts();
    
    const projectCount = projects.length;
    const categoryCount = categories.length;
    const unreadCount = contacts.filter(c => !c.isRead).length;
    
    res.render("admin/dashboard", { projectCount, categoryCount, unreadCount });
  } catch (err) {
    console.error(err);
    res.render("admin/dashboard", { projectCount: 0, categoryCount: 0, unreadCount: 0 });
  }
});

/* CONTACTS */
router.get("/contacts", async (req, res) => {
  try {
    const contacts = await contactRepo.getAllContacts();
    res.render("admin/contacts", { contacts });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Toggle read status
router.post("/contacts/:id/read", async (req, res) => {
  try {
    const contact = await contactRepo.getContactById(req.params.id);
    await contactRepo.updateContact(req.params.id, { isRead: !contact.isRead });
    res.redirect("/admin/contacts");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Delete contact
router.post("/contacts/:id/delete", async (req, res) => {
  try {
    await contactRepo.deleteContact(req.params.id);
    res.redirect("/admin/contacts");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

/* CATEGORIES */
router.get("/categories", async (req, res) => {
  try {
    const categories = await categoryRepo.getCategoriesWithCount();
    res.render("admin/categories", { categories });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Show form for creating new category
router.get("/categories/new", (req, res) => {
  res.render("admin/category-form", {
    category: null
  });
});

// Create category
router.post("/categories", async (req, res) => {
  try {
    const { name, slug, description } = req.body;
    await categoryRepo.createCategory({
      name,
      slug,
      description
    });
    res.redirect("/admin/categories");
  } catch(err){
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Show form for editing category
router.get("/categories/:id/edit", async (req, res) => {
  try { 
    const category = await categoryRepo.getCategoryById(req.params.id);
    res.render("admin/category-form", { category });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Update category
router.post("/categories/:id", async (req, res) => {
  try {
    const { name, slug, description } = req.body;
    await categoryRepo.updateCategory(req.params.id, { name, slug, description });
    res.redirect("/admin/categories");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Delete category
router.post("/categories/:id/delete", async (req, res) => {
  try {
    await categoryRepo.deleteCategory(req.params.id);
    res.redirect("/admin/categories");
  } catch(err){
    console.error(err);
    res.send("Cannot delete category because it has projects");
  }
});

/* PROJECTS */
router.get("/projects", async (req, res) => {
  try {
    const projects = await projectRepo.getAllProjects();
    res.render("admin/projects", { projects });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Show form for creating new project
router.get("/projects/new", async (req, res) => {
  try {
    const categories = await categoryRepo.getAllCategories();
    res.render("admin/project-form", { project: null, categories });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Create project
router.post("/projects", async (req, res) => {
  try {
    await projectRepo.createProject(req.body);
    res.redirect("/admin/projects");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Show form for editing project
router.get("/projects/:id/edit", async (req, res) => {
  try {
    const project = await projectRepo.getProjectById(req.params.id);
    const categories = await categoryRepo.getAllCategories();
    res.render("admin/project-form", { project, categories });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Update project
router.post("/projects/:id", async (req, res) => {
  try {
    await projectRepo.updateProject(req.params.id, req.body);
    res.redirect("/admin/projects");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Delete project
router.post("/projects/:id/delete", async (req, res) => {
  try {
    await projectRepo.deleteProject(req.params.id);
    res.redirect("/admin/projects");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
