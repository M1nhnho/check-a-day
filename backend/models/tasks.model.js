const db = require('../database/connection.js');

exports.insertTask = (userID, name, question, colourHex, icon, resetTime) =>
{
    if (colourHex && !/[0-9abcdef]{6}/i.test(colourHex))
    {
        return Promise.reject({ status: 400, msg: 'Bad Request' });
    }
    // Potentially force resetTime to follow format of /[0-9][0-9]:[0-9][0-9]/

    const currentDate = new Date().toJSON().slice(0, 10);
    const checkInDates = {};
    checkInDates[currentDate] = false;

    return db.query(
            `INSERT INTO tasks
                (user_id, name, check_in_dates, question, colour_hex, icon, reset_time)
            VALUES
                ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;`,
            [userID, name, checkInDates, question, colourHex, icon, resetTime]
        )
        .then(({ rows }) =>
        {
            return rows[0];
        });
};

exports.selectTasksByUserID = (userID) =>
{
    const promises = [
        db.query(`SELECT * FROM users WHERE user_id = $1;`, [userID]),
        db.query(`SELECT * FROM tasks WHERE user_id = $1;`, [userID])
    ]
    return Promise.all(promises)
        .then(([{ rows: usersRows }, { rows: tasksRows }]) =>
        {
            if (usersRows.length === 0)
            {
                return Promise.reject({ status: 404, msg: 'Not Found' });
            }
            return tasksRows;
        });
};