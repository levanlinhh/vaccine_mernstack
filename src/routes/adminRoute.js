const router = require('express').Router();
const adminController = require('../controllers/adminController');


router.post('/login', adminController.login);

module.exports = router;