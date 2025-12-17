const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema({
  pollCode: { type: String, required: true },
  senderName: { type: String, required: true },
  senderId: { type: String, required: true },
  senderRole: { type: String, enum: ['teacher', 'student'], required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ChatMessage', ChatMessageSchema);
