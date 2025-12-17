import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import socketService from '@/lib/socket';
import { useAppDispatch } from '@/store/hooks';
import { setCurrentUser, setPoll } from '@/store/pollSlice';

export default function TeacherPage() {
  const [teacherName, setTeacherName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleCreatePoll = async () => {
    if (!teacherName.trim()) {
      setError('Please enter your name');
      return;
    }

    setIsCreating(true);
    setError('');

    try {
      const teacherId = `teacher_${Date.now()}`;
      const response = await fetch(`${import.meta.env.VITE_API_URL}/polls/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teacherId }),
      });

      const data = await response.json();

      if (data.success) {
        const userData = {
          role: 'teacher',
          name: teacherName,
          id: teacherId
        };
        
        dispatch(setCurrentUser(userData));
        dispatch(setPoll(data.data));
        
        // Save to sessionStorage for page refresh
        sessionStorage.setItem('pollUser', JSON.stringify(userData));
        sessionStorage.setItem('pollCode', data.data.pollCode);

        const socket = socketService.connect();
        socketService.teacherJoin(data.data.pollCode, teacherId);

        navigate(`/teacher/poll/${data.data.pollCode}`);
      } else {
        setError(data.message || 'Failed to create poll');
        setIsCreating(false);
      }
    } catch (err) {
      setError('Failed to create poll. Please try again.');
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F2F2] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="inline-block bg-[#7765DA] text-white px-4 py-1 rounded-full text-sm font-medium mb-4">
            🎓 Intervue Poll
          </div>
          <h1 className="text-3xl font-bold text-[#373737] mb-2">
            Let's <span className="text-[#7765DA]">Get Started</span>
          </h1>
          <p className="text-[#6E6E6E]">
            You'll have the ability to create and manage polls, ask questions, and monitor your students' responses in real-time.
          </p>
        </div>

        <div className="bg-[#7765DA]/10 rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-[#373737] mb-3">Teacher Features:</h3>
          <ul className="space-y-2 text-sm text-[#6E6E6E]">
            <li className="flex items-start">
              <span className="text-[#7765DA] mr-2">✓</span>
              Create polls and ask multiple choice questions
            </li>
            <li className="flex items-start">
              <span className="text-[#7765DA] mr-2">✓</span>
              View live polling results as students submit answers
            </li>
            <li className="flex items-start">
              <span className="text-[#7765DA] mr-2">✓</span>
              Manage participants and remove students if needed
            </li>
            <li className="flex items-start">
              <span className="text-[#7765DA] mr-2">✓</span>
              Access poll history and past results
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#373737] mb-2">
              Enter your Name
            </label>
            <input
              type="text"
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              placeholder="Dr. Sharma"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#7765DA] text-[#373737] placeholder:text-gray-400"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleCreatePoll}
            disabled={isCreating}
            className={`w-full py-3 rounded-lg font-medium transition-all ${
              isCreating
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-[#7765DA] text-white hover:bg-[#5767D0]'
            }`}
          >
            {isCreating ? 'Creating Poll...' : 'Create Poll'}
          </button>
        </div>
      </div>
    </div>
  );
}
