module.exports = (() => {
	const express = require('express');
	const router = express.Router();
	const path = require('path');
	const chatController = require(path.join(__dirname, '../controllers/chat.controller'));
	// bring in middleware to verify user's membership in chat
	const membershipMiddleware = require(path.join(__dirname, '../middlewares/membership'));

	/**
	* @api {get} /chat Get chats user is in
	* @apiName GetChats
	* @apiGroup Chat
	*
	* @apiHeader {String} token Authorization Bearer Token.
	*
	* @apiSuccess {Object[]} - List of chats.
	* @apiSuccess {Number} -.id Chat id.
	* @apiSuccess {String} -.name Chat name.
	*
	* @apiSuccessExample Success Response:
	*     HTTP/1.1 200 OK
 	*     [
 	*          {
	*               "id": 1,
	*               "name": "Chat 1"
	*          },
	*          {
	*               "id": 4,
	*               "name": "Chat 4"
	*          }
 	*     ]
	*
	* @apiError UnauthorizedError Invalid/missing token in authorization header.
	*
	* @apiErrorExample UnAuthorizedError Response:
	*     HTTP/1.1 401 Unauthorized
	*     {
	*          "message": "Invalid/missing token"
	*     }
	*/
	router.get('/', chatController.getUserChats);

	/**
	* @api {post} /chat Create chat
	* @apiName CreateChat
	* @apiGroup Chat
	*
	* @apiHeader {String} token Authorization Bearer Token.
	* @apiParam (Request body) {String} [name] Chat's name.
	*
	* @apiSuccess (Success 201) {Number} id Chat ID.
	* @apiSuccess (Success 201) {String} name Chat name.
	*
	* @apiSuccessExample Success Response:
	*     HTTP/1.1 201 Created
	*     {
	*          "id": 1,
	*          "name": "Chat name"
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
	router.post('/', chatController.createChat);
	
	// must have some middleware to verify user making the API call is part of the given chat
	router.use('/:cid*', membershipMiddleware);

	/**
	* @api {get} /chat/:cid Get messages in chat
	* @apiName GetMessagesInChat
	* @apiGroup Chat
	*
	* @apiParam {Number} cid Chat ID.
	* @apiHeader {String} token Authorization Bearer Token.
	*
	* @apiSuccess {Object[]} - List of messages.
	* @apiSuccess {Number} -.id Message id.
	* @apiSuccess {String} -.text Message text.
	* @apiSuccess {Object} -.user User information.
 	* @apiSuccess {Number} -.user.id User ID.
 	* @apiSuccess {String} -.user.display_name User display name.
 	* @apiSuccess {String} -.user.first_name User first name.
 	* @apiSuccess {String} -.user.last_name User last name.
	*
	* @apiSuccessExample Success Response:
	*     HTTP/1.1 200 OK
	*     [
 	*          {
	*               "id": 4,
	*               "text": "here's a message",
	*               "created_at": "2019-05-04T00:31:35.880Z",
	*               "user": {
	*                    "id": 2,
	*                    "email": "test123@yahoo.com",
	*                    "display_name": "bob",
	*                    "first_name": "bob",
	*                    "last_name": "bob"
	*               }
	*          },
	*          {
	*               "id": 2,
	*               "text": "here's another message",
	*               "created_at": "2019-05-03T23:33:41.659Z",
	*               "user": {
	*                    "id": 1,
	*                    "email": "test123@gmail.com",
	*                    "display_name": "manos",
	*                    "first_name": null,
	*                    "last_name": null
	*               }
	*          }
 	*     ]
	*
	* @apiError UnauthorizedError Invalid/missing token in authorization header.
	*
	* @apiErrorExample UnAuthorizedError Response:
	*     HTTP/1.1 401 Unauthorized
	*     {
	*          "message": "Invalid/missing token"
	*     }
	*
	* @apiError MembershipError Not a member of the chat.
	*
	* @apiErrorExample MembershipError Response:
	*     HTTP/1.1 401 Unauthorized
	*     {
	*          "message": "Not a member of this chat"
	*     }
	*/
	router.get('/:cid', chatController.getMessagesInChat);
	
	/**
	* @api {post} /chat/:cid/message Create message in chat
	* @apiName CreateMessageInChat
	* @apiGroup Chat
	*
	* @apiParam {Number} cid Chat ID.
	*
	* @apiSuccessExample Success Response:
	*     HTTP/1.1 201 Created
	*
	* @apiError UnauthorizedError Invalid/missing token in authorization header.
	*
	* @apiErrorExample UnAuthorizedError Response:
	*     HTTP/1.1 401 Unauthorized
	*     {
	*          "message": "Invalid/missing token"
	*     }
	*
	* @apiError MembershipError Not a member of the chat.
	*
	* @apiErrorExample MembershipError Response:
	*     HTTP/1.1 401 Unauthorized
	*     {
	*          "message": "Not a member of this chat"
	*     }
	*/
	router.post('/:cid/message', chatController.createMessage);

	/**
	* @api {post} /chat/:cid/:uid Add user to chat
	* @apiName AddUserToChat
	* @apiGroup Chat
	*
	* @apiParam {Number} cid Chat ID.
	* @apiParam {Number} uid User ID.
	*
	* @apiSuccessExample Success Response:
	*     HTTP/1.1 201 Created
	*
	* @apiError UnauthorizedError Invalid/missing token in authorization header.
	*
	* @apiErrorExample UnAuthorizedError Response:
	*     HTTP/1.1 401 Unauthorized
	*     {
	*          "message": "Invalid/missing token"
	*     }
	*
	* @apiError MembershipError User making request is not a member of the chat.
	*
	* @apiErrorExample MembershipError Response:
	*     HTTP/1.1 401 Unauthorized
	*     {
	*          "message": "Not a member of this chat"
	*     }
	*
	* @apiError AddUserError User being added is already a member of chat.
	*
	* @apiErrorExample AddUserError Response:
	*     HTTP/1.1 400 Bad Request
	*     {
	*          "message": "User already member of chat"
	*     }
	*/
	router.post('/:cid/:uid', chatController.addUserToChat);
	
	/**
	* @api {delete} /chat/:cid/:uid Delete user from chat
	* @apiName DeleteUserFromChat
	* @apiGroup Chat
	*
	* @apiParam {Number} cid Chat ID.
	* @apiParam {Number} uid User ID.
	*
	* @apiSuccessExample Success Response:
	*     HTTP/1.1 204 No Content
	*
	* @apiError UnauthorizedError Invalid/missing token in authorization header.
	*
	* @apiErrorExample UnAuthorizedError Response:
	*     HTTP/1.1 401 Unauthorized
	*     {
	*          "message": "Invalid/missing token"
	*     }
	*
	* @apiError MembershipError Not a member of the chat.
	*
	* @apiErrorExample MembershipError Response:
	*     HTTP/1.1 401 Unauthorized
	*     {
	*          "message": "Not a member of this chat"
	*     }
	*/
	router.delete('/:cid/:uid', chatController.deleteUserFromChat);

	// ... and other possible routes (tbd)

	return router;
})();