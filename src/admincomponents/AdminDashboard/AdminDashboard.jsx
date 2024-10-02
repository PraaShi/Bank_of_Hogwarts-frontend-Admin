import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import {
  FaUsers, FaUserTie, FaUserFriends, FaChartLine, FaArrowCircleDown, FaArrowCircleUp,
  FaHandHoldingUsd, FaRegBuilding, FaPiggyBank, FaMoneyCheck, FaBalanceScale
} from 'react-icons/fa';
import axios from 'axios';

const AdminDashboard = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const Admintoken=localStorage.getItem("Admintoken");
  useEffect(() => {
    async function fetchDashboardReport() {
      try {
        console.log('Fetching dashboard report...');
        const response = await axios.get('https://localhost:7135/api/account/dashboard-report',{
          headers: { Authorization: `Bearer ${Admintoken}` },
      });
        console.log('Response received:', response.data);
        setReport(response.data); // Set the fetched report data
      } catch (error) {
        console.error('Error fetching dashboard report:', error);
        setError('Failed to load dashboard report.');
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardReport();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <main className="main-content">
      <div className="dashboard-report">
        <p className='heading'>BANK OF HOGWARTS <br></br>
          OVERVIEW 

        </p>
        <div className="report-cards">

          {/* Total Employees */}
          <div className="report-card">
            <FaUserTie className="card-icon employee-icon" />
            <div className="card-info">
              <h3>Total Employees</h3>
              <p>{report?.employeeCount || 0}</p>
            </div>
          </div>

          {/* Total Customers */}
          <div className="report-card">
            <FaUsers className="card-icon customer-icon" />
            <div className="card-info">
              <h3>Total Customers</h3>
              <p>{report?.customerCount || 0}</p>
            </div>
          </div>

          {/* Male Customers */}
          <div className="report-card">
            <FaUserFriends className="card-icon male-icon" />
            <div className="card-info">
              <h3>Male Customers</h3>
              <p>{report?.maleCustomerCount || 0}</p>
            </div>
          </div>

          {/* Female Customers */}
          <div className="report-card">
            <FaUserFriends className="card-icon female-icon" />
            <div className="card-info">
              <h3>Female Customers</h3>
              <p>{report?.femaleCustomerCount || 0}</p>
            </div>
          </div>

          {/* Total Transactions */}
          <div className="report-card">
            <FaChartLine className="card-icon transaction-icon" />
            <div className="card-info">
              <h3>Total Transactions</h3>
              <p>{report?.totalTransactions || 0}</p>
            </div>
          </div>

          {/* Total Deposits */}
          <div className="report-card">
            <FaArrowCircleUp className="card-icon deposit-icon" />
            <div className="card-info">
              <h3>Total Deposits</h3>
              <p>₹ {report?.totalDeposits?.toLocaleString() || 0}</p>
            </div>
          </div>

          {/* Total Withdrawals */}
          <div className="report-card">
            <FaArrowCircleDown className="card-icon withdrawal-icon" />
            <div className="card-info">
              <h3>Total Withdrawals</h3>
              <p>₹ {report?.totalWithdrawals?.toLocaleString() || 0}</p>
            </div>
          </div>

          {/* Total Loans Disbursed */}
          <div className="report-card">
            <FaHandHoldingUsd className="card-icon loans-icon" />
            <div className="card-info">
              <h3>Total Loans Disbursed</h3>
              <p>₹ {report?.totalLoansDisbursed?.toLocaleString() || 0}</p>
            </div>
          </div>

          {/* Interest Income */}
          <div className="report-card">
            <FaMoneyCheck className="card-icon interest-icon" />
            <div className="card-info">
              <h3>Interest Income</h3>
              <p>₹ {report?.interestIncome?.toLocaleString() || 0}</p>
            </div>
          </div>

          {/* Total Active Accounts */}
          <div className="report-card">
            <FaPiggyBank className="card-icon accounts-icon" />
            <div className="card-info">
              <h3>Total Active Accounts</h3>
              <p>{report?.activeAccountsCount || 0}</p>
            </div>
          </div>

          {/* Average Account Balance */}
          <div className="report-card">
            <FaBalanceScale className="card-icon balance-icon" />
            <div className="card-info">
              <h3>Average Account Balance</h3>
              <p>₹ {report?.averageAccountBalance?.toLocaleString() || 0}</p>
            </div>
          </div>

          {/* Loan Approval Rate */}
          <div className="report-card">
            <FaRegBuilding className="card-icon loan-approval-icon" />
            <div className="card-info">
              <h3>Loan Approval Rate</h3>
              <p>{report?.loanApprovalRate?.toFixed(2) || 0}%</p>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;
