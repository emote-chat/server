const PS = require('pg-promise').PreparedStatement;

module.exports = {
    createUser: new PS('create-user', 'INSERT INTO users(display_name, email, password, first_name, last_name) VALUES($1, $2, $3, $4, $5)'),
    findUser: new PS('find-user', 'SELECT * FROM users WHERE email = $1'),
}