const express = require('express');
const { getAPIEndpoints } = require('./controllers/api.controller.js');

// Server
const app = express();

app.get('/api', getAPIEndpoints)

app.get('/api/healthCheck', (req, res) =>
{
    res.status(200).send({ msg: 'Server is live!' });
})

module.exports = app;