// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
// Import components
import Navbar from './components/navbar/Navbar.jsx'; // Ensure this path is correct
import RegisterForm from './components/registerForm/RegisterForm.jsx'; // Registration form
import LoginForm from './components/loginForm/LoginForm.jsx'; // Login form
import Profile from './components/profile/Profile.jsx'; // Profile page
import Products from './components/products/Products.jsx'; // Products page
import ErrorBoundary from './components/errorBoundary/ErrorBoundary.jsx'; // Error boundary
import SingleProduct from './components/singleProduct/SingleProduct.jsx'; // Single product page
import Reviews from './components/reviews/Reviews.jsx'; // Reviews component
import ChatPage from './components/chatPage/ChatPage.jsx'; // Chat page
import About from './components/aboutPage/AboutPage.jsx'; // About page
import ContactPage from './components/contactUs/ContactUs.jsx'; // Correct path
import ForgotPasswordForm from './components/forgotPasswordForm/ForgotPasswordForm.jsx'; // Forgot password form

function App() {
  // Retrieve stored users from localStorage
  const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
  // Assume the first user is the logged-in user
  const user = storedUsers[0];
  // Check if a user is authenticated
  const isAuthenticated = user !== undefined;

  return (
    <Router>
      <Navbar />
      <Toaster position="top-center" reverseOrder={false} />
      <ErrorBoundary>
        <Routes>
          {/* Redirect from home page to About page */}
          <Route path="/" element={<Navigate to="/about" />} />
          {/* About page */}
          <Route path="/about" element={<About />} />
          {/* Single product page */}
          <Route path="/product/:id" element={<SingleProduct />} />
          {/* Products page */}
          <Route path="/products" element={<Products />} />
          {/* Login page */}
          <Route path="/login" element={<LoginForm />} />
          {/* Register page */}
          <Route path="/register" element={<RegisterForm />} />
          {/* Forgot Password page */}
          <Route path="/forgot-password" element={<ForgotPasswordForm />} />
          {/* Profile page, requires authentication */}
          <Route 
            path="/profile" 
            element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} 
          />
          {/* Reviews page, requires authentication */}
          <Route 
            path="/reviews" 
            element={isAuthenticated ? <Reviews /> : <Navigate to="/profile" />} 
          />
          {/* Chat page, requires authentication */}
          <Route 
            path="/chat" 
            element={isAuthenticated ? <ChatPage /> : <Navigate to="/login" />} 
          />
          {/* Contact page */}
          <Route path="/contact" element={<ContactPage />} />
          {/* 404 Page Not Found */}
          <Route path="*" element={<Navigate to="/about" />} />
        </Routes>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
