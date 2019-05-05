require('dotenv').config();
const path = require('path');

const db = require(path.join(__dirname, '../db/index'));
const queries = require(path.join(__dirname, '../db/queries'));
const getPayload = require(path.join(__dirname, '../helpers/jwt'));

const addUser = async (userId, chatId) => {
    try {
        await db.none(queries.addUserToChat, [userId, chatId]);
    }
    catch(error) {
        return error.constraint === 'users_chats_pkey' ? 
            Promise.reject('User already member of chat') :
            Promise.reject(error);
    }
}

exports.createChat = async (req, res, next) => {
    try {
        // name is optional
        const name = req.body.name || null;
        
        // create chat; return id
        const { id: chatId } = await db.one(queries.createChat, [name]);
        
        const { id: userId } = getPayload(req.headers);
        // add user who created the chat to the chat
        await addUser(userId, chatId);
        
        // get chat just added to table, searching by id returned 
        const chat = await db.one(queries.findChatById, [chatId]);

        // created chat; return chat id and name
        return res.status(201).json(chat);
    }
    catch(error) {
        if (error) return next(error);
    }
}

exports.createMessage = async (req, res, next) => {
    try {
        if (!req.body.text) {
            return next('Missing fields');
        }

        const { id: userId } = getPayload(req.headers);
        // message values: chat id, user id and text
        const message = [
            req.params.cid,
            userId,
            req.body.text
        ];
        // add message to chat
        await db.none(queries.createMessage, message);

        // created message; return nothing
        return res.status(201).json();
    }
    catch(error) {
        if (error) return next(error);
    }
}

exports.getUserChats = async (req, res, next) => {
    try {
        const { id: userId } = getPayload(req.headers);
        const chats = await db.any(queries.findChatsByUserId, [userId]);

        // success; return user's chats
        return res.status(200).json(chats);
    }
    catch(error) {
        if (error) return next(error);
    }
}

exports.getMessagesInChat = async (req, res, next) => {
    try {
        // get messages in chat
        const resp = await db.any(queries.findMessagesByChatId, [req.params.cid]);
        // shape returned data
        const messages = resp.map(({ users_id, id, chats_id, text, created_at, ...userWithPw}) => {
            const { password, ...user } = userWithPw;
            return {
                id,
                text,
                created_at,
                user
            };
        });

        // success; return array of messages
        return res.status(200).json(messages);
    }
    catch(error) {
        if (error) return next(error);
    }
}

exports.addUserToChat = async (req, res, next) => {
    try {
        // add user to chat
        await addUser(req.params.uid, req.params.cid);
        // created new entry in chat; return nothing
        return res.status(201).json();
    }
    catch(error) {
        if (error) return next(error);
    }
}

exports.deleteUserFromChat = async (req, res, next) => {
    try {
        // delete user from chat
        await db.none(queries.deleteUserFromChat, [req.params.uid]);
        // deleted user from chat; return nothing
        return res.status(204).json();
    }
    catch(error) {
        if (error) return next(error);
    }
}