import React, { useState, useEffect } from 'react';

export default function AddTask({ tasks, handleTaskChange, addNewTaskBlock, submitAllTasks, employeesList, departments, removeTaskBlock }) {
  
  // Live Timer State
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Today's Date (YYYY-MM-DD)
  const today = new Date().toISOString().split('T')[0];

  // Validation function (Strict)
  const handleTimeInput = (index, field, value) => {
    let val = parseInt(value);
    if (isNaN(val) || val < 0) val = 0; 
    if (field === 'hours' && val > 23) val = 23; 
    if (field === 'minutes' && val > 59) val = 59; 
    handleTaskChange(index, field, val);
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* Header with Live Date & Time */}
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border">
        <h1 className="text-2xl font-bold text-slate-900">Task Reporting</h1>
        <div className="bg-violet-900 text-white px-6 py-2 rounded-xl font-mono text-xl shadow-lg">
          {dateTime.toLocaleDateString()} | {dateTime.toLocaleTimeString()}
        </div>
      </div>
      
      {/* Emp & Dept Selection */}
      <div className="bg-white p-6 mb-6 rounded-2xl shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

      {/* Task Blocks */}
      {tasks.map((task, index) => (
        <div key={index} className="bg-white p-6 mb-6 rounded-2xl shadow-sm border relative">
          {index > 0 && <button onClick={() => removeTaskBlock(index)} className="absolute top-4 right-4 text-red-500 font-bold">X</button>}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Client / Project Name</label>
              <input className="w-full p-3 border rounded-xl" placeholder="e.g. DigiRank" onChange={(e) => handleTaskChange(index, 'client_name', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Task Title</label>
              <input className="w-full p-3 border rounded-xl" placeholder="Project Name" onChange={(e) => handleTaskChange(index, 'title', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Calendar (Date)</label>
              <input type="date" className="w-full p-3 border rounded-xl" defaultValue={today} onChange={(e) => handleTaskChange(index, 'task_date', e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Hours (0-23)</label>
              {/* Value prop add ki hai taaki validation update ho */}
              <input type="number" className="w-full p-3 border rounded-xl" placeholder="0" value={task.hours || ''} onChange={(e) => handleTimeInput(index, 'hours', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Minutes (0-59)</label>
              {/* Value prop add ki hai */}
              <input type="number" className="w-full p-3 border rounded-xl" placeholder="0" value={task.minutes || ''} onChange={(e) => handleTimeInput(index, 'minutes', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Status</label>
              <select className="w-full p-3 border rounded-xl" onChange={(e) => handleTaskChange(index, 'status', e.target.value)}>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Priority</label>
              <select className="w-full p-3 border rounded-xl" onChange={(e) => handleTaskChange(index, 'priority', e.target.value)}>
                <option value="Normal">Normal</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>
          
          <textarea className="w-full p-3 border rounded-xl h-20" placeholder="What did you do today?" onChange={(e) => handleTaskChange(index, 'description', e.target.value)} />
        </div>
      ))}

      <button onClick={addNewTaskBlock} className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold">+ Add Another Task</button>
      <button onClick={submitAllTasks} className="bg-violet-900 text-white px-10 py-3 rounded-xl font-bold ml-4">Submit All Tasks</button>
    </div>
  );
}