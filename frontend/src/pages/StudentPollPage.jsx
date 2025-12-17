import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import socketService from '@/lib/socket';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setPoll,
  setCurrentUser,
  setCurrentQuestion,
  setHasAnswered,
  updateResults,
  addChatMessage,
  setChatMessages
} from '@/store/pollSlice';
import QuestionDisplay from '@/components/QuestionDisplay';
import ResultsDisplay from '@/components/ResultsDisplay';
import ChatPanel from '@/components/ChatPanel';

export default function StudentPollPage() {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { poll, currentUser, currentQuestion, currentQuestionIndex, hasAnswered, results } = useAppSelector((state) => state.poll);
  const [showChat, setShowChat] = useState(false);
  const [kicked, setKicked] = useState(false);
  const [isRestoring, setIsRestoring] = useState(true);
  const hasInitialized = useRef(false);

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
      
      // Fetch current poll data to restore state
      fetch(`${import.meta.env.VITE_API_URL}/polls/${pollCode}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            dispatch(setPoll(data.data));
            
            // Restore current question and answer state
            if (data.data.questions && data.data.questions.length > 0) {
              const lastQuestionIndex = data.data.questions.length - 1;
              const lastQuestion = data.data.questions[lastQuestionIndex];
              if (lastQuestion.isActive) {
                dispatch(setCurrentQuestion({ 
                  question: lastQuestion, 
                  index: lastQuestionIndex 
                }));
                
                // Check if this student already answered
                const hasAlreadyAnswered = lastQuestion.answers.some(
                  (a) => a.studentId === userData.id
                );
                if (hasAlreadyAnswered) {
                  dispatch(setHasAnswered(true));
                }
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
      socketService.studentJoin(pollCode, userData.name);
    } else if (!currentUser.role && !savedUser) {
      navigate('/student');
    } else {
      setIsRestoring(false);
    }
  }, []);

  // Socket listeners effect - separate from restoration
  useEffect(() => {
    if (isRestoring || !currentUser.role) return;

    const socket = socketService.connect();

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

    socket.on('question:new', (data) => {
      dispatch(setCurrentQuestion({ question: data.question, index: data.questionIndex }));
      dispatch(setHasAnswered(false));
      dispatch(updateResults(null));
    });

    socket.on('answer:confirmed', (data) => {
      dispatch(setHasAnswered(true));
    });

    socket.on('results:update', (data) => {
      dispatch(updateResults(data.results));
    });

    socket.on('question:ended', (data) => {
      dispatch(updateResults(data.results));
    });

    socket.on('student:kicked', () => {
      setKicked(true);
    });

    socket.on('chat:message', (message) => {
      dispatch(addChatMessage(message));
    });

    // Load chat history
    fetchChatHistory();

    return () => {
      socket.off('question:new');
      socket.off('answer:confirmed');
      socket.off('results:update');
      socket.off('question:ended');
      socket.off('student:kicked');
      socket.off('chat:message');
    };
  }, [isRestoring, currentUser.role, pollCode, dispatch]);

  if (kicked) {
    return (
      <div className="min-h-screen bg-[#F2F2F2] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-md w-full text-center">
          <div className="inline-block bg-[#7765DA] text-white px-4 py-1 rounded-full text-sm font-medium mb-4">
            🎓 Intervue Poll
          </div>
          <h1 className="text-3xl font-bold text-[#373737] mb-4">You've been Kicked out!</h1>
          <p className="text-[#6E6E6E] mb-6">
            Looks like the teacher had removed you from the poll system. Please Try again sometime.
          </p>
          <button
            onClick={() => navigate('/student')}
            className="px-6 py-3 bg-[#7765DA] text-white rounded-lg hover:bg-[#5767D0] transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F2F2] p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="inline-block bg-[#7765DA] text-white px-3 py-1 rounded-full text-sm font-medium mb-2">
                🎓 Intervue Poll
              </div>
              <h1 className="text-2xl font-bold text-[#373737]">Student View</h1>
              <p className="text-[#6E6E6E]">
                Welcome, <span className="font-semibold">{currentUser.name}</span>
              </p>
            </div>
            <button
              onClick={() => setShowChat(!showChat)}
              className="px-4 py-2 bg-[#7765DA]/10 text-[#7765DA] rounded-lg hover:bg-[#7765DA]/20 transition-all flex items-center gap-2"
            >
              <span>💬</span> Chat
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className={showChat ? 'md:col-span-2' : 'md:col-span-3'}>
            {currentQuestion && !hasAnswered ? (
              <QuestionDisplay
                question={currentQuestion}
                questionIndex={currentQuestionIndex}
                pollCode={pollCode}
              />
            ) : hasAnswered ? (
              <ResultsDisplay />
            ) : (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <div className="mb-6">
                  <div className="inline-block w-16 h-16 border-4 border-[#7765DA] border-t-transparent rounded-full animate-spin mb-4"></div>
                </div>
                <h2 className="text-xl font-bold text-[#373737] mb-2">
                  Wait for the teacher to ask questions..
                </h2>
                <p className="text-[#6E6E6E]">
                  The teacher will ask questions shortly. Stay tuned!
                </p>
              </div>
            )}
          </div>

          {showChat && (
            <div className="md:col-span-1">
              <ChatPanel />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
