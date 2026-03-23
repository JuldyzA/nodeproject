const mongoose = require("mongoose");

// 1. The Blueprint: Define fields and types
const projectSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  isActive: { type: Boolean, required: true },

  stack: [String],

  tags: [
    {
      name: String
    }
  ],

  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },
  projectImages: [
  {
    originalName: { type: String, required: true },
    filename: { type: String, required: true },
    urlPath: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    altText: { type: String, default: "" },
    caption: { type: String, default: "" },
    isFeatured: { type: Boolean, default: false },
    uploadedAt: { type: Date, default: Date.now }
  }
],
});




// 2. The Model: The constructor used to interact with the collection
const Project = mongoose.model("Project", projectSchema);

module.exports = Project;