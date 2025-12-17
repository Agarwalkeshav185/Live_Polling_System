const express = require('express');
const router = express.Router();
const {
  createPoll,
  getPoll,
  getTeacherPolls,
  getPollResults,
  getChatMessages
} = require('../controllers/pollController');

router.post('/create', createPoll);
router.get('/:pollCode', getPoll);
router.get('/teacher/:teacherId', getTeacherPolls);
router.get('/:pollCode/results', getPollResults);
router.get('/:pollCode/chat', getChatMessages);

module.exports = router;
