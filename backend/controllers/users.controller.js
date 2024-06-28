const { insertUser, selectUserLogin } = require("../models/users.model.js");

exports.postUser = (req, res, next) =>
{
    insertUser(req.body)
        .then((user) =>
        {
            res.status(201).send({ user });
        })
        .catch(next);
}

exports.authenticateUserLogin = (req, res, next) =>
{
    selectUserLogin(req.body)
        .then((authenticated) =>
        {
            res.status(200).send({ authenticated });
        })
        .catch(next);
}