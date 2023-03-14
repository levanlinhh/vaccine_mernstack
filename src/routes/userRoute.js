const express = require('express');
const router = express.Router();
const tokenHandler = require('../handlers/tokenHandler');
const { userController } = require('../controllers');

router.post(
    '/',
    tokenHandler.verifyAdminToken,
    userController.createUser
);

router.get(
    '/',
    tokenHandler.verifyAdminToken,
    userController.getAll
);

router.get(
    '/:id',
    tokenHandler.verifyAdminToken,
    userController.getOne
);



module.exports = router;