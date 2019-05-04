const path = require('path');

const db = require(path.join(__dirname, '../db/index'));
const queries = require(path.join(__dirname, '../db/queries'));
const getPayload = require(path.join(__dirname, '../helpers/jwt'));

module.exports = async (req, res, next) => {
    const { id: userId } = getPayload(req.headers);
    const joinedChats = await db.any(queries.findChatIdsByUserId, [userId]);
    const isMember = joinedChats.filter( ({ chats_id }) => {
        return parseInt(req.params.cid) === chats_id
    }).length !== 0;

    // if user is a member proceed to cb w/o error
    /// otherwise proceed to cb w/ error
    isMember ? next() : next({ name: 'MembershipError' });
}