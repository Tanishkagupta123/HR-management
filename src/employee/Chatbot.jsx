import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

export default function Chatbot({ userType, empId, isPage = false }) {
  const [msg, setMsg] = useState('');
  const [chat, setChat] = useState([]);
  const chatEndRef = useRef(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chat]);

  const sendMessage = async () => {
    if (!msg.trim()) return;
    const newChat = [...chat, { role: 'user', text: msg }];
    setChat(newChat);
    setMsg('');
    try {
      // Backend ko userType bhej rahe hain
      const res = await axios.post('http://localhost:8000/api/chatbot/ask', { 
        question: msg, userType, empId 
      });
      setChat([...newChat, { role: 'bot', text: res.data.answer }]);
    } catch (err) {
      setChat([...newChat, { role: 'bot', text: "Error: AI se connect nahi ho pa raha." }]);
    }
  };

  return (
    <div className={isPage ? "w-full h-full flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm border" : "w-80 h-96 bg-white rounded-3xl shadow-2xl border flex flex-col"}>
      <div className="bg-violet-900 p-4 text-white font-bold">
        {userType === 'ADMIN' ? 'Hiring Assistant' : 'HR Assistant'}
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
        {chat.map((c, i) => (
          <div key={i} className={`p-3 rounded-2xl text-sm max-w-[85%] ${c.role === 'user' ? 'bg-violet-600 text-white ml-auto' : 'bg-white border'}`}>
            {c.text}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div className="p-3 border-t flex gap-2">
        <input value={msg} onChange={(e) => setMsg(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendMessage()} className="flex-1 p-2 border rounded-xl" placeholder="Kuch puchiye..." />
        <button onClick={sendMessage} className="bg-violet-900 text-white px-4 py-2 rounded-xl">Send</button>
      </div>
    </div>
  );
}