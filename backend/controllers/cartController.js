import User from '../models/User.js';

// GET /api/cart - Fetch cart
export const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ cart: user.cart || {} });
  } catch (error) {
    console.error('Fetch cart error:', error);
    res.status(500).json({ message: 'Failed to fetch cart' });
  }
};

// PUT /api/cart - Save cart
export const saveCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { cartItems } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { cart: cartItems },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'Cart saved successfully', cart: user.cart });
  } catch (error) {
    console.error('Save cart error:', error);
    res.status(500).json({ message: 'Failed to save cart' });
  }
};
