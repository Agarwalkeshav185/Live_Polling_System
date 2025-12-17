export default function ParticipantsList({ participants, onRemove }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-bold text-[#373737] mb-4">
        Participants ({participants.length})
      </h3>
      <div className="space-y-3">
        {participants.length === 0 ? (
          <p className="text-[#6E6E6E] text-sm text-center py-4">
            Waiting for students to join...
          </p>
        ) : (
          participants.map((participant) => (
            <div
              key={participant.studentId}
              className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#7765DA] rounded-full flex items-center justify-center text-white font-bold">
                  {participant.studentName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-[#373737]">{participant.studentName}</p>
                  <p className="text-xs text-[#6E6E6E]">Student</p>
                </div>
              </div>
              <button
                onClick={() => onRemove(participant.studentId)}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Kick out
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
