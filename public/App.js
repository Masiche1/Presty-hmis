
// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import PatientManagement from './components/PatientManagement';
import BillingManagement from './components/BillingManagement';
import LabManagement from './components/LabManagement';
import PharmacyManagement from './components/PharmacyManagement';
import EmployeeManagement from './components/EmployeeManagement';
import PriceListManagement from './components/PriceListManagement';
import EHRManagement from './components/EHRManagement';
import './App.css'; // Optional for custom styles

const App = () => {
    return (
        <Router>
            <nav>
                <ul>
                    <li><Link to="/">Dashboard</Link></li>
                    <li><Link to="/patients">Patient Management</Link></li>
                    <li><Link to="/billing">Billing Management</Link></li>
                    <li><Link to="/lab">Lab Management</Link></li>
                    <li><Link to="/pharmacy">Pharmacy Management</Link></li>
                    <li><Link to="/employees">Employee Management</Link></li>
                    <li><Link to="/price-list">Price List Management</Link></li>
                    <li><Link to="/ehr">EHR Management</Link></li>
                </ul>
            </nav>
            <Switch>
                <Route path="/" exact component={Dashboard} />
                <Route path="/patients" component={PatientManagement} />
                <Route path="/billing" component={BillingManagement} />
                <Route path="/lab" component={LabManagement} />
                <Route path="/pharmacy" component={PharmacyManagement} />
                <Route path="/employees" component={EmployeeManagement} />
                <Route path="/price-list" component={PriceListManagement} />
                <Route path="/ehr" component={EHRManagement} />
            </Switch>
        </Router>
    );
};

export default App;
