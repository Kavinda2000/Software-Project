import Product from '../models/Products.js';

export const searchProducts = async (req, res) => {
  const search = req.query.search || '';
  try {
    const regex = new RegExp(search, 'i'); // Case-insensitive search
    const products = await Product.find({ title: { $regex: regex } }).limit(10);
    res.json(products);
  } catch (error) {
    console.error('Product search error:', error);
    res.status(500).json({ message: 'Server error while searching products.' });
  }
};
