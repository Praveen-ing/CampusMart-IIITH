import React from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import logo2 from "../assets/iiith25.png";
import axios from 'axios';

const AddItem = () => {
  const [name, setName] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [err, setErr] = React.useState(null);
  const [success, setSuccess] = React.useState(null);
  const navigate = useNavigate();

  const categories = [
    'Electronics',
    'Books',
    'Clothing',
    'Furniture', 
    'Sports',
    'Vehicles',
    'Food',
    'Stationery',
    'Others'
  ];

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    console.log(name, price, description, category);

    // Validation
    if (!name.trim()) {
      setErr('Please enter item name');
      return;
    }
    if (!price || price <= 0) {
      setErr('Please enter a valid price');
      return;
    }
    if (!description.trim()) {
      setErr('Please enter item description');
      return;
    }
    if (!category) {
      setErr('Please select a category');
      return;
    }

    setErr(null);

    try {
      const token = JSON.parse(localStorage.getItem('user')).token;
      const response = await axios.post('/api/items/add', {
        name: name.trim(),
        price: parseFloat(price),
        description: description.trim(),
        category
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log(response.data);
      setSuccess('Item added successfully!');
      
      // Clear form
      setName('');
      setPrice('');
      setDescription('');
      setCategory('');

      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);

    } catch (error) {
      console.log(error.response?.data);
      setErr(error.response?.data?.msg || 'Failed to add item');
    }
  };

  React.useEffect(() => {
    if (err) {
      const timer = setTimeout(() => {
        setErr(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [err]);

  return (
    <>
      <div className='bg-background flex flex-col items-center justify-center min-h-screen'>
        <Navbar handleLogout={handleLogout} />
        
        <div className='bg-white p-8 rounded-lg shadow-lg mt-20 w-full max-w-md'>
          <form onSubmit={handleAddItem}>
            
            <div className='flex flex-row items-center justify-around mb-6'>
              <h4 className='text-3xl text-orange-500'>Add Item</h4>
              {/* <img src={logo2} className='w-15 h-15' alt="IIITH Logo" /> */}
            </div>

            <input 
              type="text" 
              placeholder='Item Name' 
              className='input-box'
              value={name} 
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
            />

            <input 
              type="number" 
              placeholder='Price (₹)' 
              className='input-box'
              value={price} 
              onChange={(e) => setPrice(e.target.value)}
              min="0"
              step="0.01"
            />

            <textarea 
              placeholder='Description' 
              className='input-box min-h-24 resize-vertical'
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
              rows={3}
            />

            <select 
              className='input-box'
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            {err && <p className='text-red-500 text-sm mb-2'>{err}</p>}
            {success && <p className='text-green-500 text-sm mb-2'>{success}</p>}

            <button type="submit" className='btn-primary'>
              Add Item
            </button>

            <div className='text-center mt-4'>
              <button 
                type="button"
                onClick={() => navigate('/SearchItems')}
                className='text-green-500 cursor-pointer hover:underline'
              >
                View All Items
              </button>
            </div>

          </form>
        </div>
      </div>
    </>
  )
}

export default AddItem