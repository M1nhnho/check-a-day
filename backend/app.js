const express = require('express');
const apiRouter = require('./routes/api-router.js');
const { handleEndpointErrors, handlePSQLErrors, handleCustomErrors, handleServerErrors } = require('./errors');

// Server
const app = express();
app.use(express.json());

app.use('/api', apiRouter);

// Error Handling
app.all('/*', handleEndpointErrors);
app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;