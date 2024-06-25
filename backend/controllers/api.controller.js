const { selectAPIEndpoints } = require("../models/api.model.js")

exports.getAPIEndpoints = (req, res, next) =>
{
    selectAPIEndpoints()
        .then((endpoints) =>
        {
            res.status(200).send({ endpoints });
        })
        .catch(next);
}