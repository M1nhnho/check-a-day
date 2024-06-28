const db = require('../database/connection.js');

exports.insertUser = (reqBody) =>
{
    const { password } = reqBody;
    return db.query(
            `INSERT INTO users
                (username, email, password_hash)
            VALUES
                ($1, $2, crypt($3, gen_salt('md5')))
            RETURNING *;`,
            ['test', 'test@email.com', password]
        )
        .then(({ rows }) =>
        {
            return rows[0];
        });
};

exports.selectUserLogin = (reqBody) =>
{
    const { password } = reqBody;
    return db.query(
            `SELECT (password_hash = crypt($2, password_hash))
                AS password_match
            FROM users
            WHERE email = $1;`,
            ['test@email.com', password]
        )
        .then(({ rows }) =>
        {
            // Generic message to hide whether email is in use or not
            if (rows.length === 0 || !rows[0].password_match)
            {
                return Promise.reject({ status: 401, msg: 'Unauthorised'})
            }
            return rows[0].password_match;
        });
};