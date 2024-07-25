import React, { useEffect, useState } from 'react';
import { getAPI } from '../util/getAPI';
import axios from 'axios';
import { PDFDocument } from 'pdf-lib';
import '../css/Selection.css';

const Dropdowns = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [matchingDoctors, setMatchingDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedState, setSelectedState] = useState(null);

    const stateFormMap = {
        NY: {
            "dhFormfield-2749128176": (doctor) => doctor.firstname,
            "dhFormfield-2749128805": (doctor) => doctor.lastname,
            "dhFormfield-2749128809": (doctor) => doctor.gender,
            "dhFormfield-2749129177": (doctor) => {
                const date = new Date(doctor.dob);
                return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
            }
        },
        CA: {
            "dhFormfield-2749127007": (doctor) => `${doctor.firstname} ${doctor.lastname}`,
            /*
            dhFormfield-2749127036 Male check box
            FdhFormfield-2749127702 Female check box
            */
            "dhFormfield-2749127036": (doctor) => doctor.gender,
            "dhFormfield-2749127704": (doctor) => {
                const date = new Date(doctor.dob);
                return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
            }
        }
    };

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
            };
            fetchMatchingDoctors();
        } else {
            setMatchingDoctors([]);
        }
    }, [searchQuery]);

    const handleDoctorSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setSelectedDoctor(null);
    };

    const handleDoctorSelect = (doctor) => {
        setSelectedDoctor(doctor);
    };

    const handleStateChange = (e) => {
        setSelectedState(e.target.value);
    };

    const fillPdfForm = async (doctor, state) => {
        const url = `../formTemplates/${state}.pdf`;
        const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer());
    
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        const form = pdfDoc.getForm();
    
        const stateForm = stateFormMap[state];
        if (!stateForm) {
            throw new Error(`No form found for state: ${state}`);
        }
    
        for (const [fieldName, getValue] of Object.entries(stateForm)) {
            const field = form.getTextField(fieldName);
            if (field) {
                field.setText(getValue(doctor));
            }
        }
    
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${state}-${doctor.firstname}-${doctor.lastname}.pdf`;
        link.click();
    };    

    const handleSaveToPDF = async () => {
        const API = getAPI();
        if (selectedDoctor && selectedState) {
            try {
                const res = await axios.get(`${API}/doctors/${selectedDoctor.id}`);
                const doctorDetails = res.data.payload;
                await fillPdfForm(doctorDetails, selectedState);
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
                            <p>Date of Birth: {new Date(selectedDoctor.dob).toLocaleDateString()}</p>
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
                        <option value="" disabled>Select a state</option>
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
