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
	* @apiSuccess {Object[]} -.users List of users.
	* @apiSuccess {Object} -.users.- User.
	* @apiSuccess {Number} -.users.-.id User ID.
	* @apiSuccess {String} -.users.-.display_name User display name.
	*
	* @apiSuccessExample Success Response:
	*     HTTP/1.1 200 OK
 	*     [
 	*          {
	*               "id": 1,
	*               "name": "Chat 1"
	*               "users": [
	*                    {
	*                         "id": 1,
	*                         "display_name": "User 1 display name",
	*                    },
	*                    {
	*                         "id": 2,
	*                         "display_name": "User 2 display name",
	*                    }
	*               ]
	*          },
	*          {
	*               "id": 4,
	*               "name": "Chat 4"
	*               "users": [
	*                    {
	*                         "id": 2,
	*                         "display_name": "User 2 display name",
	*                    },
	*                    {
	*                         "id": 3,
	*                         "display_name": "User 3 display name",
	*                    }
	*               ]
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
	* @apiError MissingFields Missing one or more of required fields <code>email</code>, <code>password</code> and/or <code>display_name</code>.
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
	* @apiSuccess {Number} -.users_id User ID of user who posted message.
	* @apiSuccess {String} -.created Message timestamp with timezone; defaults to current.
	* @apiSuccess {String} -.text Message text.
	*
	* @apiSuccessExample Success Response:
	*     HTTP/1.1 200 OK
	*     [
 	*          {
	*               "id": 4,
	*               "users_id": 2,
	*               "created": "2019-05-04T00:31:35.880Z",
	*               "text": "here's a message"
	*          },
	*          {
	*               "id": 2,
	*               "users_id": 1,
	*               "created": "2019-05-03T23:33:41.659Z",
	*               "text": "here's another message"
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
    * @apiError ChatOrMessageNotFound Given chat does not exist.
    *
    * @apiErrorExample ChatOrMessageNotFound Response:
    *     HTTP/1.1 404 Not Found
    *     {
    *          "message": "Given chat or message not found"
    *     }
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
	*     {
	*          "id": 4,
	*          "users_id": 2,
	*          "created": "2019-05-04T00:31:35.880Z",
	*          "text": "here's a message"
	*     }
	*
	* @apiError MissingFields Missing one or more of required fields <code>email</code>, <code>password</code> and/or <code>display_name</code>.
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
    * @apiError ChatOrMessageNotFound Given chat does not exist.
    *
    * @apiErrorExample ChatOrMessageNotFound Response:
    *     HTTP/1.1 404 Not Found
    *     {
    *          "message": "Given chat or message not found"
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
    * @apiError ChatOrMessageNotFound Given chat does not exist.
    *
    * @apiErrorExample ChatOrMessageNotFound Response:
    *     HTTP/1.1 404 Not Found
    *     {
    *          "message": "Given chat or message not found"
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
    * @apiError ChatOrMessageNotFound Given chat does not exist.
    *
    * @apiErrorExample ChatOrMessageNotFound Response:
    *     HTTP/1.1 404 Not Found
    *     {
    *          "message": "Given chat or message not found"
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