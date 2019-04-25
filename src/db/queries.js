const PS = require('pg-promise').PreparedStatement;

module.exports = {
    findUser: new PS('find-user', 'SELECT * FROM users WHERE email = $1'),
    addUser: new PS('add-user', 'INSERT INTO users(display_name, email, password, first_name, last_name) VALUES($1, $2, $3, $4, $5)')
}