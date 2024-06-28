const { insertUser } = require("../models/users.model.js");

exports.postUser = (req, res, next) =>
{
    insertUser(req.body)
        .then((user) =>
        {
            res.status(201).send({ user });
        })
        .catch(next);
}