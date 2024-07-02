module.exports = (error, req, res, next) =>
{
    // 23502: NOT NULL VIOLATION
    if (error.code === '23502')
    {
        res.status(400).send({msg: 'Bad Request'});
    }
    else
    {
        next(error);
    }
}
