import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import socketService from '@/lib/socket';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setPoll,
  setCurrentQuestion,
  updateActiveStudents,
  addChatMessage,
  setChatMessages,
  setCurrentUser
} from '@/store/pollSlice';
import QuestionForm from '@/components/QuestionForm';
import ParticipantsList from '@/components/ParticipantsList';
import LiveResults from '@/components/LiveResults';
import ChatPanel from '@/components/ChatPanel';

export default function TeacherPollPage() {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { poll, currentUser, currentQuestion, currentQuestionIndex } = useAppSelector((state) => state.poll);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [isRestoring, setIsRestoring] = useState(true);
  const hasInitialized = useRef(false);
  const [showChat, setShowChat] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const pollCode = params.pollCode;

  // Session restoration effect - runs only once
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const savedUser = sessionStorage.getItem('pollUser');
    const savedPollCode = sessionStorage.getItem('pollCode');
    
    if (!currentUser.role && savedUser && savedPollCode === pollCode) {
      const userData = JSON.parse(savedUser);
      dispatch(setCurrentUser(userData));
      
      // Fetch current poll data first
      fetch(`${import.meta.env.VITE_API_URL}/polls/${pollCode}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            dispatch(setPoll(data.data));
            
            // Set current question if exists
            if (data.data.questions && data.data.questions.length > 0) {
              const lastQuestionIndex = data.data.questions.length - 1;
              const lastQuestion = data.data.questions[lastQuestionIndex];
              if (lastQuestion.isActive) {
                dispatch(setCurrentQuestion({ 
                  question: lastQuestion, 
                  index: lastQuestionIndex 
                }));
              }
            }
          }
          setIsRestoring(false);
        })
        .catch(err => {
          console.error('Failed to fetch poll:', err);
          setIsRestoring(false);
        });
      
      // Reconnect to poll
      const socket = socketService.connect();
      socketService.teacherJoin(pollCode, userData.id);
    } else if (!currentUser.role && !savedUser) {
      navigate('/teacher');
    } else {
      setIsRestoring(false);
    }
  }, []);

  // Socket listeners effect - separate from restoration
  useEffect(() => {
    if (isRestoring || !currentUser.role) return;

    const socket = socketService.connect();

    socket.on('poll:data', (pollData) => {
      dispatch(setPoll(pollData));
    });

    socket.on('student:joined', (data) => {
      dispatch(updateActiveStudents(data.students));
    });

    socket.on('student:left', (data) => {
      dispatch(updateActiveStudents(data.students));
    });

    socket.on('student:removed', (data) => {
      dispatch(updateActiveStudents(data.students));
    });

    socket.on('question:new', (data) => {
      dispatch(setCurrentQuestion({ question: data.question, index: data.questionIndex }));
    });

    socket.on('results:update', (data) => {
      // Fetch latest poll data to get updated answers
      fetch(`${import.meta.env.VITE_API_URL}/polls/${pollCode}`)
        .then(res => res.json())
        .then(result => {
          if (result.success) {
            dispatch(setPoll(result.data));
            // Update current question with latest data
            if (result.data.questions[data.questionIndex]) {
              dispatch(setCurrentQuestion({ 
                question: result.data.questions[data.questionIndex], 
                index: data.questionIndex 
              }));
            }
          }
        })
        .catch(err => console.error('Failed to fetch updated poll:', err));
    });

    socket.on('chat:message', (message) => {
      dispatch(addChatMessage(message));
    });

    // Load chat history
    fetchChatHistory();

    return () => {
      socket.off('poll:data');
      socket.off('student:joined');
      socket.off('student:left');
      socket.off('student:removed');
      socket.off('question:new');
      socket.off('results:update');
      socket.off('chat:message');
    };
  }, [isRestoring, currentUser.role]);

  const fetchChatHistory = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/polls/${pollCode}/chat`);
      const data = await response.json();
      if (data.success) {
        dispatch(setChatMessages(data.data));
      }
    } catch (error) {
      console.error('Failed to fetch chat history:', error);
    }
  };

  const canAskNewQuestion = () => {
    if (!poll) return false;
    if (poll.questions.length === 0) return true;

    const lastQuestion = poll.questions[poll.questions.length - 1];
    const allStudentsAnswered = poll.activeStudents.length > 0 &&
      lastQuestion.answers.length === poll.activeStudents.length;

    return allStudentsAnswered || !lastQuestion.isActive;
  };

  const handleRemoveStudent = (studentId) => {
    socketService.removeStudent(pollCode, studentId);
  };

  const handleViewHistory = () => {
    setShowHistory(true);
  };

  return (
    <div className="min-h-screen bg-[#F2F2F2] p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="inline-block bg-[#7765DA] text-white px-3 py-1 rounded-full text-sm font-medium mb-2">
                🎓 Intervue Poll
              </div>
              <h1 className="text-2xl font-bold text-[#373737]">Teacher Dashboard</h1>
              <p className="text-[#6E6E6E]">Poll Code: <span className="font-mono font-bold text-[#7765DA]">{pollCode}</span></p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleViewHistory}
                className="px-4 py-2 bg-gray-100 text-[#6E6E6E] rounded-lg hover:bg-gray-200 transition-all flex items-center gap-2"
              >
                <span>📊</span> View Poll History
              </button>
              <button
                onClick={() => setShowChat(!showChat)}
                className="px-4 py-2 bg-[#7765DA]/10 text-[#7765DA] rounded-lg hover:bg-[#7765DA]/20 transition-all flex items-center gap-2"
              >
                <span>💬</span> Chat
              </button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Question Form or Current Question */}
            {showQuestionForm ? (
              <QuestionForm
                pollCode={pollCode}
                onClose={() => setShowQuestionForm(false)}
                onSubmit={() => setShowQuestionForm(false)}
              />
            ) : currentQuestion ? (
              <LiveResults />
            ) : (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <h2 className="text-xl font-bold text-[#373737] mb-4">Let's Get Started</h2>
                <p className="text-[#6E6E6E] mb-6">
                  You'll have the ability to create and manage polls, ask questions, and monitor your students' responses in real-time.
                </p>
                {canAskNewQuestion() ? (
                  <button
                    onClick={() => setShowQuestionForm(true)}
                    className="px-6 py-3 bg-[#7765DA] text-white rounded-lg hover:bg-[#5767D0] transition-all font-medium"
                  >
                    + Ask Question
                  </button>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
                    Waiting for all students to answer the current question...
                  </div>
                )}
              </div>
            )}

            {/* New Question Button */}
            {currentQuestion && canAskNewQuestion() && (
              <button
                onClick={() => setShowQuestionForm(true)}
                className="w-full px-6 py-3 bg-[#7765DA] text-white rounded-lg hover:bg-[#5767D0] transition-all font-medium"
              >
                + Ask a new question
              </button>
            )}
          </div>

          {/* Sidebar */}
          <div>
            {showChat ? (
              <ChatPanel />
            ) : (
              <ParticipantsList
                participants={poll?.activeStudents || []}
                onRemove={handleRemoveStudent}
              />
            )}
          </div>
        </div>
      </div>

      {/* Poll History Modal */}
      {showHistory && (
        <PollHistoryModal
          pollCode={pollCode}
          onClose={() => setShowHistory(false)}
        />
      )}
    </div>
  );
}

// Poll History Modal Component
function PollHistoryModal({ pollCode, onClose }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/polls/${pollCode}/results`);
      const data = await response.json();
      if (data.success) {
        setHistory(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6 border-b sticky top-0 bg-white">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-[#373737]">View Poll History</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8 text-[#6E6E6E]">Loading...</div>
          ) : history.length === 0 ? (
            <div className="text-center py-8 text-[#6E6E6E]">No questions asked yet</div>
          ) : (
            <div className="space-y-6">
              {history.map((item, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h3 className="font-bold text-lg mb-2 text-[#373737]">Question {index + 1}</h3>
                  <p className="text-[#6E6E6E] mb-4">{item.questionText}</p>
                  <div className="space-y-2">
                    {item.options.map((option, idx) => (
                      <div key={idx} className="flex items-center gap-4">
                        <div className="flex-1 bg-gray-100 rounded-lg p-3 relative overflow-hidden">
                          <div
                            className="absolute inset-0 bg-[#7765DA] opacity-20"
                            style={{ width: `${item.results.percentages[option]}%` }}
                          />
                          <div className="relative flex justify-between items-center">
                            <span className="font-medium text-[#373737]">{option}</span>
                            <span className="text-sm text-[#6E6E6E]">{item.results.percentages[option]}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-[#6E6E6E] mt-3">
                    Total Responses: {item.results.total}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
