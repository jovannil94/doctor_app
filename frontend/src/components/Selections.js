import React, { useEffect, useState } from 'react';
import { getAPI } from '../util/getAPI';
import axios from 'axios';
import jsPDF from 'jspdf';

const Dropdowns = () => {
    const [allDoctors, setAllDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedState, setSelectedState] = useState(null);

    useEffect(() => {
        const API = getAPI();
        const fetchDoctors = async () => {
            try {
                let res = await axios.get(`${API}/doctors`);
                setAllDoctors(res.data.payload);
            } catch (error) {
                console.log(error);
            }
        }
        fetchDoctors();
      }, []);
    
    const handleDoctorChange = (e) => {
        setSelectedDoctor(e.target.value);
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
                "Date of Birth (mm/dd/yyyy)": () => `${doctor.dob.month}/${doctor.dob.day}/${doctor.dob.year}`
            },
            CA: {
                "Full Name": () => `${doctor.firstname} ${doctor.lastname}`,
                "Gender": () => doctor.gender,
                "Date of Birth (yyyy-mm-dd)": () => `${doctor.dob.year}-${doctor.dob.month}-${doctor.dob.day}`
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
                const res = await axios.get(`${API}/doctors/${selectedDoctor}`);
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
        <div>
            <h1>Doctor PDF Form App</h1>
            <div>
                <label htmlFor="dropdownDoctor">Select Doctor:</label>
                <select
                    id="dropdownDoctor"
                    value={selectedDoctor || ''}
                    onChange={handleDoctorChange}
                >
                    <option value="" disabled>Select a doctor</option>
                    {allDoctors.map((doctor) => (
                        <option key={doctor.id} value={doctor.id}>
                            {doctor.firstname} {doctor.lastname}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="dropdownState">Select State:</label>
                <select
                    id="dropdownState"
                    value={selectedState || ''}
                    onChange={handleStateChange}
                >
                    <option value="" disabled>Select a state</option>
                    <option value="CA">California</option>
                    <option value="NY">New York</option>
                </select>
            </div>
            <button onClick={handleSaveToPDF}>Save to PDF</button>
        </div>
    );
};

export default Dropdowns;
