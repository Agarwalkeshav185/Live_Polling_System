const Poll = require('../models/Poll');
const ChatMessage = require('../models/ChatMessage');

// Generate unique poll code
const generatePollCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Create a new poll
exports.createPoll = async (req, res) => {
  try {
    const { teacherId } = req.body;
    const pollCode = generatePollCode();

    const poll = await Poll.create({
      pollCode,
      teacherId,
      questions: [],
      activeStudents: []
    });

    res.status(201).json({
      success: true,
      data: poll
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get poll by code
exports.getPoll = async (req, res) => {
  try {
    const { pollCode } = req.params;
    const poll = await Poll.findOne({ pollCode });

    if (!poll) {
      return res.status(404).json({
        success: false,
        message: 'Poll not found'
      });
    }

    res.status(200).json({
      success: true,
      data: poll
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all polls for a teacher (poll history)
exports.getTeacherPolls = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const polls = await Poll.find({ teacherId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: polls
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get poll results
exports.getPollResults = async (req, res) => {
  try {
    const { pollCode } = req.params;
    const poll = await Poll.findOne({ pollCode });

    if (!poll) {
      return res.status(404).json({
        success: false,
        message: 'Poll not found'
      });
    }

    const results = poll.questions.map(question => ({
      questionText: question.questionText,
      options: question.options,
      correctAnswer: question.correctAnswer,
      answers: question.answers,
      results: calculateResults(question)
    }));

    res.status(200).json({
      success: true,
      data: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get chat messages for a poll
exports.getChatMessages = async (req, res) => {
  try {
    const { pollCode } = req.params;
    const messages = await ChatMessage.find({ pollCode }).sort({ timestamp: 1 });

    res.status(200).json({
      success: true,
      data: messages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Helper function to calculate results
const calculateResults = (question) => {
  const total = question.answers.length;
  const counts = {};

  question.options.forEach(option => {
    counts[option] = 0;
  });

  question.answers.forEach(answer => {
    if (counts[answer.selectedOption] !== undefined) {
      counts[answer.selectedOption]++;
    }
  });

  const percentages = {};
  Object.keys(counts).forEach(option => {
    percentages[option] = total > 0 ? Math.round((counts[option] / total) * 100) : 0;
  });

  return {
    counts,
    percentages,
    total
  };
};
