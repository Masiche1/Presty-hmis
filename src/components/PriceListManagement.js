import React, { useState, useEffect } from 'react';
import api from '../services/api';

const PriceListManagement = () => {
    const [priceItems, setPriceItems] = useState([]);
    const [category, setCategory] = useState('');
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');

    useEffect(() => {
        const fetchPrices = async () => {
            const response = await api.get('/price-list');
            setPriceItems(response.data);
        };
        fetchPrices();
    }, []);

    const handleAddPriceItem = async () => {
        await api.post('/price-list', { category, name, price });
        setCategory('');
        setName('');
        setPrice('');
        // Refresh price list
        fetchPrices();
    };

    return (
        <div>
            <h2>Price List Management</h2>
            <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" />
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Service/Medication Name" />
            <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" />
            <button onClick={handleAddPriceItem}>Add Price Item</button>
            <h3>Price List</h3>
            <ul>
                {priceItems.map(item => (
                    <li key={item._id}>{item.category} - {item.name}: ${item.price}</li>
                ))}
            </ul>
        </div>
    );
};

export default PriceListManagement;
