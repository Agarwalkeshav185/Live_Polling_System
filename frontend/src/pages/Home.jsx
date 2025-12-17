import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Home() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);

  const handleContinue = () => {
    if (selectedRole === 'teacher') {
      navigate('/teacher');
    } else if (selectedRole === 'student') {
      navigate('/student');
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F2F2] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="inline-block bg-[#7765DA] text-white px-4 py-1 rounded-full text-sm font-medium mb-4">
            🎓 Intervue Poll
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#373737] mb-2">
            Welcome to the <span className="text-[#7765DA]">Live Polling System</span>
          </h1>
          <p className="text-[#6E6E6E]">
            Please select the role that best describes you to begin using the live polling system
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => setSelectedRole('student')}
            className={`p-6 rounded-xl border-2 transition-all text-left ${
              selectedRole === 'student'
                ? 'border-[#7765DA] bg-[#7765DA]/10'
                : 'border-gray-200 hover:border-[#7765DA]/50'
            }`}
          >
            <div className="text-2xl mb-2">👨‍🎓</div>
            <h3 className="font-bold text-lg text-[#373737] mb-1">I'm a Student</h3>
            <p className="text-sm text-[#6E6E6E]">
              Join team to quickly test out the latest polling industry
            </p>
          </button>

          <button
            onClick={() => setSelectedRole('teacher')}
            className={`p-6 rounded-xl border-2 transition-all text-left ${
              selectedRole === 'teacher'
                ? 'border-[#7765DA] bg-[#7765DA]/10'
                : 'border-gray-200 hover:border-[#7765DA]/50'
            }`}
          >
            <div className="text-2xl mb-2">👨‍🏫</div>
            <h3 className="font-bold text-lg text-[#373737] mb-1">I'm a Teacher</h3>
            <p className="text-sm text-[#6E6E6E]">
              Submit answers and view live poll results after submission
            </p>
          </button>
        </div>

        <button
          onClick={handleContinue}
          disabled={!selectedRole}
          className={`w-full py-3 rounded-lg font-medium transition-all ${
            selectedRole
              ? 'bg-[#7765DA] text-white hover:bg-[#5767D0]'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
