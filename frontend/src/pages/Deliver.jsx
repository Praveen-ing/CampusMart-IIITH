import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const Deliver = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [otp, setOtp] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('user')).token;
        const response = await axios.get('/api/orders/seller', {
          headers: {
            Authorization: `Bearer ${token}`
          },
        });
        setOrders((response.data.orders).filter(order => order.status === 'Pending'));
        setLoading(false);
      } catch (error) {
        setError('Error fetching orders');
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleOtpChange = (orderId, value) => {
    setOtp(prevOtp => ({ ...prevOtp, [orderId]: value }));
  };

  const handleCompleteTransaction = async (orderId) => {
    try {
      const token = JSON.parse(localStorage.getItem('user')).token;
      const response = await axios.put('/api/orders/verify', { orderId, otp: otp[orderId] }, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      setMessage(response.data.msg);
      setOrders(orders.filter(order => order.status === 'Pending'));
      setOtp(prevOtp => ({ ...prevOtp, [orderId]: '' }));
      setTimeout(() => {
        setMessage('');
        window.location.reload(); // Reload the page
      }, 3000);
    } catch (error) {
      setError(error.response.data.msg || 'Invalid OTP'); 
      setTimeout(() => {
        setError('');

      }, 2000);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }  

  return (
    <>
      <div className='bg-background flex flex-col items-center justify-center min-h-screen'>
        <Navbar handleLogout={handleLogout} />

        {message && (
            <div className='text-center text-3xl text-green-500 mt-4'>
              {message}
            </div>
          )}
          {error && (
            <div className='text-center text-4xl text-red-500 mt-4'>
              {error}
            </div>
          )}

        <div className='container mx-auto p-4'>
          {orders.length !== 0 && <h1 className='text-2xl mb-4'>Items to be Delivered</h1>}
          {orders.length === 0 ? (
            <div className='text-center text-4xl mb-4 text-gray-500'>No items to be delivered</div>
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
              {orders.map(order => (
                <div key={order._id} className='bg-white p-4 rounded-lg shadow-md'>
                  {order.itemID && (
                    <>
                      <h2 className='text-xl font-bold mb-2'>{order.itemID.name}</h2>
                      <p className='text-gray-900 font-semibold'>Price: {order.itemID.price}</p>
                    </>
                  )}
                  <p className='text-gray-700'>Status: {order.status}</p>
                  <div className='mt-4'>
                    <h3 className='text-lg font-semibold'>Buyer Information</h3>
                    <p className='text-gray-700'>Name: {order.buyerID.firstName} {order.buyerID.lastName}</p>
                    <p className='text-gray-700'>Email: {order.buyerID.email}</p>
                  </div>
                  <div className='mt-4'>
                    <input
                      type='text'
                      value={otp[order._id] || ''}
                      onChange={(e) => handleOtpChange(order._id, e.target.value)}
                      placeholder='Enter OTP'
                      className='input-box'
                    />
                    <button
                      onClick={() => handleCompleteTransaction(order._id)}
                      className='w-full mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-300'
                    >
                      Complete Transaction
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Deliver;