"use strict";
const { logUnauthorizedAccess } = require("../lib/log.repository");

/**
 * Middleware: Ensure user is authenticated
 * 
 * This middleware checks if user exists in the current session.
 * If not authenticated, redirects to login page.
 */
function isAuthenticated(req, res, next) {
  // Check if user exists (req.user set by passport.session())
  if (req.user) {
    // User is authenticated, let request proceed to route handler
    return next();
    
    logUnauthorizedAccess(req, "AUTHENTICATED");

  const returnUrl = req.originalUrl;
  res.redirect(`/auth/login?returnUrl=${encodeURIComponent(returnUrl)}`);

  }

  // User not authenticated, redirect to login
  // Remember the page they tried to access for redirect after login
  const returnUrl = req.originalUrl;
  res.redirect(`/auth/login?returnUrl=${encodeURIComponent(returnUrl)}`);
}

function hasAnyRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      //log guest user
      logUnauthorizedAccess(req, allowedRoles);
      return res.redirect(`/auth/login?returnUrl=${encodeURIComponent(req.originalUrl)}`);
    }

    if (allowedRoles.includes(req.user.role)) {
      return next();
    }
    //log logged-in user with wrong role
    logUnauthorizedAccess(req, allowedRoles);
    return res.status(403).render("403");
  };
}

function isModeratorOrAdmin(req, res, next) {
  return hasAnyRole("MODERATOR", "ADMIN")(req, res, next);
}

function isAdmin(req, res, next) {
  return hasAnyRole("ADMIN")(req, res, next);
}

/**
 * Middleware: Ensure user is NOT authenticated (for auth pages)
 * 
 * Used on login/register routes to redirect away if already logged in
 * 
 * USAGE:
 * router.get('/auth/login', isNotAuthenticated, (req, res) => { ... })
 */
function isNotAuthenticated(req, res, next) {
  if (!req.user) {
    // User not logged in, allow access to auth page
    return next();
  }

  // User already logged in, redirect to dashboard
  res.redirect("/admin");
}

/**
 * Middleware: Optional authentication check
 */
function optionalAuth(req, res, next) {
  // Just pass through - req.user will be set if authenticated
  // Otherwise req.user will be undefined
  return next();
}

/**
 * ERROR MESSAGE HELPER
 */
function renderAuthError(res, templateName, errorMessage) {
  res.render(templateName, {
    error: errorMessage,
    successMessage: null
  });
}

module.exports = {
  isAuthenticated,
  hasAnyRole,
  isModeratorOrAdmin,
  isAdmin,
  isNotAuthenticated,
  optionalAuth,
  renderAuthError
};
