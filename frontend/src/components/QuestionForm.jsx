import { useState } from 'react';
import socketService from '@/lib/socket';

export default function QuestionForm({ pollCode, onClose, onSubmit }) {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [timeLimit, setTimeLimit] = useState(60);
  const [charCount, setCharCount] = useState(0);

  const handleAddOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = () => {
    if (!question.trim() || options.filter(o => o.trim()).length < 2) {
      alert('Please enter a question and at least 2 options');
      return;
    }

    const validOptions = options.filter(o => o.trim());
    socketService.askQuestion(pollCode, question, validOptions, correctAnswer, timeLimit);
    onSubmit();
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-[#373737]">Let's Get Started</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-2xl"
        >
          ×
        </button>
      </div>

      <div className="space-y-6">
        {/* Question Input */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-[#373737]">
              Enter your question
            </label>
            <div className="flex items-center gap-4">
              <span className="text-sm text-[#6E6E6E]">{charCount}/100</span>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-[#373737]">{timeLimit} seconds</label>
                <select
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(Number(e.target.value))}
                  className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#7765DA] text-[#373737]"
                >
                  <option value={30}>30s</option>
                  <option value={60}>60s</option>
                  <option value={90}>90s</option>
                  <option value={120}>120s</option>
                </select>
              </div>
            </div>
          </div>
          <textarea
            value={question}
            onChange={(e) => {
              setQuestion(e.target.value);
              setCharCount(e.target.value.length);
            }}
            placeholder="Enter your question here..."
            maxLength={100}
            rows={3}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#7765DA] resize-none text-[#373737] placeholder:text-gray-400"
          />
        </div>

        {/* Options */}
        <div>
          <label className="block text-sm font-medium text-[#373737] mb-2">
            Edit Options
          </label>
          <div className="space-y-3">
            {options.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="correctAnswer"
                  checked={correctAnswer === option && option !== ''}
                  onChange={() => setCorrectAnswer(option)}
                  className="w-4 h-4 text-[#7765DA]"
                />
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#7765DA] text-[#373737] placeholder:text-gray-400"
                />
              </div>
            ))}
          </div>
          {options.length < 6 && (
            <button
              onClick={handleAddOption}
              className="mt-3 px-4 py-2 text-[#7765DA] border border-[#7765DA] rounded-lg hover:bg-[#7765DA]/10 transition-all text-sm font-medium"
            >
              + Add More option
            </button>
          )}
        </div>

        {/* Is it Correct? */}
        <div className="bg-gray-50 rounded-lg p-4">
          <label className="block text-sm font-medium text-[#373737] mb-3">
            Is it Correct?
          </label>
          <div className="flex gap-2">
            {options.filter(o => o.trim()).map((option, index) => (
              <label key={index} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="correctDisplay"
                  checked={correctAnswer === option}
                  onChange={() => setCorrectAnswer(option)}
                  className="w-4 h-4 text-[#7765DA]"
                />
                <span className="text-sm text-[#6E6E6E]">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full py-3 bg-[#7765DA] text-white rounded-lg hover:bg-[#5767D0] transition-all font-medium"
        >
          Ask Question
        </button>
      </div>
    </div>
  );
}
