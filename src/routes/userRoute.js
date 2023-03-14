const express = require('express');
const router = express.Router();
const tokenHandler = require('../handlers/tokenHandler');
const { userController } = require('../controllers');

router.post(
    '/',
    tokenHandler.verifyAdminToken,
    userController.createUser
);

module.exports = router;