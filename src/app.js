const express = require('express');
const morgan = require('morgan');
const path = require('path');

const healthRoutes = require('./routes/health.routes');
const errorHandler = require('./middlewares/errorHandler');
const notFound = require('./middlewares/notFound');

const app = express();

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/health', healthRoutes);

// Error Handling (must be last)
app.use(notFound);
app.use(errorHandler);

module.exports = app;
