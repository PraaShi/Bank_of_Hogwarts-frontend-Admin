import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginForm.css'; // Assuming the same CSS styling
import { FaUser, FaLock } from "react-icons/fa";

function AdminLoginForm({ setIsAuthenticated }) {
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
      userType: "Employee",
    };

    const apiUrl = 'https://localhost:7135/api/Auth/login';

    try {
      // API call for login
      const response = await axios.post(apiUrl, data);
      console.log(response.data, 'resssponsss')
      const status = response.data.status;

      if (status === 'Closed') {
        setError('Your account has been closed. Please contact support.');
        return; // Stop execution if account is closed
      }

      if (response.status === 200) {
        const token = response.data.token;
        const employeeId = response.data.employeeId;

        // Store token in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('employeeId', employeeId);

        setIsAuthenticated(true);
        navigate('/dashboard');

        // Clear input fields after login
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
    <div className="login-container1">
      <div className="login-box1">
        <h2>Employee Login</h2>
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
