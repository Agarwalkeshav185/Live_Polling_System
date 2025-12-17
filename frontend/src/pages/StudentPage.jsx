import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import socketService from '@/lib/socket';
import { useAppDispatch } from '@/store/hooks';
import { setCurrentUser, setPoll } from '@/store/pollSlice';

export default function StudentPage() {
  const [studentName, setStudentName] = useState('');
  const [pollCode, setPollCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const socket = socketService.connect();

    socket.on('poll:data', (poll) => {
      dispatch(setPoll(poll));
      navigate(`/student/poll/${pollCode}`);
    });

    socket.on('error', (data) => {
      setError(data.message);
      setIsJoining(false);
    });

    return () => {
      socket.off('poll:data');
      socket.off('error');
    };
  }, [dispatch, navigate, pollCode]);

  const handleJoin = () => {
    if (!studentName.trim() || !pollCode.trim()) {
      setError('Please enter your name and poll code');
      return;
    }

    setIsJoining(true);
    setError('');

    const studentId = `student_${Date.now()}`;
    const userData = {
      role: 'student',
      name: studentName,
      id: studentId
    };
    
    dispatch(setCurrentUser(userData));
    
    // Save to sessionStorage for page refresh
    sessionStorage.setItem('pollUser', JSON.stringify(userData));
    sessionStorage.setItem('pollCode', pollCode.toUpperCase());

    socketService.studentJoin(pollCode.toUpperCase(), studentName);
  };

  return (
    <div className="min-h-screen bg-[#F2F2F2] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-block bg-[#7765DA] text-white px-4 py-1 rounded-full text-sm font-medium mb-4">
            🎓 Intervue Poll
          </div>
          <h1 className="text-3xl font-bold text-[#373737] mb-2">
            Let's <span className="text-[#7765DA]">Get Started</span>
          </h1>
          <p className="text-[#6E6E6E] text-sm">
            If you're a student, you'll be able to <span className="font-semibold">submit your answers</span> participate in live polls, and see how your responses compare with your classmates
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#373737] mb-2">
              Enter your Name
            </label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Rahul Bajaj"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#7765DA] text-[#373737] placeholder:text-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#373737] mb-2">
              Enter Poll Code
            </label>
            <input
              type="text"
              value={pollCode}
              onChange={(e) => setPollCode(e.target.value.toUpperCase())}
              placeholder="ABC123"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#7765DA] uppercase text-[#373737] placeholder:text-gray-400"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleJoin}
            disabled={isJoining}
            className={`w-full py-3 rounded-lg font-medium transition-all ${
              isJoining
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-[#7765DA] text-white hover:bg-[#5767D0]'
            }`}
          >
            {isJoining ? 'Joining...' : 'Join Poll'}
          </button>
        </div>
      </div>
    </div>
  );
}
