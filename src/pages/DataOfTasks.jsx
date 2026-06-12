import React from 'react';
import axios from 'axios';

export default function DataOfTasks({ tasksList, onDelete, refreshData }) {
  const today = new Date().toISOString().split('T')[0];
  
  const todayTasks = tasksList.filter(t => t.task_date === today);
  const weeklyTasks = tasksList.filter(t => t.task_date !== today);

  // Status aur Extra Time update karne ka logic
  const handleUpdate = async (task, type) => {
    let updatedData = { ...task };
    
    if (type === 'complete') {
      updatedData.status = 'Completed';
    } else if (type === 'extra') {
      const extra = prompt("Enter Extra Time (in hours):", task.extra_time || 0);
      if (extra) updatedData.extra_time = extra;
    }

    try {
      await axios.put(`http://localhost:8000/tasks/${task.id}`, updatedData);
      refreshData(); // UI refresh ho jayega
    } catch (err) { alert("Update failed!"); }
  };

  const TaskTable = ({ data, title }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border mb-8">
      <h2 className="text-xl font-bold mb-6 text-slate-800">{title}</h2>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-slate-400 border-b">
            <th className="pb-4">Client/Task</th>
            <th className="pb-4">Assign To</th>
            <th className="pb-4">Time</th>
            <th className="pb-4">Status</th>
            <th className="pb-4">Extra/Remarks</th>
            <th className="pb-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((task) => (
            <tr key={task.id} className="border-b hover:bg-slate-50">
              <td className="py-4 font-medium">{task.client_name}<br/><span className="text-xs text-slate-400">{task.title}</span></td>
              <td className="py-4">{task.assign_to}</td>
              <td className="py-4 text-sm">{task.hours}h {task.minutes}m</td>
              <td className="py-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${task.status === 'Completed' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                  {task.status}
                </span>
              </td>
              <td className="py-4 text-sm text-slate-600">{task.extra_time || '0'} / {task.description}</td>
              <td className="py-4 flex gap-2">
                <button className="bg-yellow-400 p-1.5 rounded text-white text-xs" onClick={() => handleUpdate(task, 'extra')}>✉️</button>
                <button className="bg-green-500 p-1.5 rounded text-white text-xs" onClick={() => handleUpdate(task, 'complete')}>✅</button>
                <button className="bg-blue-500 p-1.5 rounded text-white text-xs">☁️</button>
                <button onClick={() => onDelete(task.id)} className="bg-red-500 p-1.5 rounded text-white text-xs">🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="p-4">
      <TaskTable data={todayTasks} title="Today's Tasks & Pending" />
      <TaskTable data={weeklyTasks} title="Weekly & Monthly Progress" />
    </div>
  );
}