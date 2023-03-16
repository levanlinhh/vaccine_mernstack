const express = require('express');
const router = express.Router();
const tokenHandler = require('../handlers/tokenHandler');
const { userController } = require('../controllers');

//Day du lieu len
router.post(
    '/',
    tokenHandler.verifyAdminToken,
    userController.createUser
);

//Lay ra tat ca
router.get(
    '/',
    tokenHandler.verifyAdminToken,
    userController.getAll
);

//lay ra 1
router.get(
    '/:id',
    tokenHandler.verifyAdminToken,
    userController.getOne
);

//update
router.put(
    '/:id',
    tokenHandler.verifyAdminToken,
    userController.update
);

//delete
router.delete(
    '/:id',
    tokenHandler.verifyAdminToken,
    userController.delete
);

//Them 1 vaccine cho user
router.post(
    '/vaccinated',
    tokenHandler.verifyAdminToken,
    userController.vaccinated
)

router.get(
    '/:userId/place',
    tokenHandler.verifyToken,
    userController.getAllPlace
)



module.exports = router;