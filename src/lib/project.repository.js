"use strict";

const Project = require("../models/projects");

async function getAllProjects(){

  return Project.find().populate("categoryId");

}

async function getProjectById(id){

  return Project.findById(id);

}

async function createProject(data){

  // Convert string to array for stack
  if(typeof data.stack === 'string'){
    data.stack = data.stack.split(',').map(s => s.trim()).filter(s => s);
  }

  // Convert string to array of objects for tags
  if(typeof data.tags === 'string'){
    data.tags = data.tags.split(',').map(t => ({ name: t.trim() })).filter(t => t.name);
  }

  // Convert string to boolean for isActive
  if(typeof data.isActive === 'string'){
    data.isActive = data.isActive === 'true';
  }

  const project = new Project(data);

  return project.save();

}

async function updateProject(id, data){

  // Convert string to array for stack
  if(typeof data.stack === 'string'){
    data.stack = data.stack.split(',').map(s => s.trim()).filter(s => s);
  }

  // Convert string to array of objects for tags
  if(typeof data.tags === 'string'){
    data.tags = data.tags.split(',').map(t => ({ name: t.trim() })).filter(t => t.name);
  }

  // Convert string to boolean for isActive
  if(typeof data.isActive === 'string'){
    data.isActive = data.isActive === 'true';
  }

  return Project.findByIdAndUpdate(id, data);

}

async function deleteProject(id){

  return Project.findByIdAndDelete(id);

}

module.exports = {

  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject

};