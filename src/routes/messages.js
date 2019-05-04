module.exports = (() => {
	const express = require('express');
	const router = express.Router();
	// const path = require('path');
	// const messageController = require(path.join(__dirname, '../controllers/message.controller'));

	// API endpoint to add user reaction to message in users_messages_emojis table
	// router.post('/:mid/react', messageController.addReaction);

	// ... and other possible routes like updating/removing message and removing reaction (tbd)
	
	return router;
})();