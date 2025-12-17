import { useState, useEffect } from 'react';
import socketService from '@/lib/socket';
import { useAppSelector } from '@/store/hooks';

export default function QuestionDisplay({ question, questionIndex, pollCode }) {
  const [selectedOption, setSelectedOption] = useState('');
  const [timeLeft, setTimeLeft] = useState(question.timeLimit);
  const { currentUser } = useAppSelector((state) => state.poll);

  useEffect(() => {
    // Reset selection when question changes
    setSelectedOption('');
    setTimeLeft(question.timeLimit);
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [question]);

  const handleTimeOut = () => {
    socketService.getSocket()?.emit('question:timeout', { pollCode, questionIndex });
  };

  const handleSubmit = () => {
    if (!selectedOption) {
      alert('Please select an option');
      return;
    }

    socketService.submitAnswer(
      pollCode,
      questionIndex,
      selectedOption,
      currentUser.name,
      currentUser.id
    );
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-[#373737]">
          Question {questionIndex + 1}
        </h2>
        <div className={`px-4 py-2 rounded-full text-sm font-bold ${
          timeLeft <= 10 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          ⏱ {formatTime(timeLeft)}
        </div>
      </div>

      <div className="bg-[#373737] text-white p-4 rounded-lg mb-6">
        <p className="text-lg">{question.questionText}</p>
      </div>

      <div className="space-y-3 mb-6">
        {question.options.map((option, index) => (
          <label
            key={index}
            className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
              selectedOption === option
                ? 'border-[#7765DA] bg-[#7765DA]/10'
                : 'border-gray-200 hover:border-[#7765DA]/50'
            }`}
          >
            <input
              type="radio"
              name={`answer-${currentUser.id}-${questionIndex}`}
              value={option}
              checked={selectedOption === option}
              onChange={(e) => setSelectedOption(e.target.value)}
              className="w-5 h-5 text-[#7765DA]"
            />
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#7765DA] rounded-full flex items-center justify-center text-white font-bold text-sm">
                {index + 1}
              </div>
              <span className="font-medium text-[#373737]">{option}</span>
            </div>
          </label>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!selectedOption || timeLeft === 0}
        className="w-full py-3 bg-[#7765DA] text-white rounded-lg hover:bg-[#5767D0] transition-all font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        Submit
      </button>
    </div>
  );
}
