import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ManageEmployee.css'; // Include the updated CSS
import { FaTrash, FaPenFancy } from 'react-icons/fa';

const ManageEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState('');
  const [editingEmployee, setEditingEmployee] = useState(null);
  const Admintoken = localStorage.getItem('Admintoken');
  const employeePositions = [
    'AssistantManager',
    'SeniorOfficer',
    'JuniorOfficer',
    'Teller',
    'CustomerServiceRepresentative',
    'LoanOfficer',
  ];

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('https://localhost:7135/api/account/Employees',{
          headers: { Authorization: `Bearer ${Admintoken}` },
        });
        const data = await response.json();
        if (data.$values && Array.isArray(data.$values)) {
          setEmployees(data.$values);
          setFilteredEmployees(data.$values);
        } else {
          console.error('Fetched data $values is not an array:', data.$values);
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
  }, []);

  useEffect(() => {
    setFilteredEmployees(
      employees.filter(employee => {
        const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
        const idMatch = employee.employeeId.toString().includes(searchTerm);
        const nameMatch = fullName.includes(searchTerm.toLowerCase());
        return (
          (idMatch || nameMatch) &&
          (!positionFilter || employee.position.toLowerCase() === positionFilter.toLowerCase())
        );
      })
    );
  }, [searchTerm, positionFilter, employees]);

  const handleDeleteEmployee = async (employeeId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this employee?");
    if (!confirmDelete) return;

    try {
      const response = await axios.put(
        `https://localhost:7135/api/account/deactivate-account/${employeeId}`,
        {}, // Empty body since no additional data is required
        {
          headers: {
            Authorization: `Bearer ${Admintoken}`,
          },
        }
      );
            if (response.status === 200) {
        setEmployees(employees.filter(emp => emp.employeeId !== employeeId));
        setFilteredEmployees(filteredEmployees.filter(emp => emp.employeeId !== employeeId));
        alert("Employee deleted successfully");
      } else {
        console.error('Delete failed:', response);
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  const handleUpdateEmployee = async () => {
    try {
      if (!editingEmployee || !editingEmployee.employeeId) {
        throw new Error("Employee ID is missing");
      }

      const updatedEmployee = {
        employeeId: editingEmployee.employeeId,
        firstName: editingEmployee.firstName,
        lastName: editingEmployee.lastName,
        gender:editingEmployee.gender,
        email: editingEmployee.email,
        phoneNumber: editingEmployee.phoneNumber,
        position: editingEmployee.position,
        password: editingEmployee.password,
        createdAt: editingEmployee.createdAt
      };

      const response = await axios.put(`https://localhost:7135/api/account/Employees/${editingEmployee.employeeId}`, updatedEmployee, {
        headers: {
          'accept': 'text/plain',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Admintoken}`
         },
      });

      if (response.status === 200) {
        const updatedList = employees.map(emp =>
          emp.employeeId === editingEmployee.employeeId ? updatedEmployee : emp
        );
        setEmployees(updatedList);
        setFilteredEmployees(updatedList);
        setEditingEmployee(null);
        alert("Employee updated successfully");
      } else {
        console.error('Update failed:', response);
      }
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

  const handleEditClick = (employee) => {
    setEditingEmployee(employee);
  };

  return (
    <main className='main-content'>
      <div className="employee-container">
        <div className='fixed-header12'>
          <h2 className='heading'>MANAGE EMPLOYEES</h2>
        </div>
        <div className="search-filter-container12">
          <input
            type="text"
            className="search-input"
            placeholder="Search by Employee ID or Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="empdropdown"
            value={positionFilter}
            onChange={(e) => setPositionFilter(e.target.value)}
          >
            <option value="">All Designations</option>
            {employeePositions.map((position, index) => (
              <option key={index} value={position}>
                {position}
              </option>
            ))}
          </select>
        </div>

        {Array.isArray(filteredEmployees) && filteredEmployees.map((employee) => (
          <div key={employee.employeeId} className="employee-row">
            <div className="main-details">
              <div className="manageemp-btn">
                <button className="manageemp-btn1" onClick={() => handleEditClick(employee)}>
                  <FaPenFancy />
                </button>
                <button className="manageemp-btn2" onClick={() => handleDeleteEmployee(employee.employeeId)}>
                  <FaTrash />
                </button>
              </div>
              {editingEmployee && editingEmployee.employeeId === employee.employeeId ? (
                <div className="editable-fields">
                  <input type="text" value={editingEmployee.firstName} onChange={(e) => setEditingEmployee({ ...editingEmployee, firstName: e.target.value })} />
                  <input type="text" value={editingEmployee.lastName} onChange={(e) => setEditingEmployee({ ...editingEmployee, lastName: e.target.value })} />
                  <input type="text" value={editingEmployee.gender} onChange={(e) => setEditingEmployee({ ...editingEmployee, gender: e.target.value })} />
                  <input type="text" value={editingEmployee.email} onChange={(e) => setEditingEmployee({ ...editingEmployee, email: e.target.value })} />
                  <input type="text" value={editingEmployee.phoneNumber} onChange={(e) => setEditingEmployee({ ...editingEmployee, phoneNumber: e.target.value })} />
                  <input type="text" value={editingEmployee.position} onChange={(e) => setEditingEmployee({ ...editingEmployee, position: e.target.value })} />
                  <button onClick={handleUpdateEmployee}>Save Changes</button>
                </div>
              ) : (
                <div className="employee-passbook-details">
                  <span className="employee-id"><strong>Employee ID:</strong> {employee.employeeId}</span>
                  <span className="employee-name"><strong>Full Name:</strong> {employee.firstName} {employee.lastName}</span>
                  <span className="employee-gender"><strong>Gender:</strong> {employee.gender} </span>
                  <span className="employee-position"><strong>Position:</strong> {employee.position}</span>
                  <span className="employee-email"><strong>Email:</strong> {employee.email}</span>
                  <span className="employee-phone"><strong>Phone:</strong> {employee.phoneNumber}</span>
                  <span className="employee-created"><strong>Joined On:</strong> {new Date(employee.createdAt).toLocaleDateString()}</span>
                  <span className="employee-created"><strong>Status:</strong> {employee.status}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default ManageEmployees;
