const db = require('../connection.js');

const seed = () =>
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
                    email VARCHAR NOT NULL,
                    password VARCHAR NOT NULL,
                    avatar_url VARCHAR,
                );`
            );
        })
        .then(() =>
        {
            return db.query(`
                CREATE TABLE tasks (
                    task_id SERIAL PRIMARY KEY,
                    user_id INT REFERENCES users(user_id) ON DELETE CASCADE NOT NULL,
                    
                );`);
        })
};
/* Still need to decide what exactly the database will contain */
module.exports = seed;