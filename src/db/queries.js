const PS = require("pg-promise").PreparedStatement;

module.exports = {
  // users
  createUser: new PS(
    "create-user",
    `INSERT INTO users(
            display_name, 
            email, 
            password, 
            first_name, 
            last_name
        ) 
        VALUES(
            $1, $2, $3, $4, $5
        ) 
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
            json_agg(
                json_build_object(
                    'id', users_id, 
                    'display_name', display_name
                )
            ) AS users 
        FROM users_chats AS uc 
        INNER JOIN chats ON uc.chats_id=chats.id 
        INNER JOIN users ON uc.users_id=users.id 
        WHERE uc.chats_id IN (
            SELECT chats_id 
            FROM users_chats
            WHERE users_id = $1
        ) 
        GROUP BY chats_id, name`
    ),
    
    // users_chats
    addUserToChat: new PS('add-user-to-chat', 'INSERT INTO users_chats(users_id, chats_id) VALUES($1, $2)'),
    deleteUserFromChat: new PS('delete-user-from-chat', 'DELETE FROM users_chats WHERE chats_id = $1 AND users_id = $2'),
    findChatIdsByUserId: new PS('find-chat-ids-by-user-id', 'SELECT chats_id FROM users_chats WHERE users_id = $1'),
    
    // messages
    createMessage: new PS('create-message', 'INSERT INTO messages(chats_id, users_id, text) VALUES($1, $2, $3) RETURNING *'),
    findMessagesByChatId: new PS('find-messages-by-chat-id', 
        `SELECT
            m.id,
            m.chats_id,
            m.users_id,
            m.text,
            m.created,
            json_agg(
                json_build_object(
                    'users_id', users_messages_emojis.users_id,
                    'emoji', users_messages_emojis.emoji
                )
            ) AS reactions
        FROM messages AS m
        LEFT OUTER JOIN users_messages_emojis ON users_messages_emojis.messages_id=m.id
        WHERE chats_id = $1
        GROUP BY m.id`
    ),
    addReaction: new PS('add-reaction', 'INSERT INTO users_messages_emojis(messages_id, users_id, emoji) VALUES($1, $2, $3) RETURNING *'),
}
