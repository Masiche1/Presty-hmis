import React, { useState, useEffect } from 'react';
import api from '../services/api';

const LabManagement = () => {
    const [tests, setTests] = useState([]);
    const [patientId, setPatientId] = useState('');
    const [testName, setTestName] = useState('');

    useEffect(() => {
        const fetchTests = async () => {
            const response = await api.get('/lab');
            setTests(response.data);
        };
        fetchTests();
    }, []);

    const handleAddTest = async () => {
        await api.post('/lab', { patientId, testName });
        setTestName('');
        // Refresh test list
        fetchTests();
    };

    return (
        <div>
            <h2>Lab Test Management</h2>
            <input value={patientId} onChange={(e) => setPatientId(e.target.value)} placeholder="Patient ID" />
            <input value={testName} onChange={(e) => setTestName(e.target.value)} placeholder="Test Name" />
            <button onClick={handleAddTest}>Add Test</button>
            <h3>Lab Tests</h3>
            <ul>
                {tests.map(test => (
                    <li key={test._id}>{test.patientId.name}: {test.testName} - {test.status}</li>
                ))}
            </ul>
        </div>
    );
};

export default LabManagement;
