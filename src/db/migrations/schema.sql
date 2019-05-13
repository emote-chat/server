-- drop all tables if they already exist before (re-)creating them
DROP TABLE IF EXISTS 
    users, 
    messages, 
    chats, 
    users_chats, 
    users_messages_emojis 
CASCADE;

-- create users table (note: 'user' is a reserved keyword in postgres)
CREATE TABLE users (
    id serial PRIMARY KEY,
    email varchar(254) NOT NULL UNIQUE,
    password varchar(60) NOT NULL,
    display_name varchar(35) NOT NULL,
    first_name varchar(35),
    last_name varchar(35)
);

-- create chats table; name attr field is optional (defaults to null)
CREATE TABLE chats (
    id serial PRIMARY KEY,
    name varchar(40) NOT NULL
);

-- create messages table with fk refs to chats & users 
CREATE TABLE messages (
    id serial PRIMARY KEY,
    chats_id int NOT NULL,
    users_id int NOT NULL,
    text text NOT NULL,
    created timestamptz DEFAULT now(),
    FOREIGN KEY(chats_id) REFERENCES chats(id) ON DELETE CASCADE,
    FOREIGN KEY(users_id) REFERENCES users(id) ON DELETE SET NULL 
    -- or CASCADE (depends)
);

-- create users_chats many-to-many table with fk refs to chats & users
CREATE TABLE users_chats (
    users_id int NOT NULL,
    chats_id int NOT NULL,
    FOREIGN KEY(users_id) REFERENCES users(id) ON DELETE CASCADE, 
    FOREIGN KEY(chats_id) REFERENCES chats(id) ON DELETE CASCADE,
    PRIMARY KEY(users_id, chats_id)
);

-- create users_messages_emojis many-to-many table with fk refs to users & messages
-- plus emoji attr on the relationship 
CREATE TABLE users_messages_emojis (
    users_id int NOT NULL,
    messages_id int NOT NULL,
    emoji varchar(100) NOT NULL, 
    FOREIGN KEY(users_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(messages_id) REFERENCES messages(id) ON DELETE CASCADE
);
