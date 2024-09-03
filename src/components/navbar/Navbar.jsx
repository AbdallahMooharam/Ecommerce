// src/components/Navbar.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css'; 

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const loggedInUser = sessionStorage.getItem('loggedInUser');
  
  const handleLogout = () => {
    sessionStorage.removeItem('loggedInUser');
    navigate('/login');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <button className="menu-toggle" onClick={toggleMenu}>
          <span className="menu-icon"></span>
        </button>
        <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <li><Link to="/">About</Link></li>
          <li><Link to="/products">Products</Link></li>
          {loggedInUser ? (
            <>
              <li><Link to="/profile">Profile</Link></li>
              <li><button onClick={handleLogout} className="logout-button">Logout</button></li>
            </>
          ) : (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </>
          )}
          <li><Link to="/contact">Contact Us</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
