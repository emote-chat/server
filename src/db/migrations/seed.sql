/**************************************************************************
* NOTE: Seeding users by calling POST /signup endpoint (users) so passwords
* are properly hashed.
*
* Seeding the rest of the data by the following sql queries.
***************************************************************************/

INSERT INTO chats(name)
VALUES
    ('Chat 1'), 
    ('Chat 2');

INSERT INTO users_chats(users_id, chats_id)
VALUES
    (1, 1), 
    (2, 1), 
    (1, 2), 
    (2, 2), 
    (3, 2);

INSERT INTO messages(users_id, chats_id, text)
VALUES
    (1, 1, 'Test message 1, chat id 1, user id 1'), 
    (1, 1, 'Test message 2, chat id 1, user id 1'), 
    (2, 1, 'Test message, chat id 1, user id 2'), 
    (3, 2, 'Test message, chat id 2, user id 3'),
    (2, 2, 'Test message, chat id 2, user id 2'),
    (2, 2, 'Test message 2, chat id 2, user id 2'),
    (1, 2, 'Test message, chat id 2, user id 1');

INSERT INTO users_messages_emojis(users_id, messages_id, emoji)
VALUES
    (1, 1, '😄'),
    (2, 1, '😂'),
    (1, 2, '😂'),
    (3, 3, '😮');

INSERT INTO recommended_emojis_messages(messages_id, emoji)
VALUES
    (1, '😄'),
    (2, '😂');
