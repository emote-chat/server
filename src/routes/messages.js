module.exports = (() => {
	const express = require('express');
	const router = express.Router();
	const path = require('path');
	const messageController = require(path.join(__dirname, '../controllers/message.controller'));

    /**
    * @api {post} /:mid/react Add Reaction
    * @apiName AddReaction
    * @apiGroup Message
    *
    * @apiHeader {String} token Authorization Bearer Token.
    * @apiHeader {Number} id User id.
    * @apiParam (Request body) {String} [:mid] Message's id.
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
    */
	router.post('/:mid/react', messageController.addReaction);

	// ... and other possible routes like updating/removing message and removing reaction (tbd)
	
	return router;
})();