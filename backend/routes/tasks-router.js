const tasksRouter = require('express').Router();
const { postTaskToUserID, getTasksByUserID } = require('../controllers/tasks.controller.js');

tasksRouter.post('/users/:user_id/tasks', postTaskToUserID);
tasksRouter.get('/users/:user_id/tasks', getTasksByUserID)

module.exports = tasksRouter;