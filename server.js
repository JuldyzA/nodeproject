"use strict";

const express = require('express');
const morgan = require('morgan');
const path = require('path');

const pageRouter = require('./routes/pageRouter');
const apiRouter = require('./routes/apiRouter');

const app = express();
const PORT = process.env.PORT || 3000;

//load JSON
const projectsData = require('./data/projects.json');

// Middleware
app.use(morgan('dev'));
//parse form dta 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));
app.use('/images', express.static(path.join(__dirname, 'images')));

//Routes
app.use('/', pageRouter);
app.use('/api', apiRouter);

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