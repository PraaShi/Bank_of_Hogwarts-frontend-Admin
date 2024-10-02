import React, { useState } from 'react';
import axios from 'axios';
import './AddEmployee.css'; // Assuming you want to style the form with classy elements

const AddEmployee = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState(''); // Dropdown for gender
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [position, setPosition] = useState('AssistantManager'); // Default to first option
  const [password, setPassword] = useState('');
  const Admintoken = localStorage.getItem('Admintoken');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Confirmation alert before submission
    const confirmOnboard = window.confirm('Are you sure you want to onboard this employee?');
    if (!confirmOnboard) {
      return; // If the user cancels, do not proceed with submission
    }

    const employeeData = {
      employeeId: 0, // Automatically generated on backend
      firstName,
      lastName,
      gender,
      email,
      phoneNumber,
      position,
      password,
      status: 'Active', // Fixed status as per API format
      createdAt: new Date().toISOString(), // Ensure the correct format
    };

    try {
      const response = await axios.post(
        'https://localhost:7135/api/account/Employees', // Correct API endpoint
        employeeData,
        {
          headers: {
            'accept': 'application/json', // Ensure correct content-type
            'Content-Type': 'application/json',
            Authorization: `Bearer ${Admintoken}`, // Properly include the Authorization header
          }
        }
      );

      if (response.status === 200 || response.status === 201) { // Handle success
        alert('Employee added successfully!');
        // Reset form fields
        setFirstName('');
        setLastName('');
        setGender(''); // Reset gender
        setEmail('');
        setPhoneNumber('');
        setPosition('AssistantManager');
        setPassword('');
      }
    } catch (error) {
      console.error('Error adding employee:', error);
      alert('Failed to add employee. Please try again.');
    }
  };

  return (
    <main className='main-content'>
      <div className="add-employee-container">
        <h2 className="form-header">ONBOARD EMPLOYEE</h2>
        <form onSubmit={handleSubmit} className="add-employee-form">
          <div className="form-group">
            <input
              type="text"
              id="firstName"
              value={firstName} 
              placeholder='First Name'
              onChange={(e) => setFirstName(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              id="lastName"
              value={lastName} 
              placeholder='Last Name'
              onChange={(e) => setLastName(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="form-input"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <input
              type="email"
              id="email" 
              value={email} 
              placeholder='Email'
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              id="phoneNumber" 
              value={phoneNumber} 
              placeholder='Phone Number'
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <select
              id="position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="form-input"
              required
            >
              <option value="AssistantManager">Assistant Manager</option>
              <option value="SeniorOfficer">Senior Officer</option>
              <option value="JuniorOfficer">Junior Officer</option>
              <option value="Teller">Teller</option>
              <option value="CustomerServiceRepresentative">Customer Service Representative</option>
              <option value="LoanOfficer">Loan Officer</option>
            </select>
          </div>

          <div className="form-group">
            <input
              type="password"
              id="password"
              value={password} 
              placeholder='Password'
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <button type="submit" className="submit-btn">Onboard Employee</button>
        </form>
      </div>
    </main>
  );
};

export default AddEmployee;
