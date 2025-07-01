import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const authMiddleware = async (req, res, next) => {
  let token;

  try {
    // Look for token in header (or future: cookie)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: '❌ No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: '❌ User not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('❌ Auth Middleware Error:', {
      message: err.message,
      stack: err.stack,
    });

    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: '❌ Token expired' });
    }

    res.status(401).json({ message: '❌ Token invalid' });
  }
};

export default authMiddleware;
