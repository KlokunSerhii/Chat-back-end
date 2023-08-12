const express = require('express');
const router = express.Router();

const ctrl = require('../../controllers/auth');
const { validateBody } = require('../../middelwares');
const { schemas } = require('../../models/user');

router.post(
  '/register',
  validateBody(schemas.registerSchema),
  ctrl.register
);
router.post(
  '/login',
  validateBody(schemas.loginSchema),
  ctrl.login
);
router.post('/logout', ctrl.logout);

router.get('/current', authenticate, ctrl.getCurrent);

module.exports = router;
