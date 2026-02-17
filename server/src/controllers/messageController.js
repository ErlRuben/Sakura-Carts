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
    const { type, archived, month, year } = req.query;
    const filter = {};
    if (type) filter.type = type;
    filter.archived = archived === 'true' ? true : { $ne: true };

    if (month && year) {
      const m = parseInt(month, 10);
      const y = parseInt(year, 10);
      filter.createdAt = { $gte: new Date(y, m - 1, 1), $lt: new Date(y, m, 1) };
    } else if (year) {
      const y = parseInt(year, 10);
      filter.createdAt = { $gte: new Date(y, 0, 1), $lt: new Date(y + 1, 0, 1) };
    }

    const messages = await Message.find(filter).sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    next(error);
  }
};

// PATCH /api/messages/:id/archive - Toggle archived status (admin)
const archiveMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      res.status(404);
      throw new Error('Message not found');
    }
    message.archived = !message.archived;
    await message.save();
    res.json(message);
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

// PATCH /api/messages/:id/status - Update request status (admin)
const updateMessageStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!message) {
      res.status(404);
      throw new Error('Message not found');
    }
    res.json(message);
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

// POST /api/messages/mine/:id/reply - User replies to their own message
const replyToMyMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      res.status(404);
      throw new Error('Message not found');
    }
    if (message.email !== req.user.email) {
      res.status(403);
      throw new Error('Not authorized to reply to this message');
    }
    const { text } = req.body;
    if (!text || !text.trim()) {
      res.status(400);
      throw new Error('Reply text is required');
    }
    message.replies.push({
      text: text.trim(),
      userName: req.user.name,
      isUser: true,
    });
    await message.save();
    res.json(message);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/messages/mine/:id - Delete own message (authenticated user)
const deleteMyMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      res.status(404);
      throw new Error('Message not found');
    }
    if (message.email !== req.user.email) {
      res.status(403);
      throw new Error('Not authorized to delete this message');
    }
    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: 'Message deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createMessage, getMessages, getMyMessages, toggleRead, replyToMessage, replyToMyMessage, deleteMessage, deleteMyMessage, updateMessageStatus, archiveMessage };
