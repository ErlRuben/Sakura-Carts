const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['contact', 'request', 'order'],
      required: true,
    },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    // Contact fields
    subject: { type: String, trim: true },
    message: { type: String, trim: true },
    // Request fields
    itemName: { type: String, trim: true },
    category: { type: String, trim: true },
    description: { type: String, trim: true },
    budget: { type: String, trim: true },
    referenceUrl: { type: String, trim: true },
    // Attachments
    attachments: [{ type: String }],
    // Replies (admin and user)
    replies: [
      {
        text: { type: String, required: true },
        adminName: { type: String },
        userName: { type: String },
        isUser: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    // Request status
    status: {
      type: String,
      enum: ['pending', 'reviewing', 'available', 'unavailable', 'replied', 'closed'],
      default: 'pending',
    },
    // Admin tracking
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Message', messageSchema);
