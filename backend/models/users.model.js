const db = require('../database/connection.js');

exports.insertUser = (username, email, password, avatarURL) =>
{
    return db.query(
            `INSERT INTO users
                (username, email, password_hash, avatar_url)
            VALUES
                ($1, $2, crypt($3, gen_salt('md5')), $4)
            RETURNING *;`,
            [username, email, password, avatarURL]
        )
        .then(({ rows }) =>
        {
            const { email, password_hash, ...rest } = rows[0];
            return rest;
        });
};

exports.selectUserLogin = (email, password) =>
{
    return db.query(
            `SELECT (password_hash = crypt($2, password_hash))
                AS password_match
            FROM users
            WHERE email = $1;`,
            [email, password]
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

exports.selectUserByID = (userID) =>
{
    return db.query(
            `SELECT user_id, username, avatar_url
            FROM users
            WHERE user_id = $1;`,
            [userID]
        )
        .then(({ rows }) =>
        {
            if (rows.length === 0)
            {
                return Promise.reject({ status: 404, msg: 'Not Found' });
            }
            return rows[0];
        });
};

exports.updateUserByID = (userID, reqBody) =>
{
    const keys = ['username', 'email', 'password', 'avatar_url']
    const columns = [];
    const values = [];

    keys.forEach((key) =>
    {
        if (key in reqBody)
        {
            values.push(reqBody[key]);
            columns.push(key === 'password'
                ? `password_hash = crypt($${values.length + 1}, gen_salt('md5'))`
                : `${key} = $${values.length + 1}`);
        }
    });

    return db.query(
            `UPDATE users
            SET ${columns.join(', ')}
            WHERE user_id = $1
            RETURNING *;`,
            [userID, ...values]
        )
        .then(({ rows }) =>
        {
            if (rows.length === 0)
            {
                return Promise.reject({ status: 404, msg: 'Not Found' });
            }
            const { email, password_hash, ...rest } = rows[0]
            return rest;
        });
};

exports.removeUserByID = (userID) =>
{
    return db.query(
            `DELETE FROM users
            WHERE user_id = $1
            RETURNING *;`,
            [userID]
        )
        .then(({ rows }) =>
        {
            if (rows.length === 0)
            {
                return Promise.reject({ status: 404, msg: 'Not Found' });
            }
        });
};