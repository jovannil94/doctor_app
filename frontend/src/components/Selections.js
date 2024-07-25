import React, { useEffect, useState } from 'react';
import { getAPI } from '../util/getAPI';
import axios from 'axios';
import jsPDF from 'jspdf';
import '../css/Selection.css';

const Dropdowns = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [matchingDoctors, setMatchingDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedState, setSelectedState] = useState(null);

    useEffect(() => {
        if (searchQuery.length > 0) {
            const API = getAPI();
            const fetchMatchingDoctors = async () => {
                try {
                    const res = await axios.get(`${API}/doctors/search?query=${searchQuery}`);
                    setMatchingDoctors(res.data.payload);
                } catch (error) {
                    console.log(error);
                }
            }
            fetchMatchingDoctors();
        } else {
            setMatchingDoctors([]);
        }
    }, [searchQuery]);

    const handleDoctorSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setSelectedDoctor(null); // Clear selected doctor on new search
    };

    const handleDoctorSelect = (doctor) => {
        setSelectedDoctor(doctor);
    };

    const handleStateChange = (e) => {
        setSelectedState(e.target.value);
    };

    const formatDoctorInfo = (state, doctor) => {
        const stateFormMap = {
            NY: {
                "First Name": () => doctor.firstname,
                "Last Name": () => doctor.lastname,
                "Gender": () => doctor.gender,
                "Date of Birth (mm/dd/yyyy)": () => doctor.dob.toISOString().split('T')[0]
            },
            CA: {
                "Full Name": () => `${doctor.firstname} ${doctor.lastname}`,
                "Gender": () => doctor.gender,
                "Date of Birth (yyyy-mm-dd)": () => doctor.dob.toISOString().split('T')[0]
            }
        };

        const stateForm = stateFormMap[state];
        if (!stateForm) {
            throw new Error(`No form found for state: ${state}`);
        }

        const formattedDoctor = {};
        for (const [field, getValue] of Object.entries(stateForm)) {
            formattedDoctor[field] = getValue();
        }

        return formattedDoctor;
    };

    const handleSaveToPDF = async () => {
        const API = getAPI();
        if (selectedDoctor && selectedState) {
            try {
                const res = await axios.get(`${API}/doctors/${selectedDoctor.id}`);
                const doctorDetails = res.data.payload;
                const formattedDoctor = formatDoctorInfo(selectedState, doctorDetails);

                const doc = new jsPDF();
                const content = JSON.stringify(formattedDoctor, null, 2);
                doc.text(content, 10, 10);
                doc.save(`${selectedState}-${doctorDetails.firstname}-${doctorDetails.lastname}.pdf`);
            } catch (error) {
                console.error('Error fetching doctor details:', error);
            }
        } else {
            console.error('No doctor or state selected');
        }
    };

    return (
        <div className="selection-container">
            <h1>Doctor PDF Form App</h1>
            <div className="selection-form">
                <div className="search">
                    <label htmlFor="doctorSearch">Search Doctor:</label>
                    <input
                        type="text"
                        id="doctorSearch"
                        value={searchQuery}
                        onChange={handleDoctorSearchChange}
                        placeholder="Type a doctor's name..."
                    />
                    {matchingDoctors.length > 0 && (
                        <ul className="doctor-list">
                            {matchingDoctors.map((doctor) => (
                                <li
                                    key={doctor.id}
                                    className={selectedDoctor && selectedDoctor.id === doctor.id ? 'selected' : ''}
                                    onClick={() => handleDoctorSelect(doctor)}
                                >
                                    {doctor.firstname} {doctor.lastname}
                                </li>
                            ))}
                        </ul>
                    )}
                    {selectedDoctor && (
                        <div className="selected-doctor-info">
                            <h2>Selected Doctor:</h2>
                            <p>{selectedDoctor.firstname} {selectedDoctor.lastname}</p>
                            <p>Gender: {selectedDoctor.gender}</p>
                            <p>Date of Birth: {selectedDoctor.dob.split('T')[0]}</p>
                        </div>
                    )}
                </div>
                <div>
                    <label htmlFor="dropdownState">Select State Form:</label>
                    <select
                        id="dropdownState"
                        value={selectedState || ''}
                        onChange={handleStateChange}
                    >
                        <option value="" disabled>State</option>
                        <option value="CA">California</option>
                        <option value="NY">New York</option>
                    </select>
                </div>
                <button onClick={handleSaveToPDF}>Download PDF</button>
            </div>
        </div>
    );
};

export default Dropdowns;
