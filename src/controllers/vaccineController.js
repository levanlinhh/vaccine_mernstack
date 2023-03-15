const { Vaccine, VaccineLot, UserVaccine } = require('../models');

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