const jwt = require('jsonwebtoken');
const { User, UserVaccine, UserPlace, VaccineLot, Vaccine, Place } = require('../models');


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

//Sử dụng `User.find({})` để tìm tất cả các bản ghi có trong database `User` bằng cách truy vấn toàn bộ (không thêm bất kỳ điều kiện nào).
//Sử dụng `sort('-createdAt')` để sắp xếp các bản ghi theo thời gian tạo mới nhất, từ mới đến cũ.
//Trong vòng lặp `for`, dùng `UserVaccine.find({ user: user._id })` để tìm các bản ghi liên quan đến mỗi người dùng thông qua trường `_id`.
//Tương tự như bước 2, sử dụng `sort('-createdAt')` để sắp xếp các bản ghi vaccine theo thời gian được tạo mới nhất.
//Thêm trường `vaccine` vào `_doc` của mỗi người dùng, và gán giá trị này bằng đối tượng vaccines tìm được trong bước 3.
//Thêm trường `vaccine` vào `_doc` của mỗi người dùng, và gán giá trị này bằng đối tượng vaccines tìm được trong bước 3.
//Còn trong trường hợp có lỗi, thông báo lỗi sẽ được ghi vào console và trả về 1 mã lỗi HTTP 500 cho client.

exports.getOne = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const userVaccine = await UserVaccine.find({
            user: req.params.id
        }).populate('vaccine').populate('vaccineLot').sort('-createdAt');
        const userPlaceVisit = await UserPlace.find({
            user: req.params.id
        }).populate('place').sort('-createdAt');

        user._doc.vaccinated = userVaccine;
        user._doc.placeVisited = userPlaceVisit;

        res.status(200).json(user);
    } catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
}

//Trong đoạn mã này, phương thức `getOne` được export và sử dụng để lấy thông tin của một người dùng từ database. Kết quả được trả về bao gồm thông tin vaccine và địa điểm mà người dùng đã đi đến.
//Sử dụng `User.findById(req.params.id)` để tìm kiếm người dùng trong cơ sở dữ liệu thông qua `id` được truyền vào qua param trong url.
//Sử dụng `UserVaccine.find({ user: req.params.id })` để tìm kiếm các thông tin vaccine liên quan đến người dùng trong cơ sở dữ liệu. Ở đây, sử dụng `populate('vaccine')` và `populate('vaccineLot')` để thêm thông tin về vaccine và lô vaccine vào các bản ghi tìm được. Sau đó, sử dụng `sort('-createdAt')` để sắp xếp các bản ghi theo thời gian tạo mới nhất.
//Sử dụng `UserPlace.find({ user: req.params.id })` để tìm kiếm các địa điểm mà người dùng đã đi đến, tương tự như bước 2.
//Tương tự như bước 2, sử dụng `populate('place')` để thêm thông tin về địa điểm vào các bản ghi tìm được, và sử dụng `sort('-createdAt')` để sắp xếp các bản ghi theo thời gian tạo mới nhất.
//Thêm trường `vaccinated` trong `_doc` của đối tượng người dùng và gán giá trị này bằng đối tượng vaccine được tìm kiếm ở bước 2.
//Thêm trường `placeVisited` trong `_doc` của đối tượng người dùng và gán giá trị này bằng đối tượng địa điểm được tìm kiếm ở bước 3.
//Trả về đối tượng người dùng kèm thông tin vaccine và địa điểm đã được truy xuất ở các bước trên với mã lỗi HTTP 200 nếu không có lỗi nào xảy ra.
//Nếu có lỗi xuất hiện, thông báo lỗi sẽ được ghi vào console và trả về 1 mã lỗi HTTP 500 cho client.

exports.update = async (req, res) => {
    const {
        phoneNumber,
        idNumber,
    } = req.body;
    try {
        let user = await User.findOne({phoneNumber: phoneNumber});
        if(user && user._id.toString() !== req.params.id) {
            return res.status(403).json("Phone number already registered for another account");
        }

        user = await User.findOne({idNumber: idNumber});
        if(user && user._id.toString() != req.params.id) {
            return res.status(403).json("Id number already registered for another account");
        }
        const updateUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body
            }
        );
        res.status(200).json(updateUser);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}
//Đây là một hàm xử lý tương tác với cơ sở dữ liệu MongoDB để cập nhật thông tin của một người dùng.
//Về cấu trúc chung của hàm, nó sử dụng async/await để đảm bảo rằng các lệnh cập nhật thông tin người dùng sẽ được thực hiện một cách đồng bộ. Hàm nhận vào 2 tham số là req và res. Tham số req đại diện cho request object trong Express, bao gồm các thông tin gửi lên từ client-side. Tham số res đại diện cho response object trong Express, bao gồm các phương thức để gửi trả kết quả về client-side.

//Dữ liệu của request được truy cập thông qua req.body và 2 thuộc tính phoneNumber và idNumber được lấy ra.
/*const {
    phoneNumber,
    idNumber,
} = req.body;
*/

//Hàm sử dụng User.findOne để tìm kiếm một người dùng trong cơ sở dữ liệu với số điện thoại hoặc số CMND truyền vào. Nếu tìm thấy, nó sẽ kiểm tra xem người dùng đã tìm thấy có khác với người dùng được chỉ định trong params không. Nếu có, nó sẽ trả về mã lỗi 403 và thông báo lỗi tương ứng.
/*let user = await User.findOne({phoneNumber: phoneNumber});
if(user && user._id.toString() !== req.params.id) {
    return res.status(403).json("Phone number already registered for another account");
}

user = await User.findOne({idNumber: idNumber});
if(user && user._id.toString() != req.params.id) {
    return res.status(403).json("Id number already registered for another account");
}
/*
let user = await User.findOne({phoneNumber: phoneNumber});
if(user && user._id.toString() !== req.params.id) {
    return res.status(403).json("Phone number already registered for another account");
}

user = await User.findOne({idNumber: idNumber});
if(user && user._id.toString() != req.params.id) {
    return res.status(403).json("Id number already registered for another account");
}
*/

//Nếu không có lỗi, hàm sử dụng User.findByIdAndUpdate để cập nhật thông tin của người dùng được chỉ định trong req.params.id. Các thông tin mới được cập nhật sẽ được lấy từ req.body.
/*const updateUser = await User.findByIdAndUpdate(
    req.params.id,
    {
        $set: req.body
    }
);
*/

//Nếu mọi thứ thành công, hàm sẽ trả về mã status 200 và thông tin của người dùng vừa được cập nhật.
//res.status(200).json(updateUser);

//Nếu có bất kỳ lỗi nào xảy ra trong quá trình xử lý, nó sẽ được catch bởi khối try-catch và trả về mã lỗi 500 cùng với thông báo lỗi.
/*
} catch (err) {
    console.log(err);
    res.status(500).json(err);
}
*/


exports.delete = async (req, res) => {
    try {
        const {id} = req.params;
        await UserVaccine.deleteMany({user: id});
        await UserPlace.deleteMany({user: id});
        await User.findByIdAndDelete(id);
        res.status(200).json("Deleted successfully");
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}

//Thêm vaccine cho user
exports.vaccinated = async (req, res) => {
    try {
        const {
            userId,
            vaccineId,
            vaccineLotId
        } = req.body;
        const newVaccine = new UserVaccine({
            user: userId,
            vaccine: vaccineId,
            vaccineLot: vaccineLotId
        });
        const savedUserVaccine = await newVaccine.save();
        await VaccineLot.findOneAndUpdate({
            _id: vaccineLotId
        },{
            $inc: { vaccinated: +1 }
        });

        savedUserVaccine._doc.vaccine = await Vaccine.findById(vaccineId);
        savedUserVaccine._doc.vaccineLot = await VaccineLot.findById(vaccineLotId);
        res.status(201).json(savedUserVaccine);
    } catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
}

// get places of user

exports.getAllPlace = async (req, res) => {
    try {
        const list = await Place.find({
            creator: req.params.userId
        });
        res.status(200).json(list);
    } catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
}

// user check in place

exports.checkinPlace = async (req, res) => {
    try {
        const newVisit = new UserPlace({
            user: req.user._id,
            place: req.body.placeId
        });
        const savedUserPlace = await newVisit.save();
        res.status(201).json(savedUserPlace);
    } catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
}

//nhận địa điểm mà người dùng đã đăng ký

exports.placeVisited = async (req, res) => {
    try {
        const list = await UserPlace.find({user: req.params.userId}).populate('place');
        res.status(200).json(list);
    } catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
}