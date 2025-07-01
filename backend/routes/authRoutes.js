import express from 'express';
import {
  register,
  login,
  forgotPassword,
  verifyResetCode,
  resetPassword
} from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);            // POST /api/auth/register
router.post('/login', login);                  // POST /api/auth/login
router.post('/forgot-password', forgotPassword);      // POST /api/auth/forgot-password
router.post('/verify-reset-code', verifyResetCode);   // POST /api/auth/verify-reset-code
router.post('/reset-password', resetPassword);        // POST /api/auth/reset-password

export default router;
