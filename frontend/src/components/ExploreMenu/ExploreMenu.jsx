import React from 'react';
import './ExploreMenu.css';
import { menu_list } from '../../assets/assets';

const ExploreMenu = ({ category, setCategory }) => {
  const handleCategoryClick = (menuName) => {
    setCategory(prev => prev === menuName ? null : menuName);
  };

  return (
    <div className='explore-menu' id='explore-menu'>
      <h1>Journey Through Flavors</h1>
      <p className='explore-menu-text'>
        Enjoy a feast of fresh, flavorful dishes designed to delight.
      </p>
      <div className='explore-menu-list'>
        {menu_list.map((item, index) => (
          <div
            key={index}
            className='explore-menu-list-item'
            onClick={() => handleCategoryClick(item.menu_name)}
          >
            <img className={category === item.menu_name ? "active" : ""} src={item.menu_image} alt='' />
            <p>{item.menu_name}</p>
          </div>
        ))}
      </div>
      <hr />
    </div>
  );
};

export default ExploreMenu;
