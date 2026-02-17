const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const uploadMessages = require('../config/multerMessages');
const { protect, requireAdmin } = require('../middleware/auth');
const {
  createMessage,
  getMessages,
  getMyMessages,
  toggleRead,
  replyToMessage,
  replyToMyMessage,
  deleteMessage,
  deleteMyMessage,
  updateMessageStatus,
} = require('../controllers/messageController');

const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { message: 'Too many submissions. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/', submitLimiter, uploadMessages.array('attachments', 5), createMessage);
router.get('/', protect, requireAdmin, getMessages);
router.get('/mine', protect, getMyMessages);
router.patch('/:id/read', protect, requireAdmin, toggleRead);
router.patch('/:id/status', protect, requireAdmin, updateMessageStatus);
router.post('/:id/reply', protect, requireAdmin, replyToMessage);
router.post('/mine/:id/reply', protect, replyToMyMessage);
router.delete('/mine/:id', protect, deleteMyMessage);
router.delete('/:id', protect, requireAdmin, deleteMessage);

module.exports = router;
