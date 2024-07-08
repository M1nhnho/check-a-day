const { insertTaskToUserID, selectTasksByUserID } = require("../models/tasks.model.js");

exports.postTaskToUserID = (req, res, next) =>
{
    const { user_id } = req.params;
    const { name, question, colour_hex, icon, reset_time } = req.body;
    insertTaskToUserID(user_id, name, question, colour_hex, icon, reset_time)
        .then((task) =>
        {
            res.status(201).send({ task });
        })
        .catch(next);
}

exports.getTasksByUserID = (req, res, next) =>
{
    const { user_id } = req.params;
    selectTasksByUserID(user_id)
        .then((tasks) =>
        {
            res.status(200).send({ tasks });
        })
        .catch(next);
}