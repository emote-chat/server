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
    * @api {post} /:mid/add-reaction Add Reaction
    * @apiName AddReaction
    * @apiGroup Message
    *
    * @apiHeader {String} token Authorization Bearer Token.
    * @apiHeader {Number} id User id.
    * @apiParam {String} :mid Message's id.
    *
    * @apiSuccess (Success 201) {Number} id Message ID.
    * @apiSuccess (Success 201) {Number} id User ID.
    * @apiSuccess (Success 201) {String} emoji Emoji.
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
	router.post('/:mid/add-reaction', messageController.addReaction);

	// ... and other possible routes like updating/removing message and removing reaction (tbd)
	
	return router;
})();