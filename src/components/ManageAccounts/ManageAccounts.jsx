import React, { useEffect, useState } from 'react';
import './ManageAccounts.css';

const ManageAccounts = () => {
  const [activeTab, setActiveTab] = useState('AccountRequests');
  const token = localStorage.getItem('token');
  const [accounts, setAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [accountDetails, setAccountDetails] = useState(null);
  const [accountIdSearch, setAccountIdSearch] = useState('');

  // Fetch accounts based on the active tab
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const status = activeTab === 'AccountRequests' ? 'PendingApproval' : 'Active';
        const response = await fetch(`https://localhost:7135/api/Employee/accounts-by-status?status=${status}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        console.log('Fetched data:', data);

        if (data.$values && Array.isArray(data.$values)) {
          setAccounts(data.$values);
          setFilteredAccounts(data.$values);
        } else {
          console.error('Fetched data $values is not an array:', data.$values);
        }
      } catch (error) {
        console.error('Error fetching accounts:', error);
      }
    };

    fetchAccounts();
  }, [activeTab]);

  useEffect(() => {
    setFilteredAccounts(
      accounts.filter(account => {
        return (!accountIdSearch || account.accountId.toString() === accountIdSearch);
      })
    );
  }, [accountIdSearch, accounts]);

  const fetchAccountDetails = async (accountId) => {
    try {
      const response = await fetch(`https://localhost:7135/api/accountActions/${accountId}/getAccountDetails`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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

  const handleApprove = async (accountId) => {
    if (window.confirm('Are you sure you want to approve this account?')) {
      try {
        fetch(`https://localhost:7135/api/Employee/manage-account-request/${accountId}?isApproved=true`, { method: 'POST' ,
          headers: { Authorization: `Bearer ${token}` },
      });
        setFilteredAccounts(filteredAccounts.filter(account => account.accountId !== accountId));
        alert(`Account with ID ${accountId} approved successfully`);
      } catch (error) {
        console.error('Error approving account:', error);
      }
    }
  };

  const handleReject = async (accountId) => {
    if (window.confirm('Are you sure you want to reject this account?')) {
      try {
        await fetch(`https://localhost:7135/api/Employee/manage-account-request/${accountId}?isApproved=false`, { method: 'POST'   ,
          headers: { Authorization: `Bearer ${token}` },
        });
        setFilteredAccounts(filteredAccounts.filter(account => account.accountId !== accountId));
        alert(`Account with ID ${accountId} rejected successfully`);
      } catch (error) {
        console.error('Error rejecting account:', error);
      }
    }
  };

  return (
    <main className='main-content'>
      <div className="account-container">
        <div className='fixed-header1'>
        
        <button
          className={`tab-button ${activeTab === 'ViewAccounts' ? 'active' : ''}`}
          onClick={() => setActiveTab('ViewAccounts')}
        >
          View Active Accounts
        </button>
        <button
          className={`tab-button ${activeTab === 'AccountRequests' ? 'active' : ''}`}
          onClick={() => setActiveTab('AccountRequests')}
        >
          Account Requests
        </button>
        </div>
        <div className="search-filter-container1">
          <input
            type="text"
            className="search-input"
            placeholder="Search by Account ID"
            value={accountIdSearch}
            onChange={(e) => setAccountIdSearch(e.target.value)}
          />       
        </div>
       

        {activeTab === 'AccountRequests' && (
            <section className='account-requests'>
                {accounts.length === 0 ? (
                          <p className='msg'>No Account Requests Under Review</p>
                      ) : (
      
          Array.isArray(filteredAccounts) && filteredAccounts.map((account) => (
            <div key={account.accountId} className="account-row">
              {/* Account Request UI */}
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
                <button className="button approve" onClick={() => handleApprove(account.accountId)}>Approve</button>
                <button className="button reject" onClick={() => handleReject(account.accountId)}>Reject</button>
              </div>
            </div>
          ))
        )}</section>
        )}

        {activeTab === 'ViewAccounts' && (
          Array.isArray(filteredAccounts) && filteredAccounts.map((account) => (
            <div key={account.accountId} className="account-row">
              {/* Active Account UI */}
              <div className="main-details">
                <span className="account-id"><strong>Account ID:</strong> {account.accountId}</span>
                <span className="account-number"><strong>Account Number:</strong> {account.accountNumber || 'N/A'}</span>
                <span className="account-number"><strong>Created on:</strong> {account.createdAt ? new Date(account.createdAt).toLocaleDateString() : 'N/A'}</span>
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
                      <strong>Created At:</strong> {new Date(accountDetails.createdAt).toLocaleDateString()}
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
            </div>
          ))
        )}
      </div>
    </main>
  );
};

export default ManageAccounts;
