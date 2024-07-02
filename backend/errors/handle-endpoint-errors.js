module.exports = (req, res, next) =>
{
    res.status(404).send({ msg: 'Endpoint Not Found' });
}