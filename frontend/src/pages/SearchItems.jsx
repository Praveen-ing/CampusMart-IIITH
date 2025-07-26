import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaInfoCircle } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const SearchItems = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('user')).token;
        const response = await axios.get('/api/items', {
          headers: {
            Authorization: `Bearer ${token}`
          },
        });
        const items = response.data;
        setItems(items);
        setFilteredItems(items);
        setLoading(false);

        // Extract unique categories
        const uniqueCategories = [...new Set(items.map(item => item.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        setError('Error fetching items');
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    filterItems(query, selectedCategories);
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    const isChecked = e.target.checked;
    const updatedSelectedCategories = isChecked
      ? [...selectedCategories, category]
      : selectedCategories.filter(c => c !== category);
    setSelectedCategories(updatedSelectedCategories);
    filterItems(searchQuery, updatedSelectedCategories);
  };

  const filterItems = (query, categories) => {
    const filtered = items.filter(item =>
      item.name.toLowerCase().includes(query) &&
      (categories.length === 0 || categories.includes(item.category))
    );
    setFilteredItems(filtered);
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
        <div className='container mx-auto p-4 mt-20'>
          <input
            type='text'
            placeholder='Search items by name...'
            value={searchQuery}
            onChange={handleSearch}
            className='input-box'
          />
          <div className='mb-4'>
            <h3 className='text-lg font-semibold mb-2'>Filter by Category</h3>
            <div className='flex flex-wrap'>
              {categories.map(category => (
                <div key={category} className='flex items-center mb-2 mr-4'>
                  <input
                    type='checkbox'
                    value={category}
                    onChange={handleCategoryChange}
                    className='mr-2'
                  />
                  <label>{category}</label>
                </div>
              ))}
            </div>
          </div>
          {filteredItems.length === 0 ? (
            <div className='text-center text-3xl mb-4 text-gray-500'>No results found</div>
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
              {filteredItems.map(item => (
                <div key={item._id} className='bg-white p-4 rounded-lg shadow-md'>
                  <div className='flex justify-between items-center mb-4'>
                    <h2 className='text-xl font-bold mb-2'>{item.name}</h2>
                    <Link to={`/item/${item._id}`} className='text-blue-500 hover:text-blue-700'>
                      <FaInfoCircle size={24} />
                    </Link>
                  </div>
                  <p className='text-gray-700 mb-2'>{item.description}</p>
                  <p className='text-gray-900 font-semibold'>Price: {item.price}</p>
                  <p className='text-gray-700'>Category: {item.category}</p>
                  <div className='mt-4'>
                    <h3 className=' font-semibold text-lg italic'>Seller Information</h3>
                    <p className='text-gray-700'>Name: {item.sellerID.firstName} {item.sellerID.lastName}</p>
                    <p className='text-gray-700'>Email: {item.sellerID.email}</p>
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

export default SearchItems;