const db = require('../connection.js');
const format = require('pg-format');

const seed = ({ usersData, tasksData }) =>
{
    return db
        .query(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`)
        .then(() =>
        {
            return db.query(`DROP TABLE IF EXISTS tasks;`);
        })
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
        .then(() =>
        {
            return db.query(
                format(
                    `INSERT INTO users (username, email, password_hash, avatar_url) VALUES %L`,
                    usersData.map(({ username, email, password, avatar_url }) => [username, email, `crypt('${password}', gen_salt('md5'))`, avatar_url])
                ).replaceAll(/'crypt\(''(.[^'']+)'', gen_salt\(''md5''\)\)'/g, "crypt('$1', gen_salt('md5'))")
            );
        })
};

module.exports = seed;