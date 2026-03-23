"use strict";

require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const morgan = require('morgan');
const session = require('express-session');
const passport = require('./src/config/passport');


const pageRouter = require('./src/routes/pageRouter');
const apiRouter = require('./src/routes/apiRouter');
const adminRouter = require('./src/routes/adminRouter');
const authRouter = require('./src/routes/authRouter');
const PORT = process.env.PORT || 3000;

/* -----------------------------
   Express Configuration
--------------------------------*/

// Parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Views configuration
app.set("views", path.join(__dirname, "src", "views"));
app.set("view engine", "ejs");

/* -----------------------------
   Middleware
--------------------------------*/

app.use(morgan('dev'));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  name: 'sessionId',
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60
  }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.currentUser = req.user || null;
  res.locals.isAuthenticated = Boolean(req.user);
  next();
});

app.use(express.static('public'));
app.use('/images', express.static(path.join(__dirname, 'images')));

/* -----------------------------
   Routes
--------------------------------*/

// Authentication routes
app.use('/auth', authRouter);

// API routes
app.use('/api', apiRouter);

// Admin routes
app.use('/admin', adminRouter);

// Page routes
app.use('/', pageRouter);


// Contact form route
app.post('/contact', (req, res) => {

  const { name, email, message } = req.body;

  // Validate input
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required.'
    });
  }

  console.log(`Contact form submitted: ${name} (${email}) - ${message}`);

  res.status(200).json({
    success: true,
    message: `Thank you, ${name}! We have received your message.`
  });

});

/* -----------------------------
   404 Handler
--------------------------------*/

app.use((req, res) => {
  res.status(404).send('Page not found');
});

/* -----------------------------
   MongoDB Connection
--------------------------------*/

mongoose.connect(process.env.MONGO_URI)
.then(() => {

  console.log("Connected to MongoDB Atlas");

  app.listen(PORT, () => {
    console.log(`Server running using MongoDB on http://localhost:${PORT}`);
  });

})
.catch(err => {
  console.error("MongoDB connection error:", err.message);
});