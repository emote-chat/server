const PS = require('pg-promise').PreparedStatement;

module.exports = {
    // users
    createUser: new PS('create-user', 'INSERT INTO users(display_name, email, password, first_name, last_name) VALUES($1, $2, $3, $4, $5) RETURNING id'),
    findUserByEmail: new PS('find-user-by-email', 'SELECT * FROM users WHERE email = $1'),
    findUserById: new PS('find-user-by-id', 'SELECT * FROM users WHERE id = $1'),
}