import express from 'express';
import { getFoodItems, addFoodItem } from '../controllers/foodController.js';
import multer from 'multer';
import path from 'path';

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // save to uploads folder
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

const router = express.Router();

// Routes
router.get('/', getFoodItems);
router.post('/add', upload.single('image'), addFoodItem);

export default router;
