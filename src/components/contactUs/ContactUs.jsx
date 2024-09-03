import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { FaGooglePlay, FaAppStore } from 'react-icons/fa';
import './ContactUs.css';

const ContactPage = () => (
  <div className="contact-page">
    <section className="contact-section">
      <div className="container">
        <h2>Contact Us</h2>
        <p>We are here to help. Connect with us through our social channels:</p>
        <div className="contact-icons">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <FaFacebookF className="contact-icon" />
          </a>
          <a href="https://wa.me/yourwhatsappnumber" target="_blank" rel="noopener noreferrer">
            <FaWhatsapp className="contact-icon" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <FaInstagram className="contact-icon" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <FaTwitter className="contact-icon" />
          </a>
        </div>
      </div>
    </section>
    <footer className="footer">
      <div className="container">
        <p>&copy; 2024 Your Company. Abdallah Moharam</p>
        <ul className="footer-links">
          <li><a href="/privacy-policy">Privacy Policy</a></li>
          <li><a href="/terms-of-service">Terms of Service</a></li>
        </ul>
      </div>
    </footer>
  </div>
);

export default ContactPage;
