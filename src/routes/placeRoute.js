const express = require('express');
const router = express.Router();
const tokenHandler = require('../handlers/tokenHandler');
const { placeController } = require('../controllers');

//Nguoi dung tu tao dia diem
router.post(
    '/',
    tokenHandler.verifyToken,
    placeController.create
);

//Lay ra tat ca dia diem
router.get(
    '/',
    tokenHandler.verifyAdminToken,
    placeController.getAll
);

//Lay ra 1 dia diem
router.get(
    '/:id',
    tokenHandler.verifyToken,
    placeController.getOne
);

//update

router.put(
    '/:id',
    tokenHandler.verifyToken,
    placeController.update
);

router.delete(
    '/:id',
    tokenHandler.verifyToken,
    placeController.delete
);

module.exports = router;