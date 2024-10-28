import React, { useState, useEffect } from 'react';
import api from '../services/api';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await api.get('/users');
            setUsers(response.data);
        };
        fetchUsers();
    }, []);

    const handleAddUser = async () => {
        await api.post('/users', { username, password });
        setUsername('');
        setPassword('');
        // Re-fetch users
        fetchUsers();
    };

    return (
        <div>
            <h2>User Management</h2>
            <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            <button onClick={handleAddUser}>Add User</button>
            <ul>
                {users.map(user => (
                    <li key={user._id}>{user.username}</li>
                ))}
            </ul>
        </div>
    );
};

export default UserManagement;
