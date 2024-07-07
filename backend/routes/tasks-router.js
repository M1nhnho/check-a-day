const tasksRouter = require('express').Router();
const { postTask } = require('../controllers/tasks.controller.js');

tasksRouter.post('/users/:user_id/tasks', postTask);

module.exports = tasksRouter;