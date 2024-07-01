const seed = require('./seed.js');
const db = require('../connection.js');
const data = require('../data/test-data');

const runSeed = () =>
{
    return seed(data).then(() => db.end());
};

runSeed();