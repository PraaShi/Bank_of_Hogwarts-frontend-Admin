import React, { useState, useEffect } from 'react';
import './reports.css';
import { FaArrowCircleDown, FaArrowCircleUp, FaBalanceScale, FaHandHoldingUsd, FaRupeeSign, FaCreditCard, FaRegAddressCard } from 'react-icons/fa';
import axios from 'axios';

const Report = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    async function fetchFinancialReport() {
      try {
        console.log('Fetching financial report...');
        const response = await axios.get('https://localhost:7135/api/Employee/financial-report'  ,{
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Response received:', response.data);
        setReport(response.data); // Set the fetched report data
      } catch (error) {
        console.error('Error fetching financial report:', error);
        setError('Failed to load financial report.');
      } finally {
        setLoading(false);
      }
    }

    fetchFinancialReport();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Ensure report is not null before rendering its properties
  return (
    <main className="main-content">
      <div className="financial-report">
        <p className='heading1'>FINANCIAL REPORT</p>
        <div className="report-cards">
          <div className="report-card">
            <FaArrowCircleUp className="card-icon deposit-icon" />
            <div className="card-info">
              <h3>Total Deposits</h3>
              <p>₹ {report?.totalDeposits?.toLocaleString() || 0}</p>
            </div>
          </div>

          <div className="report-card">
            <FaArrowCircleDown className="card-icon withdrawal-icon" />
            <div className="card-info">
              <h3>Total Withdrawals</h3>
              <p>₹ {report?.totalWithdrawals?.toLocaleString() || 0}</p>
            </div>
          </div>

          <div className="report-card">
            <FaBalanceScale className="card-icon balance-icon" />
            <div className="card-info">
              <h3>Net Account Balance</h3>
              <p>₹ {report?.netAccountBalance?.toLocaleString() || 0}</p>
            </div>
          </div>

          <div className="report-card">
            <FaHandHoldingUsd className="card-icon loans-icon" />
            <div className="card-info">
              <h3>Total Loans Disbursed</h3>
              <p>₹ {report?.totalLoansDisbursed?.toLocaleString() || 0}</p>
            </div>
          </div>

          <div className="report-card">
            <FaRupeeSign className="card-icon interest-icon" />
            <div className="card-info">
              <h3>Interest Income</h3>
              <p>₹ {report?.interestIncome?.toLocaleString() || 0}</p>
            </div>
          </div>

          <div className="report-card">
            <FaCreditCard className="card-icon loans-center-icon" />
            <div className="card-info">
              <h3>Total Active Loans</h3>
              <p>{report?.totalLoans || 0}</p>
            </div>
          </div>

          <div className="report-card">
            <FaRegAddressCard className="card-icon accounts-icon" />
            <div className="card-info">
              <h3>Total Active Accounts</h3>
              <p>{report?.totalAccounts || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Report;
