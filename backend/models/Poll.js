const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  studentId: { type: String, required: true },
  selectedOption: { type: String, required: true },
  answeredAt: { type: Date, default: Date.now }
});

const QuestionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String },
  timeLimit: { type: Number, default: 60 },
  answers: [AnswerSchema],
  askedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: false }
});

const PollSchema = new mongoose.Schema({
  pollCode: { type: String, required: true, unique: true },
  teacherId: { type: String, required: true },
  questions: [QuestionSchema],
  activeStudents: [{
    studentId: { type: String },
    studentName: { type: String },
    socketId: { type: String },
    joinedAt: { type: Date, default: Date.now }
  }],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Poll', PollSchema);
