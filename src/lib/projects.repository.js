"use strict";

const Project = require("../models/projects");
const Category = require("../models/category"); 

async function getAllActive(){
    const projects = await Project.find();
    console.log("Projects from DB:", projects.length);
    return projects;
}

async function searchActive(term){

    if(!term || term.trim() === ""){
        return await getAllActive();
    }

    const regex = new RegExp(term, "i");

    return await Project.find({
        isActive: true,
        $or: [
            { title: regex },
            { description: regex },
            { "tags.name": regex },
            { stack: regex }
        ]
    });
}

async function getByTag(tag){
    return await Project.find({
        isActive: true,
        "tags.name": new RegExp(tag, "i")
    });
}

async function getByCategorySlug(slug){

    const category = await Category.findOne({ slug: slug });

    if(!category){
        return [];
    }

    return await Project.find({
        categoryId: category._id,
        isActive: true
    });
}

async function getAllCategories(){
    return await Category.find();
}

async function getById(id){
    return await Project.findById(id);
}

// find project by slug
async function getBySlug(slug) {
  return await Project.findOne({
    slug: slug,
    isActive: true
  });
}
module.exports = {
    getAllActive,
    searchActive,
    getByTag,
    getByCategorySlug,
    getAllCategories,
    getById,
    getBySlug
};