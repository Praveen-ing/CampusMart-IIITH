import React from 'react'
import logo from '../assets/IIITH_Logo.jpg'
import { Link } from 'react-router-dom';
import { RiMenu4Line } from 'react-icons/ri'
import { RiLogoutCircleRLine } from "react-icons/ri";

const PhoneNavbar = ({ setIsMenuOpen, handleLogout }) => {
    return (
        <div className="w-screen fixed top-0 z-20">
            <div className='w-1/2 h-screen flex flex-col p-8 bg-gray-100'>
                <img src={logo} className="w-30 object-contain mb-8" />
                <ul>
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
                <button className='h-10 md;block' onClick={handleLogout}>
                    <div className='flex items-center justify-center cursor-pointer bg-orange-500 hover:bg-green-300 text-white rounded-lg px-4 py-2'>
                        <RiLogoutCircleRLine size={25}/> {" "}LOGOUT
                    </div>
                </button>
            </div>
            <div onClick={() => { setIsMenuOpen(false) }} className="w-screen h-screen absolute inset-0 bg-black/50 fixed top-0 -z-10"></div>
        </div>
    );
};

export default PhoneNavbar