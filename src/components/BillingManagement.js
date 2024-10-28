import React, { useState, useEffect } from 'react';
import api from '../services/api';

const BillingManagement = () => {
    const [invoices, setInvoices] = useState([]);
    const [patientId, setPatientId] = useState('');
    const [amount, setAmount] = useState('');

    useEffect(() => {
        const fetchInvoices = async () => {
            const response = await api.get('/billing');
            setInvoices(response.data);
        };
        fetchInvoices();
    }, []);

    const handleCreateInvoice = async () => {
        await api.post('/billing', { patientId, amount });
        setPatientId('');
        setAmount('');
        // Refresh invoices list
        fetchInvoices();
    };

    return (
        <div>
            <h2>Billing Management</h2>
            <input value={patientId} onChange={(e) => setPatientId(e.target.value)} placeholder="Patient ID" />
            <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />
            <button onClick={handleCreateInvoice}>Create Invoice</button>
            <h3>Invoices</h3>
            <ul>
                {invoices.map(invoice => (
                    <li key={invoice._id}>{invoice.patientId.name}: {invoice.amount} - {invoice.paymentStatus}</li>
                ))}
            </ul>
        </div>
    );
};

export default BillingManagement;
