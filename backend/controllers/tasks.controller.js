const { insertTask } = require("../models/tasks.model.js");

exports.postTask = (req, res, next) =>
{
    const { user_id } = req.params;
    const { name, question, colour_hex, icon, reset_time } = req.body;
    insertTask(user_id, name, question, colour_hex, icon, reset_time)
        .then((task) =>
        {
            res.status(201).send({ task });
        })
        .catch(next);
}