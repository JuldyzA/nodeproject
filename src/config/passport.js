const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const userRepo = require("../lib/user.repository");

/**
 * PASSPORT.JS CONFIGURATION EXPLANATION
 * =====================================
 * 
 * WHAT IS PASSPORT?
 * - Middleware for Node.js that handles authentication
 * - Supports multiple strategies: Local, OAuth, JWT, LDAP, etc.
 * - We use Local Strategy: username/password authentication
 * 
 * WHAT DOES THIS FILE DO?
 * 1. Defines authentication strategy (how to verify credentials)
 * 2. Defines serialization (how to store user in session)
 * 3. Defines deserialization (how to load user from session)
 * 
 * SESSION FLOW:
 * User Login: 
 *   username/password → verify in database → on success:
 *     → serialize user (store user.id in session) 
 *     → create session cookie
 *     → send cookie to browser
 * 
 * Subsequent Requests:
 *   browser sends session cookie →
 *   express-session middleware restores session from store →
 *   passport.deserializeUser() fetches full user object from ID →
 *   req.user contains full user object for protected routes
 */

/**
 * LOCAL STRATEGY
 * This defines how Passport verifies username/password
 * 
 * WHY PASSPORT STRATEGIES?
 * - Abstracts authentication logic away from route handlers
 * - Consistent interface across different auth methods
 * - Handles session serialization automatically
 */
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",  // Form field name for email
      passwordField: "password",  // Form field name for password
      passReqToCallback: false    // Don't pass entire request to verify callback
    },
    /**
     * Verification callback
     * Called when someone attempts login
     * 
     * @param {string} username - Username from form
     * @param {string} password - Password from form
     * @param {Function} done - Callback function
     * 
     * IMPORTANT: done() callback signature:
     * - done(error, user, info)
     * - error: null if no errors, Error object if database error
     * - user: false if auth failed, user object if successful
     * - info: optional message for UI (e.g., "Password incorrect")
     */
    async (email, password, done) => {
      try {
        // Try to verify credentials using repository method
        const user = await userRepo.verifyCredentials(email, password);

        if (!user) {
          // Authentication failed
          return done(null, false, { message: "Invalid email or password" });
        }

        // Authentication successful - pass user object back
        return done(null, user);

      } catch (error) {
        // Database error or other exception
        return done(error);
      }
    }
  )
);

/**
 * SERIALIZATION
 * Determines what user data to store in the session
 * 
 * WHY SERIALIZE?
 * - Sessions stored in memory or database have size limits
 * - Storing entire user object wastes space
 * - Store minimal identifier (ID), reload user on demand
 * 
 * In this case: Store only user._id in session
 * Session might contain: { passport: { user: "507f1f77bcf86cd799439011" } }
 */
passport.serializeUser((user, done) => {
  done(null, user._id);
});

/**
 * DESERIALIZATION
 * Restores full user object from session on each request
 * 
 * WHY DESERIALIZE?
 * - When user makes a request with session cookie
 * - Session contains only user ID (small)
 * - This function looks up full user object from ID
 * - Makes req.user available with up-to-date data
 * 
 * Called by passport.session() middleware on each request
 * before route handlers execute
 */
passport.deserializeUser(async (id, done) => {
  try {
    const user = await userRepo.getUserById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;
