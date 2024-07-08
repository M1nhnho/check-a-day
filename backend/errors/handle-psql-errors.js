module.exports = (err, req, res, next) =>
{
    // 23502: NOT NULL VIOLATION
    // 22P02: INVALID TEXT REPRESENTATION
    // 22001: STRING DATA RIGHT TRUNCATION (value too long for type character(n))
    // 22007: INVALID DATETIME FORMAT
    // 22023: INVALID PARAMETER VALUE
    if (err.code === '23502'
        || err.code === '22P02'
        || err.code === '22001'
        || err.code === '22007'
        || err.code === '22023')
    {
        res.status(400).send({msg: 'Bad Request'});
    }
    // 23503: FOREIGN KEY VIOLATION
    else if (err.code === '23503')
    {
        res.status(404).send({ msg: 'Not Found' });
    }
    else
    {
        next(err);
    }
}
