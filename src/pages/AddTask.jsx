export default function AddTask({ tasks, handleTaskChange, addNewTaskBlock, submitAllTasks, employeesList, departments, removeTaskBlock }) {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-8">Task Reporting</h1>
      
      {/* Emp & Dept Selection */}
      <div className="bg-white p-8 mb-6 rounded-3xl shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Employee Name</label>
            <select className="w-full p-4 border rounded-2xl" onChange={(e) => tasks.forEach((_, i) => handleTaskChange(i, 'empName', e.target.value))}>
              <option value="">Select Employee</option>
              {employeesList && employeesList.map(e => <option key={e.id} value={e.name}>{e.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Department</label>
            <select className="w-full p-4 border rounded-2xl" onChange={(e) => tasks.forEach((_, i) => handleTaskChange(i, 'dept', e.target.value))}>
              <option value="">Select Dept</option>
              {departments && departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Task Blocks */}
      {tasks.map((task, index) => (
        <div key={index} className="bg-white p-8 mb-6 rounded-3xl shadow-sm border relative">
          {index > 0 && <button onClick={() => removeTaskBlock(index)} className="absolute top-4 right-4 text-red-500 font-bold">X</button>}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div><label className="block text-sm font-semibold mb-2">Project Name</label>
              <input className="w-full p-4 border rounded-2xl" placeholder="Project" onChange={(e) => handleTaskChange(index, 'client_name', e.target.value)} />
            </div>
            <div><label className="block text-sm font-semibold mb-2">Task Title</label>
              <input className="w-full p-4 border rounded-2xl" placeholder="Title" onChange={(e) => handleTaskChange(index, 'title', e.target.value)} />
            </div>
            <div><label className="block text-sm font-semibold mb-2">Date</label>
              <input type="date" className="w-full p-4 border rounded-2xl" onChange={(e) => handleTaskChange(index, 'date', e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            <div><label className="block text-sm font-semibold mb-2">Hours</label>
              <input type="number" className="w-full p-4 border rounded-2xl" placeholder="0" onChange={(e) => handleTaskChange(index, 'hours', e.target.value)} />
            </div>
            <div><label className="block text-sm font-semibold mb-2">Minutes</label>
              <input type="number" className="w-full p-4 border rounded-2xl" placeholder="0" onChange={(e) => handleTaskChange(index, 'minutes', e.target.value)} />
            </div>
            <div><label className="block text-sm font-semibold mb-2">Status</label>
              <select className="w-full p-4 border rounded-2xl" onChange={(e) => handleTaskChange(index, 'status', e.target.value)}>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div><label className="block text-sm font-semibold mb-2">Priority</label>
              <select className="w-full p-4 border rounded-2xl" onChange={(e) => handleTaskChange(index, 'priority', e.target.value)}>
                <option value="Normal">Normal</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>
          
          <textarea className="w-full p-4 border rounded-2xl h-24" placeholder="Description" onChange={(e) => handleTaskChange(index, 'description', e.target.value)} />
        </div>
      ))}

      <button onClick={addNewTaskBlock} className="bg-violet-100 text-violet-900 px-6 py-4 rounded-2xl font-bold mr-4">+ Add Another Task</button>
      <button onClick={submitAllTasks} className="bg-violet-900 text-white px-10 py-4 rounded-2xl font-bold">Submit All Tasks</button>
    </div>
  );
}