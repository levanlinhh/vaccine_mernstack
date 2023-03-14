const CryptoJs = require('crypto-js');
const jwt = require('jsonwebtoken');
const { Admin } = require('../models');


exports.login = async (req, res) => {
  try {
    const admin = await Admin.findOne({
      username: req.body.username
    });
    if(!admin) {
      return res.status(401).json('Tên người dùng sai');
    }
    const decryptedPass = CryptoJs.AES.decrypt(
      admin.password,
      process.env.PASSWORD_SECRET_KEY
    ).toString(CryptoJs.enc.Utf8);
    
    if(decryptedPass !== req.body.password) {
      return res.status(401).json("Mật khẩu sai");
    }

    const token = jwt.sign({
      id: admin._id
    }, process.env.TOKEN_SECRET_KEY);

    admin.password = undefined;

    res.status(200).json({
      token,
      admin
    });
    
  } catch (error) {
    console.log(err);
    res.status(500).json(err);
    
  }
}
  