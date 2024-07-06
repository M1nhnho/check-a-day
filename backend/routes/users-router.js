const usersRouter = require('express').Router();
const tasksRouter = require('./tasks-router.js');
const { postUser, authenticateUserLogin, getUserByID, patchUserByID, deleteUserByID } = require('../controllers/users.controller.js');

usersRouter.post('/', postUser);
usersRouter.post('/login/authentication', authenticateUserLogin)
usersRouter.get('/:user_id', getUserByID);
usersRouter.patch('/:user_id', patchUserByID);
usersRouter.delete('/:user_id', deleteUserByID);

usersRouter.use('/:user_id/tasks', tasksRouter);

module.exports = usersRouter;