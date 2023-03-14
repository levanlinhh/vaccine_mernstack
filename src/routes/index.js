const router = require('express').Router();

router.use('/admin', require('./adminRoute'));

module.exports = router;
