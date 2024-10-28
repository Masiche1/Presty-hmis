import React, { useState, useEffect } from 'react';
import api from '../services/api';

const EHRManagement = ({ patientId }) => {
    const [ehr, setEHR] = useState({ medicalHistory: '', medications: [] });
    const [medication, setMedication] = useState({ name: '', dosage: '' });

    useEffect(() => {
        const fetchEHR = async () => {
            const response = await api.get(`/ehr/${patientId}`);
            setEHR(response.data || { medicalHistory: '', medications: [] });
        };
        fetchEHR();
    }, [patientId]);

    const handleAddMedication = () => {
        setEHR(prev => ({
            ...prev,
            medications: [...prev.medications, medication]
        }));
        setMedication({ name: '', dosage: '' });
    };

    const handleSaveEHR = async () => {
        await api.post('/ehr', { patientId, medicalHistory: ehr.medicalHistory, medications: ehr.medications });
        // Optionally show a success message or reload EHR data
    };

    return (
        <div>
            <h2>EHR Management for Patient {patientId}</h2>
            <textarea 
                value={ehr.medicalHistory}
                onChange={(e) => setEHR({ ...ehr, medicalHistory: e.target.value })}
                placeholder="Medical History"
            />
            <div>
                <input 
                    value={
