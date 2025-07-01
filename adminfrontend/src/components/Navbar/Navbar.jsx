import React from 'react';
import { assets } from '../../assets/assets'; 
import './Navbar.css';

const Navbar = () => {
  return (
    <div className='navbar'>
      <span className="logo-text">
        <span className="logo-f">F</span>lavour <span className="logo-f">D</span>ash
      </span>
      <img className='profile' src={assets.profile_image} alt="profile" />
    </div>
  );
};

export default Navbar;
