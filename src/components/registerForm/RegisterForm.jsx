// src/components/RegisterForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { GoogleLogin } from '@react-oauth/google';
import './RegisterForm.css';

const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailStatus, setEmailStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'email') {
      const isValidEmail = validateEmail(value);
      setEmailStatus(isValidEmail ? 'valid' : 'invalid');
    }
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasNumber = /\d/;
    const hasLetter = /[a-zA-Z]/;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;

    return (
      password.length >= minLength &&
      hasNumber.test(password) &&
      hasLetter.test(password) &&
      hasSpecialChar.test(password)
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password, confirmPassword } = formData;
    const newErrors = { email: '', password: '', confirmPassword: '' };

    if (emailStatus === 'invalid') {
      newErrors.email = 'Invalid email address';
    }

    if (!validatePassword(password)) {
      newErrors.password =
        'Password must be at least 8 characters long and include numbers, letters, and symbols';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.values(newErrors).some((error) => error)) {
      setErrors(newErrors);
    } else {
      const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
      if (storedUsers.some(user => user.email === email)) {
        newErrors.email = 'Email is already registered';
        setErrors(newErrors);
        return;
      }

      const newUser = {
        ...formData,
        profileImage: 'https://via.placeholder.com/150',
      };
      storedUsers.push(newUser);
      localStorage.setItem('users', JSON.stringify(storedUsers));
      sessionStorage.setItem('loggedInUser', email);

      navigate('/profile');
    }
  };

  const handleGoogleLogin = (response) => {
    console.log('Google Login Response:', response);
    // Handle Google login response here
  };

  return (
    <div className="register-form-container">
      <form onSubmit={handleSubmit} className="register-form">
        <h2>Register</h2>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <div className="email-container">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {emailStatus === 'valid' && <FaCheckCircle className="status-icon valid" />}
            {emailStatus === 'invalid' && <FaTimesCircle className="status-icon invalid" />}
          </div>
          {errors.email && <p className="error">{errors.email}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <div className="password-container">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.password && <p className="error">{errors.password}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <div className="password-container">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
        </div>
        <button type="submit" className="submit-button">Register</button>
        <div className="google-login">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={(error) => console.error('Google Login Error:', error)}
          />
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
