import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ManageCustomer.css';
import { FaPen,FaSave, FaTrash } from 'react-icons/fa';

const ManageCustomers = () => {
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [accountTypeFilter, setAccountTypeFilter] = useState('');
  const [accountStatusFilter, setAccountStatusFilter] = useState(''); // New filter for account status
  const [editMode, setEditMode] = useState(false);
  const [updatedCustomerDetails, setUpdatedCustomerDetails] = useState({});
  const Admintoken=localStorage.getItem("Admintoken");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get('https://localhost:7135/api/account/Customers',{
          headers: { Authorization: `Bearer ${Admintoken}` },
        });
        setCustomers(response.data.$values);
      } catch (error) {
        console.error('Error fetching customers:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  useEffect(() => {
    const fetchAccounts = async () => {
      if (selectedCustomer) {
        setAccounts([]); // Clear previous accounts
        try {
          const response = await axios.get(`https://localhost:7135/api/Customer/${selectedCustomer.customerId}/getaccounts`,{
            headers: { Authorization: `Bearer ${Admintoken}` },
        });
          setAccounts(response.data.$values || []);
        } catch (error) {
          console.error('Error fetching accounts:', error);
        }
      }
    };
    fetchAccounts();
  }, [selectedCustomer]);

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
    setUpdatedCustomerDetails({ ...customer });
    setAccounts([]); // Clear accounts on customer change
  };

  const deactivateAccount = async (customerId) => {
    const confirmDeactivate = window.confirm('Are you sure you want to deactivate this account?');
    if (!confirmDeactivate) return;
  
    try {
      // Ensure `customerId` is passed as a string or number, not as an object
      if (typeof customerId === 'object') {
        console.error('Invalid customerId format:', customerId);
        return;
      }
  
      // Send the correct customerId to the API
      await axios.put(
        `https://localhost:7135/api/account/deactivate-customer/${customerId}`, 
        {}, // Empty body (if no additional data is required)
        {
          headers: {
            Authorization: `Bearer ${Admintoken}`,
          },
        }
      );
      
      setAccounts(prevAccounts => prevAccounts.filter(account => account.customerId !== customerId));
      alert('Account deactivated successfully.');
    } catch (error) {
      console.error('Error deactivating account:', error);
    }
  };
  
  
 const handleUpdateCustomer = async () => {
    const confirmUpdate = window.confirm('Are you sure you want to update the customer details?');
    if (!confirmUpdate) return;

    const { password, aadharNumber, pan, ...customerDataWithoutSensitiveInfo } = updatedCustomerDetails;

    try {
      await axios.put(`https://localhost:7135/api/account/updateCustomers/${selectedCustomer.customerId}`, {
        ...customerDataWithoutSensitiveInfo,
        aadharNumber,
        pan,
        password},{
          headers: { Authorization: `Bearer ${Admintoken}` },
        
      });
      setSelectedCustomer(updatedCustomerDetails);
      setEditMode(false);
      alert('Customer details updated successfully.');
    } catch (error) {
      console.error('Error updating customer details:', error);
    }
  };
  const deactivateCustomerAccount = async (accountId) => {
    const confirmAction = window.confirm("Are you sure you want to approve this account deactivation?");
    
    if (confirmAction) {
        try {
            const response = await fetch(`https://localhost:7135/api/Employee/${accountId}/deactivate ?isApproved=true`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    
                },
                headers: { Authorization: `Bearer ${Admintoken}` },
                body: JSON.stringify({ 
                    deactivate: true, 
                    reject: false 
                }),
            });

            if (response.ok) {
                setAccounts(accounts.filter(account => account.accountId !== accountId)); // Update state
                alert('Account deactivated successfully!');
            } else {
                alert('Failed to deactivate account.');
            }
        } catch (error) {
            console.error('Error during deactivation:', error);
            alert('Error occurred. Please try again.');
        }
    } else {
        alert("Deactivation cancelled.");
    }
};

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedCustomerDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  // Filter accounts based on status and type
  const filteredAccounts = accounts
    .filter(account => 
      (!accountTypeFilter || account.accountType === accountTypeFilter) &&
      (!accountStatusFilter || account.status === accountStatusFilter) // Apply status filter
    );

  const filteredCustomers = customers.filter(customer => 
    customer.customerId.toString().includes(searchTerm) || 
    `${customer.firstName} ${customer.middleName} ${customer.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="main-content">
      <div className="manage-customers">
        {loading ? (
          <p>Loading customers...</p>
        ) : (
          <>
            <h2 className="heading">MANAGE CUSTOMERS</h2>
             <div className='manage-cust'>
            <input
              type="text"
              placeholder="Search by Customer ID or Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-bar1"
            />
               {/* Filters for account status */}
             <div className="account-filters">
              <select value={accountStatusFilter} onChange={(e) => setAccountStatusFilter(e.target.value)} className="dropdown">
                <option value="">All Accounts</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Closed">Closed</option>
                <option value="PendingApproval">Pending Approval</option>
                <option value="OnHold">On Hold</option>
              </select>
            </div>
            </div>

            <ul className="customer-list">
              {filteredCustomers.map(customer => (
                <li key={customer.customerId} onClick={() => handleCustomerSelect(customer)} className="customer-item">
                  {customer.firstName} {customer.middleName} {customer.lastName} (ID: {customer.customerId})
                </li>
              ))}
            </ul>

            {selectedCustomer && (
              <div className="customer-details">
                <h2 className='sub-heading'>DETAILS</h2>
                <div className="passbook-style">
                  {editMode ? (
                    <FaSave className='save' onClick={handleUpdateCustomer}>Save Changes</FaSave>
                  ) : (
                    <FaPen  className='pen'onClick={() => setEditMode(true)}>Update</FaPen>
                  )}
                  <FaTrash 
        onClick={() => deactivateAccount(selectedCustomer.customerId)} 
        className="bin"
      >
        Deactivate
      </FaTrash>
                  
                  

                  {/* Render customer details */}
                  <div className="details-row">
                    
                    <span>Customer ID: {selectedCustomer.customerId}</span>
                    <span>Name: {editMode ? (
                      <>
                        <input
                          type="text"
                          name="firstName" className='edittext'
                          value={updatedCustomerDetails.firstName}
                          onChange={handleInputChange}
                        />
                        <input
                          type="text"
                          name="middleName" className='edittext'
                          value={updatedCustomerDetails.middleName}
                          onChange={handleInputChange}
                        />
                        <input
                          type="text"
                          name="lastName" className='edittext'
                          value={updatedCustomerDetails.lastName}
                          onChange={handleInputChange}
                        />
                      </>
                    ) : (
                      `${selectedCustomer.firstName} ${selectedCustomer.middleName} ${selectedCustomer.lastName}`
                    )}</span>
                  </div>
                  <div className="details-row">
                    <span>Gender: {editMode ? (
                      <input
                        type="text"
                        name="gender" className='edittext'
                        value={updatedCustomerDetails.gender}
                        onChange={handleInputChange}
                      />
                    ) : (
                      selectedCustomer.gender
                    )}</span>
                    <span>Contact: {editMode ? (
                      <input
                        type="text"
                        name="contactNumber" className='edittext'
                        value={updatedCustomerDetails.contactNumber}
                        onChange={handleInputChange}
                      />
                    ) : (
                      selectedCustomer.contactNumber
                    )}</span>
                  </div>
                  <div className="details-row">
                    <span>DOB: {editMode ? (
                      <input
                        type="date"
                        name="dateOfBirth" className='edittext'
                        value={updatedCustomerDetails.dateOfBirth.split('T')[0]}
                        onChange={handleInputChange}
                      />
                    ) : (
                      new Date(selectedCustomer.dateOfBirth).toLocaleDateString()
                    )}</span>
                    <span>Aadhar: {editMode ? (
                      <input
                        type="text"
                        name="aadharNumber" className='edittext'
                        value={updatedCustomerDetails.aadharNumber}
                        onChange={handleInputChange}
                      />
                    ) : (
                      selectedCustomer.aadharNumber
                    )}</span>
                  </div>
                  {/* Additional customer details */}
                  <div className="details-row">
                    <span>PAN: {editMode ? (
                      <input
                        type="text"
                        name="pan" className='edittext'
                        value={updatedCustomerDetails.pan}
                        onChange={handleInputChange}
                      />
                    ) : (
                      selectedCustomer.pan
                    )}</span>
                    <span>Email: {editMode ? (
                      <input
                        type="email"
                        name="email" className='edittext'
                        value={updatedCustomerDetails.email}
                        onChange={handleInputChange}
                      />
                    ) : (
                      selectedCustomer.email
                    )}</span>
                  </div>
                  <div className="details-row">
                    <span>Address: {editMode ? (
                      <input
                        type="text"
                        name="address" className='edittextaddress'
                        value={updatedCustomerDetails.address}
                        onChange={handleInputChange}
                      />
                    ) : (
                      selectedCustomer.address
                    )}</span>
                     <span>Status: {selectedCustomer.status}</span>
                  </div>
                 
                
                </div>
              </div>
            )}

         

            {selectedCustomer && filteredAccounts.length === 0 && <p className='sub-msg'>Account doesn't exist.</p>} {/* Display if no accounts */}
            
            {filteredAccounts.length > 0 && (
            <div>
                <h2 className='sub-heading'>ACCOUNTS</h2> 
                <div className="account-list">
                {filteredAccounts.map(account => (
                  <div key={account.accountId} className="account-card">
                    <span>ID: {account.accountId}</span>
                    <span>Acc No: {account.accountNumber}</span>
                    <p>{account.accountTypeId === 1 ? 'Savings' : account.accountTypeId === 2 ? 'Salary' : 'Business'}</p>
                    <span className={`account-status ${account.status}`}>{account.status}</span>
                    {account.status==='OnHold'?
                    <button onClick={() => deactivateCustomerAccount(account.accountId)} className="deactivate-account">Deactivate</button> :' '}
                  </div>
                ))}
              </div></div>
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default ManageCustomers;
