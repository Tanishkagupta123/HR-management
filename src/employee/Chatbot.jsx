import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

export default function Chatbot({ userType, empId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [msg, setMsg] = useState('');
  const [chat, setChat] = useState([]);
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chat]);

  const sendMessage = async () => {
    if (!msg.trim()) return;
    const newChat = [...chat, { role: 'user', text: msg }];
    setChat(newChat);
    setMsg('');

    try {
      const res = await axios.post('http://localhost:8000/api/chatbot/ask', { question: msg, userType, empId });
      setChat([...newChat, { role: 'bot', text: res.data.answer }]);
    } catch (err) {
      setChat([...newChat, { role: 'bot', text: "Sorry, I'm having trouble connecting." }]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      {isOpen && (
        <div className="bg-white w-80 h-96 shadow-2xl rounded-3xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
          {/* Header */}
          <div className="bg-violet-900 p-4 text-white font-bold flex justify-between items-center">
            <span>HR Assistant</span>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-slate-200">✕</button>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
            {chat.map((c, i) => (
              <div key={i} className={`p-3 rounded-2xl text-sm max-w-[85%] ${c.role === 'user' ? 'bg-violet-600 text-white ml-auto' : 'bg-white border border-slate-200 text-slate-700'}`}>
                {c.text}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t flex gap-2">
            <input value={msg} onChange={(e) => setMsg(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1 border-none focus:ring-0 text-sm p-2" placeholder="Ask something..." />
            <button onClick={sendMessage} className="bg-violet-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-violet-800">Send</button>
          </div>
        </div>
      )}
      
      {/* Floating Button */}
      <button onClick={() => setIsOpen(!isOpen)} className="bg-violet-900 p-4 rounded-full text-white shadow-xl hover:scale-105 transition">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
      </button>
    </div>
  );
}