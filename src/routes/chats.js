module.exports = (() => {
	const express = require('express');
	const router = express.Router();
	const path = require('path');
	const chatController = require(path.join(__dirname, '../controllers/chat.controller'));
	// bring in middleware to verify user's membership in chat
	const membershipMiddleware = require(path.join(__dirname, '../middlewares/membership'));

	// API endpoint to get user's chats
	router.get('/', chatController.getUserChats);

	// API endpoint to create chat
	router.post('/', chatController.createChat);
	
	// must have some middleware to verify user making the API call is part of the given chat
	router.use('/:cid*', membershipMiddleware);

	// API endpoint to get messages in given chat from messages table
	router.get('/:cid', chatController.getMessagesInChat);
	
	// API endpoint to add message to given chat in messages table
	router.post('/:cid/message', chatController.createMessage);

	// API endpoint to add given user to given chat in users_chats table
	router.post('/:cid/:uid', chatController.addUserToChat);
	
	// API endpoint to delete given user from given chat from users_chats table
	router.delete('/:cid/:uid', chatController.deleteUserFromChat);

	// ... and other possible routes (tbd)

	return router;
})();