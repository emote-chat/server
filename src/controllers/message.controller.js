const path = require('path');

const db = require(path.join(__dirname, '../db/index'));
const queries = require(path.join(__dirname, '../db/queries'));
const getPayload = require(path.join(__dirname, '../helpers/jwt'));

exports.deleteMessageFromChat = async (req, res, next) => {
    try {
        // delete message from chat
        await db.none(queries.deleteMessageFromChat, [req.params.mid]);
        // deleted message from chat; return nothing
        return res.status(204).json();
    }
    catch (error) {
        if (error) return next(error);
    }
}

exports.addReaction = async (req, res, next) => {
    try {
        if (!req.body.emoji) {
            return next('Missing fields');
        }

        // get user id from auth headers
        const { id: userId } = getPayload(req.headers);

        // emoji values: message id, user id and emoji
        const emoji = [
            req.params.mid,
            userId,
            req.body.emoji
        ];

        // add emoji to emojis table
        const { ...insertedEmoji } = await db.one(queries.addReaction, emoji);

        // success; return inserted emoji info
        return res.status(201).json(insertedEmoji);
    }
    catch(error) {
        if (error) return next(error);
    }
}
