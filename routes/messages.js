module.exports = (() => {
	const express = require('express');
	const router = express.Router();

	// must have some middleware to verify user is authenticated
	// AND user making the API call is part of the chat that message is in

	// API endpoint to add user reaction to message in users_messages_emojis table
	// router.post('/:mid/react', (req, res) => {
	// });

	// ... and other possible routes like removing reaction (tbd)
	
	return router;
})();