const seed = require('./seed.js');
const db = require('../connection.js');
const testData = require('../data/test-data');
const blankData = {
    usersData: null,
    tasksData: null
}

const runSeed = () =>
{
    return seed(blankData).then(() => db.end());
};

runSeed();