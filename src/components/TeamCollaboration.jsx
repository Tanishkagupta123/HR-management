import React, { useState } from 'react';
import { MessageCircle, MessageSquare, Upload, RefreshCcw, AtSign, Clock, Bell, Send } from 'lucide-react';

export default function TeamCollaboration() {
  const [showChat, setShowChat] = useState(false);

  const chatMessages = [
    { id: 1, author: 'Ruchi', text: 'API complete ho gayi.', time: '10:02 AM' },
    { id: 2, author: 'Amit', text: 'Design review pending hai.', time: '10:15 AM' },
    { id: 3, author: 'Manager', text: '@Ruchi Please check the dashboard UI.', time: '10:22 AM' },
  ];

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="bg-white rounded-3xl shadow-sm border p-8 max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-violet-950 mb-3">Team Collaboration</h1>
          <p className="text-slate-600 text-lg max-w-2xl">Team Collaboration page for chat, comments, file sharing, task updates, @mentions, activity history, and notifications.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div
            role="button"
            onClick={() => setShowChat(true)}
            className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm cursor-pointer hover:border-violet-300 hover:bg-white transition"
          >
            <div className="flex items-center gap-3 mb-4 text-violet-950">
              <MessageCircle size={28} />
              <div>
                <h2 className="text-xl font-semibold">Team Chat</h2>
                <p className="text-sm text-slate-500">Team Members आपस में Chat कर सकते हैं और Project/Task से Related Discussion कर सकते हैं।</p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-slate-700">
              <p>• Direct messages और group chat सपोर्ट करें।</p>
              <p>• Task-specific discussion threads बनाएँ।</p>
            </div>
          </div>

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
              <p>• उदाहरण: @Ruchi Please check the dashboard UI.</p>
              <p>• mentions notification के साथ team member तक पहुँचें।</p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4 text-violet-950">
              <Clock size={28} />
              <div>
                <h2 className="text-xl font-semibold">Activity History</h2>
                <p className="text-sm text-slate-500">किसने क्या Update किया और कब किया, उसका पूरा Record।</p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-slate-700">
              <p>• Ruchi created the task.</p>
              <p>• Amit changed status to In Progress.</p>
              <p>• Ruchi uploaded design.pdf.</p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4 text-violet-950">
              <Bell size={28} />
              <div>
                <h2 className="text-xl font-semibold">Notifications</h2>
                <p className="text-sm text-slate-500">Task Assign, Comment, Deadline Reminder और Status Change Notifications.</p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-slate-700">
              <p>• Task Assign होने पर Notification।</p>
              <p>• Comment आने पर Notification।</p>
              <p>• Deadline Reminder।</p>
            </div>
          </div>
        </div>

        {showChat ? (
          <div className="mt-10 bg-white rounded-3xl shadow-sm border p-6 max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-2xl font-semibold text-violet-950">Team Chat</h2>
                <p className="text-sm text-slate-500">Chat system open ho gaya hai. Yahan aap team se baat kar sakte hain.</p>
              </div>
              <button
                onClick={() => setShowChat(false)}
                className="text-sm text-violet-700 hover:text-violet-900"
              >
                Close
              </button>
            </div>

            <div className="space-y-4">
              {chatMessages.map((message) => (
                <div key={message.id} className="rounded-2xl border border-slate-200 p-4 bg-slate-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-slate-900">{message.author}</span>
                    <span className="text-xs text-slate-500">{message.time}</span>
                  </div>
                  <p className="text-slate-700">{message.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex gap-3 items-center">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 border border-slate-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-200"
              />
              <button className="bg-violet-950 text-white px-5 py-3 rounded-2xl flex items-center gap-2">
                <Send size={16} /> Send
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
