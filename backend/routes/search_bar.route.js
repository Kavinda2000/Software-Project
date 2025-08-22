import express from 'express';
import { searchProducts } from '../controllers/SearchBar.controller.js';

const router = express.Router();

// GET /api/products?search=query
router.get('/', searchProducts);

export default router;
