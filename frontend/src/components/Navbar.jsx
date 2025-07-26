import React from 'react'
import { Link } from 'react-router-dom';
import logo from '../assets/IIITH_Logo.jpg'
import { RiMenu4Line,RiCloseFill } from 'react-icons/ri'
import { RiLogoutCircleRLine } from "react-icons/ri";
import PhoneNavbar from './PhoneNavbar';

const Navbar = ({handleLogout}) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  }

  return (

    <>
      {isMenuOpen && <PhoneNavbar setIsMenuOpen={setIsMenuOpen} handleLogout={handleLogout}/>} 

      <div className="bg-white w-full flex justify-between items-center px-6 py-1 sm:p-3 sm:px-24 absolute top-0 drop-shadow-md transition-all">
        <img src={logo} alt="logo" className="w-40 sm;w-45" />

        <ul className="hidden md:flex md:gap-12">
          <li>
            <Link to="/profile" className="menu-item">Profile</Link>
          </li>
          <li>
            <Link to="/addItem" className="menu-item">Add Item</Link>
          </li>
          <li>
            <Link to="/SearchItems" className="menu-item">Search</Link>
          </li>
          <li>
            <Link to="/history" className="menu-item">History</Link>
          </li>
          <li>
            <Link to="/deliver" className="menu-item">Deliver</Link>
          </li>
          <li>
            <Link to="/cart" className="menu-item">Cart</Link>
          </li>
        </ul>
        <button onClick={handleLogout} className='hidden text-base px-3 rounded cursor-pointer md:block'>
          <RiLogoutCircleRLine size={30} color='green'/>
        </button>
        <button onClick={()=>{setIsMenuOpen(true)}} className='w-11 h-11 bg-green-100 text-2xl text-green-500 flex items-center justify-center rounded md:hidden z-50'>
          {isMenuOpen? <RiCloseFill/> : <RiMenu4Line />}
        </button>
      </div>

    </>
  );
};


export default Navbar
