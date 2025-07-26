import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const Item = () => {

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const token = JSON.parse(localStorage.getItem('user')).token;
                const response = await axios.get(`/api/items/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                });
                console.log("API Response:", response.data);
                setItem(response.data);
                setLoading(false);
            } catch (error) {
                setError('Error fetching item');
                setLoading(false);
            }
        };

        fetchItem();
    }, [id]);

    const handleAddToCart = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('user')).token;
            const response = await axios.post('/api/users/cart', { itemId: id }, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });
            setMessage(response.data.msg);
            setTimeout(() => {
                setMessage('');
            }, 3000);
        } catch (error) {
            setMessage(error.response.data.msg);
            setTimeout(() => {
                setMessage('');
            }, 3000);
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
                    <div className='bg-white p-4 rounded-lg shadow-md'>
                        <h2 className='text-xl font-bold mb-2'>{item.name}</h2>
                        <p className='text-gray-700 mb-2'>{item.description}</p>
                        <p className='text-gray-900 font-semibold'>Price:{item.price}</p>
                        <p className='text-gray-700'>Category: {item.category}</p>
                        <div className='mt-4'>
                            <h3 className='text-lg font-semibold'>Seller Information</h3>
                            <p className='text-gray-700'>Name: {item.sellerID.firstName} {item.sellerID.lastName}</p>
                            <p className='text-gray-700'>Email: {item.sellerID.email}</p>
                        </div>
                        <button onClick={handleAddToCart} className='mt-4 bg-orange-500 text-white px-4 py-2 rounded hover:bg-green-300'>
                            Add to Cart
                        </button>
                        {message && <p className='mt-4 text-orange-500'>{message}</p>}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Item;