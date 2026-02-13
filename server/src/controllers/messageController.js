const Message = require('../models/Message');

// POST /api/messages - Create a message (public)
const createMessage = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.files && req.files.length > 0) {
      data.attachments = req.files.map((f) => `/uploads/${f.filename}`);
    }
    const message = await Message.create(data);
    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
};

// GET /api/messages - Get all messages (admin)
const getMessages = async (req, res, next) => {
  try {
    const { type } = req.query;
    const filter = {};
    if (type) filter.type = type;

    const messages = await Message.find(filter).sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    next(error);
  }
};

// PATCH /api/messages/:id/read - Toggle read status (admin)
const toggleRead = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      res.status(404);
      throw new Error('Message not found');
    }
    message.read = !message.read;
    await message.save();
    res.json(message);
  } catch (error) {
    next(error);
  }
};

// POST /api/messages/:id/reply - Reply to a message (admin)
const replyToMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      res.status(404);
      throw new Error('Message not found');
    }
    const { text } = req.body;
    if (!text || !text.trim()) {
      res.status(400);
      throw new Error('Reply text is required');
    }
    message.replies.push({
      text: text.trim(),
      adminName: req.user.name,
    });
    message.read = true;
    await message.save();
    res.json(message);
  } catch (error) {
    next(error);
  }
};

// GET /api/messages/mine - Get my messages (authenticated user)
const getMyMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({ email: req.user.email }).sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/messages/:id - Delete a message (admin)
const deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) {
      res.status(404);
      throw new Error('Message not found');
    }
    res.json({ message: 'Message deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createMessage, getMessages, getMyMessages, toggleRead, replyToMessage, deleteMessage };
