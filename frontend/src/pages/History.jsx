import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const History = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [soldorders, setsoldOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('user')).token;
        const response = await axios.get('/api/orders/buyer', {
          headers: {
            Authorization: `Bearer ${token}`
          },
        });
        console.log(response.data.orders);
        setOrders(response.data.orders);
        setLoading(false);
      } catch (error) {
        setError('Error fetching orders');
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const fetchsoldOrders = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('user')).token;
        const response = await axios.get('/api/orders/seller', {
          headers: {
            Authorization: `Bearer ${token}`
          },
        });
        setsoldOrders(response.data.orders);
        setLoading(false);
      } catch (error) {
        setError('Error fetching orders');
        setLoading(false);
      }
    };

    fetchsoldOrders();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const pendingOrders = orders.filter(order => order.status === 'Pending');
  const boughtItems = orders.filter(order => order.status !== 'Pending');
  const soldItems = soldorders.filter(order => order.status !== 'Pending');

  return (
    <>
      <div className='bg-background flex flex-col items-center justify-center min-h-screen'>
        <Navbar handleLogout={handleLogout} />
        <div className='container mx-auto p-4'>
          <h1 className='text-2xl mb-4'>Order History</h1>
          <h2 className='text-xl mb-2'>Pending Orders</h2>
          <div className='bg-white w-full flex justify-between items-center px-2 py-2 drop-shadow-md'>

            {pendingOrders.length === 0 ? (
              <div className='text-center text-gray-500'>No pending orders</div>
            ) : (
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                {pendingOrders.map(order => (
                  <div key={order._id} className='bg-white p-4 rounded-lg shadow-md'>
                    <h2 className='text-xl font-bold mb-2'>{order.itemID.name}</h2>
                    <p className='text-gray-900 font-semibold'>Price: {order.itemID.price}</p>
                    <p className='text-gray-700'>Status: {order.status}</p>
                    <div className='mt-4'>
                      <h3 className='text-lg font-semibold'>Seller Information</h3>
                      <p className='text-gray-700'>Name: {order.sellerID.firstName} {order.sellerID.lastName}</p>
                      <p className='text-gray-700'>Email: {order.sellerID.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <h2 className='text-xl mb-2 mt-8'>Bought Items</h2>
          <div className='bg-white w-full flex justify-between items-center px-2 py-2 drop-shadow-md'>
            {boughtItems.length === 0 ? (
              <div className='text-center text-gray-500'>No items bought</div>
            ) : (
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                {boughtItems.map(order => (
                  <div key={order._id} className='bg-white p-4 rounded-lg shadow-md'>
                    <h2 className='text-xl font-bold mb-2'>{order.itemID.name}</h2>
                    <p className='text-gray-900 font-semibold'>Price: {order.itemID.price}</p>
                    <p className='text-gray-700'>Status: {order.status}</p>
                    <div className='mt-4'>
                      <h3 className='text-lg font-semibold'>Seller Information</h3>
                      <p className='text-gray-700'>Name: {order.sellerID.firstName} {order.sellerID.lastName}</p>
                      <p className='text-gray-700'>Email: {order.sellerID.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <h2 className='text-xl mb-2 mt-8'>Sold Items</h2>
          <div className='bg-white w-full flex justify-between items-center px-2 py-2 drop-shadow-md'>

          {soldItems.length === 0 ? (
            <div className='text-center text-gray-500'>No items sold</div>
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
              {soldItems.map(order => (
                <div key={order._id} className='bg-white p-4 rounded-lg shadow-md'>
                  <h2 className='text-xl font-bold mb-2'>{order.itemID.name}</h2>
                  <p className='text-gray-900 font-semibold'>Price: {order.itemID.price}</p>
                  <p className='text-gray-700'>Status: {order.status}</p>
                  <div className='mt-4'>
                    <h3 className='text-lg font-semibold'>Buyer Information</h3>
                    <p className='text-gray-700'>Name: {order.buyerID.firstName} {order.buyerID.lastName}</p>
                    <p className='text-gray-700'>Email: {order.buyerID.email}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          </div>
        </div>
      </div>
    </>
  );
};

export default History;