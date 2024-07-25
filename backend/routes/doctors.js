const doctors = require("express").Router()

const { getAllDoctors, getOneDoctor, getSearchDoctors } = require("../queries/doctors.js");

doctors.get("/search", getSearchDoctors)

doctors.get("/:id", getOneDoctor);

doctors.get("/", getAllDoctors);

module.exports = doctors