const tasksRouter = require('express').Router();
const { postTaskToUserID, getTasksByUserID, deleteTaskByID } = require('../controllers/tasks.controller.js');

tasksRouter.post('/users/:user_id/tasks', postTaskToUserID);
tasksRouter.get('/users/:user_id/tasks', getTasksByUserID);
tasksRouter.delete('/tasks/:task_id', deleteTaskByID);

module.exports = tasksRouter;