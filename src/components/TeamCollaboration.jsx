import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MessageCircle, MessageSquare, Upload, RefreshCcw, AtSign, Clock, Bell, Send } from 'lucide-react';
import { io } from 'socket.io-client';
import axios from 'axios';

const SOCKET_URL = 'http://localhost:8000';

export default function TeamCollaboration() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminPath = location.pathname.startsWith('/admin');
  const isAdminTeamCollab = location.pathname === '/admin/team-collaboration';
  const isAdminCommunication = location.pathname === '/admin/communication-system';
  
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [myId, setMyId] = useState('');
  const [otherId, setOtherId] = useState('');
  const [role, setRole] = useState('');
  const [room, setRoom] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [dashboardCounts] = useState({ notices: 12, chats: 24, announcements: 8, emails: 5 });
  const [activeCommunicationPanel, setActiveCommunicationPanel] = useState(null);
  const [noticeForm, setNoticeForm] = useState({ title: '', content: '', priority: 'Normal', expiry: '', department: 'All', attachment: '' });
  const [notices, setNotices] = useState([
    { id: 1, title: 'Office Holiday Notice', content: 'Office will remain closed on 15th August.', priority: 'High', expiry: '2026-08-15', department: 'All', pinned: true, read: false, attachment: 'holiday.pdf' },
  ]);
  const [announcements, setAnnouncements] = useState([
    { id: 1, title: 'Annual Meeting', content: 'Annual company meeting scheduled for next Monday.', priority: 'High', scheduleDate: '2026-07-14', department: 'All', attachment: 'meeting-agenda.pdf', history: ['Created on 2026-07-05'] },
  ]);
  const [emailHistory] = useState([
    { id: 1, eventType: 'Welcome', recipientGroup: 'New Hires', subject: 'Welcome to the Team!', sentOn: '2026-07-01', status: 'Sent' },
  ]);

  const socketRef = useRef(null);
  const currentRoomRef = useRef('');

  // Initial setup for user
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setIsLoggedIn(true);
      const userRole = userData.role || 'employee';
      const userId = userRole === 'admin' ? 'admin' : (userData.id || 'employee');
      setMyId(userId);
      setRole(userRole);
      setOtherId(userRole === 'admin' ? '' : 'admin');
    }
  }, []);

  // Chat logic
  const startChat = useCallback(async (targetOtherId) => {
    const chatOtherId = targetOtherId || otherId;
    if (!myId || !chatOtherId) return;
    const r = 'chat_' + [myId, chatOtherId].sort().join('_');
    setRoom(r);
    currentRoomRef.current = r;
    setShowChat(true);

    if (socketRef.current) {
        socketRef.current.emit('join', r);
    }
    
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${SOCKET_URL}/admin/chat/history`, { params: { room: r }, headers: { 'Authorization': `Bearer ${token}` } });
      setMessages(res.data || []);
    } catch (err) {
      console.error('Failed to load chat history', err);
    }
  }, [myId, otherId]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const payload = { room, senderId: myId, senderName: user?.name, senderRole: role, message: input.trim() };
    
    if (socketRef.current) {
        socketRef.current.emit('sendMessage', payload);
        setInput('');
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      {!isLoggedIn ? (
         <div className="text-center p-10">Please login to continue.</div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border p-8 max-w-6xl mx-auto">
            <h1 className="text-4xl font-extrabold text-violet-950 mb-3">Team Collaboration</h1>
              </div>
      )}
    </div>
  );
}
