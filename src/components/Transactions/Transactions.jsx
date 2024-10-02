import React, { useState, useEffect, useCallback } from 'react';
import './transactions.css';

import axios from 'axios';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [accountId, setAccountId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filterOption, setFilterOption] = useState('lastWeek');
  const token = localStorage.getItem('token');

  const fetchTransactions = useCallback(async () => {
    if (!accountId) return; // Ensure accountId is provided

    try {
      const formattedStartDate = startDate ? new Date(startDate).toISOString().split('T')[0] : '';
      const formattedEndDate = endDate ? new Date(endDate).toISOString().split('T')[0] : '';

      const response = await axios.get(`https://localhost:7135/api/Employee/transactions/${accountId}`, {
        params: {
          startDate: formattedStartDate,
          endDate: formattedEndDate,
        },  
          headers: { Authorization: `Bearer ${token}` },
        
      });

      console.log('API Response:', response.data);
      if (response.data && response.data.$values) {
        setTransactions(response.data.$values);
      } else {
        setTransactions([]);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setTransactions([]);
    }
  }, [accountId, startDate, endDate]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleFilterChange = (e) => {
    const selectedOption = e.target.value;
    setFilterOption(selectedOption);

    let calculatedStartDate = '';
    let calculatedEndDate = '';

    const today = new Date();
    if (selectedOption === 'lastWeek') {
      calculatedStartDate = new Date(today.setDate(today.getDate() - 7)).toISOString().split('T')[0];
      calculatedEndDate = new Date().toISOString().split('T')[0];
    } else if (selectedOption === 'lastMonth') {
      calculatedStartDate = new Date(today.setMonth(today.getMonth() - 1)).toISOString().split('T')[0];
      calculatedEndDate = new Date().toISOString().split('T')[0];
    } else if (selectedOption === 'betweenDates') {
      calculatedStartDate = startDate;
      calculatedEndDate = endDate;
    }

    setStartDate(calculatedStartDate);
    setEndDate(calculatedEndDate);
  };

  return (
    <main className='main-content'>
      <h2 className='theading'>TRANSACTIONS</h2>
      <div className="transactions-container">
        <div className="filter-bar">
          <input
            className="search-bar"
            type="text"
            placeholder="Search by Account ID"
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
          />
          <select className="filter-dropdown" value={filterOption} onChange={handleFilterChange}>
            <option value="lastWeek">Last Week</option>
            <option value="lastMonth">Last Month</option>
            <option value="betweenDates">Between Dates</option>
          </select>
          <div className="date-picker">
           <h3>Start Date</h3>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="date-picker">
           <h3>End Date</h3>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
       
        </div>

        <table className="transactions-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Description</th>
              <th>Debit</th>
              <th>Credit</th>
              <th>Updated Balance</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(transactions) && transactions.length > 0 ? (
              transactions.map((transaction) => (
                <tr key={transaction.transactionId} className={transaction.transactionType.toLowerCase()}>
                  <td>{new Date(transaction.transactionDate).toLocaleDateString()}</td>
                  <td>{transaction.transactionType}</td>
                  <td>{transaction.description}</td>
                  <td>{transaction.debit > 0 ? `₹${transaction.debit}` : '-'}</td>
                  <td>{transaction.credit > 0 ? `₹${transaction.credit}` : '-'}</td>
                  <td>{transaction.updatedBalance !== null ? `₹${transaction.updatedBalance}` : '-'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" coj><div className='no-transactions'>No transactions found.</div></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default Transactions;
