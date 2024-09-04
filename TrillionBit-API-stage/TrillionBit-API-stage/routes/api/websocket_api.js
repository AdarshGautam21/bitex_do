const express = require('express');
const jwt_decode = require('jwt-decode');
const router = express.Router();

/**
 * @route POST /api/websocket/auth
 * @description validate auth
 * @access Public
 */
router.post('/auth', async (req, res) => {
	console.log(req, 'post');
	res.json({code: 0, message: null, data: {user_id: 500006}});
});

/**
 * @route GET /api/websocket/auth
 * @description validate auth
 * @access Public
 */
router.get('/auth', async (req, res) => {
	console.log(req.headers.authorization, 'get');
	let userId = 0;
	const decoded = jwt_decode(req.headers.authorization);
	// Check for expire token
	const currentTime = Math.floor(Date.now() / 1000);
	if(currentTime < decoded.exp) {
		userId = decoded.viabtcUserId;
	}

	console.log(`User Id: ${userId}`);
	res.json({code: 0, message: null, data: {user_id: userId}});
});

module.exports = router;