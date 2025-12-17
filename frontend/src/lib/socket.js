import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket'],
        autoConnect: true
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket() {
    return this.socket;
  }

  // Teacher methods
  teacherJoin(pollCode, teacherId) {
    this.socket?.emit('teacher:join', { pollCode, teacherId });
  }

  askQuestion(pollCode, question, options, correctAnswer, timeLimit) {
    this.socket?.emit('question:ask', {
      pollCode,
      question,
      options,
      correctAnswer,
      timeLimit
    });
  }

  removeStudent(pollCode, studentId) {
    this.socket?.emit('student:remove', { pollCode, studentId });
  }

  // Student methods
  studentJoin(pollCode, studentName) {
    this.socket?.emit('student:join', { pollCode, studentName });
  }

  submitAnswer(pollCode, questionIndex, selectedOption, studentName, studentId) {
    this.socket?.emit('answer:submit', {
      pollCode,
      questionIndex,
      selectedOption,
      studentName,
      studentId
    });
  }

  // Chat methods
  sendChatMessage(pollCode, message, senderName, senderId, senderRole) {
    this.socket?.emit('chat:message', {
      pollCode,
      message,
      senderName,
      senderId,
      senderRole
    });
  }

  // Listeners
  on(event, callback) {
    this.socket?.on(event, callback);
  }

  off(event, callback) {
    this.socket?.off(event, callback);
  }
}

const socketService = new SocketService();
export default socketService;
