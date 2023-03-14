const router = require('express').Router();

router.use('/admin', require('./adminRoute'));
router.use('/user', require('./userRoute'));


module.exports = router;
