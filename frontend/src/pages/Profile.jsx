import React from 'react'
import Navbar from '../components/Navbar'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from "/cropped-IIIT-Favicon-32x32.png";
import { validateContactNumber } from '../utils/helperfunc';


const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = React.useState(false);
  const [userDetails, setUserDetails] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    age: null,
    contactNumber: ''
  });

  const [originalDetails, setOriginalDetails] = React.useState({});
  const [err, setErr] = React.useState(null);

  React.useEffect(() => {
    const fetchUserDetails = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.token) {
        navigate('/');
        return;
      }

      try {
        const token = JSON.parse(localStorage.getItem('user')).token;
        const response = await axios.get('/api/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUserDetails(response.data);
        setOriginalDetails(response.data);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({ ...userDetails, [name]: value });
  };

  const toggleEdit = () => {
    if (isEditing) {
      setUserDetails(originalDetails);
    }
    setIsEditing(!isEditing);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(userDetails);
    const { firstName, lastName, age, email,contactNumber } = userDetails;

    if (!firstName) {
      setErr('Please enter your first name');
      return;
    }
    if (!lastName) {
      setErr('Please enter your last name');
      return;
    }
    if (!age || age < 0 || age > 150) {
      setErr('Please enter a valid age');
      return;
    }
    if (!validateContactNumber(contactNumber)) {
      setErr('Please enter a valid contact number');
      return;
    }
    setErr(null);
    const token = JSON.parse(localStorage.getItem('user')).token;
    await axios.put('/api/users/update', {
      firstName,
      lastName,
      age,
      contactNumber
    },{
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((response) => {
      console.log(response.data);
      setUserDetails(response.data);
      setOriginalDetails(response.data);
      setIsEditing(false);
    }
    ).catch((error) => {
      console.log(error.response.data);
      return;
    });
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
        <div className='text-4xl mb-4 text-green-500'>Hello, {userDetails.firstName}</div>
        <div className='bg-white p-8 rounded-lg shadow-lg'>
          <form onSubmit={handleSubmit}>
            <div className='flex flex-row items-center justify-between'>
              <h4 className='text-4xl mb-7 text-orange-500'>Profile</h4>
              <img src={logo} className='w-15 h-15 mb-4' />
            </div>
            <div className='flex flex-row items-center justify-between flex-wrap'>
              <div className='mb-4'>
                <label className='block text-gray-700'>FirstName</label>
                <input
                  type='text'
                  name='firstName'
                  value={userDetails.firstName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className='input-box'
                />
              </div>
              <div className='mb-4'>
                <label className='block text-gray-700'>LastName</label>
                <input
                  type='text'
                  name='lastName'
                  value={userDetails.lastName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className='input-box'
                />
              </div>
            </div>
            <div className='mb-4'>
                <label className='block text-gray-700'>Email</label>
                <input
                  type='email'
                  name='email'
                  value={userDetails.email}
                  onChange={handleChange}
                  disabled={true}
                  className='input-box'
                />
              </div>
            <div className='mb-4'>
              <label className='block text-gray-700'>Age</label>
              <input
                type='number'
                name='age'
                value={userDetails.age}
                onChange={handleChange}
                disabled={!isEditing}
                className='input-box'
              />
            </div>
            <div className='mb-4'>
              <label className='block text-gray-700'>Contact Number</label>
              <input
                type='text'
                name='contactNumber'
                value={userDetails.contactNumber}
                onChange={handleChange}
                disabled={!isEditing}
                className='input-box'
              />
            </div>
            {err && <p className='text-red-500 text-m mb-2'>{err}</p>}
            {isEditing && (
              <button
                type='submit'
                className='bg-orange-500 text-white px-4 py-2 rounded hover:bg-green-300'
              >
                Save
              </button>
            )}
            <button
              type='button'
              onClick={toggleEdit}
              className='bg-orange-500 text-white px-4 py-2 rounded ml-4 hover:bg-green-300'
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Profile
