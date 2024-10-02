import React, { useState, useEffect } from 'react';
import './ManageLoan.css';

const ManageLoans = () => {
    const [activeTab, setActiveTab] = useState('LoanRequests');
    const [loanRequests, setLoanRequests] = useState([]);
    const [disburseLoans, setDisburseLoans] = useState([]);
    const [closeLoans, setCloseLoans] = useState([]);  // New state for loans eligible for closing
    const [selectedAccountId, setSelectedAccountId] = useState(null);
    const [loanIdSearch, setLoanIdSearch] = useState(''); // For loan ID search
    const [loanTypeFilter, setLoanTypeFilter] = useState(''); // For loan type filter
    const [accountDetails, setAccountDetails] = useState(null);
    const token = localStorage.getItem('token');
    const employeeId=localStorage.getItem('employeeId');


    useEffect(() => {
        const fetchLoans = async () => {
            try {
                const response = await fetch('https://localhost:7135/api/Employee/api/loans/all', {
                    headers: { Authorization: `Bearer ${token}` },
                  });
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();

                const filteredLoans = Array.isArray(data.$values) ? data.$values : [];
                setLoanRequests(filteredLoans.filter(loan => loan.loanApplicationStatus === 'UnderReview'));
                setDisburseLoans(filteredLoans.filter(loan => loan.loanApplicationStatus === 'Approved' && loan.loanStatus === 'Pending'));

                // Filter for closing loans
                setCloseLoans(filteredLoans.filter(loan =>(loan.loanFinalStatus==='Active')
                   /* (loan.loanApplicationStatus === 'Approved' && loan.loanStatus === 'Disbursed') ||
                    (loan.loanApplicationStatus === 'Rejected' && loan.loanStatus === 'Pending') ||  (loan.loanApplicationStatus === 'Approved' && loan.loanStatus === 'Pending') */
                ));
            } catch (error) {
                console.error("Error fetching loans:", error);
                alert("An error occurred while fetching loans. Please try again.");
            }
        };

        fetchLoans();
    }, []);
    const fetchAccountDetails = async (accountId) => {
        try {
          const response = await fetch(`https://localhost:7135/api/accountActions/${accountId}/getAccountDetails`  ,{
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await response.json();
          console.log('Feteched data',data);
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


    // Approve and Reject functionalities are kept the same
    const handleApprove = async (loanId) => {
        if (window.confirm('Are you sure you want to approve this loan?')) {
            try {
                const response = await fetch(`https://localhost:7135/api/Employee/manage-loan-request/${loanId}?isApproved=true&employeeId=${employeeId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response.ok) {
                    setLoanRequests(loanRequests.filter((loan) => loan.loanId !== loanId));
                    alert(`Loan ID ${loanId} approved successfully`);
                } else {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            } catch (error) {
                console.error("Error approving loan:", error);
                alert("An error occurred while approving the loan. Please try again.");
            }
        }
    };

    const handleReject = async (loanId) => {
        if (window.confirm('Are you sure you want to reject this loan?')) {
            try {
                const response = await fetch(`https://localhost:7135/api/Employee/manage-loan-request/${loanId}?isApproved=false&employeeId=${employeeId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response.ok) {
                    setLoanRequests(loanRequests.filter((loan) => loan.loanId !== loanId));
                    alert(`Loan ID ${loanId} rejected successfully`);
                } else {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            } catch (error) {
                console.error("Error rejecting loan:", error);
                alert("An error occurred while rejecting the loan. Please try again.");
            }
        }
    };

    const handleDisburse = async (loanId) => {
        if (window.confirm('Are you sure you want to disburse this loan?')) {
            try {
                const response = await fetch(`https://localhost:7135/api/Employee/disburse-loan/${loanId}?isApproved=true`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response.ok) {
                    setDisburseLoans(disburseLoans.filter((loan) => loan.loanId !== loanId));
                    alert(`Loan ID ${loanId} disbursed successfully`);
                } else {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            } catch (error) {
                console.error("Error disbursing loan:", error);
                alert("An error occurred while disbursing the loan. Please try again.");
            }
        }
    };
    const handleRejectLoan = async (loanId) => {
        if (window.confirm('Are you sure you want to reject this loan?')) {
            try {
                const response = await fetch(`https://localhost:7135/api/Employee/disburse-loan/${loanId}?isApproved=false`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response.ok) {
                    setDisburseLoans(disburseLoans.filter((loan) => loan.loanId !== loanId));
                    alert(`Loan ID ${loanId} rejected successfully`);
                } else {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            } catch (error) {
                console.error("Error rejecting loan:", error);
                alert("An error occurred while rejecting the loan. Please try again.");
            }
        }
    };
    // Close loan functionality
    const handleCloseLoan = async (loanId) => {
        if (window.confirm('Are you sure you want to close this loan?')) {
            try {
                const response = await fetch(`https://localhost:7135/api/Employee/${loanId}/close-loan`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' } ,
                        headers: { Authorization: `Bearer ${token}` },
                      }
                );
                if (response.ok) {
                    setCloseLoans(closeLoans.filter((loan) => loan.loanId !== loanId));
                    alert(`Loan ID ${loanId} closed successfully`);
                } else {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            } catch (error) {
                console.error("Error closing loan:", error);
                alert("An error occurred while closing the loan. Please try again.");
            }
        }
    };

    // Filter logic for loanId or loan type
    const filteredCloseLoans = closeLoans.filter(loan => {
        return (
            (!loanIdSearch || loan.loanId.toString() === loanIdSearch) &&  // Use exact match
            (!loanTypeFilter || loan.loanType === loanTypeFilter)
        );
    });
    

    return (
        <main className='main-content'>
            <div className='manage-loans-container'>
                <div className='fixed-header'>
                    <button
                        className={`tab-button ${activeTab === 'LoanRequests' ? 'active' : ''}`}
                        onClick={() => setActiveTab('LoanRequests')}
                    >
                        Loan Requests
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'DisburseLoan' ? 'active' : ''}`}
                        onClick={() => setActiveTab('DisburseLoan')}
                    >
                        Disburse Loan
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'CloseLoan' ? 'active' : ''}`}
                        onClick={() => setActiveTab('CloseLoan')}
                    >
                        Close Loan
                    </button>

                </div>

                {activeTab === 'LoanRequests' && (
                    <section className='loan-requests'>
                        {loanRequests.length === 0 ? (
                            <p className='msg'>No Loan Requests Under Review</p>
                        ) : (
                            <div className="account-container">
                                {loanRequests.map((account) => (
                                    <div key={account.loanId} className="account-row">
                                        <div className="main-details">
                                            <span className="account-id"><strong>Loan ID:</strong> {account.loanId}</span>
                                            <span className="loan-type"><strong>Loan Type:</strong> {account.loanType}</span>
                                            <span className="loan-amount"><strong>Loan Amount:</strong> {account.loanAmount}</span>
                                            <button className="button view-profile" onClick={() => toggleProfileView(account.accountId)}>
                                                {selectedAccountId === account.accountId ? 'Hide Details' : 'View Details'}
                                                <span className="dropdown-arrow">{selectedAccountId === account.accountId ? '▲' : '▼'}</span>
                                            </button>
                                        </div>
                                        {selectedAccountId === account.accountId && accountDetails && (
                                            <div className="profile-details">
                                                <div className="passbook-header">{accountDetails.customer.gender==='Male'?'Mr. ':'Mrs. '}{accountDetails.customer.lastName}'s Profile</div>
                                                <div className="passbook-content">
                                                    <h4 className='head'>Customer Details</h4>
                                                    <div className="profile-row">
                                                    <span className="profile-field">
                                                    <strong>Customer ID:</strong> {accountDetails.customer ? accountDetails.customer.customerId : 'N/A'}
                                                    </span>
                                                    <span className="profile-field">
                                                       <strong>Full Name:</strong> {accountDetails.customer ? `${accountDetails.customer.firstName} ${accountDetails.customer.middleName} ${accountDetails.customer.lastName}` : 'N/A'}
                                                      </span>

                                                        <span className="profile-field">
                                                          <strong>Date of Birth:</strong> {accountDetails.customer ? accountDetails.customer.dateOfBirth : 'N/A'}
                                                       </span>
                                                    </div> <div className="profile-row">
                                                     <span className="profile-field">
                                                        <strong>PAN: </strong> {accountDetails.customer.pan}
                                                        </span>
                                                        <span className="profile-field">
                                                        <strong>Aadhar No:</strong> {accountDetails.customer ? accountDetails.customer.aadharNumber : 'N/A'}
                                                        </span> <span className="profile-field">
                                                        <strong>Contact:</strong> {accountDetails.customer ? accountDetails.customer.contactNumber : 'N/A'}
                                                       </span>
                                                        <br /></div>
                                                        
                                                        <div className="profile-row">
                                                       <span className="profile-field">
                                                         <strong>Address:</strong> {accountDetails.customer ? accountDetails.customer.address : 'N/A'}
                                                         </span>
                                                    </div>
                                                    <h4 className='head'>Account Details</h4>
                                                    <div className="profile-row">
                                                        <span className="profile-field"><strong>Account Id:</strong> {accountDetails.accountId}</span>
                                                        <span className="profile-field"><strong>Acc No:</strong> {accountDetails.accountNumber}</span>
                                                        <span className="profile-field"><strong>Balance:</strong> {accountDetails.balance}</span>
                                                    </div>
                                                    <div className="profile-row">
                                                   <span className="profile-field">
                                                        <strong>Created On:</strong> {new Date(accountDetails.createdAt).toLocaleDateString()}
                                                    </span>
                                                    <span className="profile-field">
                                                     <strong>Email:</strong> {accountDetails.customer ? accountDetails.customer.email : 'N/A'}
                                                    </span> 
                                                    <span className="profile-field"><strong>Status:</strong> {accountDetails.status || 'N/A'}</span>
                                                   </div>
                                                    <br/>
                                                    <h4 className='head'>Loan Details</h4>
                                                    <div className="profile-row">
                                                        <span className="profile-field"><strong>Loan Type:</strong> {account.loanType}</span>
                                                        <span className="profile-field"><strong>Loan Amount:</strong> ₹ {account.loanAmount}</span>
                                                    </div>
                                                    <div className="profile-row">
                                                        <span className="profile-field"><strong>Application Date:</strong> {new Date(account.applicationDate).toLocaleDateString()}</span>
                                                        <span className="profile-field"><strong>Loan Tenure:</strong> {account.tenure} Months</span>
                                                    </div>
                                                    <div className="profile-row">
                                                        <span className="profile-field"><strong>Purpose:</strong> {account.purpose}</span>
                                                        <span className="profile-field"><strong>Cibil Score:</strong> {accountDetails.cibilScore}</span>
                                                    </div>
                                                    <div className="action-buttons">
                                                    <button className="button approve" onClick={() => handleApprove(account.loanId)}>Approve</button>
                                                    <button className="button reject" onClick={() => handleReject(account.loanId)}>Reject</button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                )}

                {activeTab === 'DisburseLoan' && (
                    <section className='disburse-loans'>
                        {disburseLoans.length === 0 ? (
                            <p className='msg'>No loans available for disbursement</p>
                        ) : (
                            <div className="account-container">
                                {disburseLoans.map((account) => (
                                    <div key={account.loanId} className="account-row">
                                       
                                        <div className="main-details">
                                            <span className="account-id"><strong>Loan ID:</strong> {account.loanId}</span>
                                            <span className="loan-type"><strong>Loan Type:</strong> {account.loanType}</span>
                                            <span className="loan-amount"><strong>Loan Amount:</strong> {account.loanAmount}</span>
                                            <button className="button view-profile" onClick={() => toggleProfileView(account.accountId)}>
                                                {selectedAccountId === account.accountId ? 'Hide Details' : 'View Details'}
                                                <span className="dropdown-arrow">{selectedAccountId === account.accountId ? '▲' : '▼'}</span>
                                            </button>
                                        </div>
                                        {selectedAccountId === account.accountId && accountDetails && (
                                            <div className="profile-details">
                                                <div className="passbook-header">{accountDetails.customer.gender==='Male'?'Mr. ':'Mrs. '}{accountDetails.customer.lastName}'s Profile</div>
                                                <div className="passbook-content">
                                                    <h4 className='head'>Customer Details</h4>
                                                    <div className="profile-row">
                                                    <span className="profile-field">
                                                    <strong>Customer ID:</strong> {accountDetails.customer ? accountDetails.customer.customerId : 'N/A'}
                                                    </span>
                                                    <span className="profile-field">
                                                       <strong>Full Name:</strong> {accountDetails.customer ? `${accountDetails.customer.firstName} ${accountDetails.customer.middleName} ${accountDetails.customer.lastName}` : 'N/A'}
                                                      </span>

                                                        <span className="profile-field">
                                                          <strong>Date of Birth:</strong> {accountDetails.customer ? accountDetails.customer.dateOfBirth : 'N/A'}
                                                       </span>
                                                    </div> <div className="profile-row">
                                                     <span className="profile-field">
                                                        <strong>PAN: </strong> {accountDetails.customer.pan}
                                                        </span>
                                                        <span className="profile-field">
                                                        <strong>Aadhar No:</strong> {accountDetails.customer ? accountDetails.customer.aadharNumber : 'N/A'}
                                                        </span> <span className="profile-field">
                                                        <strong>Contact:</strong> {accountDetails.customer ? accountDetails.customer.contactNumber : 'N/A'}
                                                       </span>
                                                        <br /></div>
                                                        
                                                        <div className="profile-row">
                                                       <span className="profile-field">
                                                         <strong>Address:</strong> {accountDetails.customer ? accountDetails.customer.address : 'N/A'}
                                                         </span>
                                                    </div>
                                                    <h4 className='head'>Account Details</h4>
                                                    <div className="profile-row">
                                                        <span className="profile-field"><strong>Account Id:</strong> {accountDetails.accountId}</span>
                                                        <span className="profile-field"><strong>Acc No:</strong> {accountDetails.accountNumber}</span>
                                                        <span className="profile-field"><strong>Balance:</strong> {accountDetails.balance}</span>
                                                    </div>
                                                    <div className="profile-row">
                                                   <span className="profile-field">
                                                        <strong>Created On:</strong> {new Date(accountDetails.createdAt).toLocaleDateString()}
                                                    </span>
                                                    <span className="profile-field">
                                                     <strong>Email:</strong> {accountDetails.customer ? accountDetails.customer.email : 'N/A'}
                                                    </span> 
                                                    <span className="profile-field"><strong>Status:</strong> {accountDetails.status || 'N/A'}</span>
                                                   </div>
                                                    <br/>
                                                    <h4 className='head'>Loan Details</h4>
                                                    <div className="profile-row">
                                                        <span className="profile-field"><strong>Loan Type:</strong> {account.loanType}</span>
                                                        <span className="profile-field"><strong>Loan Amount:</strong> ₹ {account.loanAmount}</span>
                                                    </div>
                                                    <div className="profile-row">
                                                        <span className="profile-field"><strong>Application Date:</strong> {new Date(account.applicationDate).toLocaleDateString()}</span>
                                                        <span className="profile-field"><strong>Loan Tenure:</strong> {account.tenure} Months</span>
                                                    </div>
                                                    <div className="profile-row">
                                                        <span className="profile-field"><strong>Purpose:</strong> {account.purpose}</span>
                                    
                                                        <span className="profile-field"><strong>Cibil Score:</strong> {accountDetails.cibilScore}</span>
                                                    </div>
                                      
                                        
                                                    <div className='action-buttons'>
                                                    <button className="button approve" onClick={() => handleDisburse(account.loanId)}>Disburse</button>
                                                    <button className="button reject" onClick={() => handleRejectLoan(account.loanId)}>Reject</button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                )}
                {activeTab === 'CloseLoan' && (
                    <section className='close-loans'>
                        <div className="search-filter-container">
                            <input
                                type="text"
                                placeholder="Search by Loan ID"
                                value={loanIdSearch}
                                onChange={(e) => setLoanIdSearch(e.target.value)}
                                className="search-input"
                            />
                            <select
                                value={loanTypeFilter}
                                onChange={(e) => setLoanTypeFilter(e.target.value)}
                                className="filter-dropdown12"
                            >
                                <option value="">Filter by Loan Type</option>
                                <option value="Personal">Personal Loan</option>
                                <option value="Home">Home Loan</option>
                                <option value="Car">Car Loan</option>
                                {/* Add more loan types as needed */}
                            </select>
                        </div>
                        {filteredCloseLoans.length === 0 ? (
                            <p className='msg'>No loans available for closing</p>
                        ) : (
                            <div className="account-container">
                                {filteredCloseLoans.map((account) => (
                                    <div key={account.loanId} className="account-row">
                                     <div className="main-details">
                                            <span className="account-id"><strong>Loan ID:</strong> {account.loanId}</span>
                                            <span className="loan-type"><strong>Loan Type:</strong> {account.loanType}</span>
                                            <span className="loan-amount"><strong>Loan Amount:</strong> {account.loanAmount}</span>
                                            <button className="button view-profile" onClick={() => toggleProfileView(account.accountId)}>
                                                {selectedAccountId === account.accountId ? 'Hide Details' : 'View Details'}
                                                <span className="dropdown-arrow">{selectedAccountId === account.accountId ? '▲' : '▼'}</span>
                                            </button>
                                        </div>
                                        {selectedAccountId === account.accountId && accountDetails && (
                                            <div className="profile-details">
                                                <div className="passbook-header">{accountDetails.customer.gender==='Male'?'Mr. ':'Mrs. '}{accountDetails.customer.lastName}'s Profile</div>
                                                <div className="passbook-content">
                                                    <h4 className='head'>Customer Details</h4>
                                                    <div className="profile-row">
                                                    <span className="profile-field">
                                                    <strong>Customer ID:</strong> {accountDetails.customer ? accountDetails.customer.customerId : 'N/A'}
                                                    </span>
                                                    <span className="profile-field">
                                                       <strong>Full Name:</strong> {accountDetails.customer ? `${accountDetails.customer.firstName} ${accountDetails.customer.middleName} ${accountDetails.customer.lastName}` : 'N/A'}
                                                      </span>

                                                        <span className="profile-field">
                                                          <strong>Date of Birth:</strong> {accountDetails.customer ? accountDetails.customer.dateOfBirth : 'N/A'}
                                                       </span>
                                                    </div> <div className="profile-row">
                                                     <span className="profile-field">
                                                        <strong>PAN: </strong> {accountDetails.customer.pan}
                                                        </span>
                                                        <span className="profile-field">
                                                        <strong>Aadhar No:</strong> {accountDetails.customer ? accountDetails.customer.aadharNumber : 'N/A'}
                                                        </span> <span className="profile-field">
                                                        <strong>Contact:</strong> {accountDetails.customer ? accountDetails.customer.contactNumber : 'N/A'}
                                                       </span>
                                                        <br /></div>
                                                        
                                                        <div className="profile-row">
                                                       <span className="profile-field">
                                                         <strong>Address:</strong> {accountDetails.customer ? accountDetails.customer.address : 'N/A'}
                                                         </span>
                                                    </div>
                                                    <h4 className='head'>Account Details</h4>
                                                    <div className="profile-row">
                                                        <span className="profile-field"><strong>Account Id:</strong> {accountDetails.accountId}</span>
                                                        <span className="profile-field"><strong>Acc No:</strong> {accountDetails.accountNumber}</span>
                                                        <span className="profile-field"><strong>Balance:</strong> {accountDetails.balance}</span>
                                                    </div>
                                                    <div className="profile-row">
                                                   <span className="profile-field">
                                                        <strong>Created On:</strong> {new Date(accountDetails.createdAt).toLocaleDateString()}
                                                    </span>
                                                    <span className="profile-field">
                                                     <strong>Email:</strong> {accountDetails.customer ? accountDetails.customer.email : 'N/A'}
                                                    </span> 
                                                    <span className="profile-field"><strong>Status:</strong> {accountDetails.status || 'N/A'}</span>
                                                   </div>
                                                    <br/>
                                                    <h4 className='head'>Loan Details</h4>
                                                    <div className="profile-row">
                                                        <span className="profile-field"><strong>Loan Type:</strong> {account.loanType}</span>
                                                        <span className="profile-field"><strong>Loan Amount:</strong> ₹ {account.loanAmount}</span>
                                                    </div>
                                                    <div className="profile-row">
                                                        <span className="profile-field"><strong>Application Date:</strong> {new Date(account.applicationDate).toLocaleDateString()}</span>
                                                        <span className="profile-field"><strong>Loan Tenure:</strong> {account.tenure} Months</span>
                                                    </div>
                                                    <div className="profile-row">
                                                        <span className="profile-field"><strong>Purpose:</strong> {account.purpose}</span>
                                                    </div>
                                                    <div className="profile-row">
                                                        <span className="profile-field"><strong>Cibil Score:</strong> {accountDetails.cibilScore}</span>
                                                    </div>
                                                    
                                                </div><button className="button close-loan" onClick={() => handleCloseLoan(account.loanId)}>
Close Loan
</button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                )}
        
            </div>

        </main>
    );
};

export default ManageLoans;
