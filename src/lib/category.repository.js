"use strict";

const Category = require("../models/category");
const Project = require("../models/projects");

async function getCategoriesWithCount(){

  return Category.aggregate([

    {
      $lookup: {
        from: "projects",            // collection name in MongoDB
        localField: "_id",           // category _id
        foreignField: "categoryId",  // project.categoryId
        as: "projects"
      }
    },

    {
      $addFields: {
        projectCount: { $size: "$projects" }
      }
    },
    {
      $project: {
        name: 1,
        slug: 1,
        description: 1,
        projectCount: 1
      }
    }

  ]);

}

async function createCategory(data){

  const category = new Category(data);

  return category.save();

}

async function updateCategory(id, data){

  return Category.findByIdAndUpdate(id, data);

}

async function deleteCategory(id){

  const count = await Project.countDocuments({
    categoryId: id
  });

  if(count > 0){

    throw new Error("Cannot delete category because it is used by projects");

  }

  return Category.findByIdAndDelete(id);

}

async function getCategoryById(id){

  return Category.findById(id);

}

async function getAllCategories(){

  return Category.find().sort({ name: 1 });

}

module.exports = {
  getCategoriesWithCount,
  createCategory,   
  updateCategory,
  deleteCategory,
  getCategoryById,
  getAllCategories
};