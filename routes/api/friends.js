const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middelwares');
const ctrl = require('../../controllers/friends');

router.post('/:id', authenticate, ctrl.addFriend);
router.get('/', authenticate, ctrl.getAllFriends);


module.exports = router;
