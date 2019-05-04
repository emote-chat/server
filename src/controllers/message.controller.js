require('dotenv').config();
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