const { Vaccine, VaccineLot, UserVaccine } = require('../models');

exports.create = async (req, res) => {
    try {
        const newVaccineLot = new VaccineLot({
            name: req.body.name,
            quantity: req.body.quantity,
            vaccinated: 0,
            vaccine: req.body.vaccineId
        });
        const savedLot = await newVaccineLot.save();
        res.status(201).json(savedLot);
    } catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
}

//Đoạn code trên là một hàm xử lý yêu cầu HTTP POST để tạo mới một lot vaccine trong cơ sở dữ liệu. Hàm này sử dụng các phương thức của thư viện Mongoose để thao tác với MongoDB.

//Hàm create là một hàm bất đồng bộ (async function), có tham số req và res tương ứng với yêu cầu và phản hồi HTTP.
//exports.create = async (req, res) => {


//Trong phần thân hàm, đầu tiên tạo một đối tượng mới của lớp VaccineLot với các thuộc tính được truyền từ yêu cầu HTTP.
/*const newVaccineLot = new VaccineLot({
    name: req.body.name,
    quantity: req.body.quantity,
    vaccinated: 0,
    vaccine: req.body.vaccineId
});*/

//Tiếp theo, gọi phương thức save() để lưu đối tượng mới vào cơ sở dữ liệu. Phương thức save() là một phương thức của đối tượng được tạo ra từ lớp VaccineLot, được sử dụng để lưu đối tượng vào cơ sở dữ liệu.
//const saveLot = await newVaccineLot.save();


//Sau khi lưu thành công, trả về phản hồi HTTP với mã trạng thái 2001 và đối tượng mới được lưu vào cơ sở dữ liệu.
//res.status(2001).json(saveLot);


//Nếu có lỗi trong quá trình tạo mới và lưu đối tượng, nó sẽ được xử lý trong khối catch, in ra lỗi và trả về phản hồi HTTP với mã trạng thái 500 và thông báo lỗi.
/*} catch (err) {
    console.log(err);
    res.status(500).json(err);
}*/

//Hàm create được export để có thể được sử dụng bên ngoài module hiện tại.
//Đối với việc xử lý bất đồng bộ, hàm create sử dụng từ khóa await để chờ cho phương thức save() được thực thi hoàn tất. Khi phương thức này hoàn tất, đối tượng mới được lưu vào cơ sở dữ liệu được trả về bởi phương thức và lưu vào biến saveLot. Nếu có lỗi, hàm sẽ nhảy vào khối catch để xử lý lỗi.



exports.getAll = async (req, res) => {
    try {
        const list = await VaccineLot.find({}).populate('vaccine').sort('-createdAt');
        res.status(200).json(list);
    } catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
}

//Đây là một hàm xử lý khi có một yêu cầu HTTP GET được gửi đến đường dẫn tương ứng.
//Đoạn code trên sử dụng module async và await để xử lý bất đồng bộ. Hàm exports.getAll trả về một Promise được giải quyết thành một mảng các đối tượng vaccine lot.
//async: đánh dấu hàm exports.getAll là một hàm bất đồng bộ, cho phép sử dụng await bên trong.
//try và catch: đây là cú pháp xử lý lỗi. Trong trường hợp lỗi xảy ra, nó sẽ được bắt và xử lý bởi khối catch.
//const list = await VaccineLot.find({}).populate('vaccine').sort('-createdAt');: đây là đoạn code chính để truy vấn tất cả vaccine lot và sắp xếp chúng theo thời gian tạo mới nhất (được tạo từ createdAt). Nó sử dụng phương thức find() của model.
//VaccineLot để lấy tất cả các bản ghi. Sau đó, nó sử dụng phương thức populate() để nạp dữ liệu từ liên kết "vaccine" để tạo ra một danh sách các vaccine lot với thông tin vaccine tương ứng. Cuối cùng, phương thức sort() được sử dụng để sắp xếp danh sách theo thời gian tạo mới nhất. Đây là một truy vấn tới CSDL MongoDB.
//res.status(200).json(list);: nếu không có lỗi nào xảy ra, hàm trả về một HTTP status code là 200 và một đối tượng JSON chứa danh sách vaccine lot đã lấy được từ CSDL.
//console.log(err); res.status(500).json(err);: nếu có lỗi xảy ra trong khi xử lý, lỗi đó được ghi vào console và HTTP status code 500 được trả về kèm với đối tượng JSON chứa thông tin lỗi.

exports.getOne = async (req, res) => {
    try {
        const vaccineLot = await VaccineLot.findById(req.params.id).populate('vaccine');
        res.status(200).json(vaccineLot);
    } catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
}

exports.update = async (req, res) => {
    try {
        const vaccineLot = await VaccineLot.findByIdAndUpdate(
            req.params.id,
            { $set: req.body }
        );
        res.status(200).json(vaccineLot);
    } catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
}

exports.delete = async (req, res) => {
    try {
        await UserVaccine.deleteMany({vaccineLot: req.params.id});
        await VaccineLot.findByIdAndDelete(req.params.id);
        res.status(200).json('Deleted');
    } catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
}

