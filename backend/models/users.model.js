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