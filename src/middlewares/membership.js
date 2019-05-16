const path = require('path');

const db = require(path.join(__dirname, '../db/index'));
const queries = require(path.join(__dirname, '../db/queries'));
const getPayload = require(path.join(__dirname, '../helpers/jwt'));

module.exports = async (req, res, next) => {
    try {
        // get user id from auth headers
        const { id: userId } = getPayload(req.headers);
        // get chat ids of chats that user is a member of
        const joinedChats = await db.any(queries.findChatIdsByUserId, [userId]);

        // verify chat exists by its id OR get the chat id by message id
        const cid = req.params.cid 
            ? (await db.one(queries.findChatById, [req.params.cid])).id 
            : (await db.one(queries.findChatIdByMessageId, [req.params.mid])).chats_id;

        // verify whether any of those chat ids is the params cid (chat id)
        const isMember = joinedChats.some( ({ chats_id }) => {
            return parseInt(cid) === chats_id;
        });

        // if user is a member proceed to cb w/o error
        // otherwise proceed to cb w/ error
        isMember 
            ? next() 
            : next({ name: 'MembershipError' });
    }
    catch (error) {
        // if query returned nothing then we know chat doesn't exist
        error.received === 0 
            ? next({ name: 'ChatOrMessageNotFound' }) 
            : next(error);
    }
}