const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middelwares');
const ctrl = require('../../controllers/message');

router.get('/chat/:id', authenticate, ctrl.getAllMessage);
router.post('/chat/:id', authenticate, ctrl.addMessage);

module.exports = router;
