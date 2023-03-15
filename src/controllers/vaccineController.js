const { Vaccine, VaccineLot, UserVaccine } = require('../models');
const vaccine = require('../models/vaccine');

exports.create = async (req, res) => {
    try {
        const newVaccine = new Vaccine({
            name: req.body.name
        });
        const savedVaccine = await newVaccine.save();
        savedVaccine._doc.quantity = 0;
        savedVaccine._doc.vaccinated = 0;
        savedVaccine._doc.vaccineLots = [];
        res.status(201).json(savedVaccine);
    } catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
}

exports.getAll = async (req, res) => {
    try {
        const list = await Vaccine.find({}).sort('-createdAt');
        for (const vaccine of list) {
            const vaccineLots = await VaccineLot.find({vaccine: vaccine._id});
            vaccine._doc.quantity = vaccineLots.reduce(
                (total, item) => total + Number(item.quantity),
                0
            );
            vaccine._doc.vaccinated = vaccineLots.reduce(
                (total, item) => total + Number(item.vaccinated),
                0
            );
            vaccine._doc.vaccineLots = vaccineLots;
        }
        res.status(200).json(list);
    } catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
}

exports.getOne = async (req, res) => {
    try {
        const vaccine = await Vaccine.findById(req.params.id);

        const vaccineLots = await VaccineLot.find({vaccine: vaccine._id});

        vaccine._doc.quantity = vaccineLots.reduce(
            (total, item) => total + Number(item.quantity),
            0
        );

        vaccine._doc.vaccinated = vaccineLots.reduce(
            (total, item) => total + Number(item.vaccinated),
            0
        );

        vaccine._doc.vaccineLots = vaccineLots;
        res.status(200).json(vaccine);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}

exports.update = async (req, res) => {
    try {
        const vaccine = await Vaccine.findByIdAndUpdate(
            req.params.id,
            { $set: req.body }
        );
        res.status(200).json(vaccine);
    } catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
}

exports.delete = async (req, res) => {
    try {
        await VaccineLot.deleteMany({vaccine: req.params.id});
        await UserVaccine.deleteMany({vaccine: req.params.id});
        await Vaccine.findByIdAndDelete(req.params.id);
        res.status(200).json('Deleted');
    } catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
}

//Phương thức reduce
//a. Đầu tiên, khai báo một mảng gồm 5 phần tử có tên numbers.
//const numbers = [1, 2, 3, 4, 5];
//Tiếp theo, sử dụng phương thức reduce() để tính tổng các phần tử trong mảng numbers.
//const sum = numbers.reduce((total, num) => total + num, 0);
// reduce() là một phương thức của mảng, giúp thực hiện một hoạt động lặp lại trên từng phần tử trong mảng và trả về một giá trị cuối cùng. Phương thức này có tham số đầu tiên là một hàm callback, được sử dụng để thực hiện hoạt động lặp lại trên mỗi phần tử.
//Trong hàm callback này, total là giá trị tính tổng hiện tại và được khởi tạo là 0 (giá trị được truyền vào cuối cùng của phương thức reduce()). num là phần tử trong mảng đang được duyệt qua. Công thức total + num được sử dụng để tính tổng.
//(total, num) => total + num
//Sau khi hoàn tất hoạt động lặp lại trên từng phần tử của mảng, phương thức reduce() trả về giá trị tổng cuối cùng và gán vào biến sum.
//const sum = numbers.reduce((total, num) => total + num, 0);
//Cuối cùng, kết quả tổng được in ra bằng cách sử dụng console.log()
//console.log(sum); // 15
