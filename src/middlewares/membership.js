const path = require('path');

const db = require(path.join(__dirname, '../db/index'));
const queries = require(path.join(__dirname, '../db/queries'));
const getPayload = require(path.join(__dirname, '../helpers/jwt'));

module.exports = async (req, res, next) => {
    // get user id from auth headers
    const { id: userId } = getPayload(req.headers);
    // get chat ids of chats that user is a member of
    const joinedChats = await db.any(queries.findChatIdsByUserId, [userId]);
    // verify whether any of those chat ids is the params cid (chat id)
    const isMember = joinedChats.some( ({ chats_id }) => {
        return parseInt(req.params.cid) === chats_id;
    });

    // if user is a member proceed to cb w/o error
    // otherwise proceed to cb w/ error
    isMember ? next() : next({ name: 'MembershipError' });
}