// src/components/Products.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './Products.css'; // Make sure this file exists

const Products = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch product data from the API
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://fakestoreapi.com/products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleSave = (product) => {
    const loggedInUser = sessionStorage.getItem('loggedInUser');

    if (loggedInUser) {
      // Retrieve current favorites from localStorage
      const favorites = JSON.parse(localStorage.getItem('favorites')) || {};
      const userFavorites = favorites[loggedInUser] || [];

      // Add product to user's favorites
      if (!userFavorites.some(item => item.id === product.id)) {
        userFavorites.push(product);
        favorites[loggedInUser] = userFavorites;
        localStorage.setItem('favorites', JSON.stringify(favorites));
        toast.success(`Product ${product.id} saved to favorites.`);
      } else {
        toast(`Product ${product.id} is already in favorites.`, {
          icon: '🔔', // Custom icon
        });
      }
    } else {
      // Redirect to login page if not logged in
      navigate('/login');
    }
  };

  const handleInfo = (productId) => {
    console.log(`Information about product with ID: ${productId}`);
    // Implement information display functionality
  };

  return (
    <div className="products-container">
      {products.map(product => (
        <div key={product.id} className="product-card">
          <Link to={`/product/${product.id}`}>
            <img src={product.image} alt={product.title} className="product-image" />
          </Link>
          <div className="product-details">
            <p className="product-price">${product.price}</p>
            <div className="product-actions">
              <button onClick={() => handleSave(product)} className="action-button">
                Add to Favorites
              </button>
              <Link to={`/product/${product.id}`}>
                <button onClick={() => handleInfo(product.id)} className="action-button">
                  More Info
                </button>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Products;
