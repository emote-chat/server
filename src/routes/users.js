module.exports = (() => {
	const express = require('express');
	const router = express.Router();
	const path = require('path');
	const userController = require(path.join(__dirname, '../controllers/user.controller'));

	/**
	* @api {get} /user/:email Get user ID by email
	* @apiName GetUserIdByEmail
	* @apiGroup User
	*
	* @apiParam {String} email User email.
	*
	* @apiHeader {String} token Authorization Bearer Token.
	*
	* @apiSuccess {Number} id User ID.
	*
	* @apiSuccessExample Success Response:
	*     HTTP/1.1 200 OK
	*     {
	*          "id": 1
	*     }
	*
	* @apiError UnauthorizedError Invalid/missing token in authorization header.
	* @apiError UserNotFoundError User not found.
	*
	* @apiErrorExample UnAuthorizedError Response:
	*     HTTP/1.1 401 Unauthorized
	*     {
	*          "message": "Invalid/missing token"
	*     }
	*
	* @apiErrorExample UserNotFoundError Response:
	*     HTTP/1.1 404 Not Found
	*     {
	*          "message": "User not found"
	*     }
	*/
	router.get('/:email', userController.getUserByEmail);

	// API endpoint to update user profile (if time permits)
	// router.put('/:id', userController.updateInfo);

	// ... and other possible routes like deleting your own account (tbd)

	return router;
})();