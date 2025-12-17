import { useState, useEffect, useRef } from 'react';
import socketService from '@/lib/socket';
import { useAppSelector } from '@/store/hooks';
import { useParams } from 'react-router-dom';

export default function ChatPanel() {
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('chat');
  const messagesEndRef = useRef(null);
  const { chatMessages, currentUser, poll } = useAppSelector((state) => state.poll);
  const params = useParams();
  const pollCode = params.pollCode;

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    socketService.sendChatMessage(
      pollCode,
      message,
      currentUser.name,
      currentUser.id,
      currentUser.role
    );

    setMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col h-150">
      {/* Tabs */}
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-3 text-sm font-medium transition-all ${
            activeTab === 'chat'
              ? 'text-[#7765DA] border-b-2 border-[#7765DA]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Chat
        </button>
        <button
          onClick={() => setActiveTab('participants')}
          className={`flex-1 py-3 text-sm font-medium transition-all ${
            activeTab === 'participants'
              ? 'text-[#7765DA] border-b-2 border-[#7765DA]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Participants
        </button>
      </div>

      {/* Content */}
      {activeTab === 'chat' ? (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.length === 0 ? (
              <div className="text-center text-[#6E6E6E] text-sm py-8">
                No messages yet. Start the conversation!
              </div>
            ) : (
              chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${
                    msg.senderId === currentUser.id ? 'items-end' : 'items-start'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-[#6E6E6E]">
                      {msg.senderName}
                    </span>
                    <span className="text-xs text-gray-400">
                      {msg.senderRole === 'teacher' ? '(Teacher)' : ''}
                    </span>
                  </div>
                  <div
                    className={`max-w-[80%] px-4 py-2 rounded-lg ${
                      msg.senderId === currentUser.id
                        ? 'bg-[#7765DA] text-white'
                        : 'bg-gray-100 text-[#373737]'
                    }`}
                  >
                    <p className="text-sm">{msg.message}</p>
                  </div>
                  <span className="text-xs text-gray-400 mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Hey There, how can I help?"
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#7765DA] text-sm text-[#373737] placeholder:text-gray-400"
              />
              <button
                onClick={handleSendMessage}
                className="px-4 py-2 bg-[#7765DA] text-white rounded-lg hover:bg-[#5767D0] transition-all text-sm font-medium"
              >
                Send
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-sm font-semibold text-[#373737] mb-3">
            Name
          </h3>
          <div className="space-y-2">
            {poll?.activeStudents.map((student) => (
              <div
                key={student.studentId}
                className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg"
              >
                <div className="w-8 h-8 bg-[#7765DA] rounded-full flex items-center justify-center text-white font-bold text-xs">
                  {student.studentName.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm text-[#373737]">{student.studentName}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
