// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const authMiddleware = async (req, res, next) => {
  let token;

  // Look for token in Authorization header: "Bearer <token>"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // If no token, block the request
  if (!token) {
    return res.status(401).json({ message: '❌ No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info (without password) to req.user
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: '❌ User not found' });
    }

    req.user = user;

    next(); // ✅ continue to the next middleware/controller
  } catch (err) {
    console.error('❌ Token verification failed:', err.message);
    res.status(401).json({ message: '❌ Token invalid' });
  }
};

export default authMiddleware; // ✅ ES module default export
