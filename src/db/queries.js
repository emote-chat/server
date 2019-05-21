const PS = require('pg-promise').PreparedStatement;

module.exports = {
    // users
    createUser: new PS('create-user', 
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
    createChat: new PS('create-chat', 'INSERT INTO chats(name) VALUES($1) RETURNING *'),
    findChatById: new PS('find-chat-by-id', 
        `SELECT 
            c.*, 
            json_agg(
                json_build_object(
                    'id', users_id, 
                    'display_name', display_name
                )
            ) AS users 
        FROM chats AS c
        INNER JOIN users_chats AS uc ON uc.chats_id=c.id 
        INNER JOIN users AS u ON uc.users_id=u.id 
        WHERE c.id = $1 GROUP BY c.id, name`
    ),
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
    addUserToChat: new PS('add-user-to-chat', 'INSERT INTO users_chats(users_id, chats_id) VALUES($1, $2) RETURNING users_id'),
    deleteUserFromChat: new PS('delete-user-from-chat', 'DELETE FROM users_chats WHERE chats_id = $1 AND users_id = $2 RETURNING *'),
    findChatIdsByUserId: new PS('find-chat-ids-by-user-id', 'SELECT chats_id FROM users_chats WHERE users_id = $1'),
    
    // messages
    createMessage: new PS('create-message', 'INSERT INTO messages(chats_id, users_id, text) VALUES($1, $2, $3) RETURNING *'),
    findChatIdByMessageId: new PS('find-chat-id-by-message-id', 'SELECT chats_id FROM messages WHERE id = $1'),
    findMessagesByChatId: new PS('find-messages-by-chat-id', 
        `SELECT
            m.id,
            m.chats_id,
            m.users_id,
            m.text,
            m.created,
            COALESCE(
                json_agg(
                    json_build_object(
                        'users_id', ume.users_id,
                        'emoji', ume.emoji
                    )
                ) FILTER (WHERE emoji IS NOT NULL), '[]'
            ) AS reactions
        FROM messages AS m
        LEFT JOIN users_messages_emojis AS ume ON ume.messages_id=m.id
        WHERE chats_id = $1
        GROUP BY m.id`
    ),
    // users_emojis_reactions
    addReaction: new PS('add-reaction', 'INSERT INTO users_messages_emojis(messages_id, users_id, emoji) VALUES($1, $2, $3) RETURNING *'),
}
