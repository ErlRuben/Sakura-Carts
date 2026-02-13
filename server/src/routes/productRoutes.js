const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const { protect, requireAdmin } = require('../middleware/auth');
const {
  getProducts,
  getCategories,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

router.get('/categories', getCategories);
router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', protect, requireAdmin, upload.single('image'), createProduct);
router.put('/:id', protect, requireAdmin, upload.single('image'), updateProduct);
router.delete('/:id', protect, requireAdmin, deleteProduct);

module.exports = router;
