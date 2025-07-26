import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Password from '../components/Password'
import { validateEmail, validateContactNumber } from '../utils/helperfunc';
import logo2 from "../assets/iiith25.png";
import axios from 'axios';

const Register = () => {
  const [firstName, setfirstName] = React.useState('');
  const [lastName, setlastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [age, setAge] = React.useState(null);
  const [contactNumber, setcontactNumber] = React.useState(null);
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [err, setErr] = React.useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log(firstName, lastName, email, age, contactNumber, password, confirmPassword);

    if (!firstName) {
      setErr('Please enter your first name');
      return;
    }
    if (!lastName) {
      setErr('Please enter your last name');
      return;
    }
    if (!validateEmail(email)) {
      setErr('Please enter a valid IIIT email address');
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
    //properly validate password and confirm password
    if (!password) {
      setErr('Please enter a password');
      return;
    }
    if (!confirmPassword) {
      setErr('Please confirm your password');
      return;
    }
    if (password !== confirmPassword) {
      setErr('Passwords do not match');
      return;
    }

    setErr(null);

    // Call the register API here
    await axios.post('/api/users/', {
      firstName,
      lastName,
      email,
      age,
      contactNumber,
      password
    }).then((response) => {
      console.log(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
      navigate('/profile');
    }).catch((error) => {
      console.log(error.response.data);
      setErr(error.response.data.msg);
      return;
    });

  }

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

      <div className='flex flex-col items-center justify-center min-h-screen'>

        <div className='bg-white p-8 rounded-lg shadow-lg'>
          <form onSubmit={handleRegister}>

            <div className='flex flex-row items-center justify-between'>
              <h4 className='text-3xl mb-7 text-orange-500'>Register</h4>
              <img src={logo2} className='w-15 h-15 mb-4' />
            </div>

            <div className='flex flex-row items-center justify-between flex-wrap'>
            <input type="text" placeholder='FirstName' className='input-box'
              value={firstName} onChange={(e) => setfirstName(e.target.value)}
            />

            <input type="text" placeholder='LastName' className='input-box'
              value={lastName} onChange={(e) => setlastName(e.target.value)}
            />
            </div>

            <input type="text" placeholder='Email' className='input-box'
              value={email} onChange={(e) => setEmail(e.target.value)}
            />

            <input type='number' placeholder='Age' className='input-box'
              value={age} onChange={(e) => setAge(e.target.value)}
            />

            <input type='number' placeholder='Contact Number' className='input-box'
              value={contactNumber} onChange={(e) => setcontactNumber(e.target.value)}
            />

            <Password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Password
              placeholder='Confirm Password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {err && <p className='text-red-500 text-m mb-2'>{err}</p>}

            <button type="submit" className='btn-primary'>Sign Up</button>

            <p className='text-sn text-center mt-4'>Already have an account? {" "}
              <Link to='/' className='text-green-500 cursor-pointer'> Login Here</Link>
            </p>

          </form>
        </div>
      </div>
    </>
  )
}

export default Register