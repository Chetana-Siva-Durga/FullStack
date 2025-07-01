import mongoose from 'mongoose';

const foodItemSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true },
    description: { type: String },
    category:    { type: String, required: true },
    price:       { type: Number, required: true },
    image:       { type: String, required: true },
  },
  { timestamps: true }
);

const FoodItem = mongoose.model('FoodItem', foodItemSchema);

export default FoodItem;
