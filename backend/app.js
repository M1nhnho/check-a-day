const express = require('express');
const { getAPIEndpoints } = require('./controllers/api.controller.js');
const { postUser, authenticateUserLogin } = require('./controllers/users.controller.js');

// Server
const app = express();
app.use(express.json());

app.get('/api', getAPIEndpoints)

app.get('/api/healthCheck', (req, res) =>
{
    res.status(200).send({ msg: 'Server is live!' });
})

app.post('/api/users', postUser);

app.post('/api/users/login/authentication', authenticateUserLogin)

module.exports = app;