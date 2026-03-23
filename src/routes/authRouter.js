"use strict";

const express = require("express");
const router = express.Router();
const passport = require("passport");
const userRepo = require("../lib/user.repository");

/**
 * AUTHENTICATION ROUTES EXPLANATION
 * ==================================
 * 
 * ROUTES IN THIS FILE:
 * - GET /auth/register - Show registration form
 * - POST /auth/register - Handle registration submission
 * - GET /auth/login - Show login form
 * - POST /auth/login - Handle login submission (Passport handles this)
 * - GET /auth/logout - Clear session and redirect

/**
 * GET /auth/register
 * Displays the registration form
 */
router.get("/register", (req, res) => {
  // If user already logged in, redirect based on role
  if (req.user) {
    if (req.user.role === "ADMIN" || req.user.role === "MODERATOR") {
      return res.redirect("/admin");
    }
    return res.redirect("/");
  }

  res.render("auth/register", {
    title: "Register",
    error: null
  });
});

/**
 * POST /auth/register
 * Handles user registration
 */
router.post("/register", async (req, res) => {
  try {
    const { nickname, email, password, confirmPassword } = req.body;

    // Validation: check required fields
    if (!nickname || !email || !password || !confirmPassword) {
      return res.render("auth/register", {
        title: "Register",
        error: "All fields are required",
      });
    }

    // Validation: password confirmation
    if (password !== confirmPassword) {
      return res.render("auth/register", {
        title: "Register",
        error: "Passwords do not match",
      });
    }

    // Validation: password length
    if (password.length < 6) {
      return res.render("auth/register", {
        title: "Register",
        error: "Password must be at least 6 characters",
      });
    }

    const usersCount = await userRepo.getUsersCount();
    const role = usersCount === 0 ? "ADMIN" : "USER";

    await userRepo.registerUser({
      email,
      nickname,
      plainPassword: password,
      role
    });

    // Registration successful, redirect to login
    res.redirect("/auth/login?registered=true");

  } catch (error) {
    // Handle errors: duplicate username/email, database errors, etc.
    const errorMessage = error.message || "Registration failed";
    
    res.render("auth/register", {
      title: "Register",
      error: errorMessage,
    });
  }
});

/**
 * GET /auth/login
 * Displays the login form
 */
router.get("/login", (req, res) => {
  // If already logged in, redirect based on role
  if (req.user) {
    if (req.user.role === "ADMIN" || req.user.role === "MODERATOR") {
      return res.redirect("/admin");
    }
    return res.redirect("/");
  }

  // Check if redirected from successful registration
  const showSuccess = req.query.registered === 'true';
  const loginError = typeof req.query.error === "string" ? req.query.error : null;

  res.render("auth/login", {
    title: "Login",
    error: loginError,
    successMessage: showSuccess ? "Registration successful! Please login." : null
  });
});

/**
 * POST /auth/login
 * Handles user login
 */
router.post(
  "/login",
  passport.authenticate("local", {
    // Redirect back to login form on failed login
    failureRedirect: "/auth/login?error=Invalid%20email%20or%20password"
  }),
  (req, res) => {
    if (req.user && (req.user.role === "ADMIN" || req.user.role === "MODERATOR")) {
      return res.redirect("/admin");
    }

    return res.redirect("/");
  }
);

/**
 * GET /auth/logout
 * Clears session and logs out user
 */
router.get("/logout", (req, res) => {
  // Passport logout method destroys session
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }
    // Redirect to home page after successful logout
    res.redirect("/");
  });
});

module.exports = router;
