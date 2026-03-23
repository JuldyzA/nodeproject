"use strict";

const Project = require("../models/projects");
const Category = require("../models/category"); 


async function getAllActive(){
    const projects = await Project.find({ isActive: true }).populate("categoryId");
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
    }).populate("categoryId");
}
function escapeRegex(text){
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
async function getByTag(tag){
    const safeTag = escapeRegex(tag);

    return await Project.find({
        isActive: true,
        "tags.name": new RegExp(`^${safeTag}$`, "i")
    }).populate("categoryId");
}

async function getByCategorySlug(slug){

    const category = await Category.findOne({ slug: slug });

    if(!category){
        return [];
    }

    return await Project.find({
        categoryId: category._id,
        isActive: true
    }).populate("categoryId");
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
    }).populate("categoryId");
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