import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import './Navbar.css';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome

const Navbar = ({setIsAuthenticated}) => {
  const navigate = useNavigate(); // Initialize navigate for redirection

  const handleSignOut = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    // Redirect to login page
    setIsAuthenticated(false);
    navigate('/');
    window.location.reload(); 
  };

  return (
    <nav className="sidebar">
      <div className="logo">
        <i className="fas fa-university"></i>
        <div className="bank">BANK OF HOGWARTS</div>
      </div>
      <ul className="nav-links">
        <li>
          <Link to="/dashboard">
            <i className="fas fa-home"></i> 
            <div className="dashBoard">Dashboard</div>
          </Link>
      
        </li>
        <li>
          <Link to="/manage-accounts">
            <i className="fas fa-users-cog"></i> 
            <div className="manageAccounts">Manage Accounts</div>
          </Link>
        </li>
        <li>
          <Link to="/manage-loans">
            <i className="fas fa-money-check-alt"></i> 
            <div className="manageLoans">Manage Loans</div>
          </Link>
        </li>
        <li>
          <Link to="/deactivation-requests">
            <i className="fas fa-user-slash"></i> 
            <div className="deactivationRequests">Deactivation</div>
          </Link>
        </li>
        <li>
          <Link to="/transactions">
            <i className="fas fa-exchange-alt"></i> 
            <div className="transactions">Transactions</div>
          </Link>
        </li>
        <li>
          <Link to="/reports">
            <i className="fas fa-file-alt"></i> 
            <div className="reports">Reports</div>
          </Link>
        </li>
    
        <li className='sign'><Link>
            <i className="fas fa-sign-out-alt"></i>
            <div className="signOut1" onClick={handleSignOut}>Logout</div></Link>        
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
