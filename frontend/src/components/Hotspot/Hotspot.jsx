import React, { useState } from 'react';
import './Hotspot.css';
import { food_list } from '../../assets/assets';
import FoodItem from '../FoodItem/FoodItem';

import blissbite from './blissbite.jpg';
import spicevilla from './spicevilla.jpg';
import greenfork from './greenfork.jpg';
import firewood from './firewood.jpg';
import coastline from './coastline.jpg';

const restaurantMenus = {
  blissbite: ['33', '37', '1', '5', '9', '13', '17', '21', '25', '29'],
  spicevilla: ['34', '38', '2', '6', '10', '14', '18', '22', '26', '30'],
  greenfork: ['35', '39', '3', '7', '11', '15', '19', '23', '27', '31'],
  firewood: ['36', '40', '4', '8', '12', '16', '20', '24', '28', '32'],
  coastline: ['33', '37', '1', '5', '9', '13', '17', '21', '25', '29']
};

const restaurants = [
  { id: 1, name: 'BlissBite Café', image: blissbite, route: 'blissbite' },
  { id: 2, name: 'Spice Villa', image: spicevilla, route: 'spicevilla' },
  { id: 3, name: 'The Green Fork', image: greenfork, route: 'greenfork' },
  { id: 4, name: 'Firewood Grill', image: firewood, route: 'firewood' },
  { id: 5, name: 'Coastline Curries', image: coastline, route: 'coastline' },
];

const Hotspot = () => {
  const [openRestaurant, setOpenRestaurant] = useState(null);

  const handleRestaurantClick = (route) => {
    setOpenRestaurant((prev) => (prev === route ? null : route));
  };

  return (
    <div className="hotspot">
      <h1 className="title">🍽️ Popular Hotspots</h1>
      <div className="restaurant-scroll">
        {restaurants.map((rest) => (
          <div
            key={rest.id}
            className={`restaurant-square ${openRestaurant === rest.route ? 'active' : ''}`}
            onClick={() => handleRestaurantClick(rest.route)}
          >
            <img src={rest.image} alt={rest.name} />
            <p>{rest.name}</p>
          </div>
        ))}
      </div>

      {openRestaurant && (
        <div className="restaurant-menu">
          <h3 className="menu-title">
            {
              restaurants.find(r => r.route === openRestaurant)?.name
            } Menu
          </h3>
          <div className="menu-grid">
            {restaurantMenus[openRestaurant].map((menuId) =>
              food_list
                .filter((item) => item._id === menuId)
                .map((item) => (
                  <FoodItem
                    key={item._id}
                    id={item._id}
                    name={item.name}
                    price={item.price}
                    description={item.description}
                    image={item.image}
                  />
                ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Hotspot;
