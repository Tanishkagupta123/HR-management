import React from 'react';
import axios from 'axios';

export default function DataOfTasks({ tasksList, onDelete, refreshData }) {
  const today = new Date().toISOString().split('T')[0];
  const todayTasks = tasksList.filter(t => t.task_date === today);
  const weeklyTasks = tasksList.filter(t => t.task_date !== today);

  const handleUpdate = async (task, type) => {
    let updatedData = { ...task };
    if (type === 'complete') {
      updatedData.status = 'Completed';
    } else if (type === 'extra') {
      const extra = prompt("Enter Extra Time (in hours):", task.extra_time || 0);
      const remark = prompt("Enter Remarks:", task.description || "");
      if (extra !== null) updatedData.extra_time = extra;
      if (remark !== null) updatedData.description = remark;
    }
    try {
      await axios.put(`http://localhost:8000/tasks/${task.id}`, updatedData);
      refreshData();
    } catch (err) { alert("Update failed!"); }
  };

  const TaskSection = ({ data, title }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 mb-6 overflow-hidden">
      {/* Section Header */}
      <div className="p-5 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
        <h2 className="text-sm font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-2">
          📅 {title}
        </h2>
        <span className="text-[10px] bg-violet-100 px-3 py-1 rounded-full text-violet-700 font-bold">{data.length} Items</span>
      </div>

      {/* Grid: 8 Columns Layout for full professionalism */}
      <div className="hidden md:grid grid-cols-8 gap-2 px-6 py-3 bg-slate-50/50 text-[10px] uppercase font-black text-slate-400 border-b">
        <div className="col-span-2">Client / Task</div>
        <div>Assign</div>
        <div>Time</div>
        <div>Status</div>
        <div>Extra Time</div>
        <div>Remarks</div>
        <div className="text-right">Action</div>
      </div>

      {data.length > 0 ? (
        <div className="p-4 space-y-3">
          {data.map((task) => (
            <div key={task.id} className="grid grid-cols-1 md:grid-cols-8 gap-4 items-center p-4 bg-white border border-slate-100 rounded-2xl hover:shadow-md transition-all">
              <div className="md:col-span-2">
                <p className="font-bold text-slate-800 text-sm">{task.client_name}</p>
                <p className="text-[11px] text-slate-400">{task.title}</p>
              </div>
              <div className="text-xs font-bold text-slate-600">{task.assign_to}</div>
              <div className="text-xs font-mono font-bold text-slate-600">{task.hours}h {task.minutes}m</div>
              <div>
                <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${task.status === 'Completed' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                  {task.status}
                </span>
              </div>
              {/* Extra Time Column */}
              <div className="text-xs font-bold text-slate-600">{task.extra_time || '0'}h</div>
              {/* Remarks Column */}
              <div className="text-xs text-slate-500 font-medium truncate">{task.description || '-'}</div>
              
              <div className="flex gap-2 justify-end col-span-1">
                <button onClick={() => handleUpdate(task, 'extra')} className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-yellow-50 hover:text-yellow-600 transition">✉️</button>
                <button onClick={() => handleUpdate(task, 'complete')} className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-green-50 hover:text-green-600 transition">✅</button>
                <button onClick={() => onDelete(task.id)} className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition">🗑️</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center text-slate-400 text-xs italic">No tasks found.</div>
      )}
    </div>
  );

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-black text-slate-900 mb-8">Data of Tasks</h1>
      <TaskSection data={todayTasks} title="Today's Tasks & Pending" />
      <TaskSection data={weeklyTasks} title="This Week's Progress" />
      <TaskSection data={[]} title="Monthly Performance Record" />
    </div>
  );
}