const express = require('express');
const router = express.Router();

const ctrl = require('../../controllers/auth');

router.get('/chat/:id', ctrl.getById)
router.post('/chat/:id', ctrl.addMessage)