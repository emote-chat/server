const path = require('path');
const fs = require('fs');

// init db; drop and recreate tables
exports.initDb = async (db) => {
    const sql = fs.readFileSync(
        path.join(__dirname, '../../src/db/init_db.sql')
    ).toString();
    await db.multi(sql);
}

// hard-coded user for testing
exports.user = {
    display_name: 'manos',
    email: 'user@gmail.com',
    password: 'gmail'
}

exports.anotherUser = {
    display_name: 'bob',
    first_name: 'Bob',
    last_name: 'Bob',
    email: 'bob@gmail.com',
    password: 'bob'
}

// hard-coded invalid user for testing
exports.invalidUser = {
    email: 'user@yahoo.com',
    password: 'yahoo'
}