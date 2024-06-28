const db = require('../connection.js');

const seed = ({usersData, tasksData}) =>
{
    return db
        .query(`DROP TABLE IF EXISTS tasks;`)
        .then(() =>
        {
            return db.query(`DROP TABLE IF EXISTS users;`);
        })
        .then(() =>
        {
            return db.query(`
                CREATE TABLE users (
                    user_id SERIAL PRIMARY KEY,
                    username VARCHAR NOT NULL,
                    email VARCHAR NOT NULL UNIQUE,
                    password_hash VARCHAR NOT NULL,
                    avatar_url VARCHAR
                );`
            );
        })
        .then(() =>
        {
            return db.query(`
                CREATE TABLE tasks (
                    task_id SERIAL PRIMARY KEY,
                    user_id INT REFERENCES users(user_id) ON DELETE CASCADE NOT NULL,
                    name VARCHAR NOT NULL,
                    question VARCHAR,
                    colour_hex CHAR(6),
                    icon VARCHAR,
                    reset_time TIMETZ,
                    check_in_dates JSON
                );`);
        })
};

module.exports = seed;