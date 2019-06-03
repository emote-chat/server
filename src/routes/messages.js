module.exports = (() => {
    const express = require('express');
    const router = express.Router();
    const path = require('path');
    const messageController = require(path.join(__dirname, '../controllers/message.controller'));
    // bring in middleware to verify user's membership in chat
    const membershipMiddleware = require(path.join(__dirname, '../middlewares/membership'));

    // must have some middleware to verify user making the API call is part of the given chat
    router.use('/:mid/*', membershipMiddleware);

    /**
    * @api {post} /:mid/reaction Add reaction to message
    * @apiName AddReaction
    * @apiGroup Message
    *
	* @apiHeader {String} token Authorization Bearer Token.
    * @apiParam {String} mid Message's id.
	* @apiParam (Request body) {String} emoji Emoji reaction.
    *
    * @apiSuccess (Created 201) {Number} messages_id Message ID.
    * @apiSuccess (Created 201) {Number} users_id User ID.
    * @apiSuccess (Created 201) {String} emoji Emoji reaction.
    *
    * @apiSuccessExample Success Response:
    *     HTTP/1.1 201 Created
    *     {
    *          "users_id": 1,
    *          "messages_id": 1,
    *          "emoji": "😄"
    *     }
    *
    * @apiError MissingFields Missing one or more of required fields <code>emoji</code>.
    *
    * @apiErrorExample MissingFields Error Response:
    *     HTTP/1.1 400 Bad Request
    *     {
    *          "message": "Missing fields"
    *     }
    *
    * @apiError UnauthorizedError Invalid/missing token in authorization header.
    *
    * @apiErrorExample UnAuthorizedError Response:
    *     HTTP/1.1 401 Unauthorized
    *     {
    *          "message": "Invalid/missing token"
    *     }
    * 
    * @apiError ChatOrMessageNotFound Message does not refer to a chat that exists.
    *
    * @apiErrorExample ChatOrMessageNotFound Response:
    *     HTTP/1.1 404 Not Found
    *     {
    *          "message": "Given chat or message not found"
    *     }
    */
    router.post('/:mid/reaction', messageController.addReaction);

    // ... and other possible routes like updating/removing message and removing reaction (tbd)

    return router;
})();