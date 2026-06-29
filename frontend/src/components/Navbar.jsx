import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaSignOutAlt, FaCog, FaMoon, FaSun, FaHome, FaNewspaper, FaChartPie } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout, darkMode, toggleDarkMode } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="navbar">
      {/* Logo always goes to Home */}
      <Link to="/" className="logo">ManageFinance</Link>

      <div className="nav-links">
        {/* Always show Home */}
        <Link to="/">Home</Link>
        <Link to="/blogs" className="hide-mobile">Blogs</Link>

        {/* Analytics - only when logged in */}
        {user && (
          <Link to="/analytics" className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <FaChartPie /> Analytics
          </Link>
        )}

        <button onClick={toggleDarkMode} className="theme-toggle">
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>

        {user ? (
          <div className="dropdown">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px',
                borderRadius: '8px',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                color: 'inherit',
              }}
            >
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#2563eb',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
              }}>
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="hide-mobile" style={{ color: 'inherit' }}>{user.name}</span>
            </button>

            <div className={`dropdown-menu ${dropdownOpen ? 'open' : ''}`}>
              <Link to="/dashboard" onClick={() => setDropdownOpen(false)}>
                Dashboard
              </Link>
              <Link to="/profile" onClick={() => setDropdownOpen(false)}>
                <FaUser /> Profile
              </Link>
              <Link to="/settings" onClick={() => setDropdownOpen(false)}>
                <FaCog /> Settings
              </Link>
              <Link to="/analytics" onClick={() => setDropdownOpen(false)}>
                <FaChartPie /> Analytics
              </Link>
              <button 
                onClick={() => { 
                  logout(); 
                  setDropdownOpen(false); 
                }} 
                className="logout"
              >
                <FaSignOutAlt /> Logout
              </button>
            </div>
          </div>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn-primary" style={{ padding: '8px 20px' }}>Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;