import React, { useState, useEffect } from 'react';
import api from '../services/api';

const InpatientManagement = () => {
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState('');
    const [ward, setWard] = useState('');

    useEffect(() => {
        const fetchPatients = async () => {
            const response = await api.get('/patients'); // Assuming you have a patient route
            setPatients(response.data);
        };
        fetchPatients();
    }, []);

    const handleAdmitPatient = async () => {
        await api.post('/inpatients', { patientId: selectedPatient, ward });
        setWard('');
        setSelectedPatient('');
        // Optionally, refresh the inpatient list here
    };

    return (
        <div>
            <h2>Inpatient Management</h2>
            <select onChange={(e) => setSelectedPatient(e.target.value)} value={selectedPatient}>
                <option value="">Select Patient</option>
                {patients.map(patient => (
                    <option key={patient._id} value={patient._id}>{patient.name}</option>
                ))}
            </select>
            <input value={ward} onChange={(e) => setWard(e.target.value)} placeholder="Ward" />
            <button onClick={handleAdmitPatient}>Admit Patient</button>
            {/* Optionally display admitted patients here */}
        </div>
    );
};

export default InpatientManagement;
