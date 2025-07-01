import React, { useEffect, useState } from 'react';
import './Header.css';
import chefImage from './img.png'; // Image in the same header folder

const Header = () => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setAnimate(true), 300);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="header">
      <div className="header-left-only">
        <div className={`header-main-content ${animate ? 'visible' : ''}`}>
          <h2 className="main-heading">Crave it? Order it!</h2>
          <hr className="main-divider" />
          <p className="main-desc">
            Experience the perfect balance of taste and quality with our menu,
            featuring a wide selection of dishes designed to satisfy and delight.
          </p>
        </div>
      </div>
      <div className="header-right-image">
        <img src={chefImage} alt="Chef Special" />
      </div>
    </div>
  );
};

export default Header;
