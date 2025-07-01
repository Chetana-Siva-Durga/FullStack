import React, { useState, useContext } from 'react';
import './Navbar.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import SignIn from '../SignIn/SignIn';

const Navbar = () => {
  const [menu, setMenu] = useState("Home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, user, logout } = useContext(StoreContext);

  const cartHasItems = Object.values(cartItems).some(qty => qty > 0);

  const handleSmoothScroll = (anchor) => {
    const section = document.getElementById(anchor);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleMenuClick = (item, anchor) => {
    setMenu(item);
    setMobileOpen(false);

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => handleSmoothScroll(anchor), 300);
    } else {
      handleSmoothScroll(anchor);
    }
  };

  const handleLogout = () => {
    logout();
    setShowLogoutConfirm(false);
    setShowProfileMenu(false);
    setMenu("Home");
    navigate("/");
  };

  return (
    <div className='navbar'>
      <h1 className="logo-text" onClick={() => handleMenuClick("Home", "home-section")}>
        <span className="logo-f">F</span>lavour <span className="logo-f">D</span>ash
      </h1>

      <ul className={`navbar-main${mobileOpen ? ' open' : ''}`}>
        <li className={menu === "Home" ? "active" : ""} onClick={() => handleMenuClick("Home", "home-section")}>Home</li>
        <li className={menu === "Cravings" ? "active" : ""} onClick={() => handleMenuClick("Cravings", "cravings-section")}>Cravings</li>
        <li className={menu === "Hotspots" ? "active" : ""} onClick={() => handleMenuClick("Hotspots", "hotspots-section")}>Hotspots</li>
        <li className={menu === "About" ? "active" : ""} onClick={() => handleMenuClick("About", "about-section")}>About</li>
        <li className={menu === "Contact Us" ? "active" : ""} onClick={() => handleMenuClick("Contact Us", "contact-section")}>Contact Us</li>
      </ul>

      <div className="navbar-right">
        <div
          className="navbar-search-icon"
          onClick={() => navigate('/cart')}
          style={{ cursor: "pointer", position: "relative" }}
        >
          <i className="fas fa-shopping-basket fa-lg"></i>
          {cartHasItems && <div className="dot"></div>}
        </div>

        {user ? (
          <div style={{ position: "relative" }}>
            <div
              className="navbar-profile"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              title="Account options"
            >
              {user.username.charAt(0).toUpperCase()}
            </div>

            {showProfileMenu && (
              <div className="profile-menu">
                <button onClick={() => { setShowProfileMenu(false); navigate('/orders'); }}>My Orders</button>
                <button onClick={() => { setShowProfileMenu(false); setShowLogoutConfirm(true); }}>Logout</button>
              </div>
            )}

           {showLogoutConfirm && (
  <>
    <div className="logout-overlay" onClick={() => setShowLogoutConfirm(false)} />
    <div className="logout-confirm">
      <p>Are you sure you want to logout?</p>
      <div className="logout-buttons">
        <button onClick={handleLogout}>Yes</button>
        <button onClick={() => setShowLogoutConfirm(false)}>No</button>
      </div>
    </div>
  </>
)}

          </div>
        ) : (
          <button onClick={() => setShowSignIn(true)}>Sign In</button>
        )}
      </div>

      <div className={`hamburger${mobileOpen ? ' open' : ''}`} onClick={() => setMobileOpen(!mobileOpen)}>
        <span />
        <span />
        <span />
      </div>

      {showSignIn && <SignIn onClose={() => setShowSignIn(false)} />}
    </div>
  );
};

export default Navbar;
