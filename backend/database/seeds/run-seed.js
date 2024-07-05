const seed = require('./seed.js');
const db = require('../connection.js');
const data = {
    usersData: null,
    tasksData: null
}

const runSeed = () =>
{
    return seed(data).then(() => db.end());
};

runSeed();