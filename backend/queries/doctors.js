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

const getSearchDoctors = async (req, res, next) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ error: 'Query parameter is required' });
        }

        const searchTerms = query.split(' ').map(term => `%${term}%`);
        
        const conditions = searchTerms.map((term, index) => {
            return `firstName ILIKE $${index + 1} OR lastName ILIKE $${index + 1}`;
        }).join(' OR ');

        const doctors = await db.any(
            `SELECT * FROM doctors WHERE ${conditions}`,
            searchTerms
        );

        res.status(200).json({
            status: 'Success',
            message: 'Doctors with similar names',
            payload: doctors
        });
    } catch (error) {
        res.status(400).json({
            status: "Error",
            message: "Couldn't retrieve doctors",
            payload: error
        })
        next(error);
    }
};

module.exports = { getAllDoctors, getOneDoctor, getSearchDoctors };
