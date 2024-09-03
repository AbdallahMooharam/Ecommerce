// src/components/SingleProduct.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast'; // Import toast and Toaster
import './SingleProduct.css'; // Ensure this file exists

const SingleProduct = () => {
  const { id } = useParams(); // Get product ID from URL
  const [product, setProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    cardNumber: '',
    ccv: '',
    size: '',
    country: '',
    address: '',
    phone: ''
  });
  const [countries, setCountries] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch product data from the API
    fetch(`https://fakestoreapi.com/products/${id}`)
      .then(response => response.json())
      .then(data => setProduct(data))
      .catch(error => console.error('Error fetching product:', error));
  }, [id]);

  useEffect(() => {
    // Fetch countries data from the API
    fetch('https://restcountries.com/v3.1/all')
      .then(response => response.json())
      .then(data => {
        const countriesList = data.map(country => ({
          name: country.name.common,
          code: country.cca2
        }));
        setCountries(countriesList);
      })
      .catch(error => console.error('Error fetching countries:', error));
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your form submission logic here
    toast.success('Order is being processed. We will contact you soon.'); // Show success message
    setShowForm(false);
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  if (!product) {
    return <p>Loading...</p>;
  }

  return (
    <div className="single-product-container">
      <Toaster position="top-center" reverseOrder={false} /> {/* Add Toaster here */}
      <button onClick={() => navigate('/products')} className="back-button">Back to Products</button>
      <div className="single-product-content">
        <img src={product.image} alt={product.title} className="single-product-image" />
        <div className="single-product-details">
          <h1 className="product-title">{product.title}</h1>
          <p className="product-description">{product.description}</p>
          <p className="product-price">${product.price}</p>
          <button onClick={() => setShowForm(true)} className="buy-button">Buy Now</button>
          {showForm && (
            <form className="order-form" onSubmit={handleSubmit}>
              <label>
                Customer Name:
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                />
              </label>
              <label>
                Credit Card Number:
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleFormChange}
                  maxLength="16"
                  pattern="\d{13,16}"
                  required
                />
              </label>
              <label>
                CCV:
                <input
                  type="text"
                  name="ccv"
                  value={formData.ccv}
                  onChange={handleFormChange}
                  maxLength="3"
                  pattern="\d{3}"
                  required
                />
              </label>
              <label>
                Size:
                <select name="size" value={formData.size} onChange={handleFormChange} required>
                  <option value="">Select size</option>
                  <option value="M">Medium</option>
                  <option value="L">Large</option>
                  <option value="XL">Extra Large</option>
                  <option value="XXL">XXL</option>
                </select>
              </label>
              <label>
                Country:
                <select name="country" value={formData.country} onChange={handleFormChange} required>
                  <option value="">Select country</option>
                  {countries.map(country => (
                    <option key={country.code} value={country.name}>{country.name}</option>
                  ))}
                </select>
              </label>
              <label>
                Address:
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleFormChange}
                  required
                />
              </label>
              <label>
                Phone Number:
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  pattern="\d{10,15}"
                  required
                />
              </label>
              <button type="submit" className="submit-button">Submit</button>
              <button type="button" onClick={handleCancel} className="cancel-button">Cancel</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
