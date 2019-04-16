module.exports = (() => {
	const express = require('express');
	const router = express.Router();

	// must have some middleware to verify user is authenticated

	// API endpoint to update user profile (if time permits)
	// router.put('/:id', (req, res) => {
	// });

	// ... and other possible routes like deleting your own account (tbd)

	return router;
})();