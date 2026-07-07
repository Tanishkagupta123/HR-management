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
    { id: 2, title: 'Company Policy Update', content: 'New leave policy effective from next month.', priority: 'Medium', expiry: '2026-09-30', department: 'All', pinned: false, read: false, attachment: 'policy.docx' },
  ]);
  const [editingNoticeId, setEditingNoticeId] = useState(null);
  const [announcementForm, setAnnouncementForm] = useState({ title: '', content: '', priority: 'Normal', scheduleDate: '', department: 'All', attachment: '' });
  const [announcements, setAnnouncements] = useState([
    { id: 1, title: 'Annual Meeting', content: 'Annual company meeting scheduled for next Monday.', priority: 'High', scheduleDate: '2026-07-14', department: 'All', attachment: 'meeting-agenda.pdf', history: ['Created on 2026-07-05'], },
    { id: 2, title: 'Salary Credited', content: 'Salary credited to employee accounts today.', priority: 'Medium', scheduleDate: '2026-07-01', department: 'Finance', attachment: 'salary-slip.pdf', history: ['Created on 2026-07-01'], },
  ]);
  const [editingAnnouncementId, setEditingAnnouncementId] = useState(null);
  const [emailForm, setEmailForm] = useState({ eventType: 'Welcome', recipientGroup: 'All Employees', subject: '', message: '', attachment: '' });
  const [emailHistory, setEmailHistory] = useState([
    { id: 1, eventType: 'Welcome', recipientGroup: 'New Hires', subject: 'Welcome to the Team!', sentOn: '2026-07-01', status: 'Sent' },
    { id: 2, eventType: 'Leave Approval', recipientGroup: 'Finance', subject: 'Leave Request Approved', sentOn: '2026-07-03', status: 'Sent' },
  ]);
  const socketRef = useRef(null);

  const resetNoticeForm = () => {
    setNoticeForm({ title: '', content: '', priority: 'Normal', expiry: '', department: 'All', attachment: '' });
    setEditingNoticeId(null);
  };

  const handleNoticeChange = (field, value) => {
    setNoticeForm((prev) => ({ ...prev, [field]: value }));
  };

  const saveNotice = () => {
    if (!noticeForm.title.trim() || !noticeForm.content.trim()) {
      alert('Title aur Content zaroori hain.');
      return;
    }
    if (editingNoticeId) {
      setNotices((prev) => prev.map((notice) => notice.id === editingNoticeId ? { ...notice, ...noticeForm } : notice));
      resetNoticeForm();
      return;
    }
    const newNotice = {
      id: Date.now(),
      title: noticeForm.title,
      content: noticeForm.content,
      priority: noticeForm.priority,
      expiry: noticeForm.expiry,
      department: noticeForm.department,
      attachment: noticeForm.attachment,
      pinned: false,
      read: false,
    };
    setNotices((prev) => [newNotice, ...prev]);
    resetNoticeForm();
  };

  const editNotice = (notice) => {
    setEditingNoticeId(notice.id);
    setNoticeForm({
      title: notice.title,
      content: notice.content,
      priority: notice.priority,
      expiry: notice.expiry,
      department: notice.department,
      attachment: notice.attachment,
    });
  };

  const deleteNotice = (id) => {
    if (confirm('Kya aap sure hain ki aap ye notice delete karna chahte hain?')) {
      setNotices((prev) => prev.filter((notice) => notice.id !== id));
    }
  };

  const togglePin = (id) => {
    setNotices((prev) => prev.map((notice) => notice.id === id ? { ...notice, pinned: !notice.pinned } : notice));
  };

  const toggleRead = (id) => {
    setNotices((prev) => prev.map((notice) => notice.id === id ? { ...notice, read: !notice.read } : notice));
  };

  const resetAnnouncementForm = () => {
    setAnnouncementForm({ title: '', content: '', priority: 'Normal', scheduleDate: '', department: 'All', attachment: '' });
    setEditingAnnouncementId(null);
  };

  const handleAnnouncementChange = (field, value) => {
    setAnnouncementForm((prev) => ({ ...prev, [field]: value }));
  };

  const saveAnnouncement = () => {
    if (!announcementForm.title.trim() || !announcementForm.content.trim()) {
      alert('Announcement title aur content zaroori hain.');
      return;
    }
    if (editingAnnouncementId) {
      setAnnouncements((prev) => prev.map((item) => item.id === editingAnnouncementId ? { ...item, ...announcementForm, history: [...item.history, `Updated on ${new Date().toLocaleDateString()}`] } : item));
      resetAnnouncementForm();
      return;
    }
    const newAnnouncement = {
      id: Date.now(),
      title: announcementForm.title,
      content: announcementForm.content,
      priority: announcementForm.priority,
      scheduleDate: announcementForm.scheduleDate,
      department: announcementForm.department,
      attachment: announcementForm.attachment,
      history: [`Created on ${new Date().toLocaleDateString()}`],
    };
    setAnnouncements((prev) => [newAnnouncement, ...prev]);
    resetAnnouncementForm();
  };

  const editAnnouncement = (announcement) => {
    setEditingAnnouncementId(announcement.id);
    setAnnouncementForm({
      title: announcement.title,
      content: announcement.content,
      priority: announcement.priority,
      scheduleDate: announcement.scheduleDate,
      department: announcement.department,
      attachment: announcement.attachment,
    });
  };

  const deleteAnnouncement = (id) => {
    if (confirm('Kya aap sure hain ki aap ye announcement delete karna chahte hain?')) {
      setAnnouncements((prev) => prev.filter((announcement) => announcement.id !== id));
    }
  };

  const resetEmailForm = () => {
    setEmailForm({ eventType: 'Welcome', recipientGroup: 'All Employees', subject: '', message: '', attachment: '' });
  };

  const handleEmailChange = (field, value) => {
    setEmailForm((prev) => ({ ...prev, [field]: value }));
  };

  const saveEmailNotification = () => {
    if (!emailForm.subject.trim() || !emailForm.message.trim()) {
      alert('Subject aur message zaroori hain.');
      return;
    }
    const newEmail = {
      id: Date.now(),
      eventType: emailForm.eventType,
      recipientGroup: emailForm.recipientGroup,
      subject: emailForm.subject,
      sentOn: new Date().toLocaleDateString(),
      status: 'Sent',
    };
    setEmailHistory((prev) => [newEmail, ...prev]);
    resetEmailForm();
  };

  const currentRoomRef = useRef('');

  // Check if user is logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsLoggedIn(true);
        const userRole = userData.role || 'employee';
        // Use a consistent identifier for admin so room names match between admin and employee
        const userId = userRole === 'admin' ? 'admin' : (userData.id || userData.name || 'employee');
        setMyId(userId);
        setRole(userRole);
        // For admin leave otherId empty (admin will select an employee)
        // For normal employees default otherId to 'admin' so chat targets admin
        setOtherId(userRole === 'admin' ? '' : 'admin');
      } catch (error) {
        console.error('Error parsing user data:', error);
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // Fetch all employees for admin and dashboard (to show names instead of ids)
  useEffect(() => {
    // Only fetch employees when on admin path. Fetching on dashboard was
    // overwriting `otherId` for employees (set to first employee) which
    // prevented employees from joining their admin chat room.
    if (isAdminPath && isLoggedIn) {
      fetchEmployees();
    }
  }, [isAdminPath, isLoggedIn]);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${SOCKET_URL}/employees`);
      if (response.data) {
        setEmployees(response.data);
        // Set first employee as default
        if (response.data.length > 0) {
          setSelectedEmployee(response.data[0].id);
          setOtherId(response.data[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to fetch employees', error);
    }
  };

  // Helper to map id -> display name
  const getNameById = (id) => {
    if (!id) return '';
    if (String(id) === 'admin') return 'Admin';
    if (user && (String(user.id) === String(id) || String(user.name) === String(id))) return user.name || String(id);
    const emp = employees.find((e) => String(e.id) === String(id) || String(e.employee_code) === String(id));
    return emp ? emp.name : String(id);
  };

  useEffect(() => {
    // Setup socket connection once
    if (!socketRef.current) {
      const socket = io(SOCKET_URL, {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
      });
      socketRef.current = socket;
      
      socket.on('connect', () => {
        console.log('Socket connected:', socket.id);
      });
      
      socket.on('receiveMessage', (m) => {
        console.log('Received message:', m, 'For room:', currentRoomRef.current);
        // Add message if it's for the current room
        if (m && m.room === currentRoomRef.current) {
          setMessages((s) => {
            // Prevent duplicates
            const isDuplicate = s.some(msg => msg.id === m.id && msg.id);
            if (isDuplicate) return s;
            return [...s, m];
          });
        }
      });

      socket.on('disconnect', () => {
        console.log('Socket disconnected');
      });
    }
    
    return () => {
      // Don't disconnect on unmount to keep socket alive
    };
  }, []);

  // Update room ref whenever room changes
  useEffect(() => {
    currentRoomRef.current = room;
  }, [room]);

  const startChat = useCallback(async (targetOtherId) => {
    const chatOtherId = targetOtherId || otherId;
    if (!myId || !chatOtherId) return alert('Enter both your id and other id');
    const r = 'chat_' + [myId, chatOtherId].sort().join('_');
    setRoom(r);
    currentRoomRef.current = r;
    setOtherId(chatOtherId);
    setShowChat(true);

    // Join room with socket
    if (socketRef.current) {
      if (socketRef.current.connected) {
        socketRef.current.emit('join', r);
      } else {
        socketRef.current.once('connect', () => {
          socketRef.current.emit('join', r);
        });
      }
      console.log('Joining room:', r);
    }
    
    // load history
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${SOCKET_URL}/admin/chat/history`, { 
        params: { room: r },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setMessages(res.data || []);
    } catch (err) {
      console.error('Failed to load chat history', err);
      if (err.response?.status === 401) {
        setIsLoggedIn(false);
        navigate('/');
      }
    }
  }, [myId, otherId]);

  useEffect(() => {
    if (isLoggedIn && (location.pathname === '/dashboard/team-collaboration' || location.pathname === '/dashboard/communication-system')) {
      startChat();
    }
  }, [isLoggedIn, location.pathname, startChat]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    // Calculate room if not set yet
    let messageRoom = room;
    if (!messageRoom) {
      messageRoom = 'chat_' + [myId, otherId].sort().join('_');
    }
    
    const payload = {
      room: messageRoom,
      senderId: myId,
      senderName: user?.name || myId,
      senderRole: role,
      message: input.trim(),
    };
    
    try {
      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.emit('join', messageRoom);
        socketRef.current.emit('sendMessage', payload);
        setInput('');
        return;
      }

      const token = localStorage.getItem('token');
      const res = await axios.post(`${SOCKET_URL}/admin/chat/message`, payload, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Add the sent message to local state immediately
      if (res.data) {
        setMessages((prev) => {
          const isDuplicate = prev.some(msg => msg.id === res.data.id);
          if (isDuplicate) return prev;
          return [...prev, res.data];
        });
      }

      setInput('');
    } catch (err) {
      console.error('Send failed', err);
      if (err.response?.status === 401) {
        setIsLoggedIn(false);
        navigate('/');
      }
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      {!isLoggedIn ? (
        <div className="bg-white rounded-3xl shadow-sm border p-8 max-w-6xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-violet-950 mb-3">Team Collaboration</h1>
            <p className="text-slate-600 text-lg text-red-600">Please log in to access the team collaboration chat.</p>
            <button
              onClick={() => navigate('/')}
              className="mt-6 bg-violet-950 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-violet-900 transition"
            >
              Go to Login
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border p-8 max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-violet-950 mb-3">{isAdminCommunication ? 'Communication System' : 'Team Collaboration'}</h1>
          <p className="text-slate-600 text-lg max-w-2xl">Welcome, <span className="font-semibold text-violet-950">{user?.name}</span>! {isAdminCommunication ? 'Communication System page for chat, comments, file sharing, task updates, @mentions, activity history, and notifications.' : 'Team Collaboration page for chat, comments, file sharing, task updates, @mentions, activity history, and notifications.'}</p>
        </div>

        {!isAdminTeamCollab && (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 mb-8">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <p className="text-sm text-slate-500 uppercase tracking-[0.2em] mb-2">Total Notices</p>
              <p className="text-3xl font-bold text-violet-950">{dashboardCounts.notices}</p>
            </div>
            {!isAdminCommunication && (
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                <p className="text-sm text-slate-500 uppercase tracking-[0.2em] mb-2">Total Chats</p>
                <p className="text-3xl font-bold text-violet-950">{dashboardCounts.chats}</p>
              </div>
            )}
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <p className="text-sm text-slate-500 uppercase tracking-[0.2em] mb-2">Total Announcements</p>
              <p className="text-3xl font-bold text-violet-950">{dashboardCounts.announcements}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <p className="text-sm text-slate-500 uppercase tracking-[0.2em] mb-2">Emails Sent Today</p>
              <p className="text-3xl font-bold text-violet-950">{dashboardCounts.emails}</p>
            </div>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          {isAdminPath && !isAdminCommunication ? (
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4 text-violet-950">
                <MessageCircle size={28} />
                <h2 className="text-xl font-semibold">Select Employee for Chat</h2>
              </div>
              <div className="space-y-3">
                <select
                  value={selectedEmployee}
                  onChange={(e) => {
                    setSelectedEmployee(e.target.value);
                    setOtherId(e.target.value);
                  }}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
                >
                  <option value="">-- Select an Employee --</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name}{emp.email ? ` (${emp.email})` : ''}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => selectedEmployee && startChat(selectedEmployee)}
                  disabled={!selectedEmployee}
                  className="w-full bg-violet-950 text-white px-4 py-2 rounded-lg font-semibold hover:bg-violet-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Start Chat
                </button>
              </div>
            </div>
          ) : !isAdminPath ? (
            <div
              role="button"
              onClick={() => startChat('admin')}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm cursor-pointer hover:border-violet-300 hover:bg-white transition"
            >
              <div className="flex items-center gap-3 mb-4 text-violet-950">
                <MessageCircle size={28} />
                <div>
                  <h2 className="text-xl font-semibold">{isAdminPath ? 'Admin Chat' : 'User Chat'}</h2>
                  <p className="text-sm text-slate-500">Team Members आपस में Chat कर सकते हैं और Project/Task से Related Discussion कर सकते हैं।</p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-slate-700">
                <p>• Direct messages और group chat सपोर्ट करें।</p>
                <p>• Task-specific discussion threads बनाएँ।</p>
              </div>
            </div>
          ) : null}

          {!isAdminPath && location.pathname !== '/dashboard/team-collaboration' && location.pathname !== '/dashboard/communication-system' && (
            <>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4 text-violet-950">
              <MessageSquare size={28} />
              <div>
                <h2 className="text-xl font-semibold">Task Comments</h2>
                <p className="text-sm text-slate-500">हर Task के नीचे Comment करने का Option।</p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-slate-700">
              <p>• "API complete ho gayi."</p>
              <p>• "Design review pending hai."</p>
              <p>• Comments task history में store हों।</p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4 text-violet-950">
              <Upload size={28} />
              <div>
                <h2 className="text-xl font-semibold">File Sharing</h2>
                <p className="text-sm text-slate-500">Task के साथ Files Upload कर सकते हैं। PDF, Word, Excel, Images आदि।</p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-slate-700">
              <p>• Attach files directly to tasks.</p>
              <p>• देखें जो भी document काम से जुड़ा है।</p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4 text-violet-950">
              <RefreshCcw size={28} />
              <div>
                <h2 className="text-xl font-semibold">Task Updates</h2>
                <p className="text-sm text-slate-500">Task का Status Update कर सकते हैं।</p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-slate-700">
              <p>• Status जैसे: To Do, In Progress, On Hold, Completed</p>
              <p>• हर बदलाव की जानकारी पूरी team को मिले।</p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4 text-violet-950">
              <AtSign size={28} />
              <div>
                <h2 className="text-xl font-semibold">@Mention</h2>
                <p className="text-sm text-slate-500">किसी Team Member को Mention कर सकते हैं।</p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-slate-700">
              <p>• उदाहरण: @Ruchi Please check the dashboard UI。</p>
              <p>• mentions notification के साथ team member तक पहुँचें।</p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4 text-violet-950">
              <Clock size={28} />
              <div>
                <h2 className="text-xl font-semibold">Activity History</h2>
                <p className="text-sm text-slate-500">किसने क्या Update किया और कब किया, उसका पूरा Record。</p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-slate-700">
              <p>• Ruchi created the task。</p>
              <p>• Amit changed status to In Progress。</p>
              <p>• Ruchi uploaded design.pdf。</p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4 text-violet-950">
              <Bell size={28} />
              <div>
                <h2 className="text-xl font-semibold">Notifications</h2>
                <p className="text-sm text-slate-500">Task Assign, Comment, Deadline Reminder और Status Change Notifications。</p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-slate-700">
              <p>• Task Assign होने पर Notification。</p>
              <p>• Comment आने पर Notification。</p>
              <p>• Deadline Reminder。</p>
            </div>
          </div>
            </>
          )}
        </div>

        {!isAdminTeamCollab && (
          <div className="mt-10">
            {isAdminCommunication && (
              <div className="grid gap-6 lg:grid-cols-3 mb-8">
                <button
                  type="button"
                  onClick={() => setActiveCommunicationPanel('notice')}
                  className={`rounded-3xl border p-6 text-left transition ${activeCommunicationPanel === 'notice' ? 'border-violet-900 bg-violet-50' : 'border-slate-200 bg-white hover:border-violet-300'}`}>
                  <div className="flex items-center gap-3 mb-3 text-violet-950">
                    <MessageCircle size={28} />
                    <h2 className="text-xl font-semibold">Notice Board</h2>
                  </div>
                  <p className="text-sm text-slate-600">Click to open the Notice Board UI.</p>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveCommunicationPanel('announcement')}
                  className={`rounded-3xl border p-6 text-left transition ${activeCommunicationPanel === 'announcement' ? 'border-violet-900 bg-violet-50' : 'border-slate-200 bg-white hover:border-violet-300'}`}>
                  <div className="flex items-center gap-3 mb-3 text-violet-950">
                    <MessageSquare size={28} />
                    <h2 className="text-xl font-semibold">Announcement</h2>
                  </div>
                  <p className="text-sm text-slate-600">Click to open the Announcement UI.</p>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveCommunicationPanel('email')}
                  className={`rounded-3xl border p-6 text-left transition ${activeCommunicationPanel === 'email' ? 'border-violet-900 bg-violet-50' : 'border-slate-200 bg-white hover:border-violet-300'}`}>
                  <div className="flex items-center gap-3 mb-3 text-violet-950">
                    <Bell size={28} />
                    <h2 className="text-xl font-semibold">Email Notifications</h2>
                  </div>
                  <p className="text-sm text-slate-600">Click to open the Email Notifications UI.</p>
                </button>
              </div>
            )}

            {(!isAdminCommunication || activeCommunicationPanel === 'notice') && (
              <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                <div className="flex items-center justify-between gap-3 mb-4 text-violet-950">
                  <div className="flex items-center gap-3">
                    <MessageCircle size={28} />
                    <div>
                      <h2 className="text-xl font-semibold">Notice Board</h2>
                      <p className="text-sm text-slate-500">Company notices and updates for all employees with pinning, expiry, attachments, and department targeting.</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={resetNoticeForm} className="rounded-full border border-violet-200 bg-white px-4 py-2 text-sm text-violet-950 hover:bg-violet-50">Clear</button>
                    <button onClick={saveNotice} className="rounded-full bg-violet-950 px-4 py-2 text-sm text-white hover:bg-violet-900">{editingNoticeId ? 'Update Notice' : 'Add Notice'}</button>
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-2 mb-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Title</label>
                      <input value={noticeForm.title} onChange={(e) => handleNoticeChange('title', e.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-violet-500 focus:outline-none" placeholder="Notice title" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Department</label>
                      <select value={noticeForm.department} onChange={(e) => handleNoticeChange('department', e.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-violet-500 focus:outline-none">
                        <option>All</option>
                        <option>HR</option>
                        <option>IT</option>
                        <option>Sales</option>
                        <option>Finance</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Attachment</label>
                      <input value={noticeForm.attachment} onChange={(e) => handleNoticeChange('attachment', e.target.value)} placeholder="PDF, image, document file name" className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-violet-500 focus:outline-none" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Content</label>
                      <textarea value={noticeForm.content} onChange={(e) => handleNoticeChange('content', e.target.value)} rows={6} className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-violet-500 focus:outline-none" placeholder="Write the notice details..."></textarea>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Priority</label>
                        <select value={noticeForm.priority} onChange={(e) => handleNoticeChange('priority', e.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-violet-500 focus:outline-none">
                          <option>Normal</option>
                          <option>Medium</option>
                          <option>High</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Expiry Date</label>
                        <input type="date" value={noticeForm.expiry} onChange={(e) => handleNoticeChange('expiry', e.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-violet-500 focus:outline-none" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {notices.map((notice) => (
                    <div key={notice.id} className={`rounded-3xl border p-5 ${notice.pinned ? 'border-violet-500 bg-violet-50' : 'border-slate-200 bg-white'}`}>
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold text-violet-950">{notice.title}</h3>
                            {notice.pinned && <span className="rounded-full bg-violet-950 px-3 py-1 text-xs text-white">Pinned</span>}
                          </div>
                          <p className="mt-2 text-sm text-slate-700">{notice.content}</p>
                          <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
                            <span className="rounded-full bg-slate-100 px-3 py-1">{notice.department} Department</span>
                            <span className="rounded-full bg-slate-100 px-3 py-1">Priority: {notice.priority}</span>
                            <span className="rounded-full bg-slate-100 px-3 py-1">Expiry: {notice.expiry || 'No expiry'}</span>
                            <span className="rounded-full bg-slate-100 px-3 py-1">{notice.read ? 'Read' : 'Unread'}</span>
                            {notice.attachment && <span className="rounded-full bg-slate-100 px-3 py-1">Attachment: {notice.attachment}</span>}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 text-sm">
                          <button onClick={() => editNotice(notice)} className="rounded-xl border border-violet-200 bg-white px-3 py-2 text-violet-950 hover:bg-violet-50">Edit</button>
                          <button onClick={() => deleteNotice(notice.id)} className="rounded-xl border border-red-200 bg-white px-3 py-2 text-red-600 hover:bg-red-50">Delete</button>
                          <button onClick={() => togglePin(notice.id)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 hover:bg-slate-100">{notice.pinned ? 'Unpin' : 'Pin'}</button>
                          <button onClick={() => toggleRead(notice.id)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 hover:bg-slate-100">Mark {notice.read ? 'Unread' : 'Read'}</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(!isAdminCommunication || activeCommunicationPanel === 'announcement') && (
              <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                <div className="flex items-center justify-between gap-3 mb-4 text-violet-950">
                  <div className="flex items-center gap-3">
                    <MessageSquare size={28} />
                    <div>
                      <h2 className="text-xl font-semibold">Announcement</h2>
                      <p className="text-sm text-slate-500">HR/Admin ke liye company-wide ya department-wise announcements send karne ka centralized section.</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={resetAnnouncementForm} className="rounded-full border border-violet-200 bg-white px-4 py-2 text-sm text-violet-950 hover:bg-violet-50">Clear</button>
                    <button onClick={saveAnnouncement} className="rounded-full bg-violet-950 px-4 py-2 text-sm text-white hover:bg-violet-900">{editingAnnouncementId ? 'Update Announcement' : 'Add Announcement'}</button>
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-2 mb-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Title</label>
                      <input value={announcementForm.title} onChange={(e) => handleAnnouncementChange('title', e.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-violet-500 focus:outline-none" placeholder="Announcement title" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Department</label>
                      <select value={announcementForm.department} onChange={(e) => handleAnnouncementChange('department', e.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-violet-500 focus:outline-none">
                        <option>All</option>
                        <option>HR</option>
                        <option>IT</option>
                        <option>Sales</option>
                        <option>Finance</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Attachment</label>
                      <input value={announcementForm.attachment} onChange={(e) => handleAnnouncementChange('attachment', e.target.value)} placeholder="PDF, image, document file name" className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-violet-500 focus:outline-none" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Content</label>
                      <textarea value={announcementForm.content} onChange={(e) => handleAnnouncementChange('content', e.target.value)} rows={6} className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-violet-500 focus:outline-none" placeholder="Write announcement details..."></textarea>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Priority</label>
                        <select value={announcementForm.priority} onChange={(e) => handleAnnouncementChange('priority', e.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-violet-500 focus:outline-none">
                          <option>Normal</option>
                          <option>Medium</option>
                          <option>High</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Schedule Date</label>
                        <input type="date" value={announcementForm.scheduleDate} onChange={(e) => handleAnnouncementChange('scheduleDate', e.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-violet-500 focus:outline-none" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {announcements.map((announcement) => (
                    <div key={announcement.id} className="rounded-3xl border border-slate-200 bg-white p-5">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold text-violet-950">{announcement.title}</h3>
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">{announcement.department}</span>
                          </div>
                          <p className="mt-2 text-sm text-slate-700">{announcement.content}</p>
                          <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
                            <span className="rounded-full bg-slate-100 px-3 py-1">Priority: {announcement.priority}</span>
                            <span className="rounded-full bg-slate-100 px-3 py-1">Schedule: {announcement.scheduleDate || 'Immediate'}</span>
                            {announcement.attachment && <span className="rounded-full bg-slate-100 px-3 py-1">Attachment: {announcement.attachment}</span>}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 text-sm">
                          <button onClick={() => editAnnouncement(announcement)} className="rounded-xl border border-violet-200 bg-white px-3 py-2 text-violet-950 hover:bg-violet-50">Edit</button>
                          <button onClick={() => deleteAnnouncement(announcement.id)} className="rounded-xl border border-red-200 bg-white px-3 py-2 text-red-600 hover:bg-red-50">Delete</button>
                        </div>
                      </div>
                      <div className="mt-3 text-xs text-slate-500">
                        History: {announcement.history.join(' • ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(!isAdminCommunication || activeCommunicationPanel === 'email') && (
              <div className="mt-4 space-y-6">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4 text-violet-950">
                    <Bell size={28} />
                    <h2 className="text-xl font-semibold">Email Notifications</h2>
                  </div>
                  <p className="text-sm text-slate-600 mb-4">Schedule and preview email templates for key HR events, then review the delivery history.</p>
                  <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Event Type</label>
                        <select value={emailForm.eventType} onChange={(e) => handleEmailChange('eventType', e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-violet-400 focus:outline-none">
                          <option>Welcome</option>
                          <option>Password Reset</option>
                          <option>Leave Approval</option>
                          <option>Task Assignment</option>
                          <option>Attendance Reminder</option>
                          <option>Performance Update</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Recipient Group</label>
                        <select value={emailForm.recipientGroup} onChange={(e) => handleEmailChange('recipientGroup', e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-violet-400 focus:outline-none">
                          <option>All Employees</option>
                          <option>HR Team</option>
                          <option>Managers</option>
                          <option>Finance</option>
                          <option>New Hires</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Subject</label>
                        <input type="text" value={emailForm.subject} onChange={(e) => handleEmailChange('subject', e.target.value)} placeholder="Enter email subject" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-violet-400 focus:outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Message</label>
                        <textarea value={emailForm.message} onChange={(e) => handleEmailChange('message', e.target.value)} rows={5} placeholder="Write message body" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-violet-400 focus:outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Attachment (optional)</label>
                        <input type="text" value={emailForm.attachment} onChange={(e) => handleEmailChange('attachment', e.target.value)} placeholder="Attachment filename or URL" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-violet-400 focus:outline-none" />
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <button onClick={saveEmailNotification} className="rounded-2xl bg-violet-950 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-800">Send Email</button>
                        <button onClick={resetEmailForm} className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100">Reset</button>
                      </div>
                    </div>
                    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="mb-4 flex items-center justify-between">
                        <div>
                          <h3 className="text-base font-semibold text-slate-900">Email Preview</h3>
                          <p className="text-xs text-slate-500">How the recipient will see the message.</p>
                        </div>
                        <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-800">{emailForm.eventType}</span>
                      </div>
                      <div className="space-y-3 text-sm text-slate-700">
                        <div>
                          <span className="block text-slate-500">To:</span>
                          <p className="rounded-2xl bg-slate-50 p-3 text-slate-900">{emailForm.recipientGroup}</p>
                        </div>
                        <div>
                          <span className="block text-slate-500">Subject:</span>
                          <p className="rounded-2xl bg-slate-50 p-3 text-slate-900">{emailForm.subject || 'No subject yet'}</p>
                        </div>
                        <div>
                          <span className="block text-slate-500">Message:</span>
                          <p className="whitespace-pre-wrap rounded-2xl bg-slate-50 p-3 text-slate-900">{emailForm.message || 'No message yet'}</p>
                        </div>
                        {emailForm.attachment && (
                          <div className="rounded-2xl bg-slate-100 p-3 text-sm text-slate-700">Attachment: {emailForm.attachment}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">Recent Email History</h3>
                      <p className="text-sm text-slate-500">Track previously sent notifications and their status.</p>
                    </div>
                    <button onClick={() => setEmailHistory((prev) => prev)} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100">Refresh</button>
                  </div>
                  <div className="space-y-3">
                    {emailHistory.map((item) => (
                      <div key={item.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-700">
                          <div className="space-y-1">
                            <div className="font-semibold text-slate-900">{item.subject}</div>
                            <div className="text-slate-500">{item.eventType} • {item.recipientGroup}</div>
                          </div>
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{item.status}</span>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                          <span>Sent: {item.sentOn}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {showChat ? (
          <div className="mt-10 bg-white rounded-3xl shadow-sm border p-6 max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-2xl font-semibold text-violet-950">Team Chat</h2>
                <p className="text-sm text-slate-500">Real-time chat between users. Messages are stored in DB.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="border px-3 py-2 rounded bg-slate-100">
                  <p className="text-xs text-slate-500">Your ID</p>
                  <p className="font-semibold text-slate-700">{getNameById(myId)}</p>
                </div>
                <div className="border px-3 py-2 rounded bg-slate-100">
                  <p className="text-xs text-slate-500">Chat With</p>
                  <p className="font-semibold text-slate-700">{getNameById(otherId)}</p>
                </div>
                <div className="border px-3 py-2 rounded bg-slate-100">
                  <p className="text-xs text-slate-500">Your Role</p>
                  <p className="font-semibold text-slate-700 capitalize">{role}</p>
                </div>
                <button onClick={() => { setShowChat(false); }} className="text-sm text-violet-700 hover:text-violet-900">Close</button>
              </div>
            </div>

            <div className="mb-4">
              <button onClick={startChat} className="bg-violet-950 text-white px-4 py-2 rounded">Start / Refresh Chat</button>
            </div>

            <div className="border rounded-lg p-4 max-h-96 overflow-y-auto space-y-3 bg-slate-50">
              {messages.map((m) => {
                const isSentByMe = String(m.sender_id) === String(myId);
                return (
                  <div key={m.id || Math.random()} className="flex">
                    <div
                      className={`max-w-[60%] p-3 rounded-2xl ${isSentByMe ? 'ml-auto bg-green-100 text-green-950' : 'mr-auto bg-sky-400 text-white'}`}
                    >
                      <div className="text-xs text-slate-600 mb-1">{m.sender_name ? m.sender_name : getNameById(m.sender_id)} • {new Date(m.created_at).toLocaleString()}</div>
                      <div className="text-sm">{m.message}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 flex gap-3 items-center">
              <input value={input} onChange={(e) => setInput(e.target.value)} type="text" placeholder="Type your message..." className="flex-1 border border-slate-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-200" />
              <button onClick={sendMessage} className="bg-violet-950 text-white px-5 py-3 rounded-2xl flex items-center gap-2"><Send size={16} /> Send</button>
            </div>
          </div>
        ) : null}
        </div>
      )}
    </div>
  );
}
