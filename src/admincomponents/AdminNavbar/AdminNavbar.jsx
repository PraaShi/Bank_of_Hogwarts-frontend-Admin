import React from 'react';
import { Link ,useNavigate} from 'react-router-dom';
import './AdminNavbar.css';
import {FaUserTie,FaGlobe,FaUserPlus,FaUser, FaSignOutAlt} from 'react-icons/fa';
//import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome

const AdminNavbar = ({setIsAdmin}) => {
  const navigate = useNavigate(); // Initialize navigate for redirection

  const handleLogOut = () => {
    // Remove token from localStorage
    localStorage.removeItem('Admintoken');
    // Redirect to login page
    setIsAdmin(false);
    navigate('/admin');
    window.location.reload(); 
  };
  return (
    <nav className="sidebar">
      <div className="logo">
        <i className="fas fa-university"></i> <div className='bank1'>BANK OF HOGWARTS ADMIN</div>
      </div>
      <ul className="nav-links">
        <li>
          <Link to="/admin-dashboard">
            <FaGlobe></FaGlobe>
            <div className="dashBoard">HB Overview</div>
          </Link>
        </li>
        <li>
          <Link to="/manage-employee">
            <FaUserTie></FaUserTie>
            <div className="manageEmployee">Manage Employees</div>
          </Link>
        </li>
        <li>
          <Link to="/add-employee">
            <FaUserPlus></FaUserPlus>
            <div className="addEmployee">Add Employee</div>
          </Link>
        </li>
        <li>
          <Link to="/manage-customer">
          <FaUser></FaUser>
            <div className="manageCustomer">Manage Customers</div>
          </Link>
        </li>
        
      
     
        <li>
          <Link>
          <FaSignOutAlt></FaSignOutAlt>
          <div className="signOut" onClick={handleLogOut}>Sign out</div>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default AdminNavbar;
