module.exports = (() => {
	const express = require('express');
	const router = express.Router();
	// const path = require('path');
	// const chatController = require(path.join(__dirname, '../controllers/chat.controller'));

	// must have some middleware to verify user is authenticated
	// AND user making the API call is part of the given chat

	// API endpoint to get messages in given chat from messages table
	// router.get('/:cid', chatController.getMessages);

	// API endpoint to remove given user from given chat from users_chats table
	// router.delete('/:cid/:uid', chatController.removeUser);

	// API endpoint to add given user to given chat in users_chats table
	// router.post('/:cid/:uid', chatController.addUser);

	// API endpoint to add message to given chat in messages table
	// router.post('/:cid/message', chatController.addMessage);

	// ... and other possible routes like removing message (tbd)

	return router;
})();