const fs = require('fs');
const path = require('path');
const Product = require('../models/Product');
const { CATEGORIES } = require('../models/Product');

// GET /api/products
const getProducts = async (req, res, next) => {
  try {
    const { category, search, featured, sort, page = 1, limit = 12 } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (featured === 'true') filter.featured = true;
    if (search) filter.name = { $regex: search, $options: 'i' };

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    else if (sort === 'price_desc') sortOption = { price: -1 };
    else if (sort === 'newest') sortOption = { createdAt: -1 };
    else if (sort === 'name') sortOption = { name: 1 };

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortOption).skip(skip).limit(limitNum),
      Product.countDocuments(filter),
    ]);

    res.json({
      products,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      total,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/products/categories
const getCategories = (req, res) => {
  res.json(CATEGORIES);
};

// GET /api/products/:id
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
};

// POST /api/products
const createProduct = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('Product image is required');
    }

    const { name, description, price, category, stock, featured } = req.body;
    const product = await Product.create({
      name,
      description,
      price: parseFloat(price),
      image: `/uploads/${req.file.filename}`,
      category,
      stock: parseInt(stock, 10),
      featured: featured === 'true',
    });

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

// PUT /api/products/:id
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    const { name, description, price, category, stock, featured } = req.body;
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = parseFloat(price);
    if (category) product.category = category;
    if (stock !== undefined) product.stock = parseInt(stock, 10);
    if (featured !== undefined) product.featured = featured === 'true';

    if (req.file) {
      // Remove old image
      const oldPath = path.join(__dirname, '../..', product.image);
      fs.unlink(oldPath, () => {});
      product.image = `/uploads/${req.file.filename}`;
    }

    const updated = await product.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/products/:id
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    // Remove image file
    const imagePath = path.join(__dirname, '../..', product.image);
    fs.unlink(imagePath, () => {});

    await product.deleteOne();
    res.json({ message: 'Product deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getCategories,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
