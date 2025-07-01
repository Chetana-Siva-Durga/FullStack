import FoodItem from '../models/FoodItem.js';

// backend/controllers/foodController.js

export const getFoodItems = async (req, res) => {
  try {
    const items = await FoodItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



export const addFoodItem = async (req, res) => {
  try {
    const { name, description, category, price } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const item = await FoodItem.create({ name, description, category, price, image });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
