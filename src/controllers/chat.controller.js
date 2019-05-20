const path = require('path');

const db = require(path.join(__dirname, '../db/index'));
const queries = require(path.join(__dirname, '../db/queries'));
const getPayload = require(path.join(__dirname, '../helpers/jwt'));

const addUser = async (userId, chatId) => {
    try {
        // add user id and chat id to users_chats
        return await db.one(queries.addUserToChat, [userId, chatId]);
    }
    catch(error) {
        // check if primary key constraint violated
        // return error str indicating that or return error itself
        return error.constraint === 'users_chats_pkey' ? 
            Promise.reject('User already member of chat') :
            Promise.reject(error);
    }
}

exports.createChat = async (req, res, next) => {
    try {
        if (!req.body.name) {
            return next('Missing fields');
        }
        
        // create chat; return id
        const { id: chatId } = await db.one(queries.createChat, [req.body.name]);
        
        // get user id from auth headers
        const { id: userId } = getPayload(req.headers);
        // add user id (of user making req) and chat id to users_chats table
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

        // get user id from auth headers
        const { id: userId } = getPayload(req.headers);

        // message values: chat id, user id and text
        const message = [
            req.params.cid,
            userId,
            req.body.text
        ];

        // add message to messages table
        const { chats_id, ...insertedMessage } = await db.one(queries.createMessage, message);

        // success; return nothing
        return res.status(201).json({...insertedMessage, reactions: []});
    }
    catch(error) {
        console.log(error);
        if (error) return next(error);
    }
}

exports.getUserChats = async (req, res, next) => {
    try {
        // get user id from req headers
        const { id: userId } = getPayload(req.headers);

        // get chat ids and names and array of users in chats by user id
        // i.e. info about chats that user is a member of
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
        // get messages by chat id inc user info
        const messages = await db.any(queries.findMessagesByChatId, [req.params.cid]);

        // success; return array of messages
        return res.status(200).json(messages);
    }
    catch(error) {
        if (error) return next(error);
    }
}

exports.addUserToChat = async (req, res, next) => {
    try {
        // add user id and chat id to users_chats
        const { users_id: id } = await addUser(req.params.uid, req.params.cid);
        // find user by user id
        const { password, ...user } = await db.one(queries.findUserById, [id]);
        // success; return nothing
        return res.status(201).json(user);
    }
    catch(error) {
        if (error) return next(error);
    }
}

exports.deleteUserFromChat = async (req, res, next) => {
    try {
        // delete row from users_chats 
        // where chat id and user id match params
        const deletedUser = await db.one(queries.deleteUserFromChat, [req.params.cid, req.params.uid]);
        // success; return nothing
        return res.status(200).json(deletedUser);
    }
    catch(error) {
        if (error) return next(error);
    }
}