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

async function addProjectImageToProject(projectId, file, metadata) {
  try {
    const project = await Project.findById(projectId);
    if (!project) return { success: false, errorMessage: "Project not found." };

    if (!project.projectImages) {
      project.projectImages = [];
    }

    if (file) {
      const wantsFeatured = metadata.isFeatured === "true";
      if (wantsFeatured) {
        project.projectImages.forEach(img => {
          img.isFeatured = false;
        });
      }

      project.projectImages.push({
        originalName: file.originalname,
        filename: file.filename,
        urlPath: `/uploads/${project.slug}/${file.filename}`,
        mimeType: file.mimetype,
        size: file.size,
        altText: metadata.altText || "",
        caption: metadata.caption || "",
        isFeatured: wantsFeatured,
      });
    }

    await project.save();
    return { success: true, project };
  } catch (error) {
    return { success: false, error, errorMessage: "Failed to add projectImage." };
  }
}

async function updateProjectImageMetadata(projectId, imageId, updates) {
  try {
    const project = await Project.findById(projectId);
    if (!project) return { success: false, errorMessage: "Project not found." };

    // Mongoose subdocument arrays give us a special .id() method!
    const image = project.projectImages.id(imageId);

    if (!image) return { success: false, errorMessage: "Image not found." };

    // Update the properties
    if (updates.altText !== undefined) image.altText = updates.altText;
    if (updates.caption !== undefined) image.caption = updates.caption;
    if (updates.isFeatured !== undefined) {
      // If we are featuring this image, we logically must un-feature all others!
      if (updates.isFeatured === true || updates.isFeatured === 'true') {
         project.projectImages.forEach(img => img.isFeatured = false);
      }
      image.isFeatured = updates.isFeatured === true || updates.isFeatured === 'true';
    }

    // Saving the parent project automatically saves the modified subdocuments
    await project.save();
    return { success: true, project };
  } catch (error) {
    return { success: false, error, errorMessage: "Failed to update image." };
  }
}

async function  deleteProjectImage(projectId, imageId) {
  try {
    const project = await Project.findById(projectId);
    if (!project) return { success: false, errorMessage: "Project not found." };

    // Mongoose pulls the subdocument completely out of the array mapped in memory
    project.projectImages.pull(imageId);

    // Save the array back to MongoDB
    await project.save();

    return { success: true };
  } catch (error) {
     return { success: false, error, errorMessage: "Failed to delete projectImage." };
  }
}
module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  addProjectImageToProject,
  updateProjectImageMetadata,
  deleteProjectImage
};