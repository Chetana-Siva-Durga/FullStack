import React from 'react';
import { useParams } from 'react-router-dom';
import { food_list } from '../../assets/assets';
import FoodItem from '../FoodItem/FoodItem';
import './RestaurantMenu.css';

const restaurantMenus = {
  blissbite: ['33', '37', '1', '5', '9', '13', '17', '21', '25', '29'],
  spicevilla: ['34', '38', '2', '6', '10', '14', '18', '22', '26', '30'],
  greenfork: ['35', '39', '3', '7', '11', '15', '19', '23', '27', '31'],
  firewood: ['36', '40', '4', '8', '12', '16', '20', '24', '28', '32'],
  coastline: ['33', '37', '1', '5', '9', '13', '17', '21', '25', '29']
};

const RestaurantMenu = () => {
  const { restaurantName } = useParams();
  const selectedMenu = restaurantMenus[restaurantName] || [];
  const itemsToShow = food_list.filter(item => selectedMenu.includes(item._id));

  return (
    <div className="restaurant-menu-container">
      <h2 className="restaurant-menu-title">
        {restaurantName ? restaurantName.charAt(0).toUpperCase() + restaurantName.slice(1) : ''} Menu
      </h2>
      {itemsToShow.length > 0 ? (
        <div className="menu-grid">
          {itemsToShow.map(item => (
            <FoodItem
              key={item._id}
              id={item._id}
              name={item.name}
              price={item.price}
              description={item.description}
              image={item.image}
            />
          ))}
        </div>
      ) : (
        <p className="no-items-text">No items found for this restaurant.</p>
      )}
    </div>
  );
};

export default RestaurantMenu;
