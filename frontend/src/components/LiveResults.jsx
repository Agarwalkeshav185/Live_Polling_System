import { useAppSelector } from '@/store/hooks';

export default function LiveResults() {
  const { currentQuestion, poll, currentQuestionIndex } = useAppSelector((state) => state.poll);

  if (!currentQuestion) return null;

  const totalAnswers = currentQuestion.answers.length;
  const totalStudents = poll?.activeStudents.length || 0;

  const getResultPercentage = (option) => {
    if (totalAnswers === 0) return 0;
    const count = currentQuestion.answers.filter(a => a.selectedOption === option).length;
    return Math.round((count / totalAnswers) * 100);
  };

  const getResultCount = (option) => {
    return currentQuestion.answers.filter(a => a.selectedOption === option).length;
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-[#373737]">
          Question {(currentQuestionIndex || 0) + 1}
        </h2>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
            ⏱ Goals
          </span>
        </div>
      </div>

      <div className="bg-[#373737] text-white p-4 rounded-lg mb-6">
        <p className="text-lg">{currentQuestion.questionText}</p>
      </div>

      <div className="space-y-4 mb-6">
        {currentQuestion.options.map((option, index) => (
          <div key={index} className="relative">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#7765DA] rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
                <span className="font-medium text-[#373737]">{option}</span>
              </div>
              <span className="font-bold text-[#373737]">{getResultPercentage(option)}%</span>
            </div>
            <div className="w-full h-12 bg-gray-100 rounded-lg overflow-hidden">
              <div
                className="h-full bg-[#7765DA] transition-all duration-500 flex items-center justify-end px-3"
                style={{ width: `${getResultPercentage(option)}%` }}
              >
                {getResultPercentage(option) > 0 && (
                  <span className="text-white text-sm font-medium">
                    {getResultCount(option)} votes
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center text-[#6E6E6E] text-sm">
        <p>{totalAnswers} of {totalStudents} students have answered</p>
      </div>

      {/* Participants who answered */}
      <div className="mt-6 border-t pt-4">
        <h3 className="text-sm font-semibold text-[#373737] mb-3">Who answered:</h3>
        <div className="flex flex-wrap gap-2">
          {currentQuestion.answers.map((answer, idx) => (
            <div
              key={idx}
              className="px-3 py-1 bg-gray-100 rounded-full text-sm text-[#6E6E6E]"
            >
              {answer.studentName}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
