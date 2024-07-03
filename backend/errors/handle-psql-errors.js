module.exports = (err, req, res, next) =>
{
    // 23502: NOT NULL VIOLATION
    // 22P02: INVALID TEXT REPRESENTATION
    if (err.code === '23502' || err.code === '22P02')
    {
        res.status(400).send({msg: 'Bad Request'});
    }
    else
    {
        next(err);
    }
}
