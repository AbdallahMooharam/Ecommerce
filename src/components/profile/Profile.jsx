import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Profile.css';
import toast, { Toaster } from 'react-hot-toast';

const Profile = () => {
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [countries, setCountries] = useState([]);
  const [profileImage, setProfileImage] = useState('https://via.placeholder.com/150');
  const [phone, setPhone] = useState('');
  const [creditCard, setCreditCard] = useState('');
  const [creditCardError, setCreditCardError] = useState('');
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cvv, setCvv] = useState('');
  const [size, setSize] = useState('Medium');
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [purchaseMessage, setPurchaseMessage] = useState('');
  const [cart, setCart] = useState([]);
  const [purchaseDetails, setPurchaseDetails] = useState([]);

  useEffect(() => {
    const loggedInEmail = sessionStorage.getItem('loggedInUser');
    if (!loggedInEmail) {
      navigate('/login');
      return;
    }
  
    fetch('https://restcountries.com/v3.1/all')
      .then(response => response.json())
      .then(data => {
        const formattedCountries = data.map(country => ({
          code: country.cca2,
          name: country.name.common,
          flag: country.flags[1] || 'https://via.placeholder.com/64',
        }));
        setCountries(formattedCountries);
      })
      .catch(error => console.error('Error fetching countries:', error));
  
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    const currentUser = storedUsers.find(user => user.email === loggedInEmail);
    setUser(currentUser);
  
    if (currentUser) {
      setProfileImage(currentUser.profileImage || 'https://via.placeholder.com/150');
      setSelectedCountry(currentUser.country || 'US');
      setPhone(currentUser.phone || '');
      setCreditCard(currentUser.creditCard || '');
  
      const userFavorites = JSON.parse(localStorage.getItem('favorites')) || {};
      setFavorites(userFavorites[loggedInEmail] || []);
  
      const userCart = JSON.parse(localStorage.getItem('cart')) || [];
      setCart(Array.isArray(userCart) ? userCart : []);
  
      const storedPurchaseDetails = JSON.parse(localStorage.getItem(`purchaseDetails_${loggedInEmail}`)) || [];
      setPurchaseDetails(storedPurchaseDetails);
    }
  }, [navigate]);
  
  const handleCountryChange = (e) => setSelectedCountry(e.target.value);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      return () => URL.revokeObjectURL(imageUrl);
    }
  };

  const handleSave = () => {
    const loggedInEmail = sessionStorage.getItem('loggedInUser');
    if (loggedInEmail) {
      if (creditCard.replace(/\D/g, '').length < 14) {
        setCreditCardError('Credit Card Number must be exactly 14 digits.');
        return;
      }

      const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
      const updatedUsers = storedUsers.map(user =>
        user.email === loggedInEmail
          ? { ...user, profileImage, country: selectedCountry, phone, creditCard }
          : user
      );
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      toast.success('Successfully saved changes!');
      setCreditCardError('');
    }
  };

  const handleDeleteFavorite = (productId) => {
    const loggedInEmail = sessionStorage.getItem('loggedInUser');
    const userFavorites = JSON.parse(localStorage.getItem('favorites')) || {};

    if (userFavorites[loggedInEmail]) {
      const updatedFavorites = userFavorites[loggedInEmail].filter(item => item.id !== productId);
      userFavorites[loggedInEmail] = updatedFavorites;
      localStorage.setItem('favorites', JSON.stringify(userFavorites));
      setFavorites(updatedFavorites);
    }
  };

  const handleBuyClick = (product) => {
    if (!creditCard) {
      toast.error("Please enter your credit card number first.");
    } else {
      setSelectedProduct(product);
      setIsPurchasing(true);
    }
  };

  const handlePurchase = () => {
    if (!cvv || !size || quantity <= 0 || !address || !contactPhone) {
      toast.error('Please fill out all the fields.');
      return;
    }
  
    if (cvv.replace(/\D/g, '').length > 3) {
      toast.error('CVV cannot exceed 3 digits.');
      return;
    }
  
    const deliveryTime = 2; // hours
  
    const totalPrice = selectedProduct.price * quantity;
  
    const newPurchaseDetails = {
      product: selectedProduct,
      size,
      quantity,
      address,
      contactPhone,
      deliveryTime,
      totalPrice,
    };
  
    const loggedInEmail = sessionStorage.getItem('loggedInUser');
    let existingPurchases = JSON.parse(localStorage.getItem(`purchaseDetails_${loggedInEmail}`)) || [];
    if (!Array.isArray(existingPurchases)) {
      existingPurchases = [];
    }
  
    const updatedPurchases = [...existingPurchases, newPurchaseDetails];
    localStorage.setItem(`purchaseDetails_${loggedInEmail}`, JSON.stringify(updatedPurchases));
  
    setPurchaseDetails(updatedPurchases);
    setPurchaseMessage(`Purchase completed. Your product will arrive in ${deliveryTime} hours.`);
    setIsPurchasing(false);
  
    setTimeout(() => {
      setPurchaseMessage('Purchase completed.');
    }, deliveryTime * 60 * 60 * 1000);
  };

  if (!user) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="profile-container">
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      <div className="animated-background">
        {[...Array(10)].map((_, index) => (
          <div
            key={index}
            className="box"
            style={{
              top: `${Math.random() * 100}vh`,
              left: `${Math.random() * 100}vw`,
              animationDuration: `${Math.random() * 10 + 5}s`,
            }}
          />
        ))}
      </div>
      <div className="profile-sidebar">
        <div className="profile-picture-wrapper">
          <img
            src={countries.find(country => country.code === selectedCountry)?.flag || 'https://via.placeholder.com/64'}
            alt="Country Flag"
            className="country-flag"
          />
          <div className="profile-picture">
            <img 
              src={profileImage} 
              alt="Profile"
              className="profile-image"
            />
            <input 
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="file-input"
              id="file-input"
            />
            <label htmlFor="file-input" className="upload-button">+</label>
          </div>
        </div>
        <div className="profile-info">
          <h2>Complete Your Profile</h2>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <label htmlFor="nationality">Nationality:</label>
          <select
            id="nationality"
            value={selectedCountry}
            onChange={handleCountryChange}
          >
            {countries.map((country) => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
          <label htmlFor="phone">Phone Number:</label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1234567890"
          />
          <label htmlFor="credit-card">Credit Card Number:</label>
          <input
            type="text"
            id="credit-card"
            value={creditCard}
            onChange={(e) => {
              const newValue = e.target.value.replace(/\D/g, '');
              if (newValue.length <= 14) {
                setCreditCard(newValue);
                setCreditCardError('');
              } else {
                setCreditCardError('Credit Card Number cannot exceed 14 digits.');
              }
            }}
            placeholder="#### #### #### ##"
            maxLength="14"
            className="credit-card-input"
          />
          {creditCardError && <p className="error-message">{creditCardError}</p>}
          <button onClick={handleSave} className="save-button">Save Changes</button>
          <Link to="/chat" className="chat-link">Chat with Admin</Link>
          <Link to="/reviews" className="reviews-link">Go to Reviews</Link>
        </div>
      </div>
      <h3>My Favorites</h3>
      <div className="favorites-container">
        {favorites.length > 0 ? (
          favorites.map(product => (
            <div key={product.id} className="product-card">
              <img src={product.image} alt={product.title} className="product-image" />
              <div className="product-details">
                <p className="product-price">${product.price}</p>
                <button 
                  onClick={() => handleBuyClick(product)} 
                  className="buy-button"
                >
                  Buy
                </button>
                <button 
                  onClick={() => handleDeleteFavorite(product.id)} 
                  className="delete-button"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No favorite products yet.</p>
        )}
      </div>
      {isPurchasing && (
        <div className="purchase-form">
          <h3>Complete Your Purchase</h3>
          <label htmlFor="cvv">CVV:</label>
          <input
            type="text"
            id="cvv"
            value={cvv}
            onChange={(e) => {
              const newValue = e.target.value.replace(/\D/g, '');
              if (newValue.length <= 3) {
                setCvv(newValue);
              }
            }}
            placeholder="Enter CVV"
            maxLength="3"
          />
          <label htmlFor="size">Size:</label>
          <select
            id="size"
            value={size}
            onChange={(e) => setSize(e.target.value)}
          >
            <option value="Small">Small</option>
            <option value="Medium">Medium</option>
            <option value="Large">Large</option>
            <option value="XL">XL</option>
            <option value="XXL">XXL</option>
          </select>
          <label htmlFor="quantity">Quantity:</label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            min="1"
          />
          <label htmlFor="address">Address:</label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter address"
          />
          <label htmlFor="contact-phone">Contact Phone:</label>
          <input
            type="tel"
            id="contact-phone"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            placeholder="+1234567890"
          />
          <button onClick={handlePurchase} className="purchase-button">Complete Purchase</button>
          <button onClick={() => setIsPurchasing(false)} className="cancel-button">Cancel</button>
          {purchaseMessage && <p className="purchase-message">{purchaseMessage}</p>}
        </div>
      )}
      {/* Display all purchase details for the current user */}
      {purchaseDetails.length > 0 && (
        <div className="purchase-history">
          <h3>Purchase History</h3>
          {purchaseDetails.map((details, index) => (
            <div key={index} className="purchase-details-card">
              <div className="purchase-details">
                <img
                  src={details.product.image}
                  alt={details.product.title}
                  className="purchase-product-image"
                />
                <div className="purchase-product-info">
                  <p><strong>Product:</strong> {details.product.title}</p>
                  <p><strong>Price per Unit:</strong> ${details.product.price}</p>
                  <p><strong>Quantity:</strong> {details.quantity}</p>
                  <p><strong>Total Price:</strong> ${details.totalPrice}</p>
                  <p><strong>Size:</strong> {details.size}</p>
                  <p><strong>Address:</strong> {details.address}</p>
                  <p><strong>Contact Phone:</strong> {details.contactPhone}</p>
                  <p><strong>Estimated Delivery:</strong> {details.deliveryTime} hours</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
