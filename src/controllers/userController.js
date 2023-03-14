const jwt = require('jsonwebtoken');
const { User, UserVaccine } = require('../models');


exports.createUser = async (req, res) => {
    const {
        phoneNumber,
        idNumber,
    } = req.body;
    try {
        let user = await User.findOne({phoneNumber: phoneNumber});
        if (user) return res.status(403).json('Số điện thoại đã được đăng ký cho một tài khoản khác');

        user = await User.findOne({idNumber: idNumber});
        if (user) return res.status(403).json('Số id đã được đăng ký cho một tài khoản khác');

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

//Đoạn code này là một API endpoint để tạo mới một tài khoản người dùng.
//Đầu tiên, nó sử dụng thư viện jsonwebtoken để tạo một JWT (JSON Web Token) cho tài khoản người dùng mới được tạo.
//Sau đó, nó lấy các thuộc tính phoneNumber và idNumber từ yêu cầu POST và kiểm tra xem có tài khoản người dùng nào khác đã đăng ký sử dụng chúng hay chưa. Nếu có, nó sẽ trả về một phản hồi lỗi với mã trạng thái 403 (Forbidden) và thông báo lỗi tương ứng.
//Nếu không có tài khoản người dùng nào sử dụng các thuộc tính này, nó sẽ tạo một đối tượng người dùng mới từ yêu cầu POST và lưu nó vào cơ sở dữ liệu bằng cách sử dụng phương thức .save() của mô hình User.
//Sau khi lưu đối tượng người dùng mới, nó sẽ tạo một JWT bằng cách sử dụng phương thức .sign() của jsonwebtoken, sử dụng ID của người dùng mới được lưu trữ và khóa bí mật được lưu trữ trong biến môi trường TOKEN_SECRET_KEY.
//Cuối cùng, nó sẽ trả về một phản hồi thành công với mã trạng thái 201 (Created), đối tượng người dùng đã được lưu trữ và JWT vừa được tạo. Nếu có bất kỳ lỗi nào xảy ra trong quá trình này, nó sẽ trả về một phản hồi lỗi với mã trạng thái 500 (Internal Server Error) và thông báo lỗi tương ứng.


exports.getAll = async (req, res) => {
    try {
        const list = await User.find({}).sort('-createdAt');
        for (const user of list) {
            const vaccine = await UserVaccine.find({
                user: user._id
            }).sort('-createdAt');
            user._doc.vaccine = vaccine;
        }
        res.status(200).json(list)
    } catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
}

//Trong đoạn mã trên, phương thức `getAll` được export và xử lý tất cả các yêu cầu GET đối với tất cả người dùng từ database. Hàm này được viết bằng cách sử dụng `async/await` để đợi tất cả các Promise xử lý xong, để có thể trả về kết quả cuối cùng cho client.