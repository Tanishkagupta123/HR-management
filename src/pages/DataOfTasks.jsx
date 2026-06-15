import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function DataOfTasks({ tasksList, onDelete, refreshData }) {
  const today = new Date().toISOString().split('T')[0];
  const todayTasks = tasksList.filter(t => t.task_date === today);
  const weeklyTasks = tasksList.filter(t => t.task_date !== today);

  const [collapsed, setCollapsed] = useState({ today: false, weekly: true, monthly: true });
  const [timers, setTimers] = useState({});
  const [remarks, setRemarks] = useState({});
  const [extraTimes, setExtraTimes] = useState({});
  const intervalRefs = useRef({});

  const toggleSection = (key) => setCollapsed(prev => ({ ...prev, [key]: !prev[key] }));

  const handleStartStop = (taskId) => {
    setTimers(prev => {
      const t = prev[taskId] || { running: false, elapsed: 0 };
      if (t.running) {
        clearInterval(intervalRefs.current[taskId]);
        return { ...prev, [taskId]: { ...t, running: false } };
      } else {
        const start = Date.now() - (t.elapsed * 1000);
        intervalRefs.current[taskId] = setInterval(() => {
          setTimers(p => ({
            ...p,
            [taskId]: { ...p[taskId], elapsed: Math.floor((Date.now() - start) / 1000) }
          }));
        }, 1000);
        return { ...prev, [taskId]: { ...t, running: true } };
      }
    });
  };

  const formatTime = (secs) => {
    if (!secs) return '0s';
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  useEffect(() => () => Object.values(intervalRefs.current).forEach(clearInterval), []);

  const handleUpdate = async (task, type) => {
    let updatedData = { ...task };
    if (type === 'complete') {
      updatedData.status = 'Completed';
    } else if (type === 'save') {
      if (extraTimes[task.id] !== undefined) updatedData.extra_time = extraTimes[task.id];
      if (remarks[task.id] !== undefined) updatedData.description = remarks[task.id];
    }
    try {
      await axios.put(`http://localhost:8000/tasks/${task.id}`, updatedData);
      refreshData();
    } catch (err) { alert("Update failed!"); }
  };

  const TaskSection = ({ data, title, sectionKey }) => (
    <div className="border border-gray-200 rounded-xl mb-4 overflow-hidden bg-white shadow-sm">

      {/* Section Header */}
      <div
        onClick={() => toggleSection(sectionKey)}
        className="px-5 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center cursor-pointer select-none hover:bg-gray-100 transition"
      >
        <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          📅 {title}
          <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold">{data.length}</span>
        </span>
        <span className={`text-gray-400 text-lg transition-transform duration-200 ${collapsed[sectionKey] ? '-rotate-90' : 'rotate-0'}`}>⌄</span>
      </div>

      {!collapsed[sectionKey] && (
        <>
          {/* Column Headers */}
          <div className="hidden md:grid grid-cols-[2fr_1.2fr_1.2fr_1.2fr_1fr_1.5fr_1.4fr] gap-2 px-4 py-2 bg-gray-50 border-b border-gray-200">
            {['Client/Task Details', 'Assign To', 'Time Tracking', 'Status', 'Extra Time', 'Remarks', 'Action'].map((h, i) => (
              <span key={i} className={`text-[10px] font-semibold text-gray-400 uppercase tracking-wider ${i === 6 ? 'text-center' : 'text-left'}`}>{h}</span>
            ))}
          </div>

          {data.length > 0 ? (
            <div>
              {data.map((task) => {
                const timer = timers[task.id] || { running: false, elapsed: 0 };
                return (
                  <div key={task.id} className="grid grid-cols-1 md:grid-cols-[2fr_1.2fr_1.2fr_1.2fr_1fr_1.5fr_1.4fr] gap-2 items-center px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition">

                    {/* Client / Task */}
                    <div>
                      <p className="text-sm font-semibold text-gray-800 m-0">{task.client_name}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{task.title}</p>
                      {task.task_date && (
                        <span className="text-[10px] bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded mt-1 inline-block">
                          Target: {task.task_date}
                        </span>
                      )}
                    </div>

                    {/* Assign To */}
                    <div>
                      <p className="text-xs text-gray-700">{task.assign_to}</p>
                      <p className="text-[10px] text-gray-400">By: {task.assign_to}</p>
                    </div>

                    {/* Time Tracking */}
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-semibold text-gray-800 font-mono">{formatTime(timer.elapsed)}</span>
                      <button
                        onClick={() => handleStartStop(task.id)}
                        className={`text-[10px] px-2 py-0.5 rounded font-semibold w-fit border-none cursor-pointer ${timer.running ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}
                      >
                        {timer.running ? '⏹ Stop' : '▶ Start'}
                      </button>
                    </div>

                    {/* Status */}
                    <div>
                      <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${task.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {task.status === 'Completed' ? '✓ ' : '⏸ '}{task.status || 'Pending / Stop'}
                      </span>
                    </div>

                    {/* Extra Time */}
                    <div>
                      <input
                        type="text"
                        defaultValue={task.extra_time || '0'}
                        onChange={e => setExtraTimes(p => ({ ...p, [task.id]: e.target.value }))}
                        className="w-14 px-2 py-1 text-xs border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                        placeholder="0h"
                      />
                    </div>

                    {/* Remarks */}
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        defaultValue={task.description || ''}
                        onChange={e => setRemarks(p => ({ ...p, [task.id]: e.target.value }))}
                        className="w-full px-2 py-1 text-[11px] border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                        placeholder="Add remark..."
                      />
                      <button
                        onClick={() => handleUpdate(task, 'save')}
                        className="text-gray-400 hover:text-indigo-500 text-sm bg-transparent border-none cursor-pointer"
                        title="Save"
                      >✏️</button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-1.5 justify-center">
                      <button
                        title="Info"
                        className="w-8 h-8 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-white text-sm border-none cursor-pointer flex items-center justify-center transition"
                      >✉</button>
                      <button
                        onClick={() => handleUpdate(task, 'complete')}
                        title="Complete"
                        className="w-8 h-8 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm border-none cursor-pointer flex items-center justify-center transition"
                      >✓</button>
                      <button
                        title="Upload"
                        className="w-8 h-8 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm border-none cursor-pointer flex items-center justify-center transition"
                      >↑</button>
                      <button
                        onClick={() => onDelete(task.id)}
                        title="Delete"
                        className="w-8 h-8 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm border-none cursor-pointer flex items-center justify-center transition"
                      >🗑</button>
                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-10 text-center text-sm text-gray-400 italic">No tasks found.</div>
          )}
        </>
      )}
    </div>
  );

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Data of Tasks</h1>
        <p className="text-xs text-gray-400 mt-1">
          {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
        </p>
      </div>
      <TaskSection data={todayTasks} title="Today's Tasks & Pending" sectionKey="today" />
      <TaskSection data={weeklyTasks} title="This Week's Progress" sectionKey="weekly" />
      <TaskSection data={[]} title="Monthly Performance Record" sectionKey="monthly" />
    </div>
  );
}