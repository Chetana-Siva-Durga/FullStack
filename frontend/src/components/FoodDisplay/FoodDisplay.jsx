import React, { useContext } from 'react';
import './FoodDisplay.css';
import { StoreContext } from '../../context/StoreContext';
import FoodItem from '../FoodItem/FoodItem';

const FoodDisplay = ({ category }) => {
  // Get the food list from context
  const { food_list } = useContext(StoreContext);

  // If no category is selected, don't render anything
  if (!category) return null;

  // Filter items based on selected category
  const filteredItems = food_list.filter(
    item => category === "All items" || item.category === category
  );

  return (
    <div className='food-display' id='food-display'>
      <h1>Foodie Faves</h1>
      <div className="food-display-list">
        {filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <FoodItem
              key={item._id}
              id={item._id}
              name={item.name}
              description={item.description}
              price={item.price}
              image={item.image}
            />
          ))
        ) : (
          <p
            style={{
              textAlign: 'center',
              color: '#888',
              margin: '32px 0',
              width: '100%',
            }}
          >
            No items found in this category.
          </p>
        )}
      </div>
    </div>
  );
};

export default FoodDisplay;
