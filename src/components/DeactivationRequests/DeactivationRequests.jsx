import React, { useState, useEffect } from 'react';
import './Deactivate.css'; // Importing the new CSS file

const ManageDeactivation = () => {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [accountDetails, setAccountDetails] = useState(null);
    const [selectedAccountId, setSelectedAccountId] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
              if (!token) {
                throw new Error("No token found");
              }
                const response = await fetch('https://localhost:7135/api/Employee/accounts-by-status?status=onHold',{
                  headers: { Authorization: `Bearer ${token}` },
                }); // Adjust API path
                const data = await response.json();
                console.log('Fetched data:', data);
    
                // Ensure the data is set correctly from "$values"
                setAccounts(data.$values || []); // Use $values from the response to set the accounts array
    
                setLoading(false);
            } catch (error) {
                console.error('Error fetching accounts:', error);
                setLoading(false);
            }
        };
    
        fetchAccounts();
    }, []);
    
    // Handle approve action with double-check confirmation
const handleApprove = async (accountId) => {
    const confirmAction = window.confirm("Are you sure you want to approve this account deactivation?");
    
    if (confirmAction) {
        try {
            const response = await fetch(`https://localhost:7135/api/Employee/${accountId}/deactivate?isApproved=true`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                headers: { Authorization: `Bearer ${token}` },
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
const fetchAccountDetails = async (accountId) => {
    try {
      const response = await fetch(`https://localhost:7135/api/accountActions/${accountId}/getAccountDetails`);
      const data = await response.json();
      setAccountDetails(data);
    } catch (error) {
      console.error(`Error fetching account details for accountId ${accountId}:`, error);
    }
  };

  const toggleProfileView = (accountId) => {
    if (selectedAccountId === accountId) {
      setSelectedAccountId(null);
      setAccountDetails(null);
    } else {
      setSelectedAccountId(accountId);
      fetchAccountDetails(accountId);
    }
  };


// Handle reject action with double-check confirmation
const handleReject = async (accountId) => {
    const confirmAction = window.confirm("Are you sure you want to reject this deactivation request?");
    
    if (confirmAction) {
        try {
            const response = await fetch(`https://localhost:7135/api/Employee/${accountId}/deactivate?isApproved=false`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                headers: { Authorization: `Bearer ${token}` },
                body: JSON.stringify({ 
                    deactivate: false, 
                    reject: true 
                }),
            });

            if (response.ok) {
                setAccounts(accounts.filter(account => account.accountId !== accountId)); // Update state
                alert('Deactivation request rejected successfully!');
            } else {
                alert('Failed to reject the deactivation request.');
            }
        } catch (error) {
            console.error('Error during rejection:', error);
            alert('Error occurred. Please try again.');
        }
    } else {
        alert("Rejection cancelled.");
    }
};

    
    if (loading) {
        return <div>Loading...</div>; // Display loading while fetching data
    }

    return (
        <main className='main-content'>
            <div className="deactivation-account-container">
                <h2 className='dheading'>DEACTIVATION REQUESTS</h2>
                {accounts.length === 0 ? (
                    <p className='msg'>No deactivation requests found.</p>
                ) : (
                    accounts.map((account) => (
                        <div key={account.accountId} className="account-row">
                             <div className="main-details">
                <span className="account-id"><strong>Account ID:</strong> {account.accountId}</span>
                <span className="account-number"><strong>Account Number:</strong> {account.accountNumber || 'N/A'}</span>
                <span className="account-number"><strong>Applied Date:</strong> {account.createdAt ? new Date(account.createdAt).toLocaleDateString() : 'N/A'}</span>
                <span className="account-number"><strong>Status:</strong> {account.status || 'N/A'}</span>
                <button className="button view-profile" onClick={() => toggleProfileView(account.accountId)}>
                  {selectedAccountId === account.accountId ? 'Hide Profile' : 'View Profile'}
                  <span className="dropdown-arrow">{selectedAccountId === account.accountId ? '▲' : '▼'}</span>
                </button>
              </div>
              {selectedAccountId === account.accountId && accountDetails && (
                <div className="profile-details">
                 
                <div className="passbook-header">{accountDetails.customer ? `${accountDetails.customer.firstName} ${accountDetails.customer.middleName} ${accountDetails.customer.lastName}` : 'N/A'}'s Profile</div>
                <div className="passbook-content">
                  <div className="profile-row">
                    <span className="profile-field">
                      <strong>Customer ID:</strong> {accountDetails.customer ? accountDetails.customer.customerId : 'N/A'}
                    </span>
                    <span className="profile-field">
                      <strong>Account Number:</strong> {accountDetails.accountNumber || 'N/A'}
                    </span>
                  </div>
                  <div className="profile-row">
                    <span className="profile-field">
                      <strong>Created On:</strong> {new Date(accountDetails.createdAt).toLocaleDateString()}
                    </span>
                    <span className="profile-field">
                      <strong>Email:</strong> {accountDetails.customer ? accountDetails.customer.email : 'N/A'}
                    </span>
                  </div>
                  <div className="profile-row">
                    <span className="profile-field">
                      <strong>Full Name:</strong> {accountDetails.customer ? `${accountDetails.customer.firstName} ${accountDetails.customer.middleName} ${accountDetails.customer.lastName}` : 'N/A'}
                    </span>
                    <span className="profile-field">
                      <strong>Date of Birth:</strong> {accountDetails.customer ? accountDetails.customer.dateOfBirth : 'N/A'}
                    </span>
                  </div>
                  <div className="profile-row">
                    <span className="profile-field">
                      <strong>Gender:</strong> {accountDetails.customer ? accountDetails.customer.gender : 'N/A'}
                    </span>
                    <span className="profile-field">
                      <strong>Contact:</strong> {accountDetails.customer ? accountDetails.customer.contactNumber : 'N/A'}
                    </span>
                  </div>
                  <div className="profile-row">
                    <span className="profile-field">
                      <strong>Aadhar:</strong> {accountDetails.customer ? accountDetails.customer.aadharNumber : 'N/A'}
                    </span>
                    <span className="profile-field">
                      <strong>PAN:</strong> {accountDetails.customer ? accountDetails.customer.pan : 'N/A'}
                    </span>
                  </div>
                  <div className="profile-row">
                    <span className="profile-field">
                      <strong>Address:</strong> {accountDetails.customer ? accountDetails.customer.address : 'N/A'}
                    </span>
                  </div>
                </div>
                              
                </div>
              )}
                            <div className="action-buttons">
                                <button
                                    className="button approve"
                                    onClick={() => handleApprove(account.accountId)}
                                >
                                    Deactivate
                                </button>
                                <button
                                    className="button reject"
                                    onClick={() => handleReject(account.accountId)}
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </main>
    );
};

export default ManageDeactivation;
