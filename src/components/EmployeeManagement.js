import React, { useState, useEffect } from 'react';
import api from '../services/api';

const EmployeeManagement = () => {
    const [employees, setEmployees] = useState([]);
    const [name, setName] = useState('');
    const [position, setPosition] = useState('');
    const [salary, setSalary] = useState('');

    useEffect(() => {
        const fetchEmployees = async () => {
            const response = await api.get('/employees');
            setEmployees(response.data);
        };
        fetchEmployees();
    }, []);

    const handleAddEmployee = async () => {
        await api.post('/employees', { name, position, salary });
        setName('');
        setPosition('');
        setSalary('');
        // Refresh employee list
        fetchEmployees();
    };

    return (
        <div>
            <h2>Employee Management</h2>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
            <input value={position} onChange={(e) => setPosition(e.target.value)} placeholder="Position" />
            <input value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="Salary" />
            <button onClick={handleAddEmployee}>Add Employee</button>
            <h3>Employees</h3>
            <ul>
                {employees.map(emp => (
                    <li key={emp._id}>{emp.name} - {emp.position} - ${emp.salary}</li>
                ))}
            </ul>
        </div>
    );
};

export default EmployeeManagement;
