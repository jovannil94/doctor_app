const db = require("../db/index");

const getAllDoctors = async (req, res, next) => {
    try {
        let doctors = await db.any('SELECT * FROM doctors');
        res.status(200).json({
            status: "Success",
            message: "All doctors",
            payload: doctors
        })
    } catch (error) {
        res.status(400).json({
            status: "Error",
            message: "Couldn't retrieve all doctors",
            payload: error
        })
        next(error);
    }
}

const getOneDoctor = async (req, res, next) => {
    try {
        let doctor = await db.one(`SELECT * FROM doctors WHERE id = $/id/`, {
            id: req.params.id
        });
        res.status(200).json({
            status: "Success",
            message: "Retrieved doctor",
            payload: doctor
        })
    } catch (error) {
        res.status(400).json({
            status: "Error",
            message: "Couldn't retrieve the doctor",
            payload: error
        })
        next(error);
    }
}



module.exports = { getAllDoctors, getOneDoctor };