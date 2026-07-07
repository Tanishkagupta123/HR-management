import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

export default function AddTask() {
  const { tasks: contextTasks, handleTaskChange, addNewTaskBlock, submitAllTasks, employeesList, departments, removeTaskBlock } = useOutletContext();
  
  // Local state taaki add task par naya block turant dikhe
  const [localTasks, setLocalTasks] = useState([{ client_name: '', title: '', task_date: '', hours: '', minutes: '', status: 'Pending', priority: 'Normal', description: '' }]);
  
  // Logic: Agar context tasks hain toh wo dikhao, nahi toh local tasks
  const tasks = (contextTasks && contextTasks.length > 0) ? contextTasks : localTasks;

  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const today = new Date().toISOString().split('T')[0];

  const handleTimeInput = (index, field, value) => {
    let val = parseInt(value);
    if (isNaN(val) || val < 0) val = 0;
    if (field === 'hours' && val > 23) val = 23;
    if (field === 'minutes' && val > 59) val = 59;
    handleTaskChange(index, field, val);
  };

  const handleAddClick = () => {
    if (typeof addNewTaskBlock === 'function') {
      addNewTaskBlock();
    } else {
      setLocalTasks([...localTasks, { client_name: '', title: '', task_date: '', hours: '', minutes: '', status: 'Pending', priority: 'Normal', description: '' }]);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-2 md:p-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border gap-4">
        <h1 className="text-xl md:text-2xl font-bold text-slate-900">Task Reporting</h1>
        <div className="bg-violet-900 text-white px-4 py-2 rounded-xl font-mono text-sm md:text-xl shadow-lg">
          {dateTime.toLocaleDateString()} | {dateTime.toLocaleTimeString()}
        </div>
      </div>
      
      <div className="bg-white p-4 md:p-6 mb-6 rounded-2xl shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Employee Name</label>
            <select className="w-full p-3 border rounded-xl" onChange={(e) => tasks.forEach((_, i) => handleTaskChange(i, 'assign_to', e.target.value))}>
              <option value="">Select Employee</option>
              {employeesList && employeesList.map(e => <option key={e.id} value={e.name}>{e.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Department</label>
            <select className="w-full p-3 border rounded-xl" onChange={(e) => tasks.forEach((_, i) => handleTaskChange(i, 'dept', e.target.value))}>
              <option value="">Select Dept</option>
              {departments && departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>
      </div>

      {tasks.map((task, index) => (
        <div key={index} className="bg-white p-4 md:p-6 mb-6 rounded-2xl shadow-sm border relative">
          {index > 0 && (
            <button type="button" onClick={() => removeTaskBlock ? removeTaskBlock(index) : setLocalTasks(localTasks.filter((_, i) => i !== index))} className="absolute top-2 right-4 text-red-500 font-bold text-lg">X</button>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div><label className="block text-xs font-bold text-black mb-1">CLIENT NAME</label>
            <input className="w-full p-3 border rounded-xl" placeholder="Client Name" onChange={(e) => handleTaskChange(index, 'client_name', e.target.value)} /></div>
            <div><label className="block text-xs font-bold text-black mb-1">TASK TITLE</label>
            <input className="w-full p-3 border rounded-xl" placeholder="Task Title" onChange={(e) => handleTaskChange(index, 'title', e.target.value)} /></div>
            <div><label className="block text-xs font-bold text-black mb-1">DATE</label>
            <input type="date" className="w-full p-3 border rounded-xl" defaultValue={today} onChange={(e) => handleTaskChange(index, 'task_date', e.target.value)} /></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div><label className="block text-xs font-bold text-black mb-1">HOURS</label>
            <input type="number" className="w-full p-3 border rounded-xl" placeholder="Hours" value={task.hours || ''} onChange={(e) => handleTimeInput(index, 'hours', e.target.value)} /></div>
            <div><label className="block text-xs font-bold text-black mb-1">MINUTES</label>
            <input type="number" className="w-full p-3 border rounded-xl" placeholder="Mins" value={task.minutes || ''} onChange={(e) => handleTimeInput(index, 'minutes', e.target.value)} /></div>
            <div><label className="block text-xs font-bold text-black mb-1">STATUS</label>
            <select className="w-full p-3 border rounded-xl" onChange={(e) => handleTaskChange(index, 'status', e.target.value)}><option>Pending</option><option>Completed</option></select></div>
            <div><label className="block text-xs font-bold text-black mb-1">PRIORITY</label>
            <select className="w-full p-3 border rounded-xl" onChange={(e) => handleTaskChange(index, 'priority', e.target.value)}><option>Normal</option><option>High</option></select></div>
          </div>
          
          <label className="block text-xs font-bold text-black mb-1">DESCRIPTION</label>
          <textarea className="w-full p-3 border rounded-xl h-20" placeholder="Description..." onChange={(e) => handleTaskChange(index, 'description', e.target.value)} />
        </div>
      ))}

      <div className="flex gap-2">
        {/* <button type="button" onClick={handleAddClick} className="bg-green-600 text-white px-4 py-3 rounded-xl font-bold flex-1 md:flex-none">+ Add Task</button> */}
        <button type="button" onClick={submitAllTasks} className="bg-violet-900 text-white px-6 py-3 rounded-xl font-bold flex-1 md:flex-none">Submit All</button>
      </div>
    </div>
  );
}