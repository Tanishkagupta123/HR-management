import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useOutletContext } from 'react-router-dom';

export default function DataOfTasks() {
  const { tasksList = [], fetchData } = useOutletContext();
  
  const onDelete = async (id) => { 
    try {
      await axios.delete(`http://localhost:8000/tasks/${id}`); 
      fetchData(); 
    } catch (err) {
      alert("Delete failed!");
    }
  };

  // Modern Automatic Date Segregation (Today, Weekly, Monthly)
  const todayStr = new Date().toISOString().split('T')[0];
  const todayDate = new Date(todayStr);

  const todayTasks = tasksList.filter(t => t.task_date === todayStr);
  
  const weeklyTasks = tasksList.filter(t => {
    if (t.task_date === todayStr) return false;
    const tDate = new Date(t.task_date);
    const diffTime = Math.abs(tDate - todayDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  });

  const monthlyTasks = tasksList.filter(t => {
    if (t.task_date === todayStr) return false;
    const tDate = new Date(t.task_date);
    const diffTime = Math.abs(tDate - todayDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 7;
  });

  const [collapsed, setCollapsed] = useState({ today: false, weekly: false, monthly: false });
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
    if (!secs) return '00:00:00';
    const h = Math.floor(secs / 3600).toString().padStart(2, '0');
    const m = Math.floor((secs % 3600) / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
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
      fetchData();
    } catch (err) { alert("Update failed!"); }
  };

  const TaskSection = ({ data, title, sectionKey, icon, badgeColor }) => (
    <div className="bg-white border border-slate-100 rounded-2xl mb-6 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
      
      {/* Premium Header Accordion */}
      <div
        onClick={() => toggleSection(sectionKey)}
        className="px-6 py-4 bg-slate-50/70 border-b border-slate-100 flex justify-between items-center cursor-pointer select-none hover:bg-slate-100/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{icon}</span>
          <span className="text-sm font-bold text-slate-800 tracking-wide">{title}</span>
          <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${badgeColor}`}>
            {data.length} Tasks
          </span>
        </div>
        <span className={`text-slate-400 text-sm font-bold transition-transform duration-300 ${collapsed[sectionKey] ? '-rotate-90' : 'rotate-0'}`}>
          ▼
        </span>
      </div>

      {!collapsed[sectionKey] && (
        <>
          {/* Grid Column Titles */}
          <div className="hidden md:grid grid-cols-[2fr_1.2fr_1.2fr_1.2fr_1fr_1.5fr_1.4fr] gap-4 px-6 py-3 bg-slate-50/30 border-b border-slate-100">
            {['Client & Task Details', 'Assigned Employee', 'Live Tracking', 'Current Status', 'Extra Time', 'Manager Remarks', 'Actions'].map((h, i) => (
              <span key={i} className={`text-[11px] font-bold text-slate-400 uppercase tracking-wider ${i === 6 ? 'text-center' : 'text-left'}`}>{h}</span>
            ))}
          </div>

          {data.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {data.map((task) => {
                const timer = timers[task.id] || { running: false, elapsed: 0 };
                // Dynamic styling for Priority
                const isHighPriority = task.priority?.toLowerCase() === 'high';
                
                return (
                  <div key={task.id} className="grid grid-cols-1 md:grid-cols-[2fr_1.2fr_1.2fr_1.2fr_1fr_1.5fr_1.4fr] gap-4 items-center px-6 py-4 hover:bg-slate-50/60 transition-colors">

                    {/* Client & Task Info */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-slate-900 leading-tight">{task.client_name || 'N/A'}</p>
                        {isHighPriority && (
                          <span className="text-[9px] bg-red-100 text-red-600 font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wide">High</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-medium">{task.title}</p>
                      {task.task_date && (
                        <span className="text-[10px] bg-indigo-50 text-indigo-600 font-semibold px-2 py-0.5 rounded-md inline-block border border-indigo-100/50">
                           Target: {task.task_date}
                        </span>
                      )}
                    </div>

                    {/* Employee Display (Fixed & Verified) */}
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-violet-100 text-violet-700 rounded-full flex items-center justify-center font-bold text-xs uppercase shadow-inner">
                        {(task.assign_to || task.employee_name || 'U')[0]}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800 leading-none">{task.assign_to || task.employee_name || 'Not Assigned'}</p>
                        <p className="text-[10px] text-slate-400 mt-1">Dept: {task.dept || 'General'}</p>
                      </div>
                    </div>

                    {/* Modern Timer Box */}
                    <div className="flex flex-col gap-1.5">
                      <span className={`text-xs font-bold font-mono tracking-wider ${timer.running ? 'text-emerald-600 animate-pulse' : 'text-slate-700'}`}>
                         {formatTime(timer.elapsed)}
                      </span>
                      <button
                        onClick={() => handleStartStop(task.id)}
                        className={`text-[10px] px-2.5 py-1 rounded-lg font-bold w-fit transition-all active:scale-95 shadow-sm border-none cursor-pointer ${
                          timer.running 
                            ? 'bg-red-500 text-white hover:bg-red-600 shadow-red-100' 
                            : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-100'
                        }`}
                      >
                        {timer.running ? '⏹ Stop' : 'Start'}
                      </button>
                    </div>

                    {/* Premium Status Pill */}
                    <div>
                      <span className={`text-[11px] px-2.5 py-1 rounded-full font-bold inline-flex items-center gap-1 shadow-sm ${
                        task.status === 'Completed' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {task.status === 'Completed' ? '✓' : ''} {task.status || 'Pending'}
                      </span>
                    </div>

                    {/* Extra Time Form Field */}
                    <div>
                      <input
                        type="text"
                        defaultValue={task.extra_time || '0'}
                        onChange={e => setExtraTimes(p => ({ ...p, [task.id]: e.target.value }))}
                        className="w-16 px-2.5 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all text-center"
                        placeholder="0h"
                      />
                    </div>

                    {/* Custom Remarks Section */}
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        defaultValue={task.description || ''}
                        onChange={e => setRemarks(p => ({ ...p, [task.id]: e.target.value }))}
                        className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all"
                        placeholder="Add feedback..."
                      />
                      <button
                        onClick={() => handleUpdate(task, 'save')}
                        className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-violet-600 hover:text-white text-slate-500 text-xs border-none cursor-pointer flex items-center justify-center transition-all shadow-sm active:scale-90"
                        title="Save Changes"
                      >
                        
                      </button>
                    </div>

                    {/* Clean Dashboard Actions */}
                    <div className="flex gap-1.5 justify-center">
                      <button title="Mark Complete" onClick={() => handleUpdate(task, 'complete')} className="w-8 h-8 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs border-none cursor-pointer flex items-center justify-center transition-all shadow-md shadow-emerald-100 active:scale-90">✓</button>
                      <button title="Upload Documents" className="w-8 h-8 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs border-none cursor-pointer flex items-center justify-center transition-all shadow-md shadow-sky-100 active:scale-90">↑</button>
                      <button title="Delete Permanent" onClick={() => onDelete(task.id)} className="w-8 h-8 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs border-none cursor-pointer flex items-center justify-center transition-all shadow-md shadow-rose-100 active:scale-90">🗑</button>
                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center text-sm font-medium text-slate-400 bg-slate-50/20 italic">
              No active tasks found in this section.
            </div>
          )}
        </>
      )}
    </div>
  );

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto bg-slate-50/50 min-h-screen">
      {/* Upper Layout Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Data of Tasks</h1>
          <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">Operational Activity Logs</p>
        </div>
        <div className="bg-violet-900 text-white px-4 py-2 rounded-xl font-mono text-xs md:text-sm font-bold shadow-lg shadow-violet-900/20">
           {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
        </div>
      </div>

      {/* Accordion Categorized Lists */}
      <TaskSection data={todayTasks} title="Today's Tasks & Urgent Deadlines" sectionKey="today" icon="" badgeColor="bg-red-100 text-red-700" />
      <TaskSection data={weeklyTasks} title="This Week's Active Progress" sectionKey="weekly" icon="" badgeColor="bg-amber-100 text-amber-700" />
      <TaskSection data={monthlyTasks} title="Monthly Performance Record" sectionKey="monthly" icon="" badgeColor="bg-emerald-100 text-emerald-700" />
    </div>
  );
}