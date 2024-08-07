const { insertUser, selectUserLogin, selectUserByID, updateUserByID, removeUserByID } = require("../models/users.model.js");

exports.postUser = (req, res, next) =>
{
    const { username, email, password, avatar_url } = req.body;
    insertUser(username, email, password, avatar_url)
        .then((user) =>
        {
            res.status(201).send({ user });
        })
        .catch(next);
}

exports.authenticateUserLogin = (req, res, next) =>
{
    const { email, password } = req.body
    selectUserLogin(email, password)
        .then((authenticated) =>
        {
            res.status(200).send({ authenticated });
        })
        .catch(next);
}

exports.getUserByID = (req, res, next) =>
{
    const { user_id } = req.params;
    selectUserByID(user_id)
        .then((user) =>
        {
            res.status(200).send({ user });
        })
        .catch(next);
}

exports.patchUserByID = (req, res, next) =>
{
    const { user_id } = req.params;
    updateUserByID(user_id, req.body)
        .then((user) =>
        {
            res.status(200).send({ user });
        })
        .catch(next);
}

exports.deleteUserByID = (req, res, next) =>
{
    const { user_id } = req.params;
    removeUserByID(user_id)
        .then(() =>
        {
            res.status(204).send();
        })
        .catch(next);
}