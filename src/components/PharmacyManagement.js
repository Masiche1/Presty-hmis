import React, { useState, useEffect } from 'react';
import api from '../services/api';

const PharmacyManagement = () => {
    const [medications, setMedications] = useState([]);
    const [name, setName] = useState('');
    const [stock, setStock] = useState('');
    const [price, setPrice] = useState('');

    useEffect(() => {
        const fetchMedications = async () => {
            const response = await api.get('/pharmacy');
            setMedications(response.data);
        };
        fetchMedications();
    }, []);

    const handleAddMedication = async () => {
        await api.post('/pharmacy', { name, stock, price });
        setName('');
        setStock('');
        setPrice('');
        // Refresh medication list
        fetchMedications();
    };

    return (
        <div>
            <h2>Pharmacy Management</h2>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Medication Name" />
            <input value={stock} onChange={(e) => setStock(e.target.value)} placeholder="Stock" />
            <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" />
            <button onClick={handleAddMedication}>Add Medication</button>
            <h3>Medications</h3>
            <ul>
                {medications.map(med => (
                    <li key={med._id}>{med.name}: {med.stock} in stock - ${med.price}</li>
                ))}
            </ul>
        </div>
    );
};

export default PharmacyManagement;
