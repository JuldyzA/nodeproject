const { name } = require("ejs");
const mongoose = require("mongoose");

// 1. The Schema: Defines the structure of the documents in the collection
const contactsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  postedDate: { type: Date, default: Date.now  },
  isRead: { type: Boolean, default: false }
});

// 2. The Model: The constructor used to interact with the collection
const Contacts = mongoose.model("Contacts", contactsSchema);

module.exports = Contacts;