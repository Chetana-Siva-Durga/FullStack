import User from '../models/User.js';

// ✅ Get all addresses for the logged-in user
export const getAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('addresses');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ addresses: user.addresses });
  } catch (error) {
    console.error("Fetch addresses error:", error);
    res.status(500).json({ message: 'Server error while fetching addresses' });
  }
};

// ✅ Save a new address for the logged-in user
export const saveAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      firstName, lastName, email, street, city,
      state, zip, country, phone
    } = req.body;

    const newAddress = {
      _id: new Date().valueOf().toString(), // use timestamp as unique ID
      firstName, lastName, email, street, city, state, zip, country, phone,
    };

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.addresses.length >= 3) {
      return res.status(400).json({ message: 'Maximum 3 addresses allowed' });
    }

    user.addresses.push(newAddress);
    await user.save();

    res.status(201).json({ message: 'Address added successfully', addresses: user.addresses });
  } catch (error) {
    console.error("Save address error:", error);
    res.status(500).json({ message: 'Server error while saving address' });
  }
};

// ✅ Update existing address
export const updateAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.params;
    const { firstName, lastName, email, street, city, state, zip, country, phone } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === addressId);
    if (addressIndex === -1) return res.status(404).json({ message: 'Address not found' });

    user.addresses[addressIndex] = {
      ...user.addresses[addressIndex]._doc,  // Keep original _id
      firstName, lastName, email, street, city, state, zip, country, phone,
    };

    await user.save();
    res.status(200).json({ message: 'Address updated successfully', addresses: user.addresses });
  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({ message: 'Server error while updating address' });
  }
};


// ✅ Delete an address by ID for the logged-in user
export const deleteAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    console.log('User addresses:', user.addresses);
    console.log('Requested delete for addressId:', addressId);

    const index = user.addresses.findIndex(addr => addr._id.toString() === addressId);
    if (index === -1) return res.status(404).json({ message: 'Address not found' });

    user.addresses.splice(index, 1);
    await user.save();

    res.status(200).json({ message: 'Address deleted', addresses: user.addresses });
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({ message: 'Server error while deleting address' });
  }
};
