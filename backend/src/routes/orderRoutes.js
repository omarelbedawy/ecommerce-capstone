const express = require('express');
const {
  checkout,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);

router.post('/checkout', checkout);
router.get('/mine', getMyOrders);
router.get('/all', requireAdmin, getAllOrders);
router.get('/:id', getOrderById);
router.patch('/:id/status', requireAdmin, updateOrderStatus);

module.exports = router;
