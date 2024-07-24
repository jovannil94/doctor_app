DROP DATABASE IF EXISTS doctor_app;
CREATE DATABASE doctor_app;

\c doctor_app;

DROP TABLE IF EXISTS doctors;

CREATE TABLE doctors (
    id SERIAL PRIMARY KEY,
    firstName VARCHAR(25),
    lastName VARCHAR(25),
    gender VARCHAR(10),
    DOB JSONB
);
