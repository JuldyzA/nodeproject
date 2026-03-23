"use strict";

const bcrypt = require("bcrypt");
const User = require("../models/user");

async function getUsersCount() {
  return User.countDocuments();
}

async function registerUser(data) {
  const { email, nickname, plainPassword, role } = data;

  const existingUser = await User.findOne({ email: String(email).toLowerCase() });
  if (existingUser) {
    throw new Error("Email already exists");
  }

  const passwordHash = await bcrypt.hash(plainPassword, 10);

  const user = new User({
    email: String(email).toLowerCase(),
    nickname,
    passwordHash,
    role: role || "USER"
  });

  return user.save();
}

async function verifyCredentials(email, plainPassword) {
  const user = await User.findOne({ email: String(email).toLowerCase() });
  if (!user) {
    return null;
  }

  const isValid = await bcrypt.compare(plainPassword, user.passwordHash);
  if (!isValid) {
    return null;
  }

  user.lastLogin = new Date();
  await user.save();

  return user;
}

async function getUserById(id) {
  return User.findById(id).select("-passwordHash");
}

async function getUserWithPasswordById(id) {
  return User.findById(id);
}

async function getUserByEmail(email) {
  return User.findOne({ email: String(email).toLowerCase() }).select("-passwordHash");
}

async function getAllUsers() {
  return User.find().sort({ createdAt: -1 }).select("-passwordHash");
}

async function createUserByAdmin(data) {
  const { email, nickname, plainPassword, role } = data;
  return registerUser({ email, nickname, plainPassword, role });
}

async function updateUser(id, data) {
  const update = {
    email: data.email ? String(data.email).toLowerCase() : undefined,
    nickname: data.nickname,
    role: data.role
  };

  Object.keys(update).forEach((key) => update[key] === undefined && delete update[key]);

  return User.findByIdAndUpdate(id, update, { new: true, runValidators: true }).select("-passwordHash");
}

async function updateUserPassword(id, plainPassword) {
  const passwordHash = await bcrypt.hash(plainPassword, 10);
  return User.findByIdAndUpdate(id, { passwordHash }, { new: true }).select("-passwordHash");
}

async function deleteUser(id) {
  return User.findByIdAndDelete(id);
}

module.exports = {
  getUsersCount,
  registerUser,
  verifyCredentials,
  getUserById,
  getUserWithPasswordById,
  getUserByEmail,
  getAllUsers,
  createUserByAdmin,
  updateUser,
  updateUserPassword,
  deleteUser
};
