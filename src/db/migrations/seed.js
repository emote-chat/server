const path = require('path');
const fs = require('fs');
const axios = require('axios');
const db = require(path.join(__dirname, '../index'));
const app = require(path.join(__dirname, '../../config/app'));
const port = app.get('port');
const mode = app.get('mode');
let server;

// init db; drop and recreate tables
const initSchema = async (db) => {
    try {
        const sql = fs.readFileSync(
            path.join(__dirname, 'schema.sql')
        ).toString();
        await db.multi(sql);
    }
    catch(error) {
        console.error(error);
    }
}

exports.initSchema = initSchema; // need for tests

const initUser = async (user) => {
    try {
        await axios.post(`http://localhost:${port}/api/signup`, user);
    }
    catch(error) {
        console.error(error);
    }
}

// init users; making POST request for each so pw hashed
const initUsers = async (db) => {
    try {
        await initUser({
            email: 'abc@gmail.com',
            password: 'abc',
            display_name: 'abc'
        });
        await initUser({
            email: 'def@gmail.com',
            password: 'def',
            display_name: 'def',
            first_name: 'def',
            last_name: 'xyz',
        });
        await initUser({
            email: 'ghi@gmail.com',
            password: 'ghi',
            display_name: 'ghi',
            first_name: 'ghi'
        });
    }
    catch(error) {
        console.error(error);
    }
}

// init dev data by initializing users and rest of seed data
(async (mode, db) => {
    try {
        if(mode !== 'development') return;
        
        server = app.listen(port);
        
        await initSchema(db);
        await initUsers(db);
        
        const sql = fs.readFileSync(
            path.join(__dirname, 'seed.sql')
        ).toString();
        await db.multi(sql);
        
        await server.close();
        await db.$pool.end();
        
        console.log('\nDEV DB SEEDED');
    }
    catch(error) {
        console.error('\nDEV DB NOT SEEDED');
        console.error(error);
    }
})(mode, db);