import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/EmployeeNavbar/Navbar';
import Dashboard from './components/Dashboard/Dashboard';
import ManageAccounts from './components/ManageAccounts/ManageAccounts';
import ManageLoans from './components/ManageLoans/ManageLoans';
import Transactions from './components/Transactions/Transactions';
import Reports from './components/Reports/Reports';
import DeactivationRequests from './components/DeactivationRequests/DeactivationRequests';
import Login from './components/Login/Login'; 
import ManageEmployee from './admincomponents/ManageEmployee/ManageEmployee';
import AddEmployee from './admincomponents/AddEmployee/AddEmployee';
import ManageCustomer from './admincomponents/ManageCustomer/ManageCustomer';
import AdminLogin from './admincomponents/AdminLogin/AdminLogin';

import AdminNavbar from './admincomponents/AdminNavbar/AdminNavbar';
import AdminDashboard from './admincomponents/AdminDashboard/AdminDashboard';
import './App.css';

// Check if employee is logged in
const isEmployeeLoggedIn = () => !!localStorage.getItem('token');

// Check if admin is logged in
const isAdminLoggedIn = () => !!localStorage.getItem('Admintoken');

// Layout component for rendering Navbar based on route and authentication
const Layout = ({ isAuthenticated, isAdmin, setIsAuthenticated, setIsAdmin }) => {
  const location = useLocation();

  // Admin route detection
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/admin-dashboard') || location.pathname.startsWith('/manage-employee') || location.pathname.startsWith('/add-employee') || location.pathname.startsWith('/manage-customer');

  // Employee route detection
  const isEmployeeRoute = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/manage-accounts') || location.pathname.startsWith('/manage-loans') || location.pathname.startsWith('/deactivation-requests') || location.pathname.startsWith('/transactions') || location.pathname.startsWith('/reports');

  return (
    <>
      {/* Conditionally render Navbar based on employee or admin routes */}
      {isEmployeeRoute && isAuthenticated && <Navbar setIsAuthenticated={setIsAuthenticated} />}
      {isAdminRoute && isAdmin && <AdminNavbar setIsAdmin={setIsAdmin} />}
    </>
  );
};

const App = () => {
  // State for storing authentication status
  const [isAuthenticated, setIsAuthenticated] = useState(isEmployeeLoggedIn());
  const [isAdmin, setIsAdmin] = useState(isAdminLoggedIn());

  // Use effect to update the authentication state based on tokens in localStorage
  useEffect(() => {
    const employeeToken = localStorage.getItem('token');
    const adminToken = localStorage.getItem('Admintoken');

    // Update the state only if the token exists
    if (employeeToken) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }

    if (adminToken) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, []);

  return (
    <Router>
      <Layout
        isAuthenticated={isAuthenticated}
        isAdmin={isAdmin}
        setIsAuthenticated={setIsAuthenticated}
        setIsAdmin={setIsAdmin}
      />

      <Routes>
        {/* Employee Routes */}
        <Route path="/" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/manage-accounts" element={isAuthenticated ? <ManageAccounts /> : <Navigate to="/" />} />
        <Route path="/manage-loans" element={isAuthenticated ? <ManageLoans /> : <Navigate to="/" />} />
        <Route path="/deactivation-requests" element={isAuthenticated ? <DeactivationRequests /> : <Navigate to="/" />} />
        <Route path="/transactions" element={isAuthenticated ? <Transactions /> : <Navigate to="/" />} />
        <Route path="/reports" element={isAuthenticated ? <Reports /> : <Navigate to="/" />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLogin setIsAdmin={setIsAdmin} />} />
        <Route path="/admin-dashboard" element={isAdmin ? <AdminDashboard /> : <Navigate to="/admin" />} />
        <Route path="/manage-employee" element={isAdmin ? <ManageEmployee /> : <Navigate to="/admin" />} />
        <Route path="/add-employee" element={isAdmin ? <AddEmployee /> : <Navigate to="/admin" />} />
        <Route path="/manage-customer" element={isAdmin ? <ManageCustomer /> : <Navigate to="/admin" />} />
      </Routes>
    </Router>
  );
};

export default App;
