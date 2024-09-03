import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ForgotPasswordForm.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Importing eye icons

const ForgotPasswordForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    if (name === 'newPassword') setNewPassword(value);
    if (name === 'confirmPassword') setConfirmPassword(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = storedUsers.findIndex(user => user.email === email);

    if (userIndex === -1) {
      setError('Email not found');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    storedUsers[userIndex].password = newPassword;
    localStorage.setItem('users', JSON.stringify(storedUsers));
    setSuccessMessage('Password updated successfully');
    setError('');
    setTimeout(() => navigate('/login'), 2000); // Redirect to login page after 2 seconds
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState);
  };

  return (
    <div className="forgot-password-form-container">
      <form onSubmit={handleSubmit} className="forgot-password-form">
        <h2>Forgot Password</h2>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group password-container">
          <label htmlFor="newPassword">New Password:</label>
          <div className="password-input-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              id="newPassword"
              name="newPassword"
              value={newPassword}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        <div className="form-group password-container">
          <label htmlFor="confirmPassword">Confirm New Password:</label>
          <div className="password-input-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        {error && <p className="error">{error}</p>}
        {successMessage && <p className="success">{successMessage}</p>}
        <button type="submit" className="submit-button">Reset Password</button>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
