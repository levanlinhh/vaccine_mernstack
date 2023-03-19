const jsonwebtoken = require("jsonwebtoken");
const { Admin, User } = require('../models');

const tokenDecode = (req) => {
    const bearerHeader = req.headers['authorization'];
    if (bearerHeader) {
        const bearer = bearerHeader.split(' ')[1];
        try {
            const tokenDecoded = jsonwebtoken.verify(
                bearer,
                process.env.TOKEN_SECRET_KEY
            );
            return tokenDecoded;
        } catch(err) {
            return false;
        }
    } else {
        return false;
    }
}

exports.verifyAdminToken = async (req, res, next) => {
    const tokenDecoded = tokenDecode(req);
    if (tokenDecoded) {
        const admin = await Admin.findById(tokenDecoded.id);
        if (!admin) return res.status(403).json('Not allowed!');
        req.admin = admin;
        next();
    } else {
        res.status(401).json('Unauthorized');
    }
}

exports.verifyToken = async (req, res, next) => {
    const tokenDecoded = tokenDecode(req);
    if (tokenDecoded) {
        const admin = await Admin.findById(tokenDecoded.id);
        const user = await User.findById(tokenDecoded.id);
        if (!admin && !user) return res.status(403).json('Not allowed!');
        req.admin = admin;
        req.user = user;
        next();
    } else {
        res.status(401).json('Unauthorized');
    }
}

//Code trên là một module trong một ứng dụng backend với Node.js và Express framework. Đây là các middleware sử dụng để xác thực token của người dùng được gửi trong các yêu cầu API. Đoạn mã này sử dụng thư viện jsonwebtoken để giải mã token và kiểm tra quyền truy cập của người dùng thông qua các mô hình Admin và User có trong models của ứng dụng.

//Trong đó hàm `tokenDecode` nhận đối số `req` là đối tượng yêu cầu và trả về giá trị token được giải mã. Nếu không tìm thấy giá trị token hoặc mã thông báo không hợp lệ, hàm này trả về false.

//`exports.verifyAdminToken` là middleware sử dụng để xác thực token của user có quyền Admin và báo lỗi nếu token không hợp lệ hoặc người dùng không phải là Admin. Nếu token hợp lệ và người dùng được tìm thấy là Admin, middleware sẽ thêm Admin này vào đối tượng `req` để sử dụng trong các middleware khác của ứng dụng.

//`exports.verifyToken` là middleware sử dụng để xác thực token của người dùng và trả về thông tin của người dùng cho request. Thông tin này bao gồm cả thông tin Admin và User. Middleware kiểm tra xem token có hợp lệ và người dùng được tìm thấy có thuộc Admin hoặc User trước khi thêm thông tin của họ vào đối tượng `req`. Nếu không tìm thấy người dùng hoặc token không hợp lệ, middleware sẽ trả về lỗi 401 Unauthorized.

//Trong cả hai middleware này, middleware tiếp theo (nếu có) được gọi bằng việc gọi hàm `next()` nếu không có lỗi xảy ra. Nếu có lỗi, response sẽ trả về một thông báo lỗi dưới dạng mã JSON.