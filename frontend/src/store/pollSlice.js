import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  poll: null,
  currentUser: {
    role: null,
    name: '',
    id: ''
  },
  currentQuestion: null,
  currentQuestionIndex: -1,
  hasAnswered: false,
  results: null,
  chatMessages: [],
  isConnected: false
};

const pollSlice = createSlice({
  name: 'poll',
  initialState,
  reducers: {
    setPoll: (state, action) => {
      state.poll = action.payload;
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    setCurrentQuestion: (state, action) => {
      state.currentQuestion = action.payload.question;
      state.currentQuestionIndex = action.payload.index;
      state.hasAnswered = false;
    },
    setHasAnswered: (state, action) => {
      state.hasAnswered = action.payload;
    },
    updateResults: (state, action) => {
      state.results = action.payload;
    },
    addChatMessage: (state, action) => {
      state.chatMessages.push(action.payload);
    },
    setChatMessages: (state, action) => {
      state.chatMessages = action.payload;
    },
    updateActiveStudents: (state, action) => {
      if (state.poll) {
        state.poll.activeStudents = action.payload;
      }
    },
    setConnected: (state, action) => {
      state.isConnected = action.payload;
    },
    resetPoll: (state) => {
      return initialState;
    }
  }
});

export const {
  setPoll,
  setCurrentUser,
  setCurrentQuestion,
  setHasAnswered,
  updateResults,
  addChatMessage,
  setChatMessages,
  updateActiveStudents,
  setConnected,
  resetPoll
} = pollSlice.actions;

export default pollSlice.reducer;
