"use strict";

const express = require('express');
const app = express();
const path = require('path');

// Parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuration: Define the absolute path for template files
app.set("views", path.join(__dirname,"src","views"));
// Configuration: Set EJS as the default templating engine
app.set("view engine", "ejs");

const morgan = require('morgan');

const pageRouter = require('./src/routes/pageRouter');
const apiRouter = require('./src/routes/apiRouter');

const PORT = process.env.PORT || 3000;

// Middleware
app.use(morgan('dev'));

app.use(express.static('public'));
app.use('/images', express.static(path.join(__dirname, 'images')));

//Routes
app.use('/api', apiRouter);
app.use('/', pageRouter);

//post route for contact form
app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;
//validate input
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


app.use((req, res) => {
  res.status(404).send('Page not found');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});