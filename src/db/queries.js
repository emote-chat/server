const PS = require('pg-promise').PreparedStatement;

module.exports = {
    // users
    createUser: new PS('create-user', 
        `INSERT INTO users(display_name, email, password, first_name, last_name) 
        VALUES($1, $2, $3, $4, $5) 
        RETURNING id`
    ),
    findUserByEmail: new PS('find-user-by-email', 'SELECT * FROM users WHERE email = $1'),
    findUserById: new PS('find-user-by-id', 'SELECT * FROM users WHERE id = $1'),

    // chats
    createChat: new PS('create-chat', 'INSERT INTO chats(name) VALUES($1) RETURNING id'),
    findChatById: new PS('find-chat-by-id', 'SELECT * FROM chats WHERE id = $1'),
    findChatsByUserId: new PS('find-users-by-chat-id', 
        `SELECT 
            chats_id AS id, 
            name, 
            json_agg(json_build_object('id', users_id, 'display_name', display_name)) as users 
        FROM users_chats 
        INNER JOIN chats ON users_chats.chats_id=chats.id 
        INNER JOIN users ON users_chats.users_id=users.id 
        WHERE users_chats.chats_id IN (
            SELECT chats_id FROM users_chats
            WHERE users_id = $1
        ) GROUP BY chats_id, chats.name`
    ),
    
    // users_chats
    addUserToChat: new PS('add-user-to-chat', 'INSERT INTO users_chats(users_id, chats_id) VALUES($1, $2)'),
    deleteUserFromChat: new PS('delete-user-from-chat', 'DELETE FROM users_chats WHERE chats_id = $1 AND users_id = $2'),
    findChatIdsByUserId: new PS('find-chat-ids-by-user-id', 'SELECT chats_id FROM users_chats WHERE users_id = $1'),
    
    // messages
    createMessage: new PS('create-message', 'INSERT INTO messages(chats_id, users_id, text) VALUES($1, $2, $3)'),
    findMessagesByChatId: new PS('find-messages-by-chat-id', 
        `SELECT 
            users.id AS users_id, 
            users.*, 
            messages.* 
        FROM messages 
        INNER JOIN users ON users.id=users_id 
        WHERE chats_id = $1`
    ),
}