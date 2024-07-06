const db = require('../database/connection.js');

exports.insertTask = (userID, name, question, colourHex, icon, resetTime) =>
{
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