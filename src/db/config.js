module.exports = (() => {
    require('dotenv').config();
    const env = process.env.NODE_ENV || 'development'; // 'production' if production

    var config = {
        development: {
            host: process.env.DEV_DB_HOST || 'localhost', // localhost is default
            port: process.env.DEV_DB_PORT || 5432, // 5432 is default
            database: process.env.DEV_DB_NAME,
            user: process.env.DEV_DB_USER,
            password: process.env.DEV_DB_PASS
        },
        test: {
            host: process.env.TEST_DB_HOST || 'localhost', // localhost is default
            port: process.env.TEST_DB_PORT || 5432, // 5432 is default
            database: process.env.TEST_DB_NAME,
            user: process.env.TEST_DB_USER,
            password: process.env.TEST_DB_PASS
        },
        production: {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT || 5432, // 5432 is default
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASS
        }
    };

    // pg-promise setup
    const pgp = require('pg-promise')({
        promiseLib: require('bluebird') // overriding the default (ES6 Promise)
    });

    // return db instance
    return pgp(config[env]);
})();


