import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminLogin.css'; // Assuming the same CSS styling
import { FaUser, FaLock } from "react-icons/fa";

function AdminLoginForm({ setIsAdmin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Handle form submission (login logic)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      email: email,
      password: password,
      userType: "Admin", // User type for Admin login
    };

    const apiUrl = 'https://localhost:7135/api/Auth/login';

    try {
      // API call for login
      const response = await axios.post(apiUrl, data);
    

     
      if (response.status === 200) {
        const Admintoken = response.data.Admintoken;
       

        // Store token in localStorage
        localStorage.setItem('Admintoken', Admintoken);
 

        setIsAdmin(true);
        navigate('/admin-dashboard');

        // Clear input fields after login
        setEmail('');
        setPassword('');
        setError('');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response && error.response.status === 401) {
        setError('Invalid email or password. Please try again.');
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Admin Login</h2>
        <form onSubmit={handleSubmit}>
          {error && <p className="error">{error}</p>} {/* Display error if any */}
          <div className="input-group">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
            <FaUser className='icon1' />
          </div>
          <div className="input-group">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <FaLock className='icon1' />
          </div>
          <button type="submit" className="login-btn">Login</button>
        </form>
      </div>
    </div>
  );
}

export default AdminLoginForm;
