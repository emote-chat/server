/***********************************************************************
 This is temporary; we'll want to automate init test data (locally) by:
    1) calling POST /signup endpoint (users)
    2) calling POST /chat/:cid endpoint (chats)
    3) calling POST /chat/:cid/message endpoint (messages)
    4) calling POST /chat/:cid/:uid endpoint (users_chats)
    5) calling POST /message/:mid/react endpoint (users_messages_emojis)
************************************************************************/

INSERT INTO users(email, password, display_name, first_name, last_name)
VALUES
    -- test first_name and last_name optional
    ('jane@example.com', 'hello123', 'jane', NULL, NULL), 
    ('george@example.com', 'hello456', 'george', 'George', 'Smith'), 
    ('jenny@example.com', 'hello789', 'jenny', 'Jenny', 'Miller');

INSERT INTO chats(name)
VALUES
    ('Chat 1'), 
    ('Chat 2');

INSERT INTO messages(users_id, chats_id, text)
VALUES
    (1, 1, 'Test message, chat 1, user 1'), 
    (2, 1, 'Test message, chat 1, user 2'), 
    (3, 2, 'Test message, chat 2, user 3');

INSERT INTO users_chats(users_id, chats_id)
VALUES  
    (1, 1), 
    (2, 1), 
    (1, 2), 
    (2, 2), 
    (3, 2);

-- need to decide how we'll be storing emojis; first method may be best
INSERT INTO users_messages_emojis(users_id, messages_id, emoji)
VALUES  
    (1, 1, ':joy:'), 
    (2, 2, '\u03B1'), 
    (3, 3, U&'\1F601');
