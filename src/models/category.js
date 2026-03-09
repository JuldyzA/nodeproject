const { name } = require("ejs");
const mongoose = require("mongoose");

// 1. The Schema: Defines the structure of the documents in the collection
const categoriesSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true, URL: true },
  name: { type: String, required: true, unique: true },
  description: String,
  
});

// 2. The Model: The constructor used to interact with the collection
const Category = mongoose.model("Category", categoriesSchema);

module.exports = Category;