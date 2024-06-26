const { Pool } = require('pg');
const ENV = process.env.NODE_ENV || 'development';

require('dotenv').config(
    {
        path: `${__dirname}/../.env.${ENV}`,
    }
);

const config = {};

if (!process.env.PGDATABASE)
{
    throw new Error('PGDATABASE not set.');
}

module.exports = new Pool(config);