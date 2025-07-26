import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCost, setTotalCost] = useState(0);
  const [message, setMessage] = useState('');
  const [otp, setOtp] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('user')).token;
        const response = await axios.get('/api/users/getcart', {
          headers: {
            Authorization: `Bearer ${token}`
          },
        });
        setCartItems(response.data.cartItems);
        setLoading(false);

        // Calculate total cost
        const total = response.data.cartItems.reduce((sum, item) => sum + parseFloat(item.price), 0);
        setTotalCost(total);
      } catch (error) {
        setError('Error fetching cart items');
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const handleRemoveFromCart = async (itemId) => {
    try {
      const token = JSON.parse(localStorage.getItem('user')).token;
      await axios.delete(`/api/users/cart/${itemId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      const updatedCartItems = cartItems.filter(item => item._id !== itemId);
      setCartItems(updatedCartItems);

      // Update total cost
      const total = updatedCartItems.reduce((sum, item) => sum + parseFloat(item.price), 0);
      setTotalCost(total);
    } catch (error) {
      setError('Error removing item from cart');
    }
  };

  const handlePlaceOrder = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('user')).token;
      const itemIds = cartItems.map(item => item._id);
      const response = await axios.post('/api/orders/add', { items: itemIds }, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      setCartItems([]);
      setMessage('Order placed successfully! OTP vanishes in 10 seconds .');
      setOtp(response.data.otp);
      setTimeout(() => {
        setMessage('');
        setOtp('');
      }, 10000);
    } catch (error) {
      setError('Error placing order');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <div className='bg-background flex flex-col items-center justify-center min-h-screen'>
        <Navbar handleLogout={handleLogout} />
        <div className='container mx-auto p-4'>
          {cartItems.length > 0 && <h1 className='text-4xl mb-4 text-green-500 mt-20'>Your Cart</h1>}
          
          {cartItems.length === 0 ? (
            <div className='text-center text-4xl mb-4 text-gray-500'>Your cart is empty</div>
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
              {cartItems.map(item => (
                <div key={item._id} className='bg-white p-4 rounded-lg shadow-md flex flex-col justify-between'>
                  <h2 className='text-xl font-bold mb-2'>{item.name}</h2>
                  <p className='text-gray-700 mb-2'>{item.description}</p>
                  <p className='text-gray-900 font-semibold'>Price: {item.price}</p>
                  <p className='text-gray-700'>Category: {item.category}</p>
                  <div className='mt-4'>
                    <h3 className='text-lg font-semibold'>Seller Information</h3>
                    <p className='text-gray-700'>Name: {item.sellerID.firstName} {item.sellerID.lastName}</p>
                    <p className='text-gray-700'>Email: {item.sellerID.email}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveFromCart(item._id)}
                    className='mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-300'
                  >
                    Remove from Cart
                  </button>
                </div>
              ))}
            </div>
          )}
          {cartItems.length > 0 && (<div className='text-center text-2xl mt-6 text-blue-500'>
            Total Cost: ${totalCost.toFixed(2)}
          </div>)}
          
          {message && (
            <div className='text-center text-3xl text-green-500 mt-4'>
              {message}
            </div>
          )}
          {otp && (
            <div className='text-center text-3xl text-green-500 mt-4'>
              Your OTP: {otp}
            </div>
          )}
          {cartItems.length > 0 && (
            <div className='flex flex-wrap justify-center mt-8'>
              <button
                onClick={handlePlaceOrder}
                className='bg-green-500 text-white px-4 py-2 m-2 rounded hover:bg-green-300'
              >
                Place Order
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;