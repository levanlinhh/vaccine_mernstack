const { Place,UserPlace } = require('../models');
const userPlace = require('../models/userPlace');

exports.create = async (req, res) => {
    try {
        const newPlace = new Place({
            ...req.body,
            creator: req.user._id
        });
        const savedPlace = await newPlace.save();
        res.status(201).json(savedPlace);
    } catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
}

//Đoạn mã này là một phương thức controller của một ứng dụng web. Nó được sử dụng để tạo ra một đối tượng "Place" mới và lưu trữ nó vào cơ sở dữ liệu.

//Đầu tiên, nó sử dụng require để lấy module "Place" từ đường dẫn tương đối "../models". Điều này cho phép phương thức truy cập vào định nghĩa của "Place" model, mà có thể được sử dụng để tạo và lưu trữ đối tượng vào cơ sở dữ liệu.
//Phương thức "exports.create" được sử dụng để xử lý yêu cầu tạo một đối tượng "Place" mới. Nó nhận đầu vào là đối tượng "req" (yêu cầu HTTP) và đối tượng "res" (phản hồi HTTP), tương ứng với yêu cầu và phản hồi tương ứng từ client.

//Đoạn mã này sử dụng try-catch block để bắt lỗi và xử lý nó nếu có lỗi xảy ra. Nếu không có lỗi, nó tạo ra một đối tượng "Place" mới bằng cách sử dụng dữ liệu được gửi từ client thông qua "req.body" và sử dụng "req.user._id" để đặt "creator" (người tạo) của đối tượng mới là user đang thực hiện yêu cầu.

//Sau đó, đối tượng mới này được lưu trữ vào cơ sở dữ liệu bằng cách sử dụng phương thức "save" của đối tượng "Place". Kết quả trả về từ phương thức "save" được gán cho biến "savedPlace".


exports.getAll = async (req, res) => {
    try {
        const list = await Place.find({}).populate('creator').sort('-createdAt');
        for (const place of list) {
            const userVisitLast24h = await UserPlace.find({
                place: place._id,
                createdAt: {
                    $gt: new Date(Date.now() - 24*60*60*1000)
                }
            });
            place._doc.userVisitLast24h = userVisitLast24h;
        }
        res.status(200).json(list);
    } catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
}
//Đoạn code trên định nghĩa một hàm xử lý khi client yêu cầu lấy tất cả các địa điểm (places) trong hệ thống. Hàm sẽ trả về một danh sách các địa điểm kèm theo thông tin người dùng đã ghé thăm địa điểm trong 24 giờ qua.
//Để làm được điều đó, đoạn code sử dụng một số phương thức của thư viện Mongoose (một thư viện dùng để tương tác với cơ sở dữ liệu MongoDB trong Node.js) và một số tính năng bất đồng bộ của JavaScript.
exports.getAll = async (req, res) => { // Hàm xử lý yêu cầu lấy tất cả các địa điểm
    try {
      const list = await Place.find({}) // Lấy danh sách địa điểm từ MongoDB
        .populate('creator') // Lấy thông tin người tạo ra địa điểm
        .sort('-createdAt'); // Sắp xếp theo thời gian tạo giảm dần
  
      // Duyệt qua từng địa điểm trong danh sách
      for (const place of list) {
        const userVisitLast24h = await UserPlace.find({
          place: place._id, // Lọc theo địa điểm
          createdAt: {
            $gt: new Date(Date.now() - 24*60*60*1000) // Lọc theo thời gian ghé thăm
          }
        });
  
        // Gán thông tin người dùng ghé thăm địa điểm vào đối tượng địa điểm
        place._doc.userVisitLast24h = userVisitLast24h;
      }
  
      // Trả về danh sách địa điểm kèm theo thông tin người dùng ghé thăm trong 24 giờ qua
      res.status(200).json(list);
    } catch(err) { // Nếu có lỗi xảy ra
      console.log(err);
      res.status(500).json(err); // Trả về mã lỗi 500 và thông báo lỗi
    }
  };
//Dòng đầu tiên xác định hàm xử lý yêu cầu lấy tất cả các địa điểm, với tham số req là đối tượng yêu cầu từ phía client và res là đối tượng phản hồi từ phía server.
//Dòng thứ hai khai báo từ khóa async để cho phép sử dụng await, một tính năng của JavaScript giúp đợi cho tới khi một hoạt động bất đồng bộ hoàn tất.
//Dòng thứ ba sử dụng phương thức Place.find({}) để lấy danh sách tất cả các địa điểm từ cơ sở dữ liệu MongoDB.

//Phương thức populate('creator') được sử dụng để lấy thông tin về người tạo ra địa điểm, trong đó creator là tên của trường chứa thông tin người tạo trong đối tượng địa điểm. Kết quả trả về từ phương thức này sẽ được gán vào trường creator trong đối tượng địa điểm.
//Dòng thứ năm sử dụng phương thức sort('-createdAt') để sắp xếp danh sách các địa điểm theo thời gian tạo giảm dần, trong đó createdAt là trường chứa thông tin thời gian tạo trong đối tượng địa điểm.
//Dòng thứ năm sử dụng phương thức sort('-createdAt') để sắp xếp danh sách các địa điểm theo thời gian tạo giảm dần, trong đó createdAt là trường chứa thông tin thời gian tạo trong đối tượng địa điểm.
//Phương thức UserPlace.find() lấy danh sách các đối tượng UserPlace từ cơ sở dữ liệu MongoDB, trong đó UserPlace là một đối tượng liên kết giữa địa điểm và người dùng, được định nghĩa bởi Mongoose. Hàm sử dụng trường _id của địa điểm hiện tại để lọc danh sách các đối tượng UserPlace liên quan đến địa điểm đó, và sử dụng trường createdAt để lọc theo thời gian ghé thăm.
//Thông tin người dùng đã ghé thăm địa điểm trong vòng 24 giờ qua được lưu trữ trong biến userVisitLast24h. Sau đó, hàm gán thông tin này vào trường userVisitLast24h của đối tượng địa điểm bằng cách sử dụng cú pháp place._doc.userVisitLast24h = userVisitLast24h. Lưu ý rằng đây là cách gán giá trị cho một trường không được định nghĩa trong đối tượng, sử dụng thuộc tính _doc của đối tượng để truy cập vào các trường bên trong.
//Cuối cùng, hàm trả về danh sách các địa điểm kèm theo thông tin người dùng đã ghé thăm trong 24 giờ qua bằng cách sử dụng phương thức res.status(200).json(list). Nếu có lỗi xảy ra trong quá trình thực hiện, hàm sẽ bắt và xử lý lỗi bằng cách in ra thông tin lỗi trên console và trả về mã lỗi 500 


exports.getOne = async (req, res) => {
    try {
        const place = await Place.findById(req.params.id).populate('creator');
        const userVisitLast24h = await UserPlace.find({
            place: place._id,
            createdAt: {
                $gt: new Date(Date.now() - 24*60*60*1000)
            }
        }).populate('user');
        place._doc.userVisitLast24h = userVisitLast24h;
        res.status(200).json(place);
    } catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
}

exports.update = async (req, res) => {
    try {
        const place = await Place.findOneAndUpdate({
            _id: req.params.id,
            creator: req.user._id
        },
        {
            $set: req.body
        }
        );
        res.status(200).json(place);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}

exports.delete = async (req, res) => {
    try {
        await UserPlace.deleteMany({place: req.params.id});
        await Place.findOneAndDelete({
            _id: req.params.id,
            creator: req.user._id
        });
        res.status(200).json('Deleted');
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}