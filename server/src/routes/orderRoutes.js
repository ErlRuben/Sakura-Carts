const express = require('express');
const router = express.Router();
const { protect, requireAdmin } = require('../middleware/auth');
const {
  createOrder,
  getOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  archiveOrder,
  updateOrder,
  deleteOrder,
  exportOrders,
} = require('../controllers/orderController');

router.post('/', protect, createOrder);
router.get('/', protect, requireAdmin, getOrders);
router.get('/export', protect, requireAdmin, exportOrders);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.patch('/:id/status', protect, requireAdmin, updateOrderStatus);
router.patch('/:id/archive', protect, requireAdmin, archiveOrder);
router.put('/:id', protect, requireAdmin, updateOrder);
router.delete('/:id', protect, requireAdmin, deleteOrder);

module.exports = router;
