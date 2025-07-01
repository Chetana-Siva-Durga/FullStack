import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetCode: { type: String },

  // ADD THIS FIELD: stores cart items as a map of itemId => quantity
  cart: {
    type: Map,
    of: Number,
    default: {},
  },
addresses: {
  type: [
    {
      _id: String, // ✅ add this line
      firstName: String,
      lastName: String,
      email: String,
      street: String,
      city: String,
      state: String,
      zip: String,
      country: String,
      phone: String,
    }
  ],
  default: [],
},


}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
