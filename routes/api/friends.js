const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middlewares');
const ctrl = require('../../controllers/friends');

router.post('/:id', authenticate, ctrl.addFriend);
router.get('/:id', authenticate, ctrl.getAllFriends);
router.delete('/:id', authenticate, ctrl.deleteFriends);

module.exports = router;
