module.exports = (() => {
    const path = require('path');
    const config = require(path.join(__dirname, '../config/db'));

    // pg-promise setup
    const pgp = require('pg-promise')({
        promiseLib: require('bluebird') // overriding the default (ES6 Promise)
    });

    // return db instance
    return pgp(config);
})();