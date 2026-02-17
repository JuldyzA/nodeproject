const express = require('express');
const morgan = require('morgan');
const path = require('path');
const pageRouter = require('./routers/pageRouter');
const app = express();
const apiRouter = require('./routers/apiRouter');
// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/', pageRouter);
app.use('/api', apiRouter);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});