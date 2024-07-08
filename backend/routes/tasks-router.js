const tasksRouter = require('express').Router();
const { postTask, getTasksByUserID } = require('../controllers/tasks.controller.js');

tasksRouter.post('/users/:user_id/tasks', postTask);
tasksRouter.get('/users/:user_id/tasks', getTasksByUserID)

module.exports = tasksRouter;