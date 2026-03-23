"use strict";

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: /.+\@.+\..+/
  },
  nickname: {
    type: String,
    required: true,
    trim: true,
    minlength: 2
  },
  passwordHash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ["USER", "MODERATOR", "ADMIN"],
    default: "USER"
  },
  lastLogin: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

const User = mongoose.model("User", userSchema);

module.exports = User;
