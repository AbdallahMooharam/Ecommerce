import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AboutPage.css';
import { FaFacebookF, FaTwitter, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { FaGooglePlay, FaAppStore } from 'react-icons/fa';

// About Section
const AboutSection = () => (
  <section className="about-section">
    <div className="about-content">
      <h1> Classic Brand</h1>
      <p>Established in 1999, Classic Brand specializes in clothing and accessories, offering timeless fashion with a touch of elegance.</p>
    </div>
  </section>
);

// Product Section
const ProductSection = () => {
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://fakestoreapi.com/products');
        setProducts(response.data);
        setError(null); // Clear any previous errors
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Unable to load products at the moment. Please try again later.');
      }
    };

    fetchProducts();
  }, []);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + products.length) % products.length);
  };

  return (
    <section className="product-section">
      <h2>Our Products</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="product-carousel">
        {products.length > 0 && !error && (
          <div className="product-card">
            <img src={products[currentIndex].image} alt={products[currentIndex].title} className="product-image" />
            <p className="product-price">${products[currentIndex].price}</p>
          </div>
        )}
        <button className="arrow-button left" onClick={handlePrevious}>&lt;</button>
        <button className="arrow-button right" onClick={handleNext}>&gt;</button>
      </div>
    </section>
  );
};

// Features Section
const FeaturesSection = () => {
  const features = [
    { color: '#ffcccb', text: 'Buy Online' },
    { color: '#ccffcc', text: 'Voice & Message Reviews' },
    { color: '#ffebcc', text: 'Chat with Brand Representatives' },
    { color: '#ccccff', text: 'Up to 50% Discounts' }
  ];

  return (
    <section className="features-section">
      <h2>Store Features</h2>
      <div className="features-container">
        {features.map((feature, index) => (
          <div key={index} className="feature-card" style={{ backgroundColor: feature.color }}>
            <p>{feature.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

// Contact Section
const ContactSection = () => (
  <section className="contact-section">
    <h2>Contact Us</h2>
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
  </section>
);

const DownloadSection = () => (
  <section className="download-section">
    <h2>Download Our App</h2>
    <div className="download-icons">
      <a href="https://play.google.com/store/apps" target="_blank" rel="noopener noreferrer">
        <FaGooglePlay className="download-icon" />
      </a>
      <a href="https://apps.apple.com/us/app/id" target="_blank" rel="noopener noreferrer">
        <FaAppStore className="download-icon" />
      </a>
    </div>
    <p className="footer-note">Created by Abdallah Moharam 2024</p>
  </section>
);

// AboutPage Component
const AboutPage = () => (
  <>
    <AboutSection />
    <ProductSection />
    <FeaturesSection />
    <ContactSection />
    <DownloadSection />
  </>
);

export default AboutPage;
