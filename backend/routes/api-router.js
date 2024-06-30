const apiRouter = require('express').Router();
const { getAPIEndpoints } = require('../controllers/api.controller.js');
const usersRouter = require('./users-router.js');

apiRouter.get('/', getAPIEndpoints);
apiRouter.get('/healthCheck', (req, res) =>
{
    res.status(200).send({ msg: 'Server is live!' });
});

apiRouter.use('/users', usersRouter);

module.exports = apiRouter;