const Poll = require('../models/Poll');
const ChatMessage = require('../models/ChatMessage');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Teacher creates/joins poll
    socket.on('teacher:join', async ({ pollCode, teacherId }) => {
      try {
        socket.join(pollCode);
        socket.pollCode = pollCode;
        socket.role = 'teacher';
        socket.teacherId = teacherId;

        const poll = await Poll.findOne({ pollCode });
        if (poll) {
          socket.emit('poll:data', poll);
        }

        console.log(`Teacher ${teacherId} joined poll ${pollCode}`);
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // Student joins poll
    socket.on('student:join', async ({ pollCode, studentName }) => {
      try {
        const poll = await Poll.findOne({ pollCode });

        if (!poll) {
          socket.emit('error', { message: 'Poll not found' });
          return;
        }

        const studentId = socket.id;
        socket.join(pollCode);
        socket.pollCode = pollCode;
        socket.role = 'student';
        socket.studentName = studentName;
        socket.studentId = studentId;

        // Add student to active students
        poll.activeStudents.push({
          studentId,
          studentName,
          socketId: socket.id,
          joinedAt: new Date()
        });

        await poll.save();

        // Send current poll state to student
        socket.emit('poll:data', poll);

        // Notify teacher about new student
        io.to(pollCode).emit('student:joined', {
          studentId,
          studentName,
          students: poll.activeStudents
        });

        console.log(`Student ${studentName} joined poll ${pollCode}`);
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // Teacher asks a new question
    socket.on('question:ask', async ({ pollCode, question, options, correctAnswer, timeLimit }) => {
      try {
        const poll = await Poll.findOne({ pollCode });

        if (!poll) {
          socket.emit('error', { message: 'Poll not found' });
          return;
        }

        // Deactivate all previous questions
        poll.questions.forEach(q => q.isActive = false);

        // Add new question
        const newQuestion = {
          questionText: question,
          options,
          correctAnswer,
          timeLimit: timeLimit || 60,
          answers: [],
          askedAt: new Date(),
          isActive: true
        };

        poll.questions.push(newQuestion);
        await poll.save();

        const questionIndex = poll.questions.length - 1;

        // Broadcast question to all students in the poll
        io.to(pollCode).emit('question:new', {
          questionIndex,
          question: newQuestion
        });

        console.log(`Question asked in poll ${pollCode}`);
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // Student submits answer
    socket.on('answer:submit', async ({ pollCode, questionIndex, selectedOption, studentName, studentId }) => {
      try {
        const poll = await Poll.findOne({ pollCode });

        if (!poll || !poll.questions[questionIndex]) {
          socket.emit('error', { message: 'Question not found' });
          return;
        }

        const question = poll.questions[questionIndex];

        // Check if student already answered
        const existingAnswer = question.answers.find(a => a.studentId === studentId);
        if (existingAnswer) {
          socket.emit('error', { message: 'You have already answered this question' });
          return;
        }

        // Add answer
        question.answers.push({
          studentName,
          studentId,
          selectedOption,
          answeredAt: new Date()
        });

        await poll.save();

        // Calculate and broadcast updated results
        const results = calculateResults(question);
        io.to(pollCode).emit('results:update', {
          questionIndex,
          results,
          totalAnswers: question.answers.length,
          totalStudents: poll.activeStudents.length
        });

        // Send confirmation to student
        socket.emit('answer:confirmed', {
          questionIndex,
          selectedOption
        });

        console.log(`Answer submitted for question ${questionIndex} in poll ${pollCode}`);
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // Question timer ended
    socket.on('question:timeout', async ({ pollCode, questionIndex }) => {
      try {
        const poll = await Poll.findOne({ pollCode });

        if (poll && poll.questions[questionIndex]) {
          poll.questions[questionIndex].isActive = false;
          await poll.save();

          const results = calculateResults(poll.questions[questionIndex]);
          io.to(pollCode).emit('question:ended', {
            questionIndex,
            results
          });
        }
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // Chat message
    socket.on('chat:message', async ({ pollCode, message, senderName, senderId, senderRole }) => {
      try {
        const chatMessage = await ChatMessage.create({
          pollCode,
          senderName,
          senderId,
          senderRole,
          message
        });

        io.to(pollCode).emit('chat:message', chatMessage);
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // Teacher removes a student
    socket.on('student:remove', async ({ pollCode, studentId }) => {
      try {
        const poll = await Poll.findOne({ pollCode });

        if (!poll) {
          socket.emit('error', { message: 'Poll not found' });
          return;
        }

        // Find and remove student
        const studentIndex = poll.activeStudents.findIndex(s => s.studentId === studentId);
        if (studentIndex !== -1) {
          const student = poll.activeStudents[studentIndex];
          poll.activeStudents.splice(studentIndex, 1);
          await poll.save();

          // Notify the removed student
          io.to(student.socketId).emit('student:kicked');

          // Notify everyone else
          io.to(pollCode).emit('student:removed', {
            studentId,
            students: poll.activeStudents
          });

          console.log(`Student ${studentId} removed from poll ${pollCode}`);
        }
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // Disconnect
    socket.on('disconnect', async () => {
      try {
        if (socket.pollCode && socket.role === 'student') {
          const poll = await Poll.findOne({ pollCode: socket.pollCode });
          if (poll) {
            poll.activeStudents = poll.activeStudents.filter(
              s => s.socketId !== socket.id
            );
            await poll.save();

            io.to(socket.pollCode).emit('student:left', {
              studentId: socket.studentId,
              students: poll.activeStudents
            });
          }
        }
        console.log('Client disconnected:', socket.id);
      } catch (error) {
        console.error('Error on disconnect:', error);
      }
    });
  });
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
