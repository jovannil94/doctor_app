const doctors = require("express").Router()

const { getAllDoctors, getOneDoctor } = require("../queries/doctors.js");

doctors.get("/", getAllDoctors);

doctors.get("/:id", getOneDoctor);

module.exports = doctors