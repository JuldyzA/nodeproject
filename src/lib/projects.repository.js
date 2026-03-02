
"use strict";
const data = require("../../data/projects.json");
const projectsData = data.projects;

//return only active projects
function getAllActive(){
    return projectsData.filter(p => p.status === true);
}

//find project by id
function getById(id){
    return projectsData.find(p => p.id === id) || null;
}

//find by slug
function getBySlug(slug){
    return projectsData.find(p => p.slug === slug) || null;
}

//search active projects by term in title, tagline, description, stack or tags
function searchActive(term){
    const active = getAllActive();

    if(!term || term.trim() === ''){
        return active;
    }

    const lower = term.toLowerCase();
    return active.filter(p => p.title.toLowerCase().includes(lower) ||
    p.tagline.toLowerCase().includes(lower) ||
    p.description.toLowerCase().includes(lower) ||
    p.stack.some(s => s.toLowerCase().includes(lower)) ||
    p.tags.some(t => t.toLowerCase().includes(lower))); 
}

module.exports = {
    getAllActive,
    getById,
    getBySlug,
    searchActive
}