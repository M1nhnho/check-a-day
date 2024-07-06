const tasksRouter = require('express').Router();
const { postTask } = require('../controllers/tasks.controller.js');

tasksRouter.post('/', postTask);

module.exports = tasksRouter;