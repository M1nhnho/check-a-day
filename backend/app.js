const express = require('express');
const { getAPIEndpoints } = require('./controllers/api.controller.js');
const { postUser, authenticateUserLogin, getUserByID, patchUserByID } = require('./controllers/users.controller.js');

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
app.get('/api/users/:user_id', getUserByID);
app.patch('/api/users/:user_id', patchUserByID);

module.exports = app;