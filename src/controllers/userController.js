const jwt = require('jsonwebtoken');
const { User } = require('../models');


exports.createUser = async (req, res) => {
    const {
        phoneNumber,
        idNumber,
    } = req.body;
    try {
        let user = await User.findOne({phoneNumber: phoneNumber});
        if (user) return res.status(403).json('Phone number already registered for another account');

        user = await User.findOne({idNumber: idNumber});
        if (user) return res.status(403).json('Id number already registered for another account');

        const newUser = new User(req.body);
        const savedUser = await newUser.save();
        const token = jwt.sign({
            id: savedUser._id
        }, process.env.TOKEN_SECRET_KEY);

        res.status(201).json({
            user: savedUser,
            token
        });
    } catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
}