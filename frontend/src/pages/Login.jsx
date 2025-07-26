import React from 'react'
import { Link,useNavigate } from 'react-router-dom'
import Password from '../components/Password'
import { validateEmail } from '../utils/helperfunc';
import logo2 from "../assets/iiith25.png";
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [err, setErr] = React.useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        console.log(email, password);

        if (!validateEmail(email)) {
            setErr('Please enter a valid IIIT email address');
            return;
        }
        if (!password) {
            setErr('Please enter a password');
            return;
        }


        setErr(null);

        await axios.post('/api/users/login', {
            email,
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

        // Call the login API here
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

                

                <div className='w-106 bg-white p-8 rounded-lg shadow-lg'>
                    <form onSubmit={handleLogin}>

                        <div className='flex flex-row items-center justify-between'>
                        <h4 className='text-3xl mb-7 text-orange-500'>Login</h4>
                        <img src={logo2} className='w-15 h-15 mb-4' />
                        </div>

                        <input type="text" placeholder='Email' className='input-box'
                            value={email} onChange={(e) => setEmail(e.target.value)}
                        />

                        <Password
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        {err && <p className='text-red-500 text-m mb-2'>{err}</p>}

                        <button type="submit" className='btn-primary'>Login</button>

                        <p className='text-sn text-center mt-4'>Forgot your password? {" "}
                            <Link to='/forgot-password' className='text-green-500 cursor-pointer'> Reset Here</Link>
                        </p>

                        <hr className='my-6' />

                        <p className='text-sn text-center mt-4'>Don't have an account? {" "}
                            <Link to='/register' className='text-green-500 cursor-pointer'> Register Here</Link>
                        </p>

                    </form>
                </div>
            </div>
        </>
    )
}

export default Login