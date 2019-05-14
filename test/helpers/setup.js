module.exports = async () => {
    const app = require(path.join(__dirname, '../src/config/app'));
    const db = require(path.join(__dirname, '../src/db/index'));
    
    // Set reference to server in order to close the server during teardown.
    global.__SERVER__ = await app.listen();
    // Set reference to postgres in order to close db pool connection during teardown.
    global.__DB__ = await initDb(db);
};