const express = require('express');
const router = express.Router();
const uploadMessages = require('../config/multerMessages');
const { protect, requireAdmin } = require('../middleware/auth');
const {
  createMessage,
  getMessages,
  getMyMessages,
  toggleRead,
  replyToMessage,
  deleteMessage,
} = require('../controllers/messageController');

router.post('/', uploadMessages.array('attachments', 5), createMessage);
router.get('/', protect, requireAdmin, getMessages);
router.get('/mine', protect, getMyMessages);
router.patch('/:id/read', protect, requireAdmin, toggleRead);
router.post('/:id/reply', protect, requireAdmin, replyToMessage);
router.delete('/:id', protect, requireAdmin, deleteMessage);

module.exports = router;
